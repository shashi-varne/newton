import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const KycPremiumLandingDialog = ({
  isOpen,
  close,
  handleClick,
  cancel,
  data,
}) => {
  const productName = getConfig().productName;
  const subtitle = (
    <>
      {data.boldText && <b>{data.boldText}</b>} {data.subtitle}
    </>
  );
  let button1Props = {};
  let button2Props = {};
  const defaultButtonProps = {
    variant: "contained",
    title: data.buttonTitle,
    onClick: handleClick,
  };
  if (data.oneButton) {
    button1Props = defaultButtonProps;
  } else {
    button1Props = {
      variant: "outlined",
      title: "NOT NOW",
      onClick: cancel,
    };
    button2Props = defaultButtonProps;
  }
  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={close}
      title={data.title}
      subtitle={subtitle}
      image={require(`assets/${productName}/${data.icon}`)}
      button1Props={button1Props}
      button2Props={button2Props}
      classes={{
        image: "kyc-pld-right-icon"
      }}
    >
      {data.status === "ground_premium" && (
        <div className="vfdc-bottom-info" data-aid="bottom-info">
          <div className="bottom-info-box">
            <img
              src={require(`assets/${productName}/ic_instant.svg`)}
              alt=""
              className="img"
            />
            <div className="bottom-info-content" data-aid="instant-investment">
              Instant investment
            </div>
          </div>
          <div className="bottom-info-mid"></div>
          <div className="bottom-info-box">
            <img
              src={require(`assets/${productName}/ic_no_doc.svg`)}
              alt=""
              className="img"
            />
            <div className="bottom-info-content" data-aid="no-document-asked">
              No document asked
            </div>
          </div>
        </div>
      )}
    </WVBottomSheet>
  );
};

export default KycPremiumLandingDialog;
