import React, { useState } from "react";
import AddressDetails from "../../pages/Nominee/AddressDetails";
import { navigate as navigateFunc } from "../../utils/functions";
import { validateName, validateNumber } from "../../utils/validators";

import { ADDRESS_DETAILS_FORM_MAPPER } from "businesslogic/constants/nominee";
import { validateFields } from "businesslogic/utils/nominee/functions";
import { nativeCallback } from "../../utils/native_callback";
const DEFAULT_FORM_DATA = {
  [ADDRESS_DETAILS_FORM_MAPPER.pincode]: "",
  [ADDRESS_DETAILS_FORM_MAPPER.address]: "",
  [ADDRESS_DETAILS_FORM_MAPPER.city]: "",
  [ADDRESS_DETAILS_FORM_MAPPER.state]: "",
  [ADDRESS_DETAILS_FORM_MAPPER.password]: "",
  [ADDRESS_DETAILS_FORM_MAPPER.poi]: "",
};

const addressDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [isMinor, setIsMinor] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errorData, setErrorData] = useState(DEFAULT_FORM_DATA);

  const handleCheckbox = () => {
    setIsMinor(!isMinor);
  };

  const onClick = () => {
    const keysToCheck = [
      ADDRESS_DETAILS_FORM_MAPPER.pincode,
      ADDRESS_DETAILS_FORM_MAPPER.address,
      ADDRESS_DETAILS_FORM_MAPPER.city,
      ADDRESS_DETAILS_FORM_MAPPER.address,
      ADDRESS_DETAILS_FORM_MAPPER.state,
      ADDRESS_DETAILS_FORM_MAPPER.poi,
    ];
    if (isMinor) {
      keysToCheck.push(
        ADDRESS_DETAILS_FORM_MAPPER.guardianName,
        ADDRESS_DETAILS_FORM_MAPPER.guardianRelationship
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
        screen_name: "nominee_address_details",
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
      ADDRESS_DETAILS_FORM_MAPPER.pincode,
      ADDRESS_DETAILS_FORM_MAPPER.share,
    ];
    const nameFields = [
      ADDRESS_DETAILS_FORM_MAPPER.city,
      ADDRESS_DETAILS_FORM_MAPPER.state,
    ];
    const value = event.target.value || "";
    if (value && numberFields.includes(name) && !validateNumber(value)) return;
    if (value && nameFields.includes(name) && !validateName(value)) return;
    if (value && value.indexOf(" ") === 0) return;

    data[name] = value;
    errorInfo[name] = "";
    setFormData(data);
    setErrorData(errorInfo);
  };

  return (
    <WrappedComponent
      isMinor={isMinor}
      formData={formData}
      errorData={errorData}
      onClick={onClick}
      onChange={onChange}
      sendEvents={sendEvents}
    />
  );
};

export default addressDetailsContainer(AddressDetails);
