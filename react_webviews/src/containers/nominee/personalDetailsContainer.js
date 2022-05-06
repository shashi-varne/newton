import React, { useState } from "react";
import PersonalDetails from "../../pages/Nominee/PersonalDetails";
import { navigate as navigateFunc } from "../../utils/functions";
import {
  dobFormatTest,
  formatDate,
  validateName,
  validateNumber,
} from "../../utils/validators";

import { PERSONAL_DETAILS_FORM_MAPPER } from "businesslogic/constants/nominee";
import { validateFields } from "businesslogic/utils/nominee/functions";
import { nativeCallback } from "../../utils/native_callback";
const DEFAULT_FORM_DATA = {
  [PERSONAL_DETAILS_FORM_MAPPER.name]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.mobile]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.relationship]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.guardianName]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.mobile]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.email]: "",
  [PERSONAL_DETAILS_FORM_MAPPER.share]: "",
};
const personalDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [isMinor, setIsMinor] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errorData, setErrorData] = useState(DEFAULT_FORM_DATA);
  const [openExitNominee, setOpenExitNominee] = useState(false);

  const availableShare = 20;

  const handleCheckbox = () => {
    setIsMinor(!isMinor);
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
    const result = validateFields(formData, keysToCheck);
    if (!result.canSubmit) {
      const data = { ...errorData, ...result.errorData };
      setErrorData(data);
      return;
    }
    sendEvents("next");
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
    const numberFields = [
      PERSONAL_DETAILS_FORM_MAPPER.mobile,
      PERSONAL_DETAILS_FORM_MAPPER.share,
    ];
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
    data[name] = value;
    errorInfo[name] = "";
    setFormData(data);
    setErrorData(errorInfo);
  };

  const handleExitNominee = (value) => () => {
    setOpenExitNominee(value);
  };

  const handleExit = () => {};

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
