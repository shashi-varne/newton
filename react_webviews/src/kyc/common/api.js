import Api from "utils/api";
import { apiConstants, storageConstants } from "../constants";
import { isEmpty } from "utils/validators";
import { storageService } from "utils/validators";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";

const partner = getConfig().partner;
let userKyc = storageService().getObject(storageConstants.KYC);
const genericErrorMessage = "Something Went wrong!";
export const getPan = async (data) => {
  const res = await Api.post(apiConstants.getPan, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    case 402:
      accountMerge();
      break;
    case 403:
      toast("Network error");
      return;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

const accountMerge = () => {};

export const savePanData = async (pan_number, nri_data) => {
  if (nri_data && nri_data.is_nri) {
    userKyc.address.meta_data.is_nri = true;
  } else {
    userKyc.address.meta_data.is_nri = false;
  }
  let dob = userKyc.pan.meta_data.dob;
  let oldObject = userKyc.pan.meta_data;
  let newObject = Object.assign({}, oldObject);
  newObject.dob = dob;
  newObject.pan_number = pan_number;
  const res = await Api.post(apiConstants.submit, {
    kyc: {
      pan: newObject,
      address: userKyc.address.meta_data,
    },
  });
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      if (result.kyc.identification.meta_data.nationality)
        result.kyc.identification.meta_data.nationality = result.kyc.identification.meta_data.nationality.toUpperCase();
      storageService().setObject(storageConstants.KYC, result.kyc);
      storageService().setObject(storageConstants.USER, result.user);
      return result;
    case 402:
      const email = partner.email;
      let name = "fisdom";
      if (getConfig().productName === "finity") {
        name = "finity";
      }
      const msg = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
      toast(msg);
      break;
    default:
      throw result.error || result.message || "Server error";
  }
};

export const getMyAccount = async () => {
  const res = await Api.get(apiConstants.getMyaccount);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

export const getIFSC = async (data) => {
  const res = await Api.get(`${apiConstants.getIFSC}${data}`);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

export const addAdditionalBank = async (data) => {
  const res = await Api.post(apiConstants.addAdditionalBank, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.message || result.error || genericErrorMessage;
  }
};