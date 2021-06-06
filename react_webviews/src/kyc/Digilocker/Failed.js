import "./Digilocker.scss";
import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "../../common/ui/Toast";
import "./Digilocker.scss";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { storageService } from "../../utils/validators";
import { getBasePath, isMobile } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { updateQueryStringParameter } from "../common/functions";

const config = getConfig();
const productName = config.productName;
const basePath = getBasePath();
const Failed = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  
  const manual = async () => {
    try {
      setIsApiRunning(true);
      await setKycType("manual");
      navigate(PATHNAME_MAPPER.journey);
    } catch (err) {
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  const handleProceed = () => {
    const redirect_url = encodeURIComponent(
      `${basePath}/digilocker/callback${
        config.searchParams
      }&is_secure=${storageService().get("is_secure")}`
    );
    const data = {
      url: `${basePath}/kyc/journey${
        config.searchParams
      }&show_aadhaar=true&is_secure=
        ${storageService().get("is_secure")}`,
      message: "You are almost there, do you really want to go back?",
    };
    if (isMobile.any() && storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      if (isMobile.iOS()) {
        nativeCallback({
          action: "show_top_bar",
          message: { title: "Aadhaar KYC" },
        });
      }
      nativeCallback({ action: "take_back_button_control", message: data });
    } else if (!isMobile.any()) {
      const redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "You are almost there, do you really want to go back?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: encodeURIComponent(
                `${basePath}/kyc/journey${
                  config.searchParams
                }&show_aadhaar=true&is_secure=
                  ${storageService().get("is_secure")}`
              ),
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "server",
        },
      };
      if (isMobile.iOS()) {
        redirectData.show_toolbar = true;
      }
      nativeCallback({ action: "third_party_redirect", message: redirectData });
    }
    window.location.href = updateQueryStringParameter(
      kyc.digilocker_url,
      "redirect_url",
      redirect_url
    );
  };

  return (
    <Container
      title="Aadhaar KYC Failed!"
      data-aid='kyc-aadhaar-kyc-failed-screen'
      twoButtonVertical={true}
      button1Props={{
        type: 'primary',
        title: "RETRY",
        onClick: handleProceed,
      }}
      button2Props={{
        type: 'secondary',
        title: "UPLOAD DOCUMENTS MANUALLY",
        onClick: manual,
        showLoader: isApiRunning
      }}
      skelton={isLoading}
      headerData={{ icon: "close" }}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        <img
          className="digi-image"
          alt=""
          src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
        />
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your DigiLocker.
        </div>
      </section>
    </Container>
  );
};

export default Failed;
