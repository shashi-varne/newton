import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import { validateNumber, storageService } from "utils/validators";
import { navigate as navigateFunc, validateFields } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import { initData } from "../services";

const Aadhar = (props) => {
  const [showLoader] = useState(false);
  const [form_data, setFormData] = useState({});
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    initialize();
  }, []);

  let initialize = async () => {
    let userKyc = storageService().getObject(storageConstants.KYC);
    if (!userKyc) {
      await initData();
      userKyc = storageService().getObject(storageConstants.KYC);
    }
    setFormData({
      mobile: userKyc.identification.meta_data.mobile_number || "",
    });
  };

  let keysToCheck = ["aadhar", "mobile"];

  const handleClick = () => {
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = Object.assign({}, result.formData);
      setFormData(data);
      return;
    }
    navigate(getPathname("aadharConfirmation"), { state: { name: "Alekhya" } });
  };

  const handleChange = (name) => (event) => {
    let value = event?.target?.value || "";
    let formData = Object.assign({}, form_data);
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else {
      formData[`${name}_error`] = "";
    }
    if (value && !validateNumber(value)) return;
    formData[name] = value;
    setFormData(formData);
  };

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="aadhar"
      buttonTitle="PROCEED"
      disable={showLoader}
      handleClick={handleClick}
    >
      <div className="aadhar">
        <header>
          <img src={require(`assets/aadhar.png`)} alt="" />
          <div>
            Please enter you aadhar card details. Use the same mobile number as
            given in your aadhar
          </div>
        </header>
        <main>
          <Input
            label="Aadhar card number"
            placeholder="XXXXXXXXXXXX"
            class="input"
            value={form_data.aadhar || ""}
            error={form_data.aadhar_error ? true : false}
            helperText={form_data.aadhar_error || ""}
            onChange={handleChange("aadhar")}
            maxLength={12}
            type="text"
          />
          <Input
            label="Mobile number"
            placeholder="0000000000"
            class="input"
            value={form_data.mobile || ""}
            error={form_data.mobile_error ? true : false}
            helperText={form_data.mobile_error || ""}
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
