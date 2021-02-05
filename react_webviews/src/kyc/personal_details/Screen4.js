import React, { useState } from "react";
import Container from "../common/Container";
import {
  storageService,
  dobFormatTest,
  formatDate,
  calculateAge,
  isValidDate,
} from "utils/validators";
import Input from "common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { storageConstants } from "../constants";
import { relationshipOptions } from "../constants";

let userKycDetails = storageService().getObject(storageConstants.KYC);
const PersonalDetails4 = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [userKyc, setUserKyc] = useState(userKycDetails);
  const [isChecked, setIsChecked] = useState(true);

  const handleClick = () => {
    let keys_to_check = ["dob", "name", "relationship"];
    let formData = Object.assign({}, form_data);
    let submit = true;
    keys_to_check.forEach((element) => {
      let value = userKyc.nomination.meta_data[element];
      if (!value) {
        formData[`${element}_error`] = "This is required";
        submit = false;
      } else if (element === "dob") {
        if (!isValidDate(value)) {
          formData[`${element}_error`] = "Please enter a valid year";
          submit = false;
        } else if (calculateAge(value) < 18) {
          formData[`${element}_error`] = "Minimum age required 18 years";
          submit = false;
        }
      }
    });
    if (!submit) {
      setFormData(formData);
      return;
    }
  };

  const handleChange = (name) => (event) => {
    if (name === "checkbox") {
      setIsChecked(!isChecked);
      return;
    }
    let value = event.target ? event.target.value : event;
    let formData = Object.assign({}, form_data);
    let kyc = Object.assign({}, userKyc);
    kyc.nomination.meta_data[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else if (name === "dob") {
      if (!dobFormatTest(value)) {
        return;
      }
      let input = document.getElementById("dob");
      input.onkeyup = formatDate;
    } else formData[`${name}_error`] = "";

    kyc.nomination.meta_data[name] = value;
    setFormData(formData);
    setUserKyc(kyc);
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
        <div className="kyc-main-title">
          Nominee detail <span>4/4</span>
        </div>
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
            value={userKyc.nomination.meta_data.name}
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("name")}
            maxLength={20}
            type="text"
            disabled={isChecked}
          />
          <Input
            label="Date of birth(DD/MM/YYYY)"
            class="input"
            value={userKyc.nomination.meta_data.dob}
            error={form_data.dob_error ? true : false}
            helperText={form_data.dob_error || ""}
            onChange={handleChange("dob")}
            maxLength={10}
            type="text"
            id="dob"
            disabled={isChecked}
          />
          <div className="input">
            <DropdownWithoutIcon
              error={form_data.relationship_error ? true : false}
              helperText={form_data.relationship_error}
              options={relationshipOptions}
              id="relationship"
              label="Relationship"
              isAOB={true}
              value={userKyc.nomination.meta_data.relationship || ""}
              name="relationship"
              onChange={handleChange("relationship")}
              disabled={isChecked}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails4;
