import React, { useMemo, useState } from "react";
import PersonalDetails from "../../pages/Nominee/PersonalDetails";
import { navigate as navigateFunc } from "../../utils/functions";
import {
  dobFormatTest,
  formatDate,
  validateName,
  validateNumber,
} from "../../utils/validators";
import { nativeCallback } from "../../utils/native_callback";

import {
  PERSONAL_DETAILS_FORM_MAPPER,
  DEFAULT_NOMINEE_PERSONAL_DETAILS,
} from "businesslogic/constants/nominee";
import {
  validateFields,
  getNomineePersonalDetails,
  getAvailableShares,
  validateDecimalPercentage,
  getNomineeDataById,
  isNomineeUpdateFlow,
} from "businesslogic/utils/nominee/functions";
import {
  getEquityNominationData,
  getNomineeDetails,
  updateNomineeDetails,
} from "businesslogic/dataStore/reducers/nominee";
import { useDispatch, useSelector } from "react-redux";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import { handleNomineeExit } from "../../pages/Nominee/common/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { getUserName } from "businesslogic/utils/common/functions";

const initializeData = (list, nomineeDetails) => () => {
  const nomineeData = getNomineeDataById(list, nomineeDetails?.id);
  let availableShare = getAvailableShares(list);
  const isUpdateFlow = isNomineeUpdateFlow(nomineeDetails);
  if (isUpdateFlow) {
    availableShare += nomineeData[PERSONAL_DETAILS_FORM_MAPPER.share];
  }
  return {
    availableShare,
  };
};

const personalDetailsContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const navigate = navigateFunc.bind(props);
  const nomineeDetails = useSelector((state) => getNomineeDetails(state));
  const equityNominationData = useSelector((state) =>
    getEquityNominationData(state)
  );
  const [isMinor, setIsMinor] = useState(nomineeDetails.isMinor || false);
  const [formData, setFormData] = useState(
    getNomineePersonalDetails(nomineeDetails)
  );
  const [errorData, setErrorData] = useState(DEFAULT_NOMINEE_PERSONAL_DETAILS);
  const [openExitNominee, setOpenExitNominee] = useState(false);

  const { kyc } = useUserKycHook();
  const { availableShare } = useMemo(
    initializeData(equityNominationData?.eq_nominee_list, nomineeDetails),
    [equityNominationData?.eq_nominee_list, nomineeDetails?.id]
  );

  const handleCheckbox = () => {
    setIsMinor(!isMinor);
    const errorInfo = { ...errorData };
    errorInfo[PERSONAL_DETAILS_FORM_MAPPER.dob] = "";
    setErrorData(errorInfo);
  };

  const onClick = () => {
    const keysToCheck = [
      PERSONAL_DETAILS_FORM_MAPPER.name,
      PERSONAL_DETAILS_FORM_MAPPER.dob,
      PERSONAL_DETAILS_FORM_MAPPER.mobile,
      PERSONAL_DETAILS_FORM_MAPPER.relationship,
      PERSONAL_DETAILS_FORM_MAPPER.share,
      PERSONAL_DETAILS_FORM_MAPPER.email,
    ];
    if (isMinor) {
      keysToCheck.push(
        PERSONAL_DETAILS_FORM_MAPPER.guardianName,
        PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship
      );
    }
    const userName = getUserName(kyc);
    const data = { ...formData, isMinor, availableShare, userName };
    const result = validateFields(data, keysToCheck);
    if (!result.canSubmit) {
      const data = { ...errorData, ...result.errorData };
      setErrorData(data);
      return;
    }
    sendEvents("next");
    data[PERSONAL_DETAILS_FORM_MAPPER.share] = Number(
      data[PERSONAL_DETAILS_FORM_MAPPER.share]
    );
    delete data.availableShare;
    delete data.userName;
    dispatch(updateNomineeDetails(data));
    navigate(NOMINEE_PATHNAME_MAPPER.addressDetails);
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "nominee_details",
        minor_nominee: isMinor ? "yes" : "no",
        nominee_percentage_share: formData.share,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onChange = (name) => (event) => {
    const data = { ...formData };
    const errorInfo = { ...errorData };
    const numberFields = [PERSONAL_DETAILS_FORM_MAPPER.mobile];
    const nameFields = [
      PERSONAL_DETAILS_FORM_MAPPER.name,
      PERSONAL_DETAILS_FORM_MAPPER.guardianName,
    ];
    const value = event.target.value || "";
    if (value && numberFields.includes(name) && !validateNumber(value)) return;
    if (value && nameFields.includes(name) && !validateName(value)) return;
    if (name === PERSONAL_DETAILS_FORM_MAPPER.dob) {
      if (!dobFormatTest(value)) {
        return;
      }
      const input = document.getElementById(PERSONAL_DETAILS_FORM_MAPPER.dob);
      input.onkeyup = formatDate;
    }
    if (
      name === PERSONAL_DETAILS_FORM_MAPPER.share &&
      !validateDecimalPercentage(value)
    ) {
      return;
    }
    data[name] = value;
    errorInfo[name] = "";
    setFormData(data);
    setErrorData(errorInfo);
  };

  const handleExitNominee = (value) => () => {
    setOpenExitNominee(value);
  };

  const handleExit = () => {
    sendEvents("back");
    handleNomineeExit(navigate);
  };

  return (
    <WrappedComponent
      isMinor={isMinor}
      formData={formData}
      errorData={errorData}
      availableShare={availableShare}
      onClick={onClick}
      onChange={onChange}
      handleCheckbox={handleCheckbox}
      sendEvents={sendEvents}
      openExitNominee={openExitNominee}
      handleClose={handleExitNominee(false)}
      handleExit={handleExit}
      onBackClick={handleExitNominee(true)}
    />
  );
};

export default personalDetailsContainer(PersonalDetails);
