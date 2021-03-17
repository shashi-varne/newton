import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import {
  dobFormatTest,
  formatDate,
  isEmpty,
} from "utils/validators";
import Input from "common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  relationshipOptions,
  getPathname,
} from "../constants";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { kycSubmit } from "../common/api";
import { validateAlphabets } from "../../utils/validators";
import toast from "common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";

const PersonalDetails2 = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }

  const [kyc, ,isLoading] = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
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
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "name", "relationship"];
    if (!isChecked) {
      let result = validateFields(form_data, keysToCheck);
      if (!result.canSubmit) {
        let data = { ...result.formData };
        setFormData(data);
        return;
      }
    }
    let userkycDetails = { ...kyc };
    userkycDetails.nomination.meta_data.dob = form_data.dob;
    userkycDetails.nomination.meta_data.name = form_data.name;
    userkycDetails.nomination.meta_data.relationship = form_data.relationship;
    let body = { kyc: {} };
    if (isChecked) {
      userkycDetails.nomination.nominee_optional = true;
      body.kyc = {
        nomination: userkycDetails.nomination,
      };
    } else {
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
      if (isChecked) {
        if (isEdit) navigate(getPathname.journey);
        else navigate("/kyc/compliant/bank-details");
      } else {
        navigate(getPathname.journey);
      }
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setIsApiRunning(false);
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

  return (
    <Container
      skelton={isLoading}
      // hideInPageTitle
      id="kyc-compliant-personal-details2"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      // disable={isApiRunning || isLoading}
      handleClick={handleClick}
      title={title}
    >
      <div className="kyc-nominee">
        {/* <div className="kyc-main-title">{title}</div> */}
        <main>
          <div className="nominee-checkbox">
            <Checkbox
              defaultChecked
              checked={isChecked}
              value={isChecked}
              name="checked"
              handleChange={handleChange("checkbox")}
              class="checkbox"
            />
            <span>
              I do not wish to add a <b>nominee</b>
            </span>
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

export default PersonalDetails2;
