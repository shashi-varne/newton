import React from "react";
import SlidingDialog from "./SlideBottomDialog";
import Button from "@material-ui/core/Button";
import { getConfig, isMobile, getBasePath } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { storageService } from "utils/validators";
import { updateQueryStringParameter } from "../common/functions";
import { STORAGE_CONSTANTS } from "../constants";
import "./mini-components.scss";

const config = getConfig();
const AadhaarDialog = ({ id, open, close, kyc, handleIframeKyc, ...props }) => {
  const productName = config.productName;
  const basePath = getBasePath();
  const handleProceed = () => {
    const redirect_url = encodeURIComponent(
      `${basePath}/digilocker/callback${
        getConfig().searchParams
      }&is_secure=${storageService().get("is_secure")}`
    );
    if (config.isIframe) {
      close();
      handleIframeKyc(
        updateQueryStringParameter(
          kyc.digilocker_url,
          "redirect_url",
          redirect_url
        )
      );
      return;
    }
    const data = {
      url: `${basePath}/kyc/journey${
        config.searchParams
      }&show_aadhaar=true&is_secure=
        ${storageService().get("is_secure")}`,
      message: "You are almost there, do you really want to go back?",
    };
    if (!config.Web && storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      if (isMobile.iOS()) {
        nativeCallback({
          action: "show_top_bar",
          message: { title: "Aadhaar KYC" },
        });
      }
      nativeCallback({ action: "take_back_button_control", message: data });
    } else if (!config.Web) {
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

    close();
  };
  return (
    <SlidingDialog id={id} open={open} close={close} {...props} onClick={close}>
      <section className="kyc-dl-aadhaar-dialog" data-aid='kyc-dl-aadhaar-dialog'>
        <div className="flex-between" data-aid='aadhaar-heading'>
          <div className="heading">
            Please ensure your mobile no. is linked with Aadhaar
          </div>
          <img
            className="img-right-top"
            src={require(`assets/${productName}/ic_aadhaar_handy.svg`)}
            alt=""
          />
        </div>

        <div className="dialog-actions">
          <Button
            color="secondary"
            variant="raised"
            onClick={handleProceed}
            fullWidth
            data-aid='proceed-btn'
          >
            PROCEED
          </Button>
        </div>
      </section>
    </SlidingDialog>
  );
};

export default AadhaarDialog;
