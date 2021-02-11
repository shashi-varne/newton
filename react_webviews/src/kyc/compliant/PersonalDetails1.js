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
} from "../../utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { getCVL, savePanData } from "../common/api";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  let title = "Basic details";
  const [is_nri, setIsNri] = useState();
  if (isEdit) {
    title = "Edit basic details";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
    }
    setUserKyc(userkycDetails);
    let isNri = userkycDetails.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (isNri) {
      selectedIndexResidentialStatus = 1;
    }
    let formData = {
      pan: userkycDetails.pan.meta_data.pan_number,
      dob: userkycDetails.pan.meta_data.dob,
      email: userkycDetails.address.meta_data.email,
      mobile: userkycDetails.identification.meta_data.mobile_number,
      occupation: userkycDetails.identification.meta_data.occupation,
      income: userkycDetails.identification.meta_data.gross_annual_income,
      residential_status:
        residentialOptions[selectedIndexResidentialStatus].value,
      tin_number: userkycDetails.nri_address.tin_number,
    };
    setShowLoader(false);
    setIsNri(isNri);
    setFormData({ ...formData });
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    let keysToCheck = [
      "dob",
      "email",
      "mobile",
      "occupation",
      "income",
      "residential_status",
    ];
    if (is_nri) keysToCheck.push("tin_number");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userkyc };
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
    let { userKyc, tin_number } = data;
    try {
      const result = await getCVL(body);
      if (!result) return;
      userKyc.identification.politically_exposed = "NOT APPLICABLE";
      userKyc.address.meta_data.is_nri = is_nri;
      let item = {
        pan: userKyc.pan.meta_data,
        address: userKyc.address.meta_data,
        identification: userKyc.identification,
      };
      if (is_nri) {
        item.nri_address = {
          tin_number: tin_number || "",
        };
      }
      const submitResult = await savePanData(item);
      if (!submitResult) return;
      if (is_nri) {
        let toState = "kyc-bank-details";
        if (isEdit) {
          toState = "kyc-journey";
        }
        // $state.go('kyc-nri-address-details-2', {
        //   toState: toState,
        //   userType: 'compliant'
        // })
      } else {
        if (isEdit) {
          // $state.go("kyc-journey");
          navigate(getPathname.journey);
        } else {
          navigate(getPathname.compliantPersonalDetails2);
          // $state.go("kyc-compliant-personal-details2");
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
    if (!value) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="kyc-personal-details1"
      buttonTitle="CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
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
        {!isEmpty(userkyc) && (
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
        {isOpen && <CompliantHelpDialog isOpen={isOpen} close={close} />}
      </div>
    </Container>
  );
};

export default PersonalDetails1;
