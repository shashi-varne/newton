import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
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
import { getCVL, savePanData } from "../common/api";
import { getPathname, storageConstants } from "../constants";

const RtaCompliantPersonalDetails = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  let title = "Personal details";
  if (isEdit) {
    title = "Edit personal details";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
      setCurrentUser(user);
      setUserKyc(userkycDetails);
    }
    let formData = {
      pan: userkycDetails.pan.meta_data.pan_number,
      dob: userkycDetails.pan.meta_data.dob,
      email: userkycDetails.address.meta_data.email,
      mobile: userkycDetails.identification.meta_data.mobile_number,
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "mobile"];
    if (currentUser.email === null) keysToCheck.push("email");
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
    setUserKyc({ ...userkycDetails });
    let body = {
      pan_number: form_data.pan.toUpperCase(),
      dob: form_data.dob,
      mobile_number: form_data.mobile,
      email: form_data.email,
    };
    saveRtaCompliantPersonalDetails(body, userkycDetails);
  };

  const saveRtaCompliantPersonalDetails = async (body, userKyc) => {
    setIsApiRunning(true);
    try {
      const result = await getCVL(body);
      if (!result) return;
      let item = {
        kyc: {
          pan: userKyc.pan.meta_data,
          address: userKyc.address.meta_data,
        },
      };
      const submitResult = await savePanData(item);
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
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-rta-compliant-personal-details"
      buttonTitle="SAVE AND CONTINUE"
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
            />
            {currentUser && currentUser.email === null && (
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
            <Input
              label="Mobile number"
              class="input"
              value={form_data.mobile || ""}
              error={form_data.mobile_error ? true : false}
              helperText={form_data.mobile_error || ""}
              onChange={handleChange("mobile")}
              maxLength={10}
              type="text"
            />
          </main>
        )}
        <CompliantHelpDialog isOpen={isOpen} close={close} />
      </div>
    </Container>
  );
};

export default RtaCompliantPersonalDetails;
