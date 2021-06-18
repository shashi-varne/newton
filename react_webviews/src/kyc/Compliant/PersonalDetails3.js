import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  OCCUPATION_TYPE_OPTIONS,
  INCOME_OPTIONS,
  PATHNAME_MAPPER,
} from "../constants";
import { isEmpty } from "utils/validators";
import {
  validateFields,
  compareObjects,
  getTotalPagesInPersonalDetails,
  isEmailAndMobileVerified,
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import { kycSubmit, getCVL } from "../common/api";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";

const PersonalDetails3 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const { kyc, user, isLoading } = useUserKycHook();
  const [oldState, setOldState] = useState({});
  const [totalPages, setTotalPages] = useState();
  let title = "Professional details";
  if (isEdit) {
    title = "Edit professional details";
  }

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = () => {
    let formData = {
      income: kyc.identification?.meta_data?.gross_annual_income || "",
      occupation: kyc.identification?.meta_data?.occupation || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
    setTotalPages(getTotalPagesInPersonalDetails(isEdit));
  };

  const handleClick = () => {
    sendEvents("next")
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

  const handleNavigation = (isNri) => {
    const data = {
      state: {
        isEdit: isEdit,
        userType: "compliant",
      },
    };
    if (isEmailAndMobileVerified()) {
      if (isNri) {
        navigate(PATHNAME_MAPPER.nriAddressDetails2, data);
      } else {
        navigate(PATHNAME_MAPPER.compliantPersonalDetails4, data);
      }
      return;
    }
    navigate(PATHNAME_MAPPER.communicationDetails, data);
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

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "professional_details",
        "flow": 'premium onboarding'      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      id="kyc-personal-details3"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={3}
      current={3}
      total={totalPages}
      data-aid='kyc-personal-details-screen-3'
    >
      <div className="kyc-personal-details" data-aid='kyc-personal-details-page'>
        <main data-aid='kyc-personal-details'>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.occupation_error ? true : false}
              helperText={form_data.occupation_error}
              width="40"
              label="Occupation detail"
              class="occupation"
              options={OCCUPATION_TYPE_OPTIONS}
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
        <footer data-aid='kyc-footer'>
          By tapping ‘save and continue’ I agree that I am not a PEP (politically
          exposed person)
        </footer>
      </div>
    </Container>
  );
};

export default PersonalDetails3;
