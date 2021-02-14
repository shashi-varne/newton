import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import {
  genderOptions,
  maritalStatusOptions,
  storageConstants,
  getPathname,
} from "../constants";
import { initData } from "../services";
import {
  storageService,
  formatDate,
  dobFormatTest,
  isEmpty,
  validateNumber,
  validateAlphabets,
} from "../../utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData } from "../common/api";
import toast from "common/ui/Toast";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
      setCurrentUser(user);
      setUserKyc(userkycDetails);
    }
    let formData = {
      name: userkycDetails.pan?.meta_data?.name || "",
      dob: userkycDetails.pan?.meta_data?.dob || "",
      email: userkycDetails.address?.meta_data?.email || "",
      mobile: userkycDetails.identification?.meta_data?.mobile_number || "",
      gender: userkycDetails.identification?.meta_data?.gender || "",
      marital_status:
        userkycDetails.identification?.meta_data?.marital_status || "",
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["name", "dob", "gender", "marital_status"];
    if (currentUser.email === null) keysToCheck.push("email");
    if (currentUser.mobile === null) keysToCheck.push("mobile");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.pan.meta_data.name = form_data.name;
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.address.meta_data.email = form_data.email;
    userkycDetails.identification.meta_data.mobile_number = form_data.mobile;
    userkycDetails.identification.meta_data.gender = form_data.gender;
    userkycDetails.identification.meta_data.marital_status =
      form_data.marital_status;
    savePersonalDetails1(userkycDetails);
  };

  const savePersonalDetails1 = async (userKyc) => {
    setIsApiRunning(true);
    try {
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          address: userKyc.address.meta_data,
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await savePanData(item);
      if (!submitResult) return;
      navigate(getPathname.personalDetails2, {
        state: {
          isEdit: isEdit,
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
          {title} <span>1/4</span>
        </div>
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
          {currentUser.email === null && (
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
          {currentUser.mobile === null && (
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
          <div className="input">
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
          <div className="input">
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
