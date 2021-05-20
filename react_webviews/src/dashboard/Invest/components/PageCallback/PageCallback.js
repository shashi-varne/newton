import React, { useEffect, useState } from "react";
import { getUrlParams } from "../../../../utils/validators";
import Container from "../../../common/Container";
import { getPaymentStatus } from "../../common/api";
import { navigate as navigateFunc } from "../../common/commonFunctions";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import Button from "common/ui/Button";
import "../../commonStyles.scss";
import { isEmpty } from "lodash";
import { nativeCallback } from "../../../../utils/native_callback";

const FailureDialog = ({ isOpen, handleClick, errorMessage }) => {
  return (
    <Dialog open={isOpen} keepMounted className="invest-common-dialog">
      <DialogContent className="dialog-content">
        <div className="error-message">{errorMessage}</div>
      </DialogContent>
      <DialogActions className="action">
        <Button
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
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
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
            navigate(`/sip/payment/callback/success`, null, true);
          } else if (orderType === "onetime") {
            navigate(`/payment/callback/success`, null, true);
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
          sendEvents("payment failed", message);
          navigate("/landing", null, true);
        } else {
          if (!message) message = "";
          sendEvents("payment completed", investment_type);
          if (investment_type === "sip") {
            navigate(`/sip/payment/callback/${status}/${message}`, null, true);
          } else if (investment_type === "onetime") {
            navigate(`/payment/callback/${status}/${message}`, null, true);
          } else {
            navigate("/landing", null, true);
          }
        }
        break;
    }
  };

  const goBack = () => {
    navigate("/", null, true);
  };

  return (
    <Container noFooter skelton={skelton} headerData={{ goBack }}>
      <FailureDialog
        isOpen={openDialog}
        handleClick={() => navigate("/invest", null, true)}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default PageCallback;
