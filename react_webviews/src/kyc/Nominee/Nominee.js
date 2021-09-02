import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "../../common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { RELATIONSHIP_OPTIONS, PATHNAME_MAPPER } from "../constants";
import {
  validateFields,
  compareObjects,
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import { kycSubmit } from "../common/api";
import {
  validateName,
  isEmpty,
  dobFormatTest,
  formatDate,
} from "../../utils/validators";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "../../utils/native_callback";

const Nominee = (props) => {
  const genericErrorMessage = "Something went wrong!";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [oldState, setOldState] = useState({});
  const state = props.location.state || {};
  const isEdit = state.isEdit || false;
  let finalSubmissionData = state.finalSubmissionData || {
    kyc: {},
  };
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }

  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = async () => {
    let formData = {
      name: kyc.nomination.meta_data.name || "",
      dob: kyc.nomination.meta_data.dob || "",
      relationship: kyc.nomination.meta_data.relationship || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "name", "relationship"];
    let result = validateFields(form_data, keysToCheck);
    sendEvents('next')
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.nomination.meta_data.dob = form_data.dob;
    userkycDetails.nomination.meta_data.name = form_data.name;
    userkycDetails.nomination.meta_data.relationship = form_data.relationship;
    let body = { ...finalSubmissionData };
    body.kyc.nomination = userkycDetails.nomination.meta_data;
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(PATHNAME_MAPPER.kycReport);
      return;
    }
    saveNomineeDetails(body);
  };

  const saveNomineeDetails = async (body) => {
    try {
      setIsApiRunning("button");
      const submitResult = await kycSubmit(body);
      if (!submitResult) return;
      navigate(PATHNAME_MAPPER.kycReport);
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name === "name" && value && !validateName(value)) return;
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
      event_name: "KYC_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "nominee_details_compliant",
        name: form_data.name ? "yes" : "no",
        dob: form_data.dob_error ? "invalid" : form_data.dob ? "yes" : "no",
        relationship: form_data.relationship ? "yes" : "no",
        pincode_entered: kyc.nomination?.meta_data?.nominee_address?.pincode
          ? "yes"
          : "no",
        address_entered: kyc.nomination?.meta_data?.nominee_address?.addressline
          ? "yes"
          : "no",
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
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      id="kyc-home"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      data-aid='kyc-nominee-details-page'
    >
      <div className="kyc-nominee">
        <WVInfoBubble type="info">
          Nominee details will be applicable for mutual fund investments only
        </WVInfoBubble>
        {!isEmpty(kyc) && (
          <main data-aid='kyc-nominee'>
            <Input
              label="Name"
              class="input"
              value={form_data.name || ""}
              error={form_data.name_error ? true : false}
              helperText={form_data.name_error || ""}
              onChange={handleChange("name")}
              type="text"
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
            />
            <div className="input" data-aid='kyc-dropdown-withouticon'>
              <DropdownWithoutIcon
                error={form_data.relationship_error ? true : false}
                helperText={form_data.relationship_error}
                options={RELATIONSHIP_OPTIONS}
                id="relationship"
                label="Relationship"
                isAOB={true}
                value={form_data.relationship || ""}
                name="relationship"
                onChange={handleChange("relationship")}
              />
            </div>
          </main>
        )}
      </div>
    </Container>
  );
};

export default Nominee;
