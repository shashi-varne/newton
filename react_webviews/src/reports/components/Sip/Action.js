import React from "react";
import Container from "../../common/Container";
import { isEmpty } from "utils/validators";
import { getPathname } from "../../constants";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { Imgc } from "common/ui/Imgc";
import "./commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";

const Action = (props) => {
  const goBack = () => {
    sendEvents('no')
    props.history.goBack();
  };
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.action) goBack();
  const action = params.action || "";
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    sendEvents('yes')
    if (action === "cancel") {
      navigate(`${getPathname.pauseCancelDetail}${action}/0`);
      return;
    }
    if (action === "pause") {
      navigate(getPathname.pausePeriod);
      return;
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "sip_pause_cancel",
      "properties": {
        "user_action": userAction || "",
        "screen_name": "Request Confirmation",
        "operation": action
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      data-aid='reports-action-screen'
      events={sendEvents("just_set_events")}
      hidePageTitle={true}
      twoButton={true}
      buttonOneTitle="YES"
      buttonTwoTitle="NO"
      handleClickOne={() => handleClick()}
      handleClickTwo={() => goBack()}
      dualbuttonwithouticon
    >
      <div className="reports-sip-action" data-aid='reports-sip-action'>
        <Imgc
          src={require(`assets/${productName}/sip_action_illustration.svg`)}
          className="top-img"
        />
        <p className="light-text" data-aid='reports-light-text'>
          We highly recommend to stay invested for at least 3 years to get the
          best benefit of SIP.
        </p>
        {action === "cancel" && (
          <div className="cancel" data-aid='reports-cancel'>
            <div className="light-text">
              Or, you can also Pause for few months and restart later.
            </div>
            <div
              className="link-container"
              onClick={() => navigate(getPathname.pausePeriod)}
            >
              <img src={require(`assets/${productName}/link_icon.svg`)} alt="" />
              <div className="link">Pause SIP</div>
            </div>
          </div>
        )}
        <div data-aid='reports-action-message'>Do you still want to {action} SIP?</div>
      </div>
    </Container>
  );
};

export default Action;
