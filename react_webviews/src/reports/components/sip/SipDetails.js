import React, { useState } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getSipAction } from "../../common/api";
import {
  navigate as navigateFunc,
  dateOrdinalSuffix,
} from "../../common/functions";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";

const SipDetails = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const report = storageService().getObject(storageConstants.PAUSE_SIP) || {};
  if (isEmpty(report)) props.history.goBack();
  const [isApiRunning, setIsApiRunning] = useState(false);
  const sip_mandate_created = ["init", "mandate_approved", "active"];
  const mandate_approved = ["mandate_approved", "active"];
  const requested_pause = ["pause_requested", "paused"];
  const requested_cancel = ["cancellation_requested", "cancelled"];
  let buttonTitle = "";
  if (sip_mandate_created.includes(report.friendly_status))
    buttonTitle = "CANCEL SIP";
  else if (requested_pause.includes(report.friendly_status))
    buttonTitle = "RESUME SIP";
  else if (requested_cancel.includes(report.friendly_status))
    buttonTitle = "RESTART SIP";

  const getStatusName = (status) => {
    switch (status) {
      case "mandate_approved":
        return "Mandate approved";
      case "active":
        return "Auto debit started";
      case "pause_requested":
        return "Requested to pause";
      case "paused":
        return "SIP paused";
      case "cancellation_requested":
        return "Requested to cancel";
      case "cancelled":
        return "SIP cancelled";
      case "init":
        return "SIP mandate created";
      case "resume_requested":
        return "Resume requested";
      case "restart_requested":
        return "Restart requested";
      default:
        return "";
    }
  };

  const formatName = (name) => {
    if (name === "init") {
      name = "mandate pending";
    }
    return name.replace(/_/g, " ").toUpperCase();
  };

  const handleClick = (name) => () => {
    if (name === "FIRST") {
      if (sip_mandate_created.includes(report.friendly_status)) {
        navigate(`${getPathname.pauseAction}cancel`);
        return;
      }
      if (requested_pause.includes(report.friendly_status)) {
        nextStep("resume");
        return;
      }
      if (requested_cancel.includes(report.friendly_status)) {
        nextStep("cancel");
        return;
      }
    } else {
      navigate(`${getPathname.pauseAction}pause`);
    }
  };

  const nextStep = async (action) => {
    setIsApiRunning("button");
    try {
      const result = await getSipAction({
        key: report.key,
        action: action,
      });
      if (!result) {
        setIsApiRunning(false);
        return;
      }
      navigate(
        `${getPathname.pauseResumeRestart}${action}/${result.next_sip_date}`
      );
    } catch (err) {
      toast(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  return (
    <Container
      title="SIP Details"
      noFooter={buttonTitle ? false : true}
      twoButton={sip_mandate_created.includes(report.friendly_status)}
      buttonTitle={buttonTitle}
      buttonOneTitle={buttonTitle}
      buttonTwoTitle="PAUSE SIP"
      handleClick={handleClick("FIRST")}
      handleClickOne={handleClick("FIRST")}
      handleClickTwo={handleClick("SECOND")}
      showLoader={isApiRunning}
      dualbuttonwithouticon
    >
      <div className="reports-sip-details">
        {!isEmpty(report) && (
          <>
            <div
              className={`status ${
                report.friendly_status === "cancelled"
                  ? "red"
                  : report.friendly_status === "active"
                  ? "green"
                  : report.friendly_status === "paused"
                  ? "blue"
                  : "yellow"
              }`}
            >
              <div className="dot"></div>
              <div className="name">{formatName(report.friendly_status)}</div>
            </div>
            <div className="mf-name">{report.mfname}</div>
            <div className="content">
              <img
                src={require(`assets/${productName}/sip_date_icon.svg`)}
                alt=""
              />
              <div>
                <div className="title">SIP date</div>
                <div>
                  {report.next_trans ? report.next_trans.split(" ")[0] : ""}
                  <sup>
                    {dateOrdinalSuffix(
                      report.next_trans ? report.next_trans.split(" ")[0] : ""
                    )}
                  </sup>{" "}
                  of the month
                </div>
              </div>
            </div>
            <div className="content">
              <img
                src={require(`assets/${productName}/amount_icon.svg`)}
                alt=""
              />
              <div>
                <div className="title">Amount</div>
                <div>{formatAmountInr(report.amount)}</div>
              </div>
            </div>

            <div className="content">
              <img
                alt=""
                src={require(`assets/${productName}/status_sip_icon.svg`)}
              />
              <div>
                <div className="title">Status</div>
                <div>{getStatusName(report.friendly_status)}</div>
                <div className="progress-bar">
                  {sip_mandate_created.includes(report.friendly_status) && (
                    <>
                      <div className="step completed">
                        <img
                          alt=""
                          src={require(`assets/completed_step.svg`)}
                        />
                        <div className="text">SIP mandate created</div>
                      </div>
                      <div
                        className={`step ${
                          mandate_approved.includes(report.friendly_status) &&
                          "completed"
                        }`}
                      >
                        {mandate_approved.includes(report.friendly_status) ? (
                          <img
                            alt=""
                            src={require(`assets/completed_step.svg`)}
                          />
                        ) : (
                          <div className="circle"></div>
                        )}
                        <div className="text">Mandate approved</div>
                      </div>
                      <div
                        className={`step ${
                          report.friendly_status === "active" && "completed"
                        }`}
                      >
                        {report.friendly_status === "active" ? (
                          <img
                            alt=""
                            src={require(`assets/completed_step.svg`)}
                          />
                        ) : (
                          <div className="circle"></div>
                        )}
                        <div className="text">SIP activated</div>
                      </div>
                      <div
                        className={`step ${
                          report.friendly_status === "active" && "completed"
                        }`}
                      >
                        {report.friendly_status === "active" ? (
                          <img
                            alt=""
                            src={require(`assets/completed_step.svg`)}
                          />
                        ) : (
                          <div className="circle"></div>
                        )}
                        <div className="text">Auto debit started</div>
                      </div>
                    </>
                  )}
                  {requested_pause.includes(report.friendly_status) && (
                    <>
                      <div className="step completed">
                        <img
                          alt=""
                          src={require(`assets/completed_step.svg`)}
                        />
                        <div className="text">Requested to pause</div>
                      </div>
                      <div
                        className={`step ${
                          report.friendly_status === "paused" && "completed"
                        }`}
                      >
                        {report.friendly_status === "paused" ? (
                          <img
                            alt=""
                            src={require(`assets/completed_step.svg`)}
                          />
                        ) : (
                          <div className="circle"></div>
                        )}
                        <div className="text">SIP paused</div>
                      </div>
                    </>
                  )}
                  {requested_cancel.includes(report.friendly_status) && (
                    <>
                      <div className="step completed">
                        <img
                          alt=""
                          src={require(`assets/completed_step.svg`)}
                        />
                        <div className="text">Requested to cancel</div>
                      </div>
                      <div
                        className={`step ${
                          mandate_approved.includes(report.friendly_status) &&
                          "completed"
                        }`}
                      >
                        {report.friendly_status === "cancelled" ? (
                          <img
                            alt=""
                            src={require(`assets/completed_step.svg`)}
                          />
                        ) : (
                          <div className="circle"></div>
                        )}
                        <div className="text">SIP cancelled</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default SipDetails;
