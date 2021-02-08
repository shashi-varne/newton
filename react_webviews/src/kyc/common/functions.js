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

export const submitAadharData = (data) => {
  let encodedURI = encodeURIComponent(
    window.location.host + "/aadhar/callback"
  );
  if (window.location.port === "80") {
    encodedURI = encodeURIComponent(window.location.hostname + "/aadhar/callback");
  }
  console.log(getConfig().base_url);
  window.location.href =
    getConfig().base_url +
    "/page/kyc/ekyc?pan=" +
    data.pan_number +
    "&aadhar=" +
    data.aadhar +
    "&mobile_number=" +
    data.mobile_number +
    "&redirect_url=" +
    window.location.protocol +
    "//" +
    encodedURI;
};
