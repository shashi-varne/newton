import React from "react";
import Container from "../../common/Container";
import { isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { Imgc } from "common/ui/Imgc";
import "./commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";

const Request = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const requestData =
    storageService().getObject(storageConstants.PAUSE_REQUEST_DATA) || {};
  if (isEmpty(requestData)) {
    navigate(getPathname.reports);
  }

  const handleClick = () => {
    sendEvents("next");
    navigate(getPathname.reportsSip);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "sip_pause_cancel",
      properties: {
        user_action: userAction || "",
        screen_name: "Request Placed",
        operation: requestData?.action || "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      data-aid='reports-pause-request-screen'
      events={sendEvents("just_set_events")}
      hidePageTitle={true}
      buttonTitle="OK"
      handleClick={() => handleClick()}
    >
      {!isEmpty(requestData) && (
        <div className="reports-sip-request" data-aid='reports-sip-request'>
          <Imgc
            alt=""
            className="img"
            src={require(`assets/${productName}/${
              requestData.action === "resume"
                ? "sip_resumed_illustration"
                : "order_placed_illustration"
            }.svg`)}
          />
          <div className="title" data-aid='reports-title'>{requestData.title}</div>
          {requestData.data && (
            <>
              <div className="note" data-aid='reports-note'>{requestData.data.note}</div>
              {requestData.data.pause_period && (
                <div className="text" data-aid='reports-pause-period'>
                  <b>Pause Period: </b>
                  {requestData.data.pause_period}
                </div>
              )}
              {requestData.data.resume_date && (
                <div className="text" data-aid='reports-resume-date'>
                  <b>Resume Date: </b>
                  {requestData.data.resume_date}
                </div>
              )}
              {requestData.data.restart_date && (
                <div className="text" data-aid='reports-restart-date'>
                  <b>Restart Date: </b>
                  {requestData.data.restart_date}
                </div>
              )}
              {requestData.data.cancel_date && (
                <div className="text" data-aid='reports-cancel-date'>
                  <b>Cancel Date: </b>
                  {requestData.data.cancel_date}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Container>
  );
};

export default Request;
