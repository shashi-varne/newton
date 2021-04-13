import React, { useState } from "react";
import Container from "../common/Container";
import { storageService } from "../../utils/validators";
import { Button } from "@material-ui/core";
import { send80cInvest, sendCapitalgain } from "../common/functions";
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
      emailMe: send80cInvest,
    },
    "capital-gain": {
      investedYears: storageService().getObject("capitalgain") || [2020, 2021],
      title: "Capital Gain",
      emailMe: sendCapitalgain,
    },
  };

  const investmentData = investmentDataMapper[type] || {};
  const emailMe = async (year) => {
    setIsApiRunning(true);
    try {
      const result = await investmentData.emailMe(year);
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

  return (
    <Container
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
