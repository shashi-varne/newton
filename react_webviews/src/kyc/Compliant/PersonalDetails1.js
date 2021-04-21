import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { genderOptions, residentialOptions, getPathname } from "../constants";
import CompliantHelpDialog from "../mini-components/CompliantHelpDialog";
import {
  formatDate,
  dobFormatTest,
  isEmpty,
  validateNumber,
} from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
} from "../common/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { kycSubmit } from "../common/api";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Personal details";
  const [is_nri, setIsNri] = useState();
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
    let isNri = kyc.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (isNri) {
      selectedIndexResidentialStatus = 1;
    }
    let mobile_number = kyc.identification.meta_data.mobile_number || "";
    let country_code = "";
    if (mobile_number && !isNaN(mobile_number.toString().split("|")[1])) {
      country_code = mobile_number.split("|")[0];
      mobile_number = mobile_number.split("|")[1];
    }
    let formData = {
      pan: kyc.pan.meta_data.pan_number,
      dob: kyc.pan.meta_data.dob,
      email: kyc.address.meta_data.email,
      mobile: mobile_number,
      country_code: country_code,
      residential_status:
        residentialOptions[selectedIndexResidentialStatus].value,
      tin_number: kyc.nri_address.tin_number,
      gender: kyc.identification.meta_data.gender || "",
    };
    setIsNri(isNri);
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "residential_status", "gender"];
    if (is_nri) keysToCheck.push("tin_number");
    if (user.email === null) keysToCheck.push("email");
    if (user.mobile === null) keysToCheck.push("mobile");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    let mobile_number = form_data.mobile;
    if (form_data.country_code) {
      mobile_number = form_data.country_code + "|" + mobile_number;
    }
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.address.meta_data.email = form_data.email;
    userkycDetails.identification.meta_data.mobile_number = mobile_number;
    userkycDetails.identification.meta_data.gender = form_data.gender;
    userkycDetails.address.meta_data.is_nri = is_nri;
    let tin_number = form_data.tin_number;
    let item = {
      kyc: {
        pan: userkycDetails.pan.meta_data,
        address: userkycDetails.address.meta_data,
        identification: userkycDetails.identification.meta_data,
      },
    };
    if (is_nri) {
      item.kyc.nri_address = {
        tin_number: tin_number || "",
      };
    }
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(getPathname.compliantPersonalDetails2, {
        state: { isEdit: isEdit },
      });
      return;
    }
    saveCompliantPersonalDetails1(item);
  };

  const saveCompliantPersonalDetails1 = async (data) => {
    setIsApiRunning("button");
    try {
      const submitResult = await kycSubmit(data);
      if (!submitResult) {
        setIsApiRunning(false);
        return;
      }
      navigate(getPathname.compliantPersonalDetails2, {
        state: { isEdit: isEdit },
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name === "mobile" && value && !validateNumber(value)) return;
    let formData = { ...form_data };
    if (name === "residential_status") {
      formData[name] = residentialOptions[value].value;
      if (value === 1) setIsNri(true);
      else setIsNri(false);
    } else if (name === "gender") formData[name] = genderOptions[value].value;
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
      skelton={isLoading}
      id="kyc-personal-details1"
      buttonTitle="CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={1}
      current={1}
      total={3}
    >
      <div className="kyc-personal-details">
        <div className="kyc-main-subtitle">
          <div>
            <div>Share your date of birth as per PAN:</div>
            <div className="pan">{form_data.pan}</div>
          </div>
          <div className="help" onClick={() => setIsOpen(true)}>
            HELP
          </div>
        </div>
        {!isLoading && (
          <main>
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
            {user && user.email === null && (
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
            {user && user.mobile === null && (
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
                options={genderOptions}
                id="account_type"
                value={form_data.gender || ""}
                onChange={handleChange("gender")}
                disabled={isApiRunning}
              />
            </div>
            <div className={`input ${isApiRunning && `disabled`}`}>
              <RadioWithoutIcon
                error={form_data.resident_error ? true : false}
                helperText={form_data.resident_error}
                width="40"
                label="Residential status:"
                options={residentialOptions}
                id="account_type"
                value={form_data.residential_status || ""}
                onChange={handleChange("residential_status")}
                disabled={isApiRunning}
              />
            </div>
            {is_nri && (
              <Input
                label="Tax identification number (optional)"
                class="input"
                value={form_data.tin_number || ""}
                error={form_data.tin_number_error ? true : false}
                helperText={form_data.tin_number_error || ""}
                onChange={handleChange("tin_number")}
                maxLength={20}
                minLength={8}
                type="text"
                disabled={isApiRunning}
              />
            )}
          </main>
        )}
        {isOpen && (
          <CompliantHelpDialog
            isOpen={isOpen}
            close={close}
            pan={form_data.pan}
          />
        )}
      </div>
    </Container>
  );
};

export default PersonalDetails1;
