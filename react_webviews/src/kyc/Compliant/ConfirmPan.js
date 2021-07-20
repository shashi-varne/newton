import React, { useState } from "react";
import Container from "../common/Container";
import { panUiSet } from "../common/functions";
import { PATHNAME_MAPPER } from "../constants";
import toast from "../../common/ui/Toast";
import { kycSubmit } from "../common/api";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";
import { nativeCallback } from "../../utils/native_callback";

const ConfirmPan = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const kycConfirmPanScreen = true;
  const isUserCompliant = "";
  const isPremiumFlow = "";
  const {kyc, isLoading} = useUserKycHook();

  const handleClick = () => {
    sendEvents('edit')
    navigate(PATHNAME_MAPPER.homeKyc, {
      state: {
        isPremiumFlow: true,
        isEdit: true,
      },
    });
  };

  const handleClick2 = async () => {
    sendEvents('next')
    try {
      let dob = kyc.pan.meta_data.dob;
      let pan = kyc.pan?.meta_data?.pan_number;
      let oldObject = kyc.pan.meta_data;
      let newObject = { ...oldObject };
      newObject.dob = dob;
      newObject.pan_number = pan;
      let body = {
        kyc: {
          pan: newObject,
          address: kyc.address.meta_data,
        },
      };
      setIsApiRunning("button");
      let result = await kycSubmit(body);
      if (!result) return;
      if (
        (isUserCompliant || result.kyc.kyc_status === "compliant") &&
        (kycConfirmPanScreen || isPremiumFlow)
      ) {
        navigate(PATHNAME_MAPPER.compliantPersonalDetails1);
      } else {
        if (isUserCompliant || result.kyc.kyc_status === "compliant") {
          navigate(PATHNAME_MAPPER.journey);
        } else {
          if (kyc.address.meta_data.is_nri) {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${getConfig().searchParams}&show_aadhaar=false`,
            });
          } else {
            navigate(`${PATHNAME_MAPPER.journey}`, {
              searchParams: `${getConfig().searchParams}&show_aadhaar=true`,
            });
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

  const sendEvents = (userAction) => {
    let eventObj = {
      // "event_name": 'premium_onboard',
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "confirm_pan",
        // "initial_kyc_status":  "compliant",
        // "channel": getConfig().code
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      id="confirm-pan"
      events={sendEvents("just_set_events")}
      buttonOneTitle="EDIT PAN"
      buttonTwoTitle="CONFIRM PAN"
      skelton={isLoading}
      showLoader={isApiRunning}
      handleClickOne={handleClick}
      handleClickTwo={handleClick2}
      twoButton={true}
      buttonClassName="confirm-pan-button1"
      title='Confirm PAN'
      dualbuttonwithouticon={true}
      data-aid='kyc-confirm-pan-screen'
    >
      <div className="kyc-compliant-confirm-pan" data-aid='kyc-compliant-confirm-pan'>
        <div className="kyc-main-subtitle" data-aid='kyc-main-subtitle'>
          Confirm your PAN to unlock premium onboarding
        </div>
        <main data='kyc-compliant-confirm-pan'>
          <img alt="" src={require(`assets/crd_pan.png`)} />
          {kyc && (
            <div className="pan-block-on-img" data-aid='kyc-pan_number'>
              <div className="user-name">{kyc.pan?.meta_data?.name}</div>
              <div className="pan-number">
                PAN: <span>{panUiSet(kyc.pan?.meta_data?.pan_number)}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
};

export default ConfirmPan;
