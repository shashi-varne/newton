import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc, isIframe } from "utils/functions";
import AadhaarDialog from "../mini-components/AadhaarDialog";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "../../common/ui/Toast";
import "./Digilocker.scss";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";

const iframe = isIframe();

const Failed = (props) => {
  const [open, setOpen] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isBackDialogOpen, setBackDialogOpen] = useState(false);
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

  const goBack = () => {
    if (getConfig().isSdk) {
      setBackDialogOpen(true);
    } else {
      navigate("/kyc/journey", {
        state: { show_aadhaar: true },
      });
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
        order: "1",
        title: "RETRY",
        onClick: retry,
        classes: { root: 'digilocker-failed-button'}
      }}
      button2Props={{
        type: 'secondary',
        order: "2",
        title: "UPLOAD DOCUMENTS MANUALLY",
        onClick: manual,
        classes: { root: 'digilocker-failed-button'},
        showLoader: isApiRunning
      }}
      skelton={isLoading}
      headerData={{goBack}}
      iframeRightContent={require(`assets/${productName}/digilocker_failed.svg`)}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        {
          !iframe &&
          <img
            className="digi-image"
            alt=""
            src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
          />
        }
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your Digilocker.
        </div>
      </section>
      <AadhaarDialog
        open={open}
        id="kyc-aadhaar-dialog"
        close={close}
        kyc={kyc}
      />
      <ConfirmBackDialog
        isOpen={isBackDialogOpen}
        close={() => setBackDialogOpen(false)}
        goBack={() => navigate("/kyc/journey", { state: { fromState: 'digilocker-failed' }})}
      />
    </Container>
  );
};

export default Failed;
