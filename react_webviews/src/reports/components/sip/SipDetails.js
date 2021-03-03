import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { initData } from "../../services";
import { getSummaryV2, getSipAction } from "../../common/api";
import {
  navigate as navigateFunc,
  dateOrdinalSuffix,
} from "../../common/functions";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";

const SipDetails = (props) => {
  const productName = getConfig().productName;
  const selected_sip = Number(
    storageService().get(storageConstants.SELECTED_SIP) || ""
  );
  if (!selected_sip) props.history.goBack();
  const navigate = navigateFunc.bind(props);
  const [report, setreport] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [buttonTitle, setButtonTitle] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
  const sip_mandate_created = ["init", "mandate_approved", "active"];
  const mandate_approved = ["mandate_approved", "active"];
  const requested_pause = ["pause_requested", "paused"];
  const requested_cancel = ["cancellation_requested", "cancelled"];
  //   const requested_resume = ["resume_requested"];
  //   const requested_restart = ["restart_requested"];

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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    initData();
    const result = await getSummaryV2();
    if (!result) {
      showSkelton(false);
      return;
    }
    const reportData =
      result.report.sips.active_sips.find((o) => {
        return o.id === selected_sip;
      }) || {};
    setreport(reportData);
    let title = "";
    if (sip_mandate_created.includes(reportData.friendly_status))
      title = "CANCEL SIP";
    else if (requested_pause.includes(reportData.friendly_status))
      title = "RESUME SIP";
    else if (requested_cancel.includes(reportData.friendly_status))
      title = "RESTART SIP";
    setButtonTitle(title);
    setShowSkelton(false);
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
    setIsApiRunning(true);
    storageService().setObject(storageConstants.PAUSE_SIP, report);
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
      hideInPageTitle={true}
      headerTitle="SIP Details"
      noFooter={buttonTitle ? false : true}
      twoButton={sip_mandate_created.includes(report.friendly_status)}
      buttonTitle={buttonTitle}
      buttonTitle2="PAUSE SIP"
      skelton={showSkelton}
      buttonClassName={
        sip_mandate_created.includes(report.friendly_status)
          ? "reports-sip-details-footer-button"
          : ""
      }
      buttonClassName2="reports-sip-details-footer-button"
      handleClick={handleClick("FIRST")}
      handleClick2={handleClick("SECOND")}
      isApiRunning={isApiRunning}
      disable={isApiRunning || showSkelton}
    >
      <div className="reports-sip-details">
        {!showSkelton && !isEmpty(report) && (
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
