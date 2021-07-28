import "./Digilocker.scss";
import React, { useState } from "react";
import Container from "../common/Container";
import { pollProgress } from "../common/functions";
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
import { isNewIframeDesktopLayout, popupWindowCenter } from "../../utils/functions";

const config = getConfig();
const productName = config.productName;
const basePath = getBasePath();
const newIframeDesktopLayout = isNewIframeDesktopLayout();
const Failed = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  const {kyc, isLoading} = useUserKycHook();
  
  const manual = async () => {
    sendEvents('upload_manually')
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

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "aadhar_kyc_failed",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const handleIframeKyc = (url) => {
    let popup_window = popupWindowCenter(900, 580, url);
    setIsApiRunning("page");
    pollProgress(600000, 5000, popup_window).then(
      function (poll_data) {
        popup_window.close();
        if (poll_data.status === "success") {
          // Success
          navigate("/kyc/digilocker/success");
        } else if (poll_data.status === "failed") {
          // Failed
          navigate("/kyc/digilocker/failed");
        } else if (poll_data.status === "closed") {
          // Closed
          toast("Digilocker window closed. Please try again");
        }
        setIsApiRunning(false);
      },
      function (err) {
        popup_window.close();
        setIsApiRunning(false);
        console.log(err);
        if (err?.status === "timeout") {
          toast("Digilocker has been timedout . Please try again");
        } else {
          toast("Something went wrong. Please try again.");
        }
      }
    );
  };

  const handleProceed = () => {
    sendEvents('retry');
    const redirect_url = encodeURIComponent(
      `${basePath}/digilocker/callback${
        config.searchParams
      }&is_secure=${storageService().get("is_secure")}`
    );

    if (newIframeDesktopLayout) {
      handleIframeKyc(
        updateQueryStringParameter(
          kyc.digilocker_url,
          "redirect_url",
          redirect_url
        )
      )
    }
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
      events={sendEvents("just_set_events")}
      title="Aadhaar KYC Failed!"
      data-aid='kyc-aadhaar-kyc-failed-screen'
      twoButtonVertical={true}
      button1Props={{
        variant: "contained",
        title: "RETRY",
        onClick: handleProceed,
      }}
      button2Props={{
        variant: "outlined",
        title: "UPLOAD DOCUMENTS MANUALLY",
        onClick: manual,
        showLoader: isApiRunning
      }}
      skelton={isLoading}
      headerData={{ icon: "close" }}
      loaderData={{ loadingText: " " }}
      iframeRightContent={require(`assets/${productName}/digilocker_failed.svg`)}
      showLoader={isApiRunning === "page" ? isApiRunning : false}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        {
          !newIframeDesktopLayout &&
          <img
            className="digi-image"
            alt=""
            src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
          />
        }
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your DigiLocker.
        </div>
        <div className='body-text2'>Try again to complete KYC.</div>
      </section>
    </Container>
  );
};

export default Failed;
