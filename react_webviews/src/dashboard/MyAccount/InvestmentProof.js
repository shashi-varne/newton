import React, { useState } from "react";
import Container from "../common/Container";
import { storageService } from "../../utils/validators";
import { Button } from "@material-ui/core";
import { sendInvestmentProof } from "./MyAccountFunctions";
import toast from "common/ui/Toast";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import "./MyAccount.scss";

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
      data-aid='investment-proof-dialog'
    >
      <DialogContent className="content" data-aid='content'>{dialogMessage}</DialogContent>
      <DialogActions className="action" data-aid='action'>
        <Button className="button" data-aid='ok-btn' onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container
      data-aid='investment-proof-screen'
      title={investmentData.title}
      skelton={isApiRunning}
      noFooter={true}
    >
      {investmentData.investedYears.map((year, index) => {
        return (
          <div className="investment-proof" key={index} data-aid='investment-proof'>
            <div>
              {year} - {year + 1}
            </div>
            <Button className="button" onClick={() => emailMe(year)} data-aid='email-btn'>
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
