import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  OCCUPATION_TYPE_OPTIONS,
  INCOME_OPTIONS,
  PATHNAME_MAPPER,
} from "../constants";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
  getTotalPagesInPersonalDetails,
  getEmailOrMobileVerifiedStatus,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { isEmpty } from "../../utils/validators";

const PersonalDetails3 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [oldState, setOldState] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [totalPages, setTotalPages] = useState();
  let title = "Professional details";
  if (isEdit) {
    title = "Edit professional details";
  }
  const type = props.type || "";

  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = async () => {
    let formData = {
      income: kyc.identification?.meta_data?.gross_annual_income || "",
      occupation: kyc.identification?.meta_data?.occupation || "",
    };
    setFormData({ ...formData });
    setOldState(formData);
    setTotalPages(getTotalPagesInPersonalDetails(isEdit));
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
      handleNavigation();
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.identification.meta_data.gross_annual_income =
      form_data.income;
    userkycDetails.identification.meta_data.occupation = form_data.occupation;
    userkycDetails.identification.meta_data.politically_exposed =
      "NOT APPLICABLE";
    userkycDetails.identification.meta_data.fatca_declaration = true;
    savePersonalDetails3(userkycDetails);
  };

  const savePersonalDetails3 = async (userKyc) => {
    setIsApiRunning("button");
    try {
      let item = {
        kyc: {
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      handleNavigation();
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleNavigation = () => {
    const data = { state: { isEdit } };
    if (!getEmailOrMobileVerifiedStatus()) {
      navigate(PATHNAME_MAPPER.communicationDetails, data);
      return;
    }
    if (type === "digilocker") {
      navigate(PATHNAME_MAPPER.digilockerPersonalDetails3, data);
    } else {
      navigate(PATHNAME_MAPPER.personalDetails4, data);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let formData = { ...form_data };
    if (name === "occupation")
      formData[name] = OCCUPATION_TYPE_OPTIONS[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      showSkelton={isLoading}
      hideInPageTitle
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      skelton={isLoading}
      showLoader={isApiRunning}
      title={title}
      count={type === "digilocker" ? 2 : 3}
      current={type === "digilocker" ? 2 : 3}
      total={totalPages}
    >
      <div className="kyc-personal-details">
        <main>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.occupation_error ? true : false}
              helperText={form_data.occupation_error}
              width="40"
              label="Occupation detail:"
              class="occupation"
              options={OCCUPATION_TYPE_OPTIONS}
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
              options={INCOME_OPTIONS}
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
