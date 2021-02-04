import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";

const PersonalDetails1 = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});

  const occupationOptions = [
    {
      name: "Private Sector",
      value: "PRIVATE SECTOR",
    },
    {
      name: "Professional",
      value: "PROFESSIONAL",
    },
    {
      name: "Business",
      value: "BUSINESS",
    },
    {
      name: "House Wife",
      value: "HOUSE WIFE",
    },
    {
      name: "Public Sector",
      value: "PUBLIC SECTOR",
    },
    {
      name: "Government",
      value: "GOVERNMENT",
    },
    {
      name: "Student",
      value: "STUDENT",
    },
    {
      name: "Retired",
      value: "RETIRED",
    },
    {
      name: "Others",
      value: "OTHERS",
    },
  ];

  const incomeOptions = [
    {
      name: "Below 1L",
      value: "BELOW 1L",
    },
    {
      name: "1-5L",
      value: "1-5L",
    },
    {
      name: "5-10L",
      value: "5-10L",
    },
    {
      name: "10-25L",
      value: "10-25L",
    },
    {
      name: "25-100L",
      value: "25-100L",
    },
    {
      name: ">100L",
      value: ">100L",
    },
  ];

  const residentialOptions = [
    {
      name: "Indian",
      value: true,
    },
    {
      name: "Non indian",
      value: false,
    },
  ];

  const handleClick = () => {};

  const handleChange = (name) => (event) => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-personal-details1"
      buttonTitle="CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details-1">
        <div className="kyc-main-title">Basic details</div>
        <div className="kyc-main-subtitle">
          <div>
            <div>Share your date of birth as per PAN:</div>
            <div className="pan">AAAAA1234A</div>
          </div>
          <div className="help">HELP</div>
        </div>
        <main>
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
            <DropdownWithoutIcon
              error={form_data.occupation_error ? true : false}
              helperText={form_data.occupation_error || ""}
              options={occupationOptions}
              id="occupation"
              label="Occupation"
              isAOB={true}
              value=""
              name="occupation"
              onChange={handleChange("occupation")}
            />
          </div>
          <DropdownWithoutIcon
            error={form_data.income_error ? true : false}
            helperText={form_data.income_error || ""}
            options={incomeOptions}
            id="income"
            label="Income range"
            isAOB={true}
            value=""
            name="income"
            onChange={handleChange("income")}
          />
          <RadioWithoutIcon
            error={form_data.resident_error ? true : false}
            helperText={form_data.resident_error}
            width="40"
            label="Residential status:"
            class="residential-status"
            options={residentialOptions}
            id="account_type"
            value=""
            onChange={handleChange("residential_status")}
          />
          <Input
            label="Tax identification number (optional)"
            class="input"
            value=""
            error={form_data.tax_identification_error ? true : false}
            helperText={form_data.tax_identification_error || ""}
            onChange={handleChange("tax_identification")}
            maxLength={20}
            minLength={8}
            type="text"
          />
          <footer>
            By tapping ‘save and continue’ I agree that I am not a
            PEP(politically exposed person)
          </footer>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails1;
