import React, { useState } from "react";
import Container from "../common/Container";
import { storageService } from "../../utils/validators";
import { Button } from "@material-ui/core";
import { sendInvestmentProof } from "./MyAccountFunctions";
import toast from "common/ui/Toast";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import "./MyAccount.scss";
import { nativeCallback } from "../../utils/native_callback";

const InvestmentProof = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const type = props.type || "";

  const investmentDataMapper = {
    "investment-proof": {
      investedYears: storageService().getObject("elss") || [],
      title: "80C Investment Proof",
      statement: "elssstatement",
    },
    "capital-gain": {
      investedYears: storageService().getObject("capitalgain"),
      title: "Capital Gain",
      statement: "taxstatement",
    },
  };

  const investmentData = investmentDataMapper[type] || {};
  const emailMe = async (year) => {
    sendEvents('next', year)
    setIsApiRunning(true);
    try {
      const result = await sendInvestmentProof({
        statement: investmentData.statement,
        year: year,
      });
      if (!result) return;
      setDialogMessage(result.message);
      console.log(result);
      setOpenDialog(true);
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const renderDialog = (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      className="investment-proof-dialog"
    >
      <DialogContent className="content">{dialogMessage}</DialogContent>
      <DialogActions className="action">
        <Button className="button" onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  const sendEvents = (userAction, year) => {
    let eventObj = {
      "event_name": 'my_account',
      "properties": {
        "user_action": userAction,
        "screen_name": type === 'capital-gain' ? 'capital gain' : 'elss statement',
        "year": year || "",
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
      events={sendEvents("just_set_events")}
      title={investmentData.title}
      skelton={isApiRunning}
      noFooter={true}
    >
      {investmentData.investedYears.map((year, index) => {
        return (
          <div className="investment-proof" key={index}>
            <div>
              {year} - {year + 1}
            </div>
            <Button className="button" onClick={() => emailMe(year)}>
              EMAIL ME
            </Button>
          </div>
        );
      })}
      {renderDialog}
    </Container>
  );
};

export default InvestmentProof;
