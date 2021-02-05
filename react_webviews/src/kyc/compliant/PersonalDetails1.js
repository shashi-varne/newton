import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import {
  occupationOptions,
  incomeOptions,
  residentialOptions,
} from "../constants";
import CompliantHelpDialog from "../mini_components/CompliantHelpDialog";

const PersonalDetails1 = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
  };

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
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">Basic details</div>
        <div className="kyc-main-subtitle">
          <div>
            <div>Share your date of birth as per PAN:</div>
            <div className="pan">AAAAA1234A</div>
          </div>
          <div className="help" onClick={() => setIsOpen(true)}>
            HELP
          </div>
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
        <CompliantHelpDialog isOpen={isOpen} close={close} />
      </div>
    </Container>
  );
};

export default PersonalDetails1;
