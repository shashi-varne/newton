import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import Toast from "../../../common/ui/Toast";
import { submit } from "../../common/api";
import Container from "../../common/Container";
import { NRI_DOCUMENTS_MAPPER } from "../../constants";
import {
  compareObjects,
  navigate as navigateFunc,
  validateFields,
} from "../../common/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isEmpty, validateNumber } from "../../../utils/validators";
import "../commonStyles.scss";

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
    const data = { state: { isEdit } };
    if (stateParams?.backToJourney) {
      navigate("/kyc/upload/address", data);
    } else if (stateParams?.userType === "compliant") {
      navigate("/kyc/compliant-personal-details4", data);
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
    address_proof = NRI_DOCUMENTS_MAPPER[kyc?.address_doc_type];
  }

  const getPageDetails = (userKyc) => {
    let pageDetails = {}
    const isCompliant = userKyc.kyc_status === "compliant";
    pageDetails.total = isCompliant ? (isEdit ? 5 : 6) : 4 ;
    pageDetails.current = isCompliant && !isEdit ? 5 : 4;
    return pageDetails;
  }

  const pageDetails = getPageDetails(kyc);

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={pageDetails.current}
      count={pageDetails.current}
      total={pageDetails.total}
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
