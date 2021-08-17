import React, { useEffect, useState } from "react";
import { getUrlParams } from "../../../../utils/validators";
import Container from "../../../common/Container";
import { getPaymentStatus } from "../../common/api";
import { navigate as navigateFunc } from "../../../../utils/functions";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import Button from "common/ui/Button";
import "../../commonStyles.scss";
import { isEmpty } from "lodash";
import { nativeCallback } from "../../../../utils/native_callback";

const FailureDialog = ({ isOpen, handleClick, errorMessage }) => {
  return (
    <Dialog open={isOpen} keepMounted className="invest-common-dialog" data-aid='invest-common-dialog'>
      <DialogContent className="dialog-content" data-aid='dialog-content'>
        <div className="error-message" data-aid='error-message'>{errorMessage}</div>
      </DialogContent>
      <DialogActions className="action" data-aid='action'>
        <Button
          dataAid='please-retry-btn'
          onClick={handleClick}
          classes={{ button: "invest-dialog-button" }}
          buttonTitle="PLEASE RETRY"
        />
      </DialogActions>
    </Dialog>
  );
};

const PageCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props.match.params || {};
  let { investment_type, status, investment_amount, message } = params;
  const [skelton, setSkelton] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const platform = props.type || "";
  const { data } = getUrlParams();
  const finalData = JSON.parse(data || "{}");
  let type = finalData.type || "";
  const link = finalData.link;
  // const sipState = finalData.fromState;
  if (platform !== "sdk") {
    type = "server";
  }

  useEffect(() => {
    initialize();
  }, []);

  const sendEvents = (eventName, data) => {
    let eventObj = {
      event_name: eventName,
      properties:
        eventName === "payment completed"
          ? {
              investment_type: data,
              investment_amount: investment_amount,
            }
          : {
              error_message: data || "",
            },
    };
      nativeCallback({ events: eventObj });
  };

  const initialize = async () => {
    switch (type) {
      case "bank":
        delete finalData.type;
        delete finalData.link;
        delete finalData.fromState;
        try {
          const result = await getPaymentStatus({ link: link, obj: finalData });
          if (isEmpty(result)) {
            return;
          }
          const orderType = result?.investment?.order_type;
          sendEvents("payment completed", orderType);
          if (orderType === "sip") {
            navigate(`/sip/payment/callback/success`);
          } else if (orderType === "onetime") {
            navigate(`/payment/callback/success`);
          }
        } catch (err) {
          setErrorMessage(err);
          setOpenDialog(true);
        } finally {
          setSkelton(false);
        }
        break;
      case "server":
      default:
        setSkelton(false);
        if (!status) {
          navigate("/");
        } else {
          if (!message) message = "";
          if(status === "success")
            sendEvents("payment completed", investment_type);
          else
            sendEvents("payment failed", message);
          if (investment_type === "sip") {
            navigate(`/sip/payment/callback/${status}/${message}`);
          } else if (investment_type === "onetime") {
            navigate(`/payment/callback/${status}/${message}`);
          } else {
            navigate("/");
          }
        }
        break;
    }
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <Container noFooter skelton={skelton} headerData={{ goBack }} data-aid='page-call-back-screen'>
      <FailureDialog
        isOpen={openDialog}
        handleClick={() => navigate("/invest")}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default PageCallback;
