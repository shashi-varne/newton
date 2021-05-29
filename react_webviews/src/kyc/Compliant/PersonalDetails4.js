import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { dobFormatTest, formatDate, isEmpty } from "utils/validators";
import Input from "../../common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { relationshipOptions, getPathname } from "../constants";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
  getTotalPagesInPersonalDetails,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import { validateAlphabets } from "../../utils/validators";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";

const PersonalDetails4 = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }
  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let is_checked = false;
    if (
      kyc.nomination.nominee_optional ||
      (kyc.nomination.meta_data_status !== "submitted" &&
        kyc.nomination.meta_data_status !== "approved")
    ) {
      is_checked = true;
    }

    setIsChecked(is_checked);

    let formData = {
      name: kyc.nomination.meta_data.name,
      dob: kyc.nomination.meta_data.dob,
      relationship: kyc.nomination.meta_data.relationship,
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "name", "relationship"];
    sendEvents('next')
    if (!isChecked) {
      let result = validateFields(form_data, keysToCheck);
      if (!result.canSubmit) {
        let data = { ...result.formData };
        setFormData(data);
        return;
      }
    }

    if (isChecked) {
      if (kyc.nomination.nominee_optional) {
        handleNavigation();
        return;
      }
    } else if (compareObjects(keysToCheck, oldState, form_data)) {
      handleNavigation();
      return;
    }

    let userkycDetails = { ...kyc };
    let body = { kyc: {} };
    if (isChecked) {
      userkycDetails.nomination.nominee_optional = true;
      body.kyc = {
        nomination: userkycDetails.nomination,
      };
    } else {
      userkycDetails.nomination.meta_data.dob = form_data.dob;
      userkycDetails.nomination.meta_data.name = form_data.name;
      userkycDetails.nomination.meta_data.relationship = form_data.relationship;
      body.kyc = {
        nomination: userkycDetails.nomination.meta_data,
      };
    }
    saveCompliantPersonalDetails2(body);
  };

  const saveCompliantPersonalDetails2 = async (body) => {
    try {
      setIsApiRunning("button");
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
    // if (isChecked) {
    //   if (isEdit) navigate(getPathname.journey);
    //   else navigate("/kyc/compliant/bank-details");
    // } else {
    //   navigate(getPathname.journey);
    // }
    if (kyc.sign.doc_status !== "submitted" && kyc.sign.doc_status !== "approved") {
      navigate(getPathname.uploadSign);
    } else {
      navigate(getPathname.journey)
    }
  };

  const handleChange = (name) => (event) => {
    if (name === "checkbox") {
      setIsChecked(!isChecked);
      return;
    }

    let value = event.target ? event.target.value : event;
    if (name === "name" && value && !validateAlphabets(value)) return;
    let formData = { ...form_data };
    if (name === "dob") {
      if (!dobFormatTest(value)) {
        return;
      }
      let input = document.getElementById("dob");
      input.onkeyup = formatDate;
    }
    formData[name] = value;
    if (!value) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "nominee_details",
        add_nominee: isChecked ? "no" : "yes",
        // "flow": 'premium onboarding',
        // "name": form_data.name ? "yes" : "no",
        // "dob": form_data.dob_error ? "invalid" : form_data.dob ? "yes" : "no",
        // "relationship": form_data.relationship ? "yes" : "no",
        // "flow": 'premium onboarding',
        // "initial_kyc_status" : "compliant"
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const pageNumber = getTotalPagesInPersonalDetails(kyc, user, isEdit);
  return (
    <Container
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      id="kyc-compliant-personal-details2"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      current={pageNumber}
      count={pageNumber}
      total={pageNumber}
    >
      <div className="kyc-nominee">
        <main>
          <WVInfoBubble
            type="info"
            customTitle="Nominee details will be applicable for mutual fund investments only"
            hasTitle
          />
          <div className="nominee-checkbox">
            <Checkbox
              defaultChecked
              checked={isChecked}
              value={isChecked}
              name="checked"
              handleChange={handleChange("checkbox")}
              class="checkbox"
            />
            <span>I do not wish to add a nominee</span>
          </div>
          <Input
            label="Name"
            class="input"
            value={form_data.name || ""}
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("name")}
            maxLength={20}
            type="text"
            disabled={isChecked || isApiRunning}
          />
          <Input
            label="Date of birth(DD/MM/YYYY)"
            class="input"
            value={form_data.dob || ""}
            error={form_data.dob_error ? true : false}
            helperText={form_data.dob_error || ""}
            onChange={handleChange("dob")}
            maxLength={10}
            type="text"
            inputMode="numeric"
            id="dob"
            disabled={isChecked || isApiRunning}
          />
          <div className="input">
            <DropdownWithoutIcon
              error={form_data.relationship_error ? true : false}
              helperText={form_data.relationship_error}
              options={relationshipOptions}
              id="relationship"
              label="Relationship"
              isAOB={true}
              value={form_data.relationship || ""}
              name="relationship"
              onChange={handleChange("relationship")}
              disabled={isChecked || isApiRunning}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails4;
