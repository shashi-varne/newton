import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  occupationTypeOptions,
  incomeOptions,
  getPathname,
} from "../constants";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { kycSubmit } from "../common/api";
import toast from "common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { isEmpty } from "../../utils/validators";

const PersonalDetails3 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  let title = "Professional details";
  if (isEdit) {
    title = "Edit professional details";
  }
  const type = props.type || "";

  const [kyc, ,isLoading] = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = async () => {
    let formData = {
      income: kyc.identification?.meta_data?.gross_annual_income || "",
      occupation: kyc.identification?.meta_data?.occupation || "",
    };
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
    let userkycDetails = { ...kyc };
    userkycDetails.identification.meta_data.gross_annual_income =
      form_data.income;
    userkycDetails.identification.meta_data.occupation = form_data.occupation;
    userkycDetails.identification.politically_exposed = "NOT APPLICABLE";
    userkycDetails.identification.fatca_declaration = true;
    savePersonalDetails3(userkycDetails);
  };

  const savePersonalDetails3 = async (userKyc) => {
    setIsApiRunning(true);
    try {
      let item = {
        kyc: {
          identification: userKyc.identification,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      if (type === "digilocker") {
        if (isEdit) {
          navigate(getPathname.journey);
        } else {
          navigate(getPathname.digilockerPersonalDetails3);
        }
      } else {
        navigate(getPathname.personalDetails4, {
          state: {
            isEdit: isEdit,
          },
        });
      }
    } catch (err) {
      console.log(err);
      toast(err.message);
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
      showSkelton={isLoading}
      id="kyc-personal-details3"
      hideInPageTitle
      buttonTitle="CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || isLoading}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">
          {title} <span>{type === "digilocker" ? 2 : 3}/4</span>
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
