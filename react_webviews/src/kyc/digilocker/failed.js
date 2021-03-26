import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import Button from "@material-ui/core/Button";
import AadhaarDialog from "../mini_components/AadhaarDialog";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "common/ui/Toast";

const Failed = (props) => {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const retry = () => {
    setOpen(true);
  };

  const manual = async () => {
    const navigate = navigateFunc.bind(props);
    try {
      const result = setKycType("manual");
      navigate("/kyc/journey", {state: {fromState: 'digilocker-failed'}});
    } catch (err) {
      toast(err.message);
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  const productName = getConfig().productName;
  return (
    <Container title="Aadhaar KYC Failed !" noFooter skelton={isLoading}>
      <section id="digilocker-failed">
        <img
          className="digi-image"
          alt=""
          src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
        />
        <div className="body-text1">
          Aadhaar KYC has been failed because we were not able to connect to
          your Digilocker.
        </div>
        <div className="body-text2">
          However, you can <strong>still complete your KYC</strong> and start
          investing in mutual funds.
        </div>
        {!isLoading && (
          <footer className="footer">
            <Button
              variant="raised"
              fullWidth
              color="secondary"
              className="raised"
              onClick={retry}
            >
              RETRY
            </Button>
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              className="outlined"
              onClick={manual}
            >
              CONTINUE WITH MANUAL KYC
            </Button>
          </footer>
        )}
      </section>
      <AadhaarDialog
        open={open}
        id="kyc-aadhaar-dialog"
        close={close}
        kyc={kyc}
      />
    </Container>
  );
};

export default Failed;
