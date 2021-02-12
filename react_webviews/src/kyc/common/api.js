import Api from "utils/api";
import { apiConstants, storageConstants } from "../constants";
import { isEmpty } from "utils/validators";
import { storageService } from "utils/validators";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";

const partner = getConfig().partner;
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

export const savePanData = async (body) => {
  const res = await Api.post(apiConstants.submit, {
    kyc: {
      ...body,
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
      throw result.message || result.error || "Server error";
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

export const upload = async (file, type = 'pan') => {
  const formData = new FormData()
  formData.set('res', file)
  const res = await Api.post(`/api/kyc/v2/doc/mine/${type}`, formData)
  if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message === 'success') {
    return res.pfwresponse.result
  }
  throw new Error(res?.pfwresponse?.result?.message || res?.pfwresponse?.result?.error || genericErrorMessage)
}
export const saveBankData = async (data) => {
  const res = await Api.post(apiConstants.pennyVerification, data);
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

export const getBankStatus = async (data) => {
  const res = await Api.post(apiConstants.getBankStatus, data);
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

export const getCVL = async (data) => {
  const res = await Api.post(apiConstants.getCVL, data);
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
