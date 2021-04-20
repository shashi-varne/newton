import React from "react";
import Container from "../../common/Container";
import { isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { navigate as navigateFunc } from "../../common/functions";
import { getConfig } from "utils/functions";
import { Imgc } from "common/ui/Imgc";
import "./commonStyles.scss";

const Request = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const requestData =
    storageService().getObject(storageConstants.PAUSE_REQUEST_DATA) || {};
  if (isEmpty(requestData)) {
    navigate(getPathname.reports);
  }

  const handleClick = () => {
    navigate(getPathname.reportsSip);
  };

  return (
    <Container
      hidePageTitle={true}
      buttonTitle="OK"
      handleClick={() => handleClick()}
    >
      {!isEmpty(requestData) && (
        <div className="reports-sip-request">
          <Imgc
            alt=""
            className="img"
            src={require(`assets/${productName}/${
              requestData.action === "resume"
                ? "sip_resumed_illustration"
                : "order_placed_illustration"
            }.svg`)}
          />
          <div className="title">{requestData.title}</div>
          {requestData.data && (
            <>
              <div className="note">{requestData.data.note}</div>
              {requestData.data.pause_period && (
                <div className="text">
                  <b>Pause Period: </b>
                  {requestData.data.pause_period}
                </div>
              )}
              {requestData.data.resume_date && (
                <div className="text">
                  <b>Resume Date: </b>
                  {requestData.data.resume_date}
                </div>
              )}
              {requestData.data.restart_date && (
                <div className="text">
                  <b>Restart Date: </b>
                  {requestData.data.restart_date}
                </div>
              )}
              {requestData.data.cancel_date && (
                <div className="text">
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
