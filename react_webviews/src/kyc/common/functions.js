import { calculateAge, isValidDate, validateEmail, isEmpty, storageService } from 'utils/validators'
import { isTradingEnabled, getConfig, isEquityAocApplicable } from '../../utils/functions'
import { nativeCallback, openPdfCall } from '../../utils/native_callback'
import { validateAlphaNumeric } from '../../utils/validators'
import { eqkycDocsGroupMapper, VERIFICATION_DOC_OPTIONS, ADDRESS_PROOF_OPTIONS, GENDER_OPTIONS, PATHNAME_MAPPER, PINCODE_LENGTH } from '../constants'
import { getKycAppStatus, isReadyToInvest } from '../services'
import { getKyc } from './api'

export const isEquityAllowed = (config = getConfig()) => {
  // Function to check if Equity broking/trading is allowed as per frontend checks/rules
  const equityEnabled = storageService().getBoolean('equityEnabled'); // Used to enable kyc equity flow from native/external side
  const androidSdkVersionCode = storageService().get("android_sdk_version_code");
  const iosSdkVersionCode = storageService().get("ios_sdk_version_code");
  
  if (config.isSdk) {
    // eslint-disable-next-line
    return (parseInt(androidSdkVersionCode) >= 21 || parseInt(iosSdkVersionCode) >= 999);
  } else if (config.isNative) {
    return equityEnabled;
  }
  return true;
}

export const validateFields = (formData, keyToCheck) => {
  let canSubmit = true
  for (let key of keyToCheck) {
    let value = formData[key]
    if (!value) {
      formData[`${key}_error`] = 'This is required'
      canSubmit = false
    } else {
      switch (key) {
        case 'mobile':
          if (value.length !== 10) {
            formData[`${key}_error`] = 'Minimum length is 10'
            canSubmit = false
          }
          break
        case 'aadhar':
          if (value.length !== 12) {
            formData[`${key}_error`] = 'Minimum length is 12'
            canSubmit = false
          }
          break
        case 'account_number':
        case 'c_account_number':
          if (value.length < 5) {
            formData[`${key}_error`] = 'Minimum length is 5'
            canSubmit = false
          }
          break
        case 'ifsc_code':
          if (value.length !== 11) {
            formData[`${key}_error`] = 'Minimum length is 11'
            canSubmit = false
          }
          break
        case 'dob':
          if (!isValidDate(value)) {
            formData[`${key}_error`] = 'Please enter a valid date'
            canSubmit = false
          } else if (calculateAge(value) < 18) {
            formData[`${key}_error`] = 'Minimum age required 18 years'
            canSubmit = false
          }
          break
        case 'tin_number':
          if (value.length < 8) {
            formData[`${key}_error`] = 'Minimum length is 8'
            canSubmit = false
          }
          break
        case 'email':
          if (!validateEmail(value)) {
            formData[`${key}_error`] = 'Invalid email'
            canSubmit = false
          }
          break
        case 'pincode':
          if (value.length !== PINCODE_LENGTH) {
            formData[`${key}_error`] = `Minimum length is ${PINCODE_LENGTH}`
            canSubmit = false
          }
          break
        case 'name':
        case 'father_name':
        case 'mother_name':
        case 'spouse_name':
          if (value.includes("  ")) {
            formData[`${key}_error`] = 'consecutive spaces are not allowed'
            canSubmit = false
          }
          break
        case 'nri_pincode':
          if (!validateAlphaNumeric(value)) {
            formData[`${key}_error`] = 'invalid pincode'
            canSubmit = false
          }
          break
        default:
          break
      }
    }
  }
  return { formData, canSubmit }
}

export const panUiSet = (pan) => {
  if (!pan) {
    return ''
  }

  let panNew =
    pan.substring(0, 5) + ' ' + pan.substring(5, 9) + ' ' + pan.substring(9, 10)

  return panNew
}

export const blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

export const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

export const combinedDocBlob = (fr, bc, docName) => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width = fr.width > bc.width ? fr.width : bc.width
  canvas.height = fr.height + bc.height
  context.fillStyle = 'rgba(255, 255, 255, 0.5)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(fr, 0, 0, fr.width, fr.height)
  context.drawImage(bc, 0, fr.height, bc.width, bc.height)

  let combined_image = dataURLtoBlob(canvas.toDataURL('image/jpeg'))
  let blob = blobToFile(combined_image, docName)
  return blob
}


export function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  var separator = uri.indexOf('?') !== -1 ? '&' : '?'
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2')
  } else {
    return uri + separator + key + '=' + value
  }
}

export const compareObjects = (keysToCheck, oldState, newState) => {
  let compare = true;
  keysToCheck.forEach((key) => {
    if (oldState[key] !== newState[key]) {
      compare = false;
    }
  });
  return compare;
};

export const getKycUserFromSession = () => {
  const kyc = storageService().getObject("kyc") || {};
  const user = storageService().getObject("user") || {};

  return { kyc, user };
}

export const getTotalPagesInPersonalDetails = (isEdit = false) => {
  const { kyc } = getKycUserFromSession();
  if (isEmpty(kyc)) {
    return "";
  }
  const isCompliant = kyc.kyc_status === "compliant";
  const isNri = kyc?.address?.meta_data?.is_nri || false;
  const dlCondition =
    !isCompliant &&
    !isNri &&
    kyc.dl_docs_status !== "" &&
    kyc.dl_docs_status !== "init" &&
    kyc.dl_docs_status !== null;
  let totalPages = 5;
  if (isNri && isCompliant) totalPages++;
  if (isEmailAndMobileVerified() && isEdit) totalPages--;
  if (dlCondition) totalPages--;
  return totalPages;
};

export const isEmailAndMobileVerified = () => {
  const { kyc } = getKycUserFromSession();
  if (isEmpty(kyc)) {
    return false;
  }
  return (
    kyc.identification?.meta_data?.email_verified &&
    kyc.identification?.meta_data?.mobile_number_verified
  );
};

export const isDigilockerFlow = (kyc = {}) => {
  if (isEmpty(kyc)) return false;
  return (
    kyc.kyc_status !== "compliant" &&
    !kyc.address.meta_data.is_nri &&
    kyc.dl_docs_status !== "" &&
    kyc.dl_docs_status !== "init" &&
    kyc.dl_docs_status !== null
  );
};

export async function checkDocsPending(kyc = {}) {
  if (isEmpty(kyc)) return false;
  let pendingDocs = [];

  const incompleteApplication = isIncompleteEquityApplication(kyc);

  if (incompleteApplication) {
    pendingDocs = await pendingDocsList(kyc);
    return !!pendingDocs.length;
  }

  return false;
}

export function isEquityEsignReady(kyc) {
  kyc = kyc || getKycUserFromSession().kyc;
  if (isEmpty(kyc)) return false;
  
  return (
    kyc.kyc_product_type === 'equity' &&
    kyc.equity_application_status === 'complete' &&
    kyc.equity_sign_status !== 'signed' &&
    isEquityAocPaymentCompleted(kyc)
  );
}

export async function pendingDocsList(kyc = {}) {
  if (isEmpty(kyc)) return false;
  let docsToCheck = ["equity_pan", "equity_identification", "address", "bank", "ipvvideo", "sign"];

  if (kyc?.address?.meta_data.is_nri) {
    docsToCheck.push("nri_address");
  }

  return docsToCheck.filter((doc) => {
    return (
      (doc !== "bank" && kyc[doc]?.doc_status !== "approved") ||
      (doc === "bank" && kyc[doc]?.meta_data?.bank_status !== "verified") 
    );
  });
}

export async function getPendingDocuments(kyc = {}) {
  if (isEmpty(kyc)) return false;
  const pendingDocs = await pendingDocsList(kyc)
  const pendingDocsMapper = pendingDocs.filter((group) => eqkycDocsGroupMapper[group]).map((group) => {
    let docType = "";
    if (group === "bank") {
      VERIFICATION_DOC_OPTIONS.forEach((option) => {
        if (option.value === kyc[group]?.meta_data?.doc_type) {
          docType = option.name;
        }
      });

      if (!docType) {
        docType = "Bank document"
      }
    }

    if (group === "address" || group === "nri_address") {
      ADDRESS_PROOF_OPTIONS.forEach((option) => {
        if (option.value === kyc[group]?.meta_data?.doc_type) {
          docType = option.name;
        }
      });

      if (!docType) {
        docType = "Address document"
      }
    }

    return {
      title: eqkycDocsGroupMapper[group]?.title,
      doc: eqkycDocsGroupMapper[group]?.doc || docType
    };
  });

  return pendingDocsMapper;
}

export function checkDLPanFetchStatus(kyc = {}) {
  if (isEmpty(kyc)) return false;
  return (
    kyc.all_dl_doc_statuses.pan_fetch_status === null ||
    kyc.all_dl_doc_statuses.pan_fetch_status === "" ||
    kyc.all_dl_doc_statuses.pan_fetch_status === "failed");
}

export function checkDLPanFetchAndApprovedStatus(kyc = {}) {
  if (isEmpty(kyc)) return false;
  const TRADING_ENABLED = isTradingEnabled(kyc)
  return (checkDLPanFetchStatus(kyc) && ((!TRADING_ENABLED && kyc.pan.doc_status !== "approved") ||
    (TRADING_ENABLED && kyc.equity_pan.doc_status !== "approved")));
}

export function isNotManualAndNriUser(kyc = {}) {
  if (isEmpty(kyc)) return false;
  return kyc.kyc_type !== "manual" && !kyc.address?.meta_data?.is_nri;
}

export function isDocSubmittedOrApproved(doc) {
  const { kyc = {} } = getKycUserFromSession(); 
  if (isEmpty(kyc)) return false;
  return kyc[doc]?.doc_status === "submitted" || kyc[doc]?.doc_status === "approved";
}

export const pollProgress = (timeout, interval, popup_window) => {
  const endTime = Number(new Date()) + (timeout || 3 * 1000 * 60);
  interval = interval || 1000;
  const dlSuccessStates = ["docs_fetched", "docs_fetch_failed"]
  let checkCondition = async function (resolve, reject) {
    if (popup_window.closed) {
      resolve({ status: "closed" });
    } else {
      try {
        const result = await getKyc();
        if (!isEmpty(result)) {
          if (dlSuccessStates.includes(result?.kyc?.dl_docs_status)) {
            resolve({ status: "success" });
          } else if (result.kyc?.all_dl_doc_statuses?.aadhaar_fetch_status === "failed") {
            resolve({ status: "failed" });
          } else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
          } else {
            reject({ status: "timeout" });
          }
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }
  };
  return new Promise(checkCondition);
}

export const getFlow = (kycData) => {
  let flow = "";
  if (kycData.kyc_status === 'compliant' && !isTradingEnabled(kycData)) {
    flow = 'premium onboarding'
  } else {
    if (isDigilockerFlow(kycData)) {
      flow = 'digi kyc'
    } else {
      flow = 'general'
    }
  }
  return flow;
}

export const isEquityApplSubmittedOrComplete = (kyc) => {
  if (isEmpty(kyc)) return false;
  return (kyc.equity_application_status === "submitted" || kyc.equity_application_status === "complete");
}

export const isMfApplSubmittedOrComplete = (kyc) => {
  if (isEmpty(kyc)) return false;
  return (kyc.application_status_v2 === "submitted" || kyc.application_status_v2 === "complete");
}

export const isEquityCompleted = () => {
  const kyc = storageService().getObject("kyc");
  if (isEmpty(kyc)) return false;

  return (kyc.equity_application_status === "complete" && kyc.equity_sign_status === "signed" && kyc.equity_investment_ready);
}

export const isIncompleteEquityApplication = (kyc) => {
  if (isEmpty(kyc)) return false;

  return (
    (kyc.application_status_v2 !== "submitted" && kyc.application_status_v2 !== "complete") ||
    (kyc.equity_application_status !== "submitted" && kyc.equity_application_status !== "complete") ||
    (isEquityApplSubmittedOrComplete(kyc) && kyc.equity_sign_status !== "signed")
  );
}

export const isKycCompleted = (kyc) => {
  if (isEmpty(kyc)) return false;

  if (kyc?.kyc_status === "compliant") {
    return kyc?.application_status_v2 === "complete";
  } else {
    return (
        kyc?.application_status_v2 === "complete" &&
      kyc.sign_status === "signed"
    );
  }
};

export const skipBankDetails = () => {
  const {kyc, user} = getKycUserFromSession();
  const TRADING_ENABLED = isTradingEnabled(kyc);

  return (
    (((!TRADING_ENABLED && isReadyToInvest()) || (TRADING_ENABLED && isEquityCompleted())) && user.active_investment) ||
    (kyc.bank.meta_data_status === "approved" && kyc.bank.meta_data.bank_status === "verified") ||
    kyc.bank.meta_data.bank_status === "doc_submitted"
  );
}

export const getGenderValue = (gender="", key="value") => {
  const generData = GENDER_OPTIONS.find(data => data.value === gender) || {};
  return generData[key] || "";
}

export function openInBrowser(url, type) {
  if(!url) {
      return;
  }

  const config = getConfig();

  // add new key value pair with same structure
  const mapper = {
    'download_kra_form' : {
        header_title: 'Download Forms',
        file_name: 'KRA_Form.pdf'
    }
  }

  const mapper_data = mapper[type];

  if(config.Android && !config.isWebOrSdk) {
    nativeCallback({
      action: 'download_on_device',
      message: {
        url: url || '',
        file_name: mapper_data.file_name
      }
    });
  } else {
    const data = {
        url: url,
        header_title: mapper_data.header_title,
        icon: 'close'
    };

    openPdfCall(data);
  }
};

export function openPdf(pdfLink, pdfType){
  if (getConfig().iOS){
      nativeCallback({
        action: 'open_inapp_tab',
        message: {
            url: pdfLink  || '',
            back_url: ''
        }
      });
  } else {
    openInBrowser(pdfLink, pdfType);
  }
}

export const getUpgradeAccountFlowNextStep = (kyc) => {
  const userType = kyc?.kyc_status;
  if (!isEmailAndMobileVerified()) {
    return PATHNAME_MAPPER.communicationDetails;
  } else {
    if (kyc?.bank?.meta_data_status === "approved" && kyc?.bank?.meta_data?.bank_status !== "verified") {
      return `/kyc/${userType}/bank-details`;
    } else {
      return PATHNAME_MAPPER.tradingExperience;
    }
  }
}

export const checkNomineeNameValidity = (kyc, nomineeName) => {
  const applicantName = (kyc?.pan?.meta_data?.name)?.replace(/\s/g, '');
  nomineeName = nomineeName?.replace(/\s/g, '');

  // Matches for https://fisdom.atlassian.net/browse/QA-1247
  if (nomineeName.match(new RegExp('^' + applicantName + '$', "i"))) {
    return "Nominee name cannot be same as your name";
  }
  return '';
}

export const isBankVerified = (bank = {}, kyc = {}) => {
  return (
    bank.bank_status === "verified" ||
    (bank.status === "default" && kyc.bank?.meta_data_status === "approved")
  );
};

export const isRetroMfIRUser = (kyc) => {
  return kyc.mf_kyc_processed;
};

export const isEquityAocPaymentCompleted = (kyc) => {
  return (
    kyc.equity_aoc_payment_status === "success" || !isEquityAocApplicable(kyc)
  );
};

export const validateAocPaymentAndRedirect = (kyc, navigate) => {
  if(isEquityAocPaymentCompleted(kyc)) {
    if (isEquityEsignReady(kyc)) {
      navigate(PATHNAME_MAPPER.kycEsign)
    } else {
      navigate(PATHNAME_MAPPER.documentVerification)
    }
  } else {
    navigate(PATHNAME_MAPPER.aocPaymentSummary);
  }
}

export const isUpgradeToEquityAccountEnabled = (kyc, kycStatus) => {
  if (!kycStatus) {
    kycStatus = getKycAppStatus(kyc).status;
  }
  return isTradingEnabled(kyc) && kyc?.kyc_product_type !== "equity" && kycStatus !== "mf_esign_pending";
};