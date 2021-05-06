import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "../../common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { genderOptions, maritalStatusOptions, getPathname } from "../constants";
import {
  formatDate,
  dobFormatTest,
  validateNumber,
  validateAlphabets,
  isEmpty,
} from "../../utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import useUserKycHook from "../common/hooks/userKycHook";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  const productName = getConfig().productName;

  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  const {kyc, user, isLoading} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
    let mobile_number = kyc.identification?.meta_data?.mobile_number || "";
    let country_code = "";
    if (mobile_number && !isNaN(mobile_number.toString().split("|")[1])) {
      country_code = mobile_number.split("|")[0];
      mobile_number = mobile_number.split("|")[1];
    }
    let formData = {
      name: kyc.pan?.meta_data?.name || "",
      dob: kyc.pan?.meta_data?.dob || "",
      email: kyc.identification?.meta_data?.email || "",
      mobile: mobile_number,
      country_code: country_code,
      gender: kyc.identification?.meta_data?.gender || "",
      marital_status: kyc.identification?.meta_data?.marital_status || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["name", "dob", "gender", "marital_status"];
    if (user.email === null) keysToCheck.push("email");
    if (user.mobile === null) keysToCheck.push("mobile");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let mobile_number = form_data.mobile;
    if (form_data.country_code) {
      mobile_number = form_data.country_code + "|" + mobile_number;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.pan.meta_data.name = form_data.name;
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.identification.meta_data.email = form_data.email;
    userkycDetails.identification.meta_data.mobile_number = mobile_number;
    userkycDetails.identification.meta_data.gender = form_data.gender;
    userkycDetails.identification.meta_data.marital_status =
      form_data.marital_status;
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(getPathname.personalDetails2, {
        state: {
          isEdit: isEdit,
        },
      });
      return;
    }
    savePersonalDetails1(userkycDetails);
  };

  const savePersonalDetails1 = async (userKyc) => {
    setIsApiRunning("button");
    try {
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          address: userKyc.address.meta_data,
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(getPathname.personalDetails2, {
        state: {
          isEdit: isEdit,
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
    if (value && name === "name" && !validateAlphabets(value)) return;
    if (name === "mobile" && value && !validateNumber(value)) return;
    let formData = { ...form_data };
    if (name === "marital_status")
      formData[name] = maritalStatusOptions[value].value;
    else if (name === "gender") formData[name] = genderOptions[value].value;
    else if (name === "dob") {
      if (!dobFormatTest(value)) {
        return;
      }
      let input = document.getElementById("dob");
      input.onkeyup = formatDate;
      formData[name] = value;
    } else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      handleClick={handleClick}
      skelton={isLoading}
      showLoader={isApiRunning}
      title={title}
      count="1"
      current="1"
      total="4"
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
    >
      <div className="kyc-personal-details">
        <div className="kyc-main-subtitle">
          We need basic details to verify identity
        </div>
        <main>
          <Input
            label="Name"
            class="input"
            value={form_data.name || ""}
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("name")}
            maxLength={20}
            type="text"
            disabled={isApiRunning}
          />
          <Input
            label="Date of birth(DD/MM/YYYY)"
            class="input"
            value={form_data.dob || ""}
            error={form_data.dob_error ? true : false}
            helperText={form_data.dob_error || ""}
            onChange={handleChange("dob")}
            maxLength={10}
            type="text"
            id="dob"
            disabled={isApiRunning}
          />
          {user.email === null && (
            <Input
              label="Email"
              class="input"
              value={form_data.email || ""}
              error={form_data.email_error ? true : false}
              helperText={form_data.email_error || ""}
              onChange={handleChange("email")}
              type="text"
              disabled={isApiRunning}
            />
          )}
          {user.mobile === null && (
            <Input
              label="Mobile number"
              class="input"
              value={form_data.mobile || ""}
              error={form_data.mobile_error ? true : false}
              helperText={form_data.mobile_error || ""}
              onChange={handleChange("mobile")}
              maxLength={10}
              type="text"
              disabled={isApiRunning}
            />
          )}
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.gender_error ? true : false}
              helperText={form_data.gender_error}
              width="40"
              label="Gender:"
              class="gender"
              options={genderOptions}
              id="account_type"
              value={form_data.gender || ""}
              onChange={handleChange("gender")}
              disabled={isApiRunning}
            />
          </div>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.marital_status_error ? true : false}
              helperText={form_data.marital_status_error}
              width="40"
              label="Marital status:"
              class="marital_status"
              options={maritalStatusOptions}
              id="account_type"
              value={form_data.marital_status || ""}
              onChange={handleChange("marital_status")}
              disabled={isApiRunning}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails1;
