import React from "react";
import { getConfig, navigate as navigateFunc, } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";
import { PATHNAME_MAPPER } from "../../constants";
import { nativeCallback } from "../../../utils/native_callback";
import { Imgc } from "../../../common/ui/Imgc";

const config = getConfig();
const productName = config.productName;
const NriError = (props) => {
  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "NRI_not_available",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const navigate = navigateFunc.bind(props);
  const stateParams = props?.location?.state;

  const handleClick = () => {
    sendEvents("home");
    if(config.Web) {
      navigate("/");
    } else {
      nativeCallback({ action: "exit_web" });
    }
  }
  
  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={stateParams?.noStockOption ? {} :
      {
        variant: "contained",
        title: "COMPLETE MUTUAL FUND KYC",
        onClick: () => {
          sendEvents("complete_mf_kyc");
          navigate(PATHNAME_MAPPER.journey)
        },
      }}
      button2Props={{
        variant: stateParams?.noStockOption ? "contained" : "outlined",
        title: "HOME",
        onClick: handleClick
      }}
    >
      <div className="status-info">
        <Imgc
          className="status-info-img"
          src={require(`assets/${productName}/no_stocks_nri.svg`)}
        />
        <div className="status-info-title">
          Currently, we don't offer trading and demat services to NRI users
        </div>
        <div className="status-info-subtitle">
          Please check back later or continue with your mutual fund KYC
        </div>
      </div>
    </Container>
  );
};

export default NriError;
