import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import {
  storageConstants,
  getPathname,
  maritalStatusOptions,
} from "../constants";
import { initData } from "../services";
import { storageService, isEmpty, validateAlphabets } from "utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData } from "../common/api";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import toast from "common/ui/Toast";

const PersonalDetails2 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
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
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      setUserKyc(userkycDetails);
    }
    let formData = {
      father_name: userkycDetails.pan?.meta_data?.father_name || "",
      mother_name: userkycDetails.pan?.meta_data?.mother_name || "",
      marital_status:
        userkycDetails.identification.meta_data.marital_status || "",
      spouse_name: userkycDetails.identification.meta_data.spouse_name || "",
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["mother_name", "marital_status"];
    if (form_data.marital_status === "MARRIED") keysToCheck.push("spouse_name");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.identification.meta_data.marital_status =
      form_data.marital_status;
    userkycDetails.pan.meta_data.mother_name = form_data.mother_name;
    if (form_data.marital_status === "MARRIED")
      userkycDetails.pan.meta_data.spouse_name = form_data.spouse_name;
    let item = {
      kyc: {
        pan: userkycDetails.pan.meta_data,
        identification: userkycDetails.identification.meta_data,
      },
    };
    savePersonalDetails2(item);
  };

  const savePersonalDetails2 = async (item) => {
    setIsApiRunning(true);
    try {
      const submitResult = await savePanData(item);
      if (!submitResult) return;
      navigate(getPathname.compliantPersonalDetails3, {
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
    if (name.includes("name") && value && !validateAlphabets(value)) {
      return;
    }
    let formData = { ...form_data };
    if (name === "marital_status")
      formData[name] = maritalStatusOptions[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      showSkelton={showLoader}
      id="kyc-personal-details2"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          {title} <span>2/3</span>
        </div>
        {!showLoader && (
          <main>
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
            <Input
              label="Mother's name"
              class="input"
              value={form_data.mother_name || ""}
              error={form_data.mother_name_error ? true : false}
              helperText={form_data.mother_name_error || ""}
              onChange={handleChange("mother_name")}
              type="text"
              disabled={isApiRunning}
            />
            {form_data.marital_status === "MARRIED" && (
              <Input
                label="Spouse"
                class="input"
                value={form_data.spouse_name || ""}
                error={form_data.spouse_name_error ? true : false}
                helperText={form_data.spouse_name_error || ""}
                onChange={handleChange("spouse_name")}
                type="text"
                disabled={isApiRunning}
              />
            )}
          </main>
        )}
      </div>
    </Container>
  );
};

export default PersonalDetails2;
