import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { dobFormatTest, formatDate, isEmpty } from "utils/validators";
import Input from "../../common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { RELATIONSHIP_OPTIONS, PATHNAME_MAPPER } from "../constants";
import {
  validateFields,
  compareObjects,
  getTotalPagesInPersonalDetails,
  getFlow
} from "../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import { kycSubmit } from "../common/api";
import { validateAlphabets } from "../../utils/validators";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "../../utils/native_callback";

const PersonalDetails4 = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  const [totalPages, setTotalPages] = useState();
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }
  const type = props.type || "";
  const keysToCheck = ["dob", "name", "relationship"];

  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) initialize();
  }, [kyc, user]);

  const initialize = async () => {
    let is_checked = false;
    if (
      kyc.nomination.nominee_optional ||
      (kyc.nomination.meta_data_status !== "submitted" &&
        kyc.nomination.meta_data_status !== "approved")
    ) {
      is_checked = true;
    }

    setIsChecked(is_checked);

    let formData = {
      name: kyc.nomination?.meta_data?.name || "",
      dob: kyc.nomination?.meta_data?.dob || "",
      relationship: kyc.nomination?.meta_data?.relationship || "",
    };
    setFormData({ ...formData });
    setOldState({ ...formData });
    setTotalPages(getTotalPagesInPersonalDetails(isEdit));
  };

  const handleClick = () => {
    if (!isChecked) {
      let result = validateFields(form_data, keysToCheck);
      if (!result.canSubmit) {
        let data = { ...result.formData };
        setFormData(data);
        sendEvents("next")
        return;
      }
    }
    sendEvents("next")
    if (isChecked) {
      if (kyc.nomination.nominee_optional) {
        handleNavigation();
        return;
      }
    } else if (compareObjects(keysToCheck, oldState, form_data)) {
      handleNavigation();
      return;
    }

    let userkycDetails = { ...kyc };
    let body = { kyc: {} };
    if (isChecked) {
      userkycDetails.nomination.nominee_optional = true;
      body.kyc = {
        nomination: userkycDetails.nomination,
      };
    } else {
      userkycDetails.nomination.meta_data.dob = form_data.dob;
      userkycDetails.nomination.meta_data.name = form_data.name;
      userkycDetails.nomination.meta_data.relationship = form_data.relationship;
      body.kyc = {
        nomination: userkycDetails.nomination.meta_data,
      };
    }
    savePersonalDetails4(body);
  };

  const savePersonalDetails4 = async (body) => {
    try {
      setIsApiRunning("button");
      const submitResult = await kycSubmit(body);
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
    if (type === "digilocker") {
      navigate(PATHNAME_MAPPER.uploadSign);
    } else {
      navigate(PATHNAME_MAPPER.journey);
    }
  };

  const handleChange = (name) => (event) => {
    if (name === "checkbox") {
      setIsChecked(!isChecked);
      let formData = { ...form_data };
      keysToCheck.forEach((element) => {
        formData[`${element}_error`] = "";
      });
      setFormData({
        ...formData,
      });
      return;
    }

    let value = event.target ? event.target.value : event;
    if (name === "name" && value && !validateAlphabets(value)) return;
    let formData = { ...form_data };
    if (name === "dob") {
      if (!dobFormatTest(value)) {
        return;
      }
      let input = document.getElementById("dob");
      input.onkeyup = formatDate;
    }
    formData[name] = value;
    if (!value) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "nominee details",
        "name": form_data.name ? "yes" : "no",
        "dob": form_data.dob_error ? "invalid" : form_data.dob ? "yes" : "no",
        "relationship": form_data.relationship ? "yes" : "no",
        "flow": getFlow(kyc) || "",
        "add_nominee":isChecked ? "no":"yes",
        "initial_kyc_status" : kyc.kyc_status || ""
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  return (
    <Container
      events={sendEvents("just_set_events")}
      showSkelton={isLoading}
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      handleClick={handleClick}
      skelton={isLoading}
      showLoader={isApiRunning}
      title={title}
      count={totalPages}
      current={totalPages}
      total={totalPages}
      data-aid='kyc-personal-details-screen-4'
    >
      <div className="kyc-nominee">
        <main data-aid='kyc-nominee-details'>
          <WVInfoBubble type="info">
            Nominee details will be applicable for mutual fund investments only
          </WVInfoBubble>
          <div className="nominee-checkbox" data-aid='kyc-nominee-checkbox'>
            <Checkbox
              defaultChecked
              checked={isChecked}
              value={isChecked}
              name="checked"
              handleChange={handleChange("checkbox")}
              class="checkbox"
            />
            <span>
              I do not wish to add a nominee
            </span>
          </div>
          <Input
            label="Name"
            class="input"
            value={form_data.name || ""}
            error={form_data.name_error ? true : false}
            helperText={form_data.name_error || ""}
            onChange={handleChange("name")}
            maxLength={20}
            type="text"
            disabled={isChecked || isApiRunning}
          />
          <Input
            label="Date of birth(DD/MM/YYYY)"
            class="input"
            value={form_data.dob || ""}
            error={form_data.dob_error ? true : false}
            helperText={form_data.dob_error || ""}
            onChange={handleChange("dob")}
            maxLength={10}
            type="text"
            inputMode="numeric"
            id="dob"
            disabled={isChecked || isApiRunning}
          />
          <div className="input" data-aid='kyc-dropdown-withouticon'>
            <DropdownWithoutIcon
              error={form_data.relationship_error ? true : false}
              helperText={form_data.relationship_error}
              options={RELATIONSHIP_OPTIONS}
              id="relationship"
              label="Relationship"
              isAOB={true}
              value={form_data.relationship || ""}
              name="relationship"
              onChange={handleChange("relationship")}
              disabled={isChecked || isApiRunning}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default PersonalDetails4;
