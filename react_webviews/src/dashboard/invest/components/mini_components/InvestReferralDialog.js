import React, { useState } from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import DotDotLoader from "common/ui/DotDotLoader";
import { verifyCode } from "../../common/api";

const InvestReferralDialog = ({ isOpen, close, proceedInvestment }) => {
  const [form_data, setFormData] = useState({});
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isReferralApplied, setIsReferralApplied] = useState(false);

  const handleChange = () => (event) => {
    const value = event.target ? event.target.value : event;
    setIsReferralApplied(false);
    setFormData({
      referral_code: value,
      referral_code_error: "",
      referral_code_helper: "",
    });
  };

  const handleClick = () => {
    proceedInvestment(
      {
        applied: true,
        code: form_data.referral_code,
      },
      true
    );
    close();
  };

  const cancel = () => {
    proceedInvestment(
      {
        applied: false,
        code: "",
      },
      true
    );
    close();
  };

  const applyReferral = async () => {
    const code = form_data.referral_code;
    if (!code) return;
    setIsReferralApplied(false);
    setIsApiRunning(true);
    try {
      const result = await verifyCode({ code: code });
      if (!result) return;
      setIsReferralApplied(true);
    } catch (err) {
      console.log(err);
      setFormData({
        referral_code: code,
        referral_code_error: err,
        referral_code_helper: "",
      });
    } finally {
      setIsApiRunning(false);
    }
  };

  const clearReferral = () => {
    setIsReferralApplied(false);
    setFormData({
      referral_code: "",
      referral_code_error: "",
      referral_code_helper: "",
    });
  };

  return (
    <Dialog
      open={isOpen ? isOpen : false}
      aria-labelledby="invest-refferal-dialog"
      keepMounted
      aria-describedby="invest-refferal-dialog"
      className="invest-refferal-dialog"
      id="invest-bottom-dialog"
    >
      <DialogContent className="invest-refferal-dialog-content">
        <header>
          <div>Bank Referral Code</div>
          <img src={require(`assets/internet_banking_icon.svg`)} alt="" />
        </header>
        <p className="sub-text ">
          Ask Bank employee for their assisted referral code.
        </p>
        <div className="input">
          <TextField
            label="Bank referral code"
            placeholder="ex: UTM73P"
            id="referral_code"
            className="input"
            value={form_data.referral_code || ""}
            error={form_data.referral_code_error ? true : false}
            helperText={
              form_data.referral_code_error ||
              form_data.referral_code_helper ||
              ""
            }
            onChange={handleChange("referral_code")}
            type="text"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div className="text">
                    {!form_data.referral_code_error && !isReferralApplied && (
                      <div className="verify" onClick={() => applyReferral()}>
                        Verify
                      </div>
                    )}
                    {(form_data.referral_code_error || isReferralApplied) && (
                      <div onClick={() => clearReferral()}>Clear</div>
                    )}
                  </div>
                  {isApiRunning && (
                    <div className="referral-loader">
                      <DotDotLoader className="dot-spinner" />
                    </div>
                  )}
                </InputAdornment>
              ),
            }}
            disabled={isApiRunning}
          />
        </div>
        <footer>
          <Button
            onClick={cancel}
            className={`trasparent-button ${isApiRunning && "disabled"}`}
          >
            SKIP REFERRAL
          </Button>
          <Button
            onClick={handleClick}
            className={`full-button ${
              (isApiRunning || !isReferralApplied) && "disabled"
            }`}
            disabled={isApiRunning || !isReferralApplied}
          >
            CONTINUE
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default InvestReferralDialog;
