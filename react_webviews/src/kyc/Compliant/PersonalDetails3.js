import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  occupationTypeOptions,
  incomeOptions,
  getPathname,
} from "../constants";
import { isEmpty } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
} from "../common/functions";
import { kycSubmit, getCVL } from "../common/api";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";

const PersonalDetails3 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const {kyc, isLoading} = useUserKycHook();
  const [oldState, setOldState] = useState({});
  let title = "Professional details";
  if (isEdit) {
    title = "Edit professional details";
  }

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let formData = {
      income: kyc.identification?.meta_data?.gross_annual_income || "",
      occupation: kyc.identification?.meta_data?.occupation || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["income", "occupation"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }

    if (compareObjects(keysToCheck, oldState, form_data)) {
      handleNavigation(kyc.address.meta_data.is_nri);
      return;
    }

    let userkycDetails = { ...kyc };
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
    setIsApiRunning("button");
    try {
      const result = await getCVL(cvlData);
      if (!result) return;
      const submitResult = await kycSubmit(submitData);
      if (!submitResult) return;
      handleNavigation(is_nri);
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleNavigation = (is_nri) => {
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
      skelton={isLoading}
      id="kyc-personal-details3"
      buttonTitle="CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={3}
      current={3}
      total={3}
      data-aid='kyc-personal-details-screen-3'
    >
      <div className="kyc-personal-details" data-aid='kyc-personal-details-page'>
        <main data-aid='kyc-personal-details'>
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
          <div className="input" data-aid='kyc-dropdown-withouticon'>
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
        <footer data-aid='kyc-footer'>
          By tapping ‘save and continue’ I agree that I am not a PEP(politically
          exposed person)
        </footer>
      </div>
    </Container>
  );
};

export default PersonalDetails3;
