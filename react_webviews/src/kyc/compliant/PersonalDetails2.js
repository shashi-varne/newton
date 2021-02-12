import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import {
  storageService,
  dobFormatTest,
  formatDate,
  isEmpty,
} from "utils/validators";
import Input from "common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  storageConstants,
  relationshipOptions,
  getPathname,
} from "../constants";
import { initData } from "../services";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData } from "../common/api";

const PersonalDetails2 = (props) => {
  const [isChecked, setIsChecked] = useState(true);
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
    }
    setUserKyc(userkycDetails);
    let is_checked = true;
    if (
      userkycDetails.nomination.nominee_optional ||
      (userkycDetails.nomination.meta_data_status !== "submitted" &&
        userkycDetails.nomination.meta_data_status !== "approved")
    ) {
      is_checked = true;
    }

    setIsChecked(is_checked);

    let formData = {
      name: userkycDetails.nomination.meta_data.name,
      dob: userkycDetails.nomination.meta_data.dob,
      relationship: userkycDetails.nomination.meta_data.relationship,
    };
    setShowLoader(false);
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
    let userkycDetails = { ...userkyc };
    userkycDetails.nomination.meta_data.dob = form_data.dob;
    userkycDetails.nomination.meta_data.name = form_data.name;
    userkycDetails.nomination.meta_data.relationship = form_data.relationship;
    let body = {};
    if (isChecked) {
      userkycDetails.nomination.nominee_optional = true;
      body = {
        nomination: userkycDetails.nomination,
      };
    } else {
      body = {
        nomination: userkycDetails.nomination.meta_data,
      };
    }
    saveCompliantPersonalDetails2(body);
  };

  const saveCompliantPersonalDetails2 = async (body) => {
    try {
      setIsApiRunning(true);
      const submitResult = await savePanData(body);
      if (!submitResult) return;
      if (isChecked) {
        if (isEdit) navigate(getPathname.journey);
        else navigate();
      } else {
        navigate(getPathname.journey);
      }
    } catch (err) {
      console.log(err);
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
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-compliant-personal-details2"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-nominee">
        <div className="kyc-main-title">{title}</div>
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
