import { getConfig } from "utils/functions";

export function navigate(pathname, data = {}) {
  if (data.edit) {
    this.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
    });
  } else {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data.state,
    });
  }
}

export const validateFields = (formData, keyToCheck) => {
  let canSubmit = true;
  for (let key of keyToCheck) {
    if (!formData[key]) {
      formData[`${key}_error`] = "This is required";
      canSubmit = false;
    } else if (key === "mobile" && formData[key].length !== 10) {
      formData[`${key}_error`] = "Max length is 10";
      canSubmit = false;
    } else if (key === "aadhar" && formData[key].length !== 12) {
      formData[`${key}_error`] = "Max length is 12";
      canSubmit = false;
    }
  }
  return { formData, canSubmit };
};
