import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import {
  genderOptions,
  maritalStatusOptions,
  getPathname,
} from "../../constants";
import { validateNumber, validateAlphabets } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
} from "../../common/functions";
import { kycSubmit } from "../../common/api";
import toast from "common/ui/Toast";
import useUserKycHook from "../../common/hooks/userKycHook";
import { isEmpty } from "../../../utils/validators";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;

  const [kyc, user, isLoading] = useUserKycHook();

  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  useEffect(() => {
    if (!isEmpty(kyc) & !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = async () => {
    let mobile_number = kyc.identification.meta_data.mobile_number || "";
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
      father_name: kyc.pan?.meta_data?.father_name || "",
      mother_name: kyc.pan?.meta_data?.mother_name || "",
      spouse_name: kyc.identification.meta_data.spouse_name || "",
    };
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = [
      "name",
      "gender",
      "marital_status",
      "father_name",
      "mother_name",
    ];
    if (form_data.marital_status === "MARRIED") keysToCheck.push("spouse_name");
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
    userkycDetails.pan.meta_data.father_name = form_data.father_name;
    userkycDetails.pan.meta_data.mother_name = form_data.mother_name;
    if (form_data.marital_status === "MARRIED")
      userkycDetails.pan.meta_data.spouse_name = form_data.spouse_name;
    savePersonalDetails1(userkycDetails);
  };

  const savePersonalDetails1 = async (userKyc) => {
    setShowLoader("button");
    try {
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(getPathname.digilockerPersonalDetails2, {
        state: {
          isEdit: isEdit,
        },
      });
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setShowLoader(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (value && name.includes("name") && !validateAlphabets(value)) return;
    if (name === "mobile" && value && !validateNumber(value)) return;
    let formData = { ...form_data };
    if (name === "marital_status")
      formData[name] = maritalStatusOptions[value].value;
    else if (name === "gender") formData[name] = genderOptions[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      skelton={isLoading}
      id="kyc-personal-details1"
      // hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      showLoader={showLoader}
      // disable={showLoader}
      handleClick={handleClick}
      title={title}
      count={1}
      current={1}
      total={4}
    >
      <div className="kyc-complaint-personal-details">
        {/* <div className="kyc-main-title">
          {title} <span>1/4</span>
        </div> */}
        <div className="kyc-main-subtitle">
          Please fill your basic details for further verification
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
            disabled={showLoader}
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
              disabled={showLoader}
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
              disabled={showLoader}
            />
          )}
          <Input
            label="Father's name"
            class="input"
            value={form_data.father_name || ""}
            error={form_data.father_name_error ? true : false}
            helperText={form_data.father_name_error || ""}
            onChange={handleChange("father_name")}
            maxLength={20}
            type="text"
            disabled={showLoader}
          />
          <Input
            label="Mother's name"
            class="input"
            value={form_data.mother_name || ""}
            error={form_data.mother_name_error ? true : false}
            helperText={form_data.mother_name_error || ""}
            onChange={handleChange("mother_name")}
            type="text"
            disabled={showLoader}
          />
          <div className={`input ${showLoader && `disabled`}`}>
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
              disabled={showLoader}
            />
          </div>
          <div className={`input ${showLoader && `disabled`}`}>
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
              disabled={showLoader}
            />
          </div>
          {form_data.marital_status === "MARRIED" && (
            <Input
              label="Spouse"
              class="input"
              value={form_data.spouse_name || ""}
              error={form_data.spouse_name_error ? true : false}
              helperText={form_data.spouse_name_error || ""}
              onChange={handleChange("spouse_name")}
              type="text"
              disabled={showLoader}
            />
          )}
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails1;
