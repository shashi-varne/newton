import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import Toast from "../../common/ui/Toast";
import { isEmpty } from "utils/validators";
import { getPinCodeData, submit } from "../common/api";
import Container from "../common/Container";
import { kycDocNameMapper } from "../constants";
import {
  compareObjects,
  navigate as navigateFunc,
  validateFields,
} from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { validateNumber } from "utils/validators";
import "./commonStyles.scss";

const AddressDetails2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const { kyc, isLoading } = useUserKycHook();
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
    formData.pincode = kyc?.address?.meta_data?.pincode || "";
    formData.addressline = kyc?.address?.meta_data?.addressline || "";
    formData.state = kyc?.address?.meta_data?.state.toUpperCase() || "";
    formData.city = kyc?.address?.meta_data?.city?.toUpperCase() || "";
    formData.country = kyc?.address?.meta_data?.country || "INDIA";
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleSubmit = async () => {
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

    try {
      let item = {
        kyc: {
          address: userKycDetails.address.meta_data,
          nomination: userKycDetails?.nomination?.meta_data,
        },
      };
      userKycDetails.nomination.meta_data.nominee_address.state =
        form_data.state;
      userKycDetails.nomination.meta_data.nominee_address.city = form_data.city;
      userKycDetails.nomination.meta_data.nominee_address.pincode =
        form_data.pincode;
      userKycDetails.nomination.meta_data.nominee_address.addressline =
        form_data.addressline;
      const nomination_address =
        userKycDetails.nomination.meta_data.nominee_address;
      item.kyc.nomination.address = nomination_address;
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
      navigate("/kyc/upload/address");
    } else {
      if (kyc?.address?.meta_data?.is_nri) {
        navigate("/kyc/nri-address-details1", {
          isEdit,
        });
      } else {
        navigate("/kyc/journey");
      }
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (
      name === "pincode" &&
      value &&
      (value.length > 6 || !validateNumber(value))
    )
      return;
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
    if (form_data.pincode.length === 6) {
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
    return kycDocNameMapper[kyc?.address_doc_type];
  };

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={2}
      count={2}
      total={getTotalPages(kyc)}
      data-aid='kyc-address-details-screen-2'
    >
      <section data-aid='kyc-address-details-2'>
        <div className="sub-title" data-aid='kyc-sub-title'>Address as per {getAddressProof(kyc)}</div>
        <form className="form-container" data-aid='kyc-form-container'>
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
