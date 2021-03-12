import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  occupationTypeOptions,
  incomeOptions,
  storageConstants,
  getPathname,
} from "../constants";
import { initData } from "../services";
import { storageService, isEmpty } from "utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData, getCVL } from "../common/api";
import toast from "common/ui/Toast";

const PersonalDetails3 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  let title = "Professional details";
  if (isEdit) {
    title = "Edit professional details";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC) || {};
      setUserKyc(userkycDetails);
    }
    let formData = {
      income:
        userkycDetails.identification?.meta_data?.gross_annual_income || "",
      occupation: userkycDetails.identification?.meta_data?.occupation || "",
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["income", "occupation"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.identification.meta_data.gross_annual_income =
      form_data.income;
    userkycDetails.identification.meta_data.occupation = form_data.occupation;

    let cvlData = {
      pan_number: userkycDetails.pan.meta_data.pan_number.toUpperCase(),
      dob: userkycDetails.pan.meta_data.dob,
      mobile_number: userkycDetails.identification.meta_data.mobile_number,
      email: userkycDetails.address.meta_data.email,
    };
    userkycDetails.identification.meta_data.politically_exposed =
      "NOT APPLICABLE";
    let item = {
      kyc: {
        identification: userkycDetails.identification.meta_data,
      },
    };
    savePersonalDetails3(
      cvlData,
      item,
      userkycDetails.address.meta_data.is_nri
    );
  };

  const savePersonalDetails3 = async (cvlData, submitData, is_nri) => {
    setIsApiRunning(true);
    try {
      const result = await getCVL(cvlData);
      if (!result) return;
      const submitResult = await savePanData(submitData);
      if (!submitResult) return;
      if (is_nri) {
        navigate(getPathname.nriAddressDetails2, {
          state: {
            isEdit: isEdit,
            userType: "compliant",
          },
        });
      } else {
        navigate(getPathname.compliantPersonalDetails4, {
          state: {
            isEdit: isEdit,
            userType: "compliant",
          },
        });
      }
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let formData = { ...form_data };
    if (name === "occupation")
      formData[name] = occupationTypeOptions[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      showSkelton={showLoader}
      id="kyc-personal-details3"
      hideInPageTitle
      buttonTitle="CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          {title} <span>3</span>
        </div>
        <main>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.occupation_error ? true : false}
              helperText={form_data.occupation_error}
              width="40"
              label="Occupation detail:"
              class="occupation"
              options={occupationTypeOptions}
              id="account_type"
              value={form_data.occupation || ""}
              onChange={handleChange("occupation")}
              disabled={isApiRunning}
            />
          </div>
          <div className="input">
            <DropdownWithoutIcon
              error={form_data.income_error ? true : false}
              helperText={form_data.income_error}
              options={incomeOptions}
              id="relationship"
              label="Income range"
              isAOB={true}
              value={form_data.income || ""}
              name="relationship"
              onChange={handleChange("income")}
              disabled={isApiRunning}
            />
          </div>
        </main>
        <footer>
          By tapping ‘save and continue’ I agree that I am not a PEP(politically
          exposed person)
        </footer>
      </div>
    </Container>
  );
};

export default PersonalDetails3;
