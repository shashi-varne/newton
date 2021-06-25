import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import { PATHNAME_MAPPER, MARITAL_STATUS_OPTIONS } from "../constants";
import { isEmpty, validateAlphabets } from "utils/validators";
import {
  validateFields,
  compareObjects,
  getTotalPagesInPersonalDetails,
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import { kycSubmit } from "../common/api";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import toast from "common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";

const PersonalDetails2 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  const [totalPages, setTotalPages] = useState();
  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      initialize();
    }
  }, [kyc, user]);

  const initialize = () => {
    setTotalPages(getTotalPagesInPersonalDetails(isEdit))
    let formData = {
      mother_name: kyc.pan?.meta_data?.mother_name || "",
      marital_status: kyc.identification.meta_data.marital_status || "",
      spouse_name: kyc.identification.meta_data.spouse_name || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    sendEvents("next")
    let keysToCheck = ["mother_name", "marital_status"];
    if (form_data.marital_status === "MARRIED") keysToCheck.push("spouse_name");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.identification.meta_data.marital_status =
      form_data.marital_status;
    userkycDetails.pan.meta_data.mother_name = form_data.mother_name;
    if (form_data.marital_status === "MARRIED")
      userkycDetails.identification.meta_data.spouse_name =
        form_data.spouse_name;
    let item = {
      kyc: {
        pan: userkycDetails.pan.meta_data,
        identification: userkycDetails.identification.meta_data,
      },
    };
    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(PATHNAME_MAPPER.compliantPersonalDetails3, {
        state: {
          isEdit: isEdit,
        },
      });
      return;
    }
    savePersonalDetails2(item);
  };

  const savePersonalDetails2 = async (body) => {
    try {
      setIsApiRunning("button");
      const submitResult = await kycSubmit(body);
      if (!submitResult) return;
      navigate(PATHNAME_MAPPER.compliantPersonalDetails3, {
        state: {
          isEdit: isEdit,
        },
      });
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name.includes("name") && value && !validateAlphabets(value)) {
      return;
    }
    let formData = { ...form_data };
    if (name === "marital_status")
      formData[name] = MARITAL_STATUS_OPTIONS[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "personal_details_2",
        marital_status: form_data.marital_status
          ? form_data.marital_status.toLowerCase()
          : "",
        mother_name: form_data.mother_name ? "yes" : "no",
        spouse_name: form_data.spouse_name ? "yes" : "no",
        "flow": 'premium onboarding'
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      id="kyc-compliant-personal-details2"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={2}
      current={2}
      total={totalPages}
      data-aid='kyc-personal-details-screen-2'
    >
      <div className="kyc-personal-details" data-aid='kyc-personal-details-page'>
        {!isLoading && (
          <main  data-aid='kyc-personal-details'>
            <div className={`input ${isApiRunning && `disabled`}`}>
              <RadioWithoutIcon
                error={form_data.marital_status_error ? true : false}
                helperText={form_data.marital_status_error}
                width="40"
                label="Marital status"
                options={MARITAL_STATUS_OPTIONS}
                id="account_type"
                value={form_data.marital_status || ""}
                onChange={handleChange("marital_status")}
                disabled={isApiRunning}
              />
            </div>
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
            {form_data.marital_status === "MARRIED" && (
              <Input
                label="Spouse's name"
                class="input"
                value={form_data.spouse_name || ""}
                error={form_data.spouse_name_error ? true : false}
                helperText={form_data.spouse_name_error || ""}
                onChange={handleChange("spouse_name")}
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

export default PersonalDetails2;
