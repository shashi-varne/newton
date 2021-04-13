import React, { useState } from "react";
import Container from "../common/Container";
import { storageService } from "../../utils/validators";
import { Button } from "@material-ui/core";
import { send80cInvest } from "../common/functions";
import toast from "common/ui/Toast";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import "./MyAccount.scss";

const InvestmentProof = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const user80cInvestment = storageService().getObject("elss") || [];
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const emailMe = async (year) => {
    setIsApiRunning(true);
    try {
      const result = await send80cInvest(year);
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
      title="80C Investment Proof"
      skelton={isApiRunning}
      noFooter={true}
    >
      {user80cInvestment.map((year, index) => {
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
