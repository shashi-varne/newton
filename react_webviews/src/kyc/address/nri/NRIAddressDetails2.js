import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import Toast from "common/ui/Toast";
import { getPinCodeData, submit } from "../../common/api";
import Container from "../../common/Container";
import { kycNRIDocNameMapper } from "../../constants";
import {
  compareObjects,
  navigate as navigateFunc,
  validateFields,
} from "../../common/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isEmpty, validateNumber } from "../../../utils/validators";

const NRIAddressDetails2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [pinTouched, setPinTouched] = useState(false);
  const [showError, setShowError] = useState(false);
  const [kyc, , isLoading] = useUserKycHook();
  const [form_data, setFormData] = useState({
    pincode: "",
  });
  const [oldState, setOldState] = useState({});
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let formData = {};
    formData.pincode = kyc?.nri_address?.meta_data?.pincode || "";
    formData.addressline = kyc?.nri_address?.meta_data?.addressline || "";
    formData.state = kyc?.nri_address?.meta_data?.state || "";
    formData.city = kyc?.nri_address?.meta_data?.city || "";
    formData.country = kyc?.nri_address?.meta_data?.country || "";
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const stateParams = props?.location?.state;

  const handleSubmit = async () => {
    let keysToCheck = ["pincode", "addressline", "state", "city", "country"];

    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }

    if (form_data.pincode_error) {
      return;
    }

    if (compareObjects(keysToCheck, oldState, form_data)) {
      handleNavigation();
      return;
    }

    try {
      let item = {
        kyc: {
          nri_address: kyc?.nri_address.meta_data,
        },
      };
      setIsApiRunning("button");
      await submit(item);
      handleNavigation();
    } catch (err) {
      setShowError(err.message);
      Toast(err.message, "error");
    } finally {
      setIsApiRunning(false);
      setShowError(false);
    }
  };

  const handleNavigation = () => {
    if (stateParams?.toState) {
      navigate(stateParams?.toState, { userType: stateParams?.userType });
    } else if (stateParams?.backToJourney) {
      navigate("/kyc/upload/address");
    } else if (stateParams?.userType === "compliant") {
      navigate("/kyc/compliant-personal-details4");
    } else {
      navigate("/kyc/journey");
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (
      name === "pincode" &&
      ((value && value.length > 6) || !validateNumber(value))
    )
      return;
    let formData = { ...form_data };
    formData[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  // const fetchPincodeData = async () => {
  //   let formData = { ...form_data };
  //   try {
  //     const data = await getPinCodeData(form_data.pincode);
  //     if (data && data.length === 0) {
  //       formData["pincode_error"] = "Please enter valid pincode";
  //       formData.country = "";
  //       formData.city = "";
  //       formData.state = "";
  //     } else {
  //       formData.country = "INDIA";
  //       formData.city = data[0].district_name;
  //       formData.state = data[0].state_name;
  //       formData.city_error = "";
  //       formData.state_error = "";
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setFormData({ ...formData });
  // };

  const isEdit = stateParams?.isEdit;
  let title = "";

  if (kyc?.address?.meta_data?.is_nri) {
    if (isEdit) {
      title = "Edit Foreign address details";
    } else {
      title = "Foreign address details";
    }
  } else {
    if (isEdit) {
      title = "Edit address details";
    } else {
      title = "Address details";
    }
  }

  let address_proof = "";

  if (kyc?.address?.meta_data?.is_nri) {
    address_proof = "Passport";
  } else {
    address_proof = kycNRIDocNameMapper[kyc?.address_doc_type];
  }

  // useEffect(() => {
  //   if (form_data.pincode.length === 6) {
  //     fetchPincodeData();
  //   }
  // }, [form_data.pincode]);

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={4}
      count={4}
      total={4}
    >
      <section id="kyc-address-details-2" className="page-body-kyc">
        <div className="sub-title">Address as per {address_proof}</div>
        <form className="form-container">
          <TextField
            label="Pincode"
            name="pincode"
            className=""
            value={form_data.pincode}
            onChange={handleChange}
            margin="normal"
            helperText={form_data.pincode_error || ""}
            error={form_data.pincode_error ? true : false}
          />
          <TextField
            label="Address"
            name="addressline"
            className=""
            value={form_data.addressline}
            helperText={form_data.addressline_error || ""}
            error={form_data.addressline_error ? true : false}
            onChange={handleChange}
            margin="normal"
            multiline
          />
          <TextField
            label="City"
            name="city"
            className=""
            value={form_data.city}
            helperText={form_data.city_error || ""}
            error={form_data.city_error ? true : false}
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="State"
            name="state"
            className=""
            value={form_data.state}
            helperText={form_data.state_error || ""}
            error={form_data.state_error ? true : false}
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Country"
            name="country"
            value={form_data.country}
            helperText={form_data.country_error || ""}
            error={form_data.country_error ? true : false}
            margin="normal"
            onChange={handleChange}
          />
        </form>
      </section>
    </Container>
  );
};

export default NRIAddressDetails2;
