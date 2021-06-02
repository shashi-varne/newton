import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { PATHNAME_MAPPER } from "../../constants";
import { isEmpty, validateNumber } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
} from "../../common/functions";
import { kycSubmit } from "../../common/api";
import toast from "../../../common/ui/Toast";
import useUserKycHook from "../../common/hooks/userKycHook";
import "../commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";

const NriAddressDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const state = props.location.state || {};
  const isEdit = state.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Foreign address details";
  if (isEdit) {
    title = "Edit foreign address details";
  }

  const {kyc, isLoading} = useUserKycHook();

  const ADDRESS_PROOF_OPTIONS = [
    { name: "Driving license", value: "DL" },
    { name: "Gas receipt", value: "UTILITY_BILL" },
    { name: "Passbook", value: "LAT_BANK_PB" },
  ];

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = async () => {
    let mobile_number = kyc.nri_address?.meta_data?.mobile_number || "";
    let country_code = "";
    if (mobile_number && !isNaN(mobile_number.toString().split("|")[1])) {
      country_code = mobile_number.split("|")[0];
      mobile_number = mobile_number.split("|")[1];
    }
    let formData = {
      mobile_number: mobile_number,
      country_code: country_code,
      address_doc_type: kyc.address_doc_type || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    sendEvents("next")
    let keysToCheck = ["mobile_number", "address_doc_type"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(PATHNAME_MAPPER.nriAddressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
      return;
    }
    let mobile_number = form_data.mobile;
    if (form_data.country_code) {
      mobile_number = form_data.country_code + "|" + mobile_number;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.nri_address.meta_data.mobile_number = mobile_number;
    userkycDetails.nri_address.meta_data.address_doc_type =
      form_data.address_doc_type;
    saveNriAddressDetails1(userkycDetails);
  };

  const saveNriAddressDetails1 = async (userKyc) => {
    setIsApiRunning("button");
    try {
      let item = {
        kyc: {
          nri_address: userKyc.nri_address.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(PATHNAME_MAPPER.nriAddressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name === "mobile_number" && value && !validateNumber(value)) return;
    let formData = { ...form_data };
    if (name === "address_doc_type")
      formData[name] = ADDRESS_PROOF_OPTIONS[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "nri_address_details_1",
        "address_proof": form_data.address_doc_type,
        "mobile_number": kyc.nri_address.meta_data.mobile_number ? "Indian" : "NRI"
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
      skelton={isLoading}
      id="kyc-personal-details1"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      current={3}
      count={3}
      total={4}
    >
      <div className="kyc-personal-details kyc-address-details">
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
              options={ADDRESS_PROOF_OPTIONS}
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
