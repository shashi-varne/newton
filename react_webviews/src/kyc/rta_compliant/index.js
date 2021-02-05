import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import CompliantHelpDialog from "../mini_components/CompliantHelpDialog";

const RtaCompliantPersonalDetails = (props) => {
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
      id="kyc-rta-compliant-personal-details"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">Personal details</div>
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
        </main>
        <CompliantHelpDialog isOpen={isOpen} close={close} />
      </div>
    </Container>
  );
};

export default RtaCompliantPersonalDetails;
