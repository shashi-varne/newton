import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import Toast from "../../../common/ui/Toast";
import { submit } from "../../common/api";
import Container from "../../common/Container";
import { kycNRIDocNameMapper } from "../../constants";
import {
  compareObjects,
  navigate as navigateFunc,
  validateFields,
} from "../../common/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isEmpty, validateNumber } from "../../../utils/validators";
import "../commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";

const NRIAddressDetails2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const {kyc, isLoading} = useUserKycHook();
  const [form_data, setFormData] = useState({
    nri_pincode: "",
  });
  const [oldState, setOldState] = useState({});
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let formData = {};
    formData.nri_pincode = kyc?.nri_address?.meta_data?.pincode || "";
    formData.addressline = kyc?.nri_address?.meta_data?.addressline || "";
    formData.state = kyc?.nri_address?.meta_data?.state || "";
    formData.city = kyc?.nri_address?.meta_data?.city || "";
    formData.country = kyc?.nri_address?.meta_data?.country || "";
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const stateParams = props?.location?.state;

  const handleSubmit = async () => {
    sendEvents("next")
    let keysToCheck = [
      "nri_pincode",
      "addressline",
      "state",
      "city",
      "country",
    ];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }

    if (form_data.nri_pincode_error) {
      return;
    }

    if (compareObjects(keysToCheck, oldState, form_data)) {
      handleNavigation();
      return;
    }

    let userKycDetails = {...kyc};
    userKycDetails.nri_address.meta_data.city = form_data.city;
    userKycDetails.nri_address.meta_data.state = form_data.state;
    userKycDetails.nri_address.meta_data.country = form_data.country;
    userKycDetails.nri_address.meta_data.pincode = form_data.nri_pincode;
    userKycDetails.nri_address.meta_data.addressline = form_data.addressline;

    try {
      let item = {
        kyc: {
          nri_address: userKycDetails.nri_address.meta_data,
        },
      };
      setIsApiRunning("button");
      await submit(item);
      handleNavigation();
    } catch (err) {
      Toast(err.message, "error");
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleNavigation = () => {
    if (stateParams?.backToJourney) {
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
    if (name === "nri_pincode" && !validateNumber(value)) return;
    let formData = { ...form_data };
    formData[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

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

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "nri_address_details_2",
        "pincode_entered": form_data.nri_pincode ? "yes" : "no",
        "address_entered": form_data.addressline ? "yes" : "no"
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={4}
      count={4}
      total={4}
    >
      <section id="kyc-address-details-2">
        <div className="sub-title">Address as per {address_proof}</div>
        <form className="form-container">
          <TextField
            label="Pincode"
            name="nri_pincode"
            value={form_data.nri_pincode}
            onChange={handleChange}
            margin="normal"
            helperText={form_data.nri_pincode_error || ""}
            error={form_data.nri_pincode_error ? true : false}
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
