import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import CompliantHelpDialog from "../mini-components/CompliantHelpDialog";
import {
  formatDate,
  dobFormatTest,
  isEmpty,
  validateNumber,
} from "../../utils/validators";
import { validateFields, navigate as navigateFunc, compareObjects } from "../common/functions";
import { getCVL, kycSubmit } from "../common/api";
import { getPathname } from "../constants";
import useUserKycHook from "../common/hooks/userKycHook";

const RtaCompliantPersonalDetails = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  const [oldState, setOldState] = useState({});
  let title = "Personal details";
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
    let formData = {
      pan: kyc.pan.meta_data.pan_number,
      dob: kyc.pan.meta_data.dob,
      email: kyc.address.meta_data.email,
      mobile: kyc.identification.meta_data.mobile_number,
    };
    setFormData({ ...formData });
    setOldState({...formData});
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    let keysToCheck = ["dob"];
    if (user.email === null) keysToCheck.push("email");
    if (user.mobile === null) keysToCheck.push("mobile");
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    if(compareObjects(keysToCheck, oldState, form_data)) {
      navigate(getPathname.invest);
      return
    }
    let userkycDetails = { ...kyc };
    userkycDetails.pan.meta_data.dob = form_data.dob;
    userkycDetails.address.meta_data.email = form_data.email;
    userkycDetails.identification.meta_data.mobile_number = form_data.mobile;
    let body = {
      pan_number: form_data.pan.toUpperCase(),
      dob: form_data.dob,
      mobile_number: form_data.mobile,
      email: form_data.email,
    };
    saveRtaCompliantPersonalDetails(body, userkycDetails);
  };

  const saveRtaCompliantPersonalDetails = async (body, userKyc) => {
    setIsApiRunning("button");
    try {
      const result = await getCVL(body);
      if (!result) return;
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          address: userKyc.address.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(getPathname.invest);
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

  return (
    <Container
      skelton={isLoading}
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      data-aid='kyc-rta-compliant-screen'
    >
      <div className="kyc-personal-details" data-aid='kyc-personal-details'>
        <div className="kyc-main-subtitle" data-aid='kyc-main-subtitle'>
          <div data-aid='kyc-share-dob'>
            <div>Share your date of birth as per PAN:</div>
            <div className="pan">{form_data.pan}</div>
          </div>
          <div className="help" data-aid='kyc-help' onClick={() => setIsOpen(true)}>
            HELP
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
              type="text"
              id="dob"
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
                inputMode="numeric"
                type="text"
              />
            )}
          </main>
        )}
        <CompliantHelpDialog
          isOpen={isOpen}
          close={close}
          pan={form_data.pan}
        />
      </div>
    </Container>
  );
};

export default RtaCompliantPersonalDetails;
