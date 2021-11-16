import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import Toast from "../../common/ui/Toast";
import { isEmpty } from "utils/validators";
import { getPinCodeData, submit } from "../common/api";
import Container from "../common/Container";
import { DOCUMENTS_MAPPER, PATHNAME_MAPPER, PINCODE_LENGTH } from "../constants";
import {
  compareObjects,
  validateFields,
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { validateNumber } from "utils/validators";
import { getConfig } from "utils/functions";
import "./commonStyles.scss";
import { nativeCallback } from "../../utils/native_callback";

const AddressDetails2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const { kyc, isLoading } = useUserKycHook();
  const [form_data, setFormData] = useState({
    pincode: "",
  });
  const [oldState, setOldState] = useState({});
  const navigate = navigateFunc.bind(props);
  const productName = getConfig().productName;

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let formData = {};
    formData.pincode = kyc?.address?.meta_data?.pincode || "";
    formData.addressline = kyc?.address?.meta_data?.addressline || "";
    formData.state = kyc?.address?.meta_data?.state.toUpperCase() || "";
    formData.city = kyc?.address?.meta_data?.city?.toUpperCase() || "";
    formData.country = kyc?.address?.meta_data?.country || "INDIA";
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleSubmit = async () => {
    sendEvents("next")
    let keysToCheck = ["pincode", "addressline", "state", "city"];

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

    let userKycDetails = { ...kyc };
    userKycDetails.address.meta_data.state = form_data.state;
    userKycDetails.address.meta_data.city = form_data.city;
    userKycDetails.address.meta_data.pincode = form_data.pincode;
    userKycDetails.address.meta_data.addressline = form_data.addressline;
    userKycDetails.address.meta_data.country = form_data.country;

    try {
      let item = {
        kyc: {
          address: userKycDetails.address.meta_data,
          nomination: userKycDetails?.nomination?.meta_data,
        },
      };
      let { nominee_address } = userKycDetails.nomination.meta_data;
      nominee_address.state = form_data.state;
      nominee_address.city = form_data.city;
      nominee_address.pincode = form_data.pincode;
      nominee_address.addressline = form_data.addressline;
      item.kyc.nomination.address = nominee_address;
      userKycDetails.nomination.meta_data.country = form_data.country;

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
    if (backToJourney !== null) {
      navigate(PATHNAME_MAPPER.uploadAddress);
    } else {
      if (kyc?.address?.meta_data?.is_nri) {
        navigate(PATHNAME_MAPPER.nriAddressDetails1, {
          state: {
            isEdit,
          }
        });
      } else {
        navigate(PATHNAME_MAPPER.journey);
      }
    }
  };

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const maxLength = target.maxLength;
    if (name === "pincode" && value && !validateNumber(value)) return;
    if (value && maxLength && value.length > maxLength) return;
    if(value && name === "addressline" && value.indexOf(" ") === 0) return;
    let formData = { ...form_data };
    formData[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const fetchPincodeData = async () => {
    let formData = { ...form_data };
    try {
      const data = await getPinCodeData(form_data.pincode);
      if (data && data.length === 0) {
        formData["pincode_error"] = "Please enter valid pincode";
        formData.city = "";
        formData.state = "";
      } else {
        formData.city = data[0].district_name?.toUpperCase();
        formData.state = data[0].state_name?.toUpperCase();
      }
    } catch (err) {
      console.error(err);
    }
    setFormData({ ...formData });
  };

  useEffect(() => {
    if (form_data.pincode.length === PINCODE_LENGTH) {
      fetchPincodeData();
    }
  }, [form_data.pincode]);

  const stateParams = props.location?.state || {};

  const isEdit = stateParams?.isEdit || "";
  const backToJourney = stateParams?.backToJourney || null;
  let title = "";

  if (kyc?.address?.meta_data?.is_nri) {
    if (isEdit) {
      title = "Edit indian address details";
    } else {
      title = "Indian address details";
    }
  } else {
    if (isEdit) {
      title = "Edit address details";
    } else {
      title = "Address details";
    }
  }

  const getTotalPages = (userKyc) =>
    userKyc?.address?.meta_data?.is_nri ? 4 : 2;

  const getAddressProof = (userKyc) => {
    const isNri = userKyc?.address?.meta_data?.is_nri;
    if (isNri) {
      return "Passport";
    }
    return DOCUMENTS_MAPPER[kyc?.address_doc_type];
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "address_details_2",
        pincode_entered: form_data.pincode ? "yes" : "no",
        address_entered: form_data.addressline ? "yes" : "no",
        nominee_pincode_entered: kyc?.nomination?.meta_data?.pincode
          ? "yes"
          : "no",
        nominee_address_entered: kyc?.nomination?.meta_data?.addressline
          ? "yes"
          : "no",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  
  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={2}
      count={2}
      total={getTotalPages(kyc)}
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
      data-aid='kyc-address-details-screen-2'
    >
      <section data-aid='kyc-address-details-2'>
        <div className="kyc-main-subtitle" data-aid='kyc-sub-title'>Address as per {getAddressProof(kyc)}</div>
        <form className="form-container" data-aid='kyc-form-container'>
          <TextField
            label="Pincode"
            name="pincode"
            className=""
            value={form_data.pincode}
            onChange={handleChange}
            margin="normal"
            helperText={
              form_data.pincode_error ||
              `Please enter your ${PINCODE_LENGTH}-digit pincode`
            }
            error={form_data.pincode_error ? true : false}
            inputProps={{
              inputMode:"numeric",
              maxLength: PINCODE_LENGTH,
            }}
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
            inputProps={{
              maxLength: 150
            }}
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
            disabled
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
            disabled
          />
        </form>
      </section>
    </Container>
  );
};

export default AddressDetails2;
