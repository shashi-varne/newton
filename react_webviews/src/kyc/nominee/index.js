import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  storageConstants,
  relationshipOptions,
  getPathname,
} from "../constants";
import { initData } from "../services";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { savePanData } from "../common/api";
import {
  storageService,
  validateAlphabets,
  isEmpty,
  dobFormatTest,
  formatDate,
} from "../../utils/validators";
import { toast } from "react-toastify";

const Nominee = (props) => {
  const genericErrorMessage = "Something went wrong!";
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const state = props.location.state || {};
  const isEdit = state.isEdit || false;
  let finalSubmissionData = state.finalSubmissionData || {
    kyc: {},
  };
  const [userKyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  let title = "Nominee detail";
  if (isEdit) {
    title = "Edit nominee detail";
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userKyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
    }

    userkycDetails.nomination.meta_data.nominee_optional = false;
    setUserKyc(userkycDetails);

    let formData = {
      name: userkycDetails.nomination.meta_data.name || "",
      dob: userkycDetails.nomination.meta_data.dob || "",
      relationship: userkycDetails.nomination.meta_data.relationship || "",
    };
    setShowLoader(false);
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["dob", "name", "relationship"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    let userkycDetails = { ...userKyc };
    userkycDetails.nomination.meta_data.dob = form_data.dob;
    userkycDetails.nomination.meta_data.name = form_data.name;
    userkycDetails.nomination.meta_data.relationship = form_data.relationship;
    let body = { ...finalSubmissionData };
    body.kyc.nomination = userkycDetails.nomination.meta_data;
    saveNomineeDetails(body);
  };

  const saveNomineeDetails = async (body) => {
    try {
      setIsApiRunning(true);
      const submitResult = await savePanData(body);
      if (!submitResult) return;
      navigate(getPathname.kycReport);
    } catch (err) {
      console.log(err);
      toast(err || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
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

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="kyc-home"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-nominee">
        <div className="kyc-main-title">{title}</div>
        {!isEmpty(userKyc) && (
          <main>
            <Input
              label="Name"
              class="input"
              value={form_data.name || ""}
              error={form_data.name_error ? true : false}
              helperText={form_data.name_error || ""}
              onChange={handleChange("name")}
              maxLength={20}
              type="text"
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
              id="dob"
            />
            <div className="input">
              <DropdownWithoutIcon
                error={form_data.relationship_error ? true : false}
                helperText={form_data.relationship_error}
                options={relationshipOptions}
                id="relationship"
                label="Relationship"
                isAOB={true}
                value={form_data.relationship || ""}
                name="relationship"
                onChange={handleChange("relationship")}
              />
            </div>
          </main>
        )}
      </div>
    </Container>
  );
};

export default Nominee;
