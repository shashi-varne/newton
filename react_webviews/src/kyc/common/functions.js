import { getConfig } from "utils/functions";
import { getIFSC, addAdditionalBank } from "../common/api";
import { getIfscCodeError, getPathname } from "../constants";
import toast from "common/ui/Toast";

const genericErrorMessage = "Something Went wrong!";
const partner = getConfig().partner;
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
      formData[`${key}_error`] = "Minimum length is 10";
      canSubmit = false;
    } else if (key === "aadhar" && formData[key].length !== 12) {
      formData[`${key}_error`] = "Minimum length is 12";
      canSubmit = false;
    } else if (key.includes("account_number") && formData[key].length !== 16) {
      formData[`${key}_error`] = "Minimum length is 16";
      canSubmit = false;
    } else if (key === "ifsc_code" && formData[key].length !== 11) {
      formData[`${key}_error`] = "Minimum length is 11";
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
    encodedURI = encodeURIComponent(
      window.location.hostname + "/aadhar/callback"
    );
  }
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

export const checkIFSCFormat = async (bankData, form_data, setIsApiRunning) => {
  let formData = Object.assign({}, form_data);
  let bank = Object.assign({}, bankData);
  let bankIcon = "";
  if (
    (partner.code === "ktb" &&
      bankData.ifsc_code.toUpperCase().startsWith("KARB")) ||
    (partner.code === "lvb" &&
      bankData.ifsc_code.toUpperCase().startsWith("LAVB")) ||
    (partner.code === "cub" &&
      bankData.ifsc_code.toUpperCase().startsWith("CIUB")) ||
    (partner.code === "ippb" &&
      bankData.ifsc_code.toUpperCase().startsWith("IPOS")) ||
    (partner.code !== "ktb" &&
      partner.code !== "lvb" &&
      partner.code !== "cub" &&
      partner.code !== "ippb")
  ) {
    setIsApiRunning(true);
    try {
      const result = (await getIFSC(bankData.ifsc_code)) || [];
      if (result && result.length > 0) {
        const data = result[0] || {};
        formData.ifsc_code_error = "";
        bank.branch_name = data.branch;
        bank.bank_name = data.bank;
        bankIcon = data.image || "";
        formData.ifsc_code_helper = `${data.bank} ${data.branch}`;
      } else {
        bank.branch_name = "";
        bank.bank_name = "";
        formData.ifsc_code_error = getIfscCodeError(partner.code);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsApiRunning(false);
    }
  } else {
    console.log("else");
    bank.branch_name = "";
    bank.bank_name = "";
    formData.ifsc_code_error = getIfscCodeError(partner.code);
  }
  return { bankData: bank, formData: formData, bankIcon: bankIcon };
};

export const saveBankData = async (data, setIsApiRunning, navigate) => {
  try {
    setIsApiRunning(true);
    const result = await addAdditionalBank(data);
    if (!result) return;
    if (result.bank.bank_status === "approved") {
      toast("Congratulations!, new account added succesfully");
      navigate(getPathname("bankList"));
    } else {
      navigate(`${getPathname("addBankVerify")}${result.bank.bank_id}`);
    }
  } catch (err) {
    toast(err || genericErrorMessage);
  } finally {
    setIsApiRunning(false);
  }
};
