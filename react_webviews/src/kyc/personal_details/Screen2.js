import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import { storageConstants, getPathname } from "../constants";
import { initData } from "../services";
import {
  storageService,
  isEmpty,
  validateAlphabets,
} from "../../utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData } from "../common/api";
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
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["mother_name", "father_name"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.pan.meta_data.father_name = form_data.father_name;
    userkycDetails.pan.meta_data.mother_name = form_data.mother_name;
    savePersonalDetails2(userkycDetails);
  };

  const savePersonalDetails2 = async (userKyc) => {
    setIsApiRunning(true);
    try {
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await savePanData(item);
      if (!submitResult) return;
      navigate(getPathname.personalDetails3, {
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
    if (!validateAlphabets(value) && value) return;
    let formData = { ...form_data };
    formData[name] = value;
    if (!value) formData[`${name}_error`] = "This is required";
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
          {title} <span>2/4</span>
        </div>
        {!showLoader && (
          <main>
            <Input
              label="Father's name"
              class="input"
              value={form_data.father_name || ""}
              error={form_data.father_name_error ? true : false}
              helperText={form_data.father_name_error || ""}
              onChange={handleChange("father_name")}
              maxLength={20}
              type="text"
              disabled={isApiRunning}
            />
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
          </main>
        )}
      </div>
    </Container>
  );
};

export default PersonalDetails2;
