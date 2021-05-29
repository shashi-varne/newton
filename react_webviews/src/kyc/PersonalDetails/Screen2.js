import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "../../common/ui/Input";
import { getPathname } from "../constants";
import { isEmpty, validateAlphabets } from "../../utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
  getTotalPagesInPersonalDetails,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";

const PersonalDetails2 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  const {kyc, user, isLoading} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = async () => {
    let formData = {
      father_name: kyc.pan?.meta_data?.father_name || "",
      mother_name: kyc.pan?.meta_data?.mother_name || "",
      marital_status: kyc.identification.meta_data.marital_status || "",
      spouse_name: kyc.identification.meta_data.spouse_name || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
  };

  const handleClick = () => {
    sendEvents("next");
    let keysToCheck = ["mother_name", "father_name"];
    if (form_data.marital_status === "MARRIED") keysToCheck.push("spouse_name");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.pan.meta_data.father_name = form_data.father_name;
    userkycDetails.pan.meta_data.mother_name = form_data.mother_name;
    if (form_data.marital_status === "MARRIED")
      userkycDetails.identification.meta_data.spouse_name =
        form_data.spouse_name;

    if (compareObjects(keysToCheck, oldState, form_data)) {
      navigate(getPathname.personalDetails3, {
        state: {
          isEdit: isEdit,
        },
      });
      return;
    }
    savePersonalDetails2(userkycDetails);
  };

  const savePersonalDetails2 = async (userKyc) => {
    setIsApiRunning("button");
    try {
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          identification: userKyc.identification.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(getPathname.personalDetails3, {
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
    if (!validateAlphabets(value) && value) return;
    let formData = { ...form_data };
    formData[name] = value;
    if (!value) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "personal_details_2",
        mother_name: form_data.mother_name ? "yes" : "no",
        father_name: form_data.father_name ? "yes" : "no",
        spouse_name: form_data.spouse_name ? "yes" : "no",
        // "flow": 'general'
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
      events={sendEvents("just_set_events")}
      showSkelton={isLoading}
      buttonTitle="SAVE AND CONTINUE"
      handleClick={handleClick}
      skelton={isLoading}
      showLoader={isApiRunning}
      title={title}
      count="2"
      current="2"
      total={getTotalPagesInPersonalDetails(kyc, user, isEdit)}
    >
      <div className="kyc-personal-details">
        <main>
          <Input
            label="Father's name"
            class="input"
            value={form_data.father_name || ""}
            error={form_data.father_name_error ? true : false}
            helperText={form_data.father_name_error || ""}
            onChange={handleChange("father_name")}
            maxLength={20}
            type="text"
            disabled={isApiRunning}
          />
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
              label="Spouse"
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
      </div>
    </Container>
  );
};

export default PersonalDetails2;
