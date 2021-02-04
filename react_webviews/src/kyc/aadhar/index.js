import React, { useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";

const Aadhar = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});

  const handleClick = () => {};

  const handleChange = () => {}

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="aadhar"
      buttonTitle="PROCEED"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="aadhar">
        <header>
          <img src={require(`assets/aadhar.png`)} />
          <div>
            Please enter you aadhar card details. Use the same mobile number as
            given in your aadhar
          </div>
        </header>
        <main>
          <Input
            label="Aadhar card number"
            placeholder='XXXXXXXXXXXX'
            class="input"
            value=''
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("aadhar")}
            maxLength={20}
            type="text"
          />
          <Input
            label="Mobile number"
            placeholder='0000000000'
            class="input"
            value=''
            error={form_data.mobile_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("mobile")}
            maxLength={10}
            type="text"
          />
        </main>
      </div>
    </Container>
  );
};

export default Aadhar;
