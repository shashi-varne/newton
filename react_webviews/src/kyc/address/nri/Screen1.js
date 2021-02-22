import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { storageConstants, getPathname } from "../../constants";
import { initData } from "../../services";
import { storageService, isEmpty, validateNumber } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
} from "../../common/functions";
import { savePanData } from "../../common/api";
import toast from "common/ui/Toast";

const NriAddressDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const state = props.location.state || {};
  const isEdit = state.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  let title = "Foreign address details";
  if (isEdit) {
    title = "Edit foreign address details";
  }

  const addressProofOptions = [
    { name: "Driving license", value: "DL" },
    { name: "Gas receipt", value: "UTILITY_BILL" },
    { name: "Passbook", value: "LAT_BANK_PB" },
  ];

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      setUserKyc(userkycDetails);
    }
    let formData = {
      mobile_number: userkycDetails.nri_address?.meta_data?.mobile_number || "",
      address_doc_type: userkycDetails.address_doc_type || "",
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["mobile_number", "address_doc_type"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.nri_address.meta_data.mobile_number =
      form_data.mobile_number;
    userkycDetails.nri_address.meta_data.address_doc_type =
      form_data.address_doc_type;
    saveNriAddressDetails1(userkycDetails);
  };

  const saveNriAddressDetails1 = async (userKyc) => {
    setIsApiRunning(true);
    try {
      let item = {
        kyc: {
          nri_address: userKyc.nri_address.meta_data,
        },
      };
      const submitResult = await savePanData(item);
      if (!submitResult) return;
      navigate(getPathname.nriAddressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name === "mobile_number" && value && !validateNumber(value)) return;
    let formData = { ...form_data };
    if (name === "address_doc_type")
      formData[name] = addressProofOptions[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      showLoader={showLoader}
      id="kyc-personal-details1"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          {title} <span>3/4</span>
        </div>
        <main>
          <Input
            label="Contact number"
            class="input"
            value={form_data.mobile_number || ""}
            error={form_data.mobile_number_error ? true : false}
            helperText={form_data.mobile_number_error || ""}
            onChange={handleChange("mobile_number")}
            type="text"
            disabled={isApiRunning}
          />
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.address_doc_type_error ? true : false}
              helperText={form_data.address_doc_type_error}
              width="40"
              label="Foreign Address proof:"
              class="address_doc_type"
              options={addressProofOptions}
              id="account_type"
              value={form_data.address_doc_type || ""}
              onChange={handleChange("address_doc_type")}
              disabled={isApiRunning}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default NriAddressDetails1;
