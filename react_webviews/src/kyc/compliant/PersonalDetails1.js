import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import {
  occupationOptions,
  incomeOptions,
  residentialOptions,
  storageConstants,
  getPathname,
} from "../constants";
import CompliantHelpDialog from "../mini_components/CompliantHelpDialog";
import { initData } from "../services";
import {
  storageService,
  formatDate,
  dobFormatTest,
  isEmpty,
  validateNumber,
} from "../../utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { getCVL, kycSubmit } from "../common/api";
import useUserKycHook from "../common/hooks/userKycHook";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  let title = "Basic details";
  const [is_nri, setIsNri] = useState();
  if (isEdit) {
    title = "Edit basic details";
  }

  const [kyc, user, isLoading] = useUserKycHook();

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
    let formData = {
      pan: kyc.pan.meta_data.pan_number,
      dob: kyc.pan.meta_data.dob,
      email: kyc.address.meta_data.email,
      mobile: kyc.identification.meta_data.mobile_number,
      occupation: kyc.identification.meta_data.occupation,
      income: kyc.identification.meta_data.gross_annual_income,
      residential_status:
        residentialOptions[selectedIndexResidentialStatus].value,
      tin_number: kyc.nri_address.tin_number,
    };
    setIsNri(isNri);
    setFormData({ ...formData });
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    let keysToCheck = [
      "dob",
      "mobile",
      "occupation",
      "income",
      "residential_status",
    ];
    if (is_nri) keysToCheck.push("tin_number");
    if (user.email === null) keysToCheck.push("email");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.address.meta_data.email = form_data.email;
    userkycDetails.identification.meta_data.mobile_number = form_data.mobile;
    userkycDetails.identification.meta_data.occupation = form_data.occupation;
    userkycDetails.identification.meta_data.gross_annual_income =
      form_data.income;
    let tin_number = form_data.tin_number;
    let body = {
      pan_number: form_data.pan.toUpperCase(),
      dob: form_data.dob,
      mobile_number: form_data.mobile,
      email: form_data.email,
    };
    let data = {
      tin_number,
      userKyc: userkycDetails,
    };
    saveCompliantPersonalDetails1(body, data);
  };

  const saveCompliantPersonalDetails1 = async (body, data) => {
    setIsApiRunning(true);
    let { userKyc, tin_number } = data;
    try {
      const result = await getCVL(body);
      if (!result) return;
      userKyc.identification.politically_exposed = "NOT APPLICABLE";
      userKyc.address.meta_data.is_nri = is_nri;
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          address: userKyc.address.meta_data,
          identification: userKyc.identification,
        },
      };
      if (is_nri) {
        item.kyc.nri_address = {
          tin_number: tin_number || "",
        };
      }
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      if (is_nri) {
        let toState = "kyc-bank-details";
        if (isEdit) {
          toState = "kyc-journey";
        }
        navigate(getPathname.nriAddressDetails2, {
          state: {
            toState: toState,
            userType: "compliant",
          },
        });
      } else {
        if (isEdit) {
          navigate(getPathname.journey);
        } else {
          navigate(getPathname.compliantPersonalDetails2);
        }
      }
    } catch (err) {
      console.log(err);
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
    } else if (name === "dob") {
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
      showSkelton={isLoading}
      hideInPageTitle
      id="kyc-personal-details1"
      buttonTitle="CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || isLoading}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details">
        <div className="kyc-main-title">{title}</div>
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
            <div className="input">
              <DropdownWithoutIcon
                error={form_data.occupation_error ? true : false}
                helperText={form_data.occupation_error || ""}
                options={occupationOptions}
                id="occupation"
                label="Occupation"
                isAOB={true}
                value={form_data.occupation || ""}
                name="occupation"
                onChange={handleChange("occupation")}
                disabled={isApiRunning}
              />
            </div>
            <DropdownWithoutIcon
              error={form_data.income_error ? true : false}
              helperText={form_data.income_error || ""}
              options={incomeOptions}
              id="income"
              label="Income range"
              isAOB={true}
              value={form_data.income || ""}
              name="income"
              onChange={handleChange("income")}
              disabled={isApiRunning}
            />
            <div className={`input ${isApiRunning && `disabled`}`}>
              <RadioWithoutIcon
                error={form_data.resident_error ? true : false}
                helperText={form_data.resident_error}
                width="40"
                label="Residential status:"
                class="residential-status"
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
            <footer>
              By tapping ‘save and continue’ I agree that I am not a
              PEP(politically exposed person)
            </footer>
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
