import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { kycSubmit } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isDocSubmittedOrApproved } from "../../common/functions"
import toast from "../../../common/ui/Toast";
import { isEmpty } from "../../../utils/validators";
import { PATHNAME_MAPPER } from "../../constants";
import "./commonStyles.scss";
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

  useEffect(() => {
    if (!isEmpty(kyc)) {
      setExperience(kyc?.equity_data?.meta_data?.trading_experience || "0-1");
      setOldState(kyc?.equity_data?.meta_data?.trading_experience || "")
    }
  }, [kyc]);

  const handleClick = () => {
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
            // "fno_required": true,
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
    if (kyc.initial_kyc_status === "compliant") {
      if (!isDocSubmittedOrApproved("equity_pan")) {
        navigate(PATHNAME_MAPPER.uploadPan);
        return;
      }
    } 
    if ((kyc?.kyc_type !== "manual" && !isDocSubmittedOrApproved("equity_identification")) ||
      (kyc?.kyc_type === "manual" && !isDocSubmittedOrApproved("identification")))
      navigate(PATHNAME_MAPPER.uploadSelfie);
    else {
      if (!isDocSubmittedOrApproved("equity_income"))
        navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
      else navigate(PATHNAME_MAPPER.kycEsign)
    }
  }

  const handleChange = (selectedOption) => {
    setExperience(selectedOption.value)
  }

  const goBack = () => {
    navigate(PATHNAME_MAPPER.journey);
  }

  return (
    <Container
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      title="Select trading experience"
      disable={isLoading}
      showLoader={isApiRunning}
      headerData={{goBack}}
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
