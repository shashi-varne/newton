import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { initData } from "../../services";
import { navigate as navigateFunc } from "../../common/functions";
import { getConfig } from "utils/functions";
import { getSipNote, postSipAction } from "../../common/api";
import toast from "common/ui/Toast";

const PauseCancelDetail = (props) => {
  const productName = getConfig().productName;
  const sip = storageService().getObject(storageConstants.PAUSE_SIP) || {};
  if (isEmpty(sip)) props.history.goBack();
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.action) props.history.goBack();
  const action = params.action || "";
  const period = params.period || "";
  const navigate = navigateFunc.bind(props);
  const [showSkelton, setShowSkelton] = useState(true);
  const [note, setNote] = useState({});
  const [isApiRunning, setIsApiRunning] = useState(false);
  let title = "Pause SIP details";
  if (action === "cancel") {
    title = "Cancel SIP details";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    initData();
    try {
      const result = await getSipNote({
        key: sip.key,
        tenure: Number(period),
        action: action,
      });
      if (!result) {
        setShowSkelton(false);
        return;
      }

      setNote(result);
    } catch (err) {
    } finally {
      setShowSkelton(false);
    }
  };

  const handleClick = async () => {
    setIsApiRunning(true);
    try {
      const result = await postSipAction({
        key: sip.key,
        action: action,
        period: Number(period),
      });
      if (!result) {
        setIsApiRunning(false);
        return;
      }
      toast("OTP is sent successfully to your mobile number.");
      navigate(`${getPathname.sipOtp}${action}`, {
        state: {
          urls: result,
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
      title={title}
      headerTitle={title}
      buttonTitle="CONTINUE"
      handleClick={() => handleClick()}
      skelton={showSkelton}
      disable={showSkelton || isApiRunning}
      isApiRunning={isApiRunning}
    >
      {!isEmpty(sip) && (
        <div className="reports-sip-pause-cancel-detail">
          <div>
            <div className="mf-name">{sip.mfname}</div>
            {action === "pause" && (
              <div className="content">
                <img
                  src={require(`assets/${productName}/paused_sip_icon.svg`)}
                  alt=""
                />
                <div>
                  <div className="title">Pause period</div>
                  <div>{note.pause_period}</div>
                </div>
              </div>
            )}
            {action === "cancel" && (
              <>
                <div className="content">
                  <img
                    src={require(`assets/${productName}/paused_sip_icon.svg`)}
                    alt=""
                  />
                  <div>
                    <div className="title">Last SIP installment</div>
                    <div>{note.last_sip_installment || "NA"}</div>
                  </div>
                </div>
                <div className="content">
                  <img
                    src={require(`assets/${productName}/amount_icon.svg`)}
                    alt=""
                  />
                  <div>
                    <div className="title">Amount</div>
                    <div>{formatAmountInr(sip.amount)}</div>
                  </div>
                </div>
              </>
            )}
            <div className="alert">
              <div className="title">
                <img src={require(`assets/attention_icon.svg`)} alt="" />
                <div>Note</div>
              </div>
              <p>{note.note}</p>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PauseCancelDetail;
