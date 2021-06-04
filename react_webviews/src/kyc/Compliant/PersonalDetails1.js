import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { GENDER_OPTIONS, RESIDENTIAL_OPTIONS, PATHNAME_MAPPER } from "../constants";
import {
  formatDate,
  dobFormatTest,
  isEmpty,
} from "utils/validators";
import {
  validateFields,
  compareObjects,
  getTotalPagesInPersonalDetails,
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { kycSubmit } from "../common/api";
import { nativeCallback } from "../../utils/native_callback";

const PersonalDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Personal details";
  const [isNri, setIsNri] = useState();
  const [totalPages, setTotalPages] = useState();
  if (isEdit) {
    title = "Edit personal details";
  }

  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc, user]);

  const initialize = async () => {
    let nri = kyc.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (nri) {
      selectedIndexResidentialStatus = 1;
    }
    let formData = {
      pan: kyc.pan.meta_data.pan_number,
      dob: kyc.pan.meta_data.dob,
      residential_status:
        RESIDENTIAL_OPTIONS[selectedIndexResidentialStatus].value,
      tin_number: kyc.nri_address.tin_number,
      gender: kyc.identification.meta_data.gender || "",
    };
    setIsNri(nri);
    setFormData({ ...formData });
    setOldState({ ...formData });
    setTotalPages(getTotalPagesInPersonalDetails(isEdit))
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "residential_status", "gender"];
    let result = validateFields(form_data, keysToCheck);
    sendEvents('next')
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.identification.meta_data.gender = form_data.gender;
    userkycDetails.address.meta_data.is_nri = isNri;
    let tin_number = form_data.tin_number;
    let item = {
      kyc: {
        pan: userkycDetails.pan.meta_data,
        address: userkycDetails.address.meta_data,
        identification: userkycDetails.identification.meta_data,
      },
    };
    if (isNri) {
      item.kyc.nri_address = {
        tin_number: tin_number || "",
      };
    }
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(PATHNAME_MAPPER.compliantPersonalDetails2, {
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
      navigate(PATHNAME_MAPPER.compliantPersonalDetails2, {
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
    let formData = { ...form_data };
    if (name === "residential_status") {
      formData[name] = RESIDENTIAL_OPTIONS[value].value;
      if (value === 1) setIsNri(true);
      else setIsNri(false);
    } else if (name === "gender") formData[name] = GENDER_OPTIONS[value].value;
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

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "personal_details_1",
        "mobile": form_data.mobile ? "yes" : "no",
        "dob": form_data.dob_error ? "invalid" : form_data.dob ? "yes" : "no",
        "email": form_data.email_error ? "invalid" : form_data.email ? "yes" : "no",
        "gender": form_data.gender,
        "flow": 'premium onboarding'      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  const goBack = () => {
    navigate("/kyc/journey");
  };

  return (
    <Container
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      data-aid="kyc-personal-details-screen-1"
      buttonTitle="CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={1}
      current={1}
      total={totalPages}
      headerData={{ goBack }}
    >
      <div className="kyc-personal-details" data-aid='kyc-personal-details-page'>
        <div className="kyc-main-subtitle" data-aid='kyc-main-subtitle'>
          <div data-aid='kyc-share-pan-dob'>
            <div>Date of birth should be as per</div>
            <div>
              <b>PAN:</b> {form_data.pan}
            </div>
          </div>
        </div>
        {!isLoading && (
          <main data-aid='kyc-personal-details'>
            <Input
              label="Date of birth(DD/MM/YYYY)"
              class="input"
              value={form_data.dob || ""}
              error={form_data.dob_error ? true : false}
              helperText={form_data.dob_error || ""}
              onChange={handleChange("dob")}
              maxLength={10}
              inputMode="numeric"
              type="text"
              id="dob"
              disabled={isApiRunning}
            />
            <div className={`input ${isApiRunning && `disabled`}`}>
              <RadioWithoutIcon
                error={form_data.gender_error ? true : false}
                helperText={form_data.gender_error}
                width="40"
                label="Gender"
                options={GENDER_OPTIONS}
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
                label="Residential status"
                options={RESIDENTIAL_OPTIONS}
                id="account_type"
                value={form_data.residential_status || ""}
                onChange={handleChange("residential_status")}
                disabled={isApiRunning}
              />
            </div>
            {isNri && (
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
      </div>
    </Container>
  );
};

export default PersonalDetails1;
