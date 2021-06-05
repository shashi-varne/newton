import "./Digilocker.scss";
import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import AadhaarDialog from "../mini-components/AadhaarDialog";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "../../common/ui/Toast";
import "./Digilocker.scss";

const Failed = (props) => {
  const [open, setOpen] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);

  const close = () => {
    setOpen(false);
  };

  const retry = () => {
    setOpen(true);
  };

  const manual = async () => {
    try {
      setIsApiRunning(true);
      await setKycType("manual");
      navigate("/kyc/journey", { state: { fromState: 'digilocker-failed' }});
    } catch (err) {
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  const productName = getConfig().productName;
  return (
    <Container
      title="Aadhaar KYC Failed!"
      data-aid='kyc-aadhaar-kyc-failed-screen'
      twoButtonVertical={true}
      button1Props={{
        type: 'primary',
        title: "RETRY",
        onClick: retry,
      }}
      button2Props={{
        type: 'secondary',
        title: "UPLOAD DOCUMENTS MANUALLY",
        onClick: manual,
        showLoader: isApiRunning
      }}
      skelton={isLoading}
      headerData={{ icon: "close" }}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        <img
          className="digi-image"
          alt=""
          src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
        />
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your DigiLocker.
        </div>
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
