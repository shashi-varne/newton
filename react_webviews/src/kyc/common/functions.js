import { getConfig } from "utils/functions";
import { getIFSC, addAdditionalBank, getCVL, savePanData } from "../common/api";
import { getIfscCodeError, getPathname } from "../constants";
import toast from "common/ui/Toast";
import { calculateAge, isValidDate } from "utils/validators";

const genericErrorMessage = "Something Went wrong!";
const partner = getConfig().partner;
export function navigate(pathname, data = {}) {
  if (data.edit) {
    this.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data.state,
      params: data.params,
    });
  } else {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data.state,
      params: data.params,
    });
  }
}

export const validateFields = (formData, keyToCheck) => {
  let canSubmit = true;
  for (let key of keyToCheck) {
    let value = formData[key];
    if (!value) {
      formData[`${key}_error`] = "This is required";
      canSubmit = false;
    } else {
      switch (key) {
        case "mobile":
          if (value.length !== 10) {
            formData[`${key}_error`] = "Minimum length is 10";
            canSubmit = false;
          }
          break;
        case "aadhar":
          if (value.length !== 12) {
            formData[`${key}_error`] = "Minimum length is 12";
            canSubmit = false;
          }
          break;
        case "account_number":
        case "c_account_number":
          if (value.length !== 16) {
            formData[`${key}_error`] = "Minimum length is 16";
            canSubmit = false;
          }
          break;
        case "ifsc_code":
          if (value.length !== 11) {
            formData[`${key}_error`] = "Minimum length is 11";
            canSubmit = false;
          }
          break;
        case "dob":
          if (!isValidDate(value)) {
            formData[`${key}_error`] = "Please enter a valid date";
            canSubmit = false;
          } else if (calculateAge(value) < 18) {
            formData[`${key}_error`] = "Minimum age required 18 years";
            canSubmit = false;
          }
          break;
        case "tin_number":
          if (value.length < 8) {
            formData[`${key}_error`] = "Minimum length is 8";
            canSubmit = false;
          }
          break;
        default:
          break;
      }
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
      navigate(getPathname.bankList);
    } else {
      navigate(`${getPathname.addBankVerify}${result.bank.bank_id}`);
    }
  } catch (err) {
    toast(err || genericErrorMessage);
  } finally {
    setIsApiRunning(false);
  }
};

export const saveCompliantPersonalDetails1 = async (body, data) => {
  let { setIsApiRunning, userKyc, tin_number, is_nri, isEdit, navigate } = data;
  try {
    const result = await getCVL(body);
    if (!result) return;
    userKyc.identification.politically_exposed = "NOT APPLICABLE";
    userKyc.address.meta_data.is_nri = is_nri;
    let item = {
      pan: userKyc.pan.meta_data,
      address: userKyc.address.meta_data,
      identification: userKyc.identification,
    };
    if (is_nri) {
      item.nri_address = {
        tin_number: tin_number || "",
      };
    }
    const submitResult = await savePanData(item);
    if (!submitResult) return;
    if (is_nri) {
      let toState = "kyc-bank-details";
      if (isEdit) {
        toState = "kyc-journey";
      }
      // $state.go('kyc-nri-address-details-2', {
      //   toState: toState,
      //   userType: 'compliant'
      // })
    } else {
      if (isEdit) {
        // $state.go("kyc-journey");
        navigate(getPathname.journey);
      } else {
        navigate(getPathname.compliantPersonalDetails2);
        // $state.go("kyc-compliant-personal-details2");
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsApiRunning(false);
  }
};

export const saveCompliantPersonalDetails2 = async (body, data) => {
  let { setIsApiRunning, isEdit, navigate, isChecked } = data;
  try {
    setIsApiRunning(true);
    const submitResult = await savePanData(body);
    if (!submitResult) return;
    if (isChecked) {
      if (isEdit) navigate(getPathname.journey);
      else navigate();
    } else {
      navigate(getPathname.journey);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsApiRunning(false);
  }
};
