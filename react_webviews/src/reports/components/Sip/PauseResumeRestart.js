import React, { useState } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { postSipAction } from "../../common/api";
import toast from "common/ui/Toast";
import "./commonStyles.scss";

const PauseResumeRestart = (props) => {
  const productName = getConfig().productName;
  const sip = storageService().getObject(storageConstants.PAUSE_SIP) || {};
  if (isEmpty(sip)) props.history.goBack();
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.action) props.history.goBack();
  const action = params.action || "";
  let next_sip_date = params.next_sip_date || "";
  if (next_sip_date === "undefined") next_sip_date = "";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  let title = `${action.charAt(0).toUpperCase()}${action.slice(1)} SIP`;

  const handleClick = async () => {
    setIsApiRunning("button");
    try {
      const result = await postSipAction({
        key: sip.key,
        action: action,
      });
      if (!result) {
        setIsApiRunning(false);
        return;
      }
      const requestData = {
        title: action === "resume" ? "SIP resumed" : "SIP restarted",
        data: result,
        action: action,
      };
      storageService().setObject(
        storageConstants.PAUSE_REQUEST_DATA,
        requestData
      );
      navigate(getPathname.pauseRequest, {
        state: {
          action: action,
        },
      });
    } catch (err) {
      toast(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  return (
    <Container
      data-aid='reports-pause-resume-restart-screen'
      title={title}
      buttonTitle="CONTINUE"
      handleClick={() => handleClick()}
      showLoader={isApiRunning}
    >
      {!isEmpty(sip) && (
        <div className="reports-sip-pause-cancel-detail" data-aid='reports-sip-pause-cancel-detail'>
          <div className="mf-name">{sip.mfname}</div>

          <div className="content" data-aid='reports-nextspidate-content'>
            <img
              src={require(`assets/${productName}/sip_date_icon.svg`)}
              alt=""
            />
            <div>
              <div className="title">Next SIP date</div>
              <div>{next_sip_date}</div>
            </div>
          </div>
          <div className="content" data-aid='reports-amount-content'>
            <img
              src={require(`assets/${productName}/amount_icon.svg`)}
              alt=""
            />
            <div>
              <div className="title">Amount</div>
              <div>{formatAmountInr(sip.amount)}</div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PauseResumeRestart;
