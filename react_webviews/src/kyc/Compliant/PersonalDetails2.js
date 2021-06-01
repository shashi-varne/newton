import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Input from "common/ui/Input";
import { getPathname, maritalStatusOptions } from "../constants";
import { isEmpty, validateAlphabets } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
  compareObjects,
  getTotalPagesInPersonalDetails,
} from "../common/functions";
import { kycSubmit } from "../common/api";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import toast from "common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";

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
      navigate(getPathname.compliantPersonalDetails3, {
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
      navigate(getPathname.compliantPersonalDetails3, {
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
      formData[name] = maritalStatusOptions[value].value;
    else formData[name] = value;
    if (!value && value !== 0) formData[`${name}_error`] = "This is required";
    else formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  return (
    <Container
      skelton={isLoading}
      id="kyc-compliant-personal-details2"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      handleClick={handleClick}
      title={title}
      count={2}
      current={2}
      total={totalPages}
    >
      <div className="kyc-personal-details">
        {!isLoading && (
          <main>
            <div className={`input ${isApiRunning && `disabled`}`}>
              <RadioWithoutIcon
                error={form_data.marital_status_error ? true : false}
                helperText={form_data.marital_status_error}
                width="40"
                label="Marital status:"
                class="marital_status"
                options={maritalStatusOptions}
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
        )}
      </div>
    </Container>
  );
};

export default PersonalDetails2;
