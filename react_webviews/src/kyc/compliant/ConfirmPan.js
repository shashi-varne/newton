import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { navigate as navigateFunc, panUiSet } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import { storageService, isEmpty } from "utils/validators";
import { initData } from "../services";
import toast from "common/ui/Toast";
import { savePanData } from "../common/api";

const ConfirmPan = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const kycConfirmPanScreen = true;
  const isUserCompliant = "";
  const isPremiumFlow = "";
  const [userKyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );

  const handleClick = () => {
    navigate(getPathname.homeKyc, {
      state: {
        isPremiumFlow: true,
        isEdit: true,
      },
    });
  };

  // const handleClick2 = () => {};

  const handleClick2 = async () => {
    try {
      let dob = userKyc.pan.meta_data.dob;
      let pan = userKyc.pan?.meta_data?.pan_number;
      let oldObject = userKyc.pan.meta_data;
      let newObject = { ...oldObject };
      newObject.dob = dob;
      newObject.pan_number = pan;
      let body = {
        pan: newObject,
        address: userKyc.address.meta_data,
      };
      setIsApiRunning(true);
      let result = await savePanData(body);
      if (!result) return;
      if (
        (isUserCompliant || result.kyc.kyc_status === "compliant") &&
        (kycConfirmPanScreen || isPremiumFlow)
      ) {
        navigate(getPathname.compliantPersonalDetails1);
        // $state.go("kyc-compliant-personal-details");
      } else {
        if (isUserCompliant || result.kyc.kyc_status === "compliant") {
          // $state.go("kyc-journey");
          navigate(getPathname.journey);
        } else {
          if (userKyc.address.meta_data.is_nri) {
            // $state.go("kyc-journey", { show_aadhaar: false });
          } else {
            // $state.go("kyc-journey", { show_aadhaar: true });
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast(err || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userKyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
    }
    setUserKyc(userkycDetails);
  };

  return (
    <Container
      hideInPageTitle
      id="confirm-pan"
      buttonTitle="EDIT PAN"
      buttonTitle2="CONFIRM PAN"
      isApiRunning2={isApiRunning}
      disable2={isApiRunning}
      handleClick={handleClick}
      handleClick2={handleClick2}
      twoButton={true}
      buttonClassName="confirm-pan-button1"
    >
      <div className="kyc-compliant-confirm-pan">
        <div className="kyc-main-title">Confirm PAN</div>
        <div className="kyc-main-subtitle">
          Confirm your PAN to unlock premium onboarding
        </div>
        <main>
          <img alt="" src={require(`assets/crd_pan.png`)} />
          {userKyc && (
            <div className="pan-block-on-img">
              <div className="user-name">{userKyc.pan?.meta_data?.name}</div>
              <div className="pan-number">
                PAN: <span>{panUiSet(userKyc.pan?.meta_data?.pan_number)}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
};

export default ConfirmPan;
