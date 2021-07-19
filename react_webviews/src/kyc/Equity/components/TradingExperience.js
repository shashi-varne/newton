import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { kycSubmit } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import { checkDLPanFetchAndApprovedStatus, checkDocsPending, isDocSubmittedOrApproved } from "../../common/functions"
import toast from "../../../common/ui/Toast";
import { isEmpty } from "../../../utils/validators";
import { PATHNAME_MAPPER } from "../../constants";
import "./commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";
import WVSelect from "../../../common/ui/Select/WVSelect";
import { navigate as navigateFunc, } from "../../../utils/functions";

const TRADING_EXPERIENCE_VALUES = [
  {
    name: "0 to 1 year",
    value: "0-1",
  },
  {
    name: "1 to 3 years",
    value: "1-3",
  },
  {
    name: "3 to 5 years",
    value: "3-5",
  },
  {
    name: "5 years +",
    value: "5+",
  },
];

const TradingExperience = (props) => {
  const [experience, setExperience] = useState("");
  const [oldState, setOldState] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  const {kyc, isLoading} = useUserKycHook();
  const [areDocsPending, setDocsPendingStatus] = useState();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
    setExperience(kyc?.equity_data?.meta_data?.trading_experience || "0-1");
    setOldState(kyc?.equity_data?.meta_data?.trading_experience || "")
    const docStatus = await checkDocsPending(kyc);
    setDocsPendingStatus(docStatus)
  }

  const handleClick = () => {
    sendEvents("next")
    if (oldState === experience) {
      handleNavigation();
      return;
    }
    handleSubmit();
  }

  const handleSubmit = async () => {
    setIsApiRunning("button");
    try {
      let body = {
        kyc: {
          equity_data: {
            "trading_experience": experience
          },
        },
      };
      const submitResult = await kycSubmit(body);
      if (!submitResult) return;
      handleNavigation();
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleNavigation = () => {
    const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
    if (kyc.initial_kyc_status === "compliant" || isPanFailedAndNotApproved) {
      if (!isDocSubmittedOrApproved("equity_pan")) {
        navigate(PATHNAME_MAPPER.uploadPan, {
          state: { goBack: "/kyc/trading-experience" }
        });
        return;
      }
    } 
    if (!isDocSubmittedOrApproved("equity_identification")) {
        navigate(PATHNAME_MAPPER.uploadSelfie);
    } else {
      if (!isDocSubmittedOrApproved("equity_income")) {
        navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
      } else {
        if (areDocsPending) {
          navigate(PATHNAME_MAPPER.documentVerification)
        } else {
          navigate(PATHNAME_MAPPER.kycEsign)
        }
      } 
    }
  }

  const sendEvents = (userAction) => {
    const experienceMapper ={
      "0-1": "0 to 1 years",
      "1-3":"1 to 3 years",
      "3-5":"3 to 5 years",
      "5+":"more than 5 years"
    }
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "select_trading_experience",
        experience: experienceMapper[experience]
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  
  const handleChange = (selectedOption) => {
    setExperience(selectedOption.value)
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      title="Select trading experience"
      disable={isLoading}
      showLoader={isApiRunning}
      data-aid="select-trading-experience-screen"
    >
      <div className="trading-experience" data-aid="trading-experience">
        <div
          className="generic-page-subtitle te-subtitle"
          data-aid="generic-page-subtitle"
        >
          As per SEBI, it is mandatory to share your trading experience
        </div>
        <WVSelect
          options={TRADING_EXPERIENCE_VALUES}
          titleProp="name"
          indexBy="value"
          value={experience}
          onChange={handleChange}
        />
      </div>
    </Container>
  );
};

export default TradingExperience;
