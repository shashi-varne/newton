import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";

const PersonalDetails2 = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});

  const handleClick = () => {};

  const handleChange = (name) => (event) => {};

  return (
    <Container
      showLoader={showLoader}
      id="kyc-personal-details2"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          Personal details <span>2/4</span>
        </div>
        <main>
          <Input
            label="Father's name"
            class="input"
            value=""
            error={form_data.father_name_error ? true : false}
            helperText={form_data.father_name_error || ""}
            onChange={handleChange("father_name")}
            maxLength={20}
            type="text"
          />
          <Input
            label="Mother's name"
            class="input"
            value=""
            error={form_data.mother_name_error ? true : false}
            helperText={form_data.mother_name_error || ""}
            onChange={handleChange("mother_name")}
            type="text"
          />
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails2;
