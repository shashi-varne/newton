import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";
import WVFullscreenDialog from "../../../common/ui/FullscreenDialog/WVFullscreenDialog";
import { Imgc } from "../../../common/ui/Imgc";
import { nativeCallback } from "../../../utils/native_callback";

const PRODUCT_NAME_MAPPER = {
  fisdom: "Fisdom",
  finity: "Finity",
};

const BFDLBanner = ({ isOpen, close }) => {
  const { productName, colorLogo, appLink } = useMemo(getConfig, []);

  const openFinityApp = () => {
    nativeCallback({
      action: "open_in_browser",
      message: {
        url: appLink,
      },
    });
  };

  const title = (
    <div style={{ margin: "0 auto", width: "100%" }}>
      <Imgc src={require(`assets/${colorLogo}`)} className="partner-logo" />
    </div>
  );

  return (
    <WVFullscreenDialog
      onClose={close}
      open={isOpen}
      title={title}
      closeIconPosition="left"
      wvClasses={{
        container: "bfdl-announcement-dialog",
        dialogTitle: {
          root: "bfdl-announcement-dialog-title",
        },
        wvTitle: "bfdla-title-image",
      }}
    >
      <WVFullscreenDialog.Content>
        <div className="bfdla-content">
          <Imgc
            src={require("assets/iv_announcement.svg")}
            className="bfdla-icon"
          />
          <div className="bfdla-title">Important update for investors</div>
          <div className="bfdla-subtitle">
            Your mutual fund investments were brought to you in partnership with{" "}
            {PRODUCT_NAME_MAPPER[productName]}. Now this partnership is ending.
            Download {PRODUCT_NAME_MAPPER[productName]} & login with your
            existing credentials to continue investing.
          </div>
        </div>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <div onClick={openFinityApp} className="bfdla-action-bar">
          <Imgc
            src={require("assets/bfdl_announcement_button.svg")}
            style={{
              width: "100%",
            }}
          />
        </div>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
};

export default BFDLBanner;
