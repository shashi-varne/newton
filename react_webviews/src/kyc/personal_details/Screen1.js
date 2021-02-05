import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { genderOptions, maritalStatusOptions } from "../constants";

const PersonalDetails1 = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});

  const handleClick = () => {};

  const handleChange = (name) => (event) => {};

  return (
    <Container
      showLoader={showLoader}
      id="kyc-personal-details1"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          Personal details <span>1/4</span>
        </div>
        <div className="kyc-main-subtitle">
          We need basic details to verify identity
        </div>
        <main>
          <Input
            label="Name"
            class="input"
            value=""
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("name")}
            maxLength={20}
            type="text"
          />
          <Input
            label="Date of birth(DD/MM/YYYY)"
            class="input"
            value=""
            error={form_data.dob_error ? true : false}
            helperText={form_data.dob_error || ""}
            onChange={handleChange("dob")}
            maxLength={10}
            type="text"
            id="dob"
          />
          <Input
            label="Email"
            class="input"
            value=""
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("email")}
            type="text"
          />
          <Input
            label="Mobile number"
            class="input"
            value=""
            error={form_data.mobile_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("mobile")}
            maxLength={10}
            type="text"
          />
          <div className="input">
            <RadioWithoutIcon
              error={form_data.gender_error ? true : false}
              helperText={form_data.gender_error}
              width="40"
              label="Gender:"
              class="gender"
              options={genderOptions}
              id="account_type"
              value=""
              onChange={handleChange("gender")}
            />
          </div>
          <div className="input">
            <RadioWithoutIcon
              error={form_data.marital_status_error ? true : false}
              helperText={form_data.marital_status_error}
              width="40"
              label="Marital status:"
              class="marital_status"
              options={maritalStatusOptions}
              id="account_type"
              value=""
              onChange={handleChange("marital_status")}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails1;
