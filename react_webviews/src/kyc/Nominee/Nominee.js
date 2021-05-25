import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "../../common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { relationshipOptions, getPathname } from "../constants";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import {
  validateAlphabets,
  isEmpty,
  dobFormatTest,
  formatDate,
} from "../../utils/validators";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";

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
      navigate(getPathname.kycReport);
      return;
    }
    saveNomineeDetails(body);
  };

  const saveNomineeDetails = async (body) => {
    try {
      setIsApiRunning("button");
      const submitResult = await kycSubmit(body);
      if (!submitResult) return;
      navigate(getPathname.kycReport);
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
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

  return (
    <Container
      skelton={isLoading}
      id="kyc-home"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
    >
      <div className="kyc-nominee">
        <WVInfoBubble
          type="info"
          customTitle="Nominee details will be applicable for mutual fund investments only"
          hasTitle
        />
        {!isEmpty(kyc) && (
          <main>
            <Input
              label="Name"
              class="input"
              value={form_data.name || ""}
              error={form_data.name_error ? true : false}
              helperText={form_data.name_error || ""}
              onChange={handleChange("name")}
              maxLength={20}
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
              />
            </div>
          </main>
        )}
      </div>
    </Container>
  );
};

export default Nominee;
