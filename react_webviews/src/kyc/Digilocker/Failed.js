import React, { useState } from "react";
import Container from "../common/Container";
import { pollProgress } from "../common/functions";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import AadhaarDialog from "../mini-components/AadhaarDialog";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "../../common/ui/Toast";
import "./Digilocker.scss";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";
import { popupWindowCenter } from "../../utils/functions";

const config = getConfig();
const iframe = config.isIframe;
const Failed = (props) => {
  const [open, setOpen] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isBackDialogOpen, setBackDialogOpen] = useState(false);
  const navigate = navigateFunc.bind(props);
  const isMobileDevice = config.isMobileDevice;

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

  const handleIframeKyc = (url) => {
    let popup_window = popupWindowCenter(900, 580, url);
    setIsApiRunning("page");
    pollProgress(600000, 5000, popup_window).then(
      function (poll_data) {
        popup_window.close();
        if (poll_data.status === "success") {
          // Success
          navigate("/kyc/digilocker/success");
        } else if (poll_data.status === "failed") {
          // Failed
          navigate("/kyc/digilocker/failed");
        } else if (poll_data.status === "closed") {
          // Closed
          toast("Digilocker window closed. Please try again");
        }
        setIsApiRunning(false);
      },
      function (err) {
        popup_window.close();
        setIsApiRunning(false);
        console.log(err);
        if (err?.status === "timeout") {
          toast("Digilocker has been timedout . Please try again");
        } else {
          toast("Something went wrong. Please try again.");
        }
      }
    );
  };


  const goBack = () => {
    if (config.isSdk) {
      setBackDialogOpen(true);
    } else {
      navigate("/kyc/journey", {
        state: { show_aadhaar: true },
      });
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  const productName = config.productName;
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
      loaderData={{ loadingText: " " }}
      iframeRightContent={require(`assets/${productName}/digilocker_failed.svg`)}
      showLoader={isApiRunning === "page"}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        {
          (!iframe || isMobileDevice) &&
          <img
            className="digi-image"
            alt=""
            src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
          />
        }
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your DigiLocker.
        </div>
        <div className='body-text2'>Try again to complete KYC.</div>
      </section>
      <AadhaarDialog
        open={open}
        id="kyc-aadhaar-dialog"
        close={close}
        kyc={kyc}
        handleIframeKyc={handleIframeKyc}
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
