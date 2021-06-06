import React from "react";
import { getConfig, isMobile } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { storageService } from "utils/validators";
import { updateQueryStringParameter } from "../common/functions";
import { STORAGE_CONSTANTS } from "../constants";
import { getBasePath } from "../../utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const productName = getConfig().productName;
const AadhaarDialog = ({ id, open, close, kyc, ...props }) => {
  const basePath = getBasePath();
  const handleProceed = () => {
    const redirect_url = encodeURIComponent(
      `${basePath}/digilocker/callback${
        getConfig().searchParams
      }&is_secure=${storageService().get("is_secure")}`
    );
    const data = {
      url: `${basePath}/kyc/journey${
        getConfig().searchParams
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
                  getConfig().searchParams
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

    close();
  };
  return (
    <WVBottomSheet
      dataAidSuffix="kyc-dl-aadhaar-dialog"
      onClose={close}
      isOpen={open}
      title="Please ensure your mobile no. is linked with Aadhaar"
      image={require(`assets/${productName}/ic_aadhaar_handy.svg`)}
      button1Props={{
        title:"PROCEED",
        onClick: handleProceed,
        type: "primary"
      }}
    />
  );
};

export default AadhaarDialog;
