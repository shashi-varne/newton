import { getConfig } from 'utils/functions'
import { calculateAge, isValidDate, validateEmail } from 'utils/validators'
import { isEmpty } from '../../utils/validators'

export function navigate(pathname, data = {}) {
  if (data?.edit) {
    this.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data?.state || null,
      params: data?.params || null,
    })
  } else {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data?.state,
      params: data?.params,
    })
  }
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
        // case 'account_number':
        // case 'c_account_number':
        //   if (value.length !== 16) {
        //     formData[`${key}_error`] = 'Minimum length is 16'
        //     canSubmit = false
        //   }
        //   break
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
          if(value.length !== 6) {
            formData[`${key}_error`] = 'Minimum length is 6'
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

export const getFlow = (kycData) => {
  let flow = "";
  let dlFlow = false;
  if (
    kycData.kyc_status !== 'compliant' &&
    !kycData.address?.meta_data?.is_nri &&
    kycData.dl_docs_status !== '' &&
    kycData.dl_docs_status !== 'init' &&
    kycData.dl_docs_status !== null
  ) {
    dlFlow = true;
  }
  if (kycData.kyc_status === 'compliant') {
    flow = 'premium onboarding'
  } else {
    if (dlFlow) {
      flow = 'digi kyc'
    } else {
      flow = 'general'
    }
  }
  return flow;
}

export const getDLFlow = (kycData) => {
  let dlFlow = false;
  if (
    kycData.kyc_status !== 'compliant' &&
    !kycData.address?.meta_data?.is_nri &&
    kycData.dl_docs_status !== '' &&
    kycData.dl_docs_status !== 'init' &&
    kycData.dl_docs_status !== null
  ) {
    dlFlow = true;
  }
  return dlFlow;
}
export const getTotalPagesInPersonalDetails = (kyc = {}, user = {}, isEdit = false) => {
  if (isEmpty(kyc) || isEmpty(user)) {
    return "";
  }
  const isCompliant = kyc.kyc_status === "compliant";
  const isNri = kyc?.address?.meta_data?.is_nri || false;
  const isEmailAndMobileVerified = getEmailOrMobileVerifiedStatus(kyc, user)
  const dlCondition =
    !isCompliant &&
    !isNri &&
    kyc.dl_docs_status !== "" &&
    kyc.dl_docs_status !== "init" &&
    kyc.dl_docs_status !== null;
  let totalPages = 5;
  if (isNri && isCompliant) totalPages++;
  if (isEmailAndMobileVerified && isEdit) totalPages--;
  if (dlCondition) totalPages--;
  return totalPages;
};

export const getEmailOrMobileVerifiedStatus = (kyc = {}, user = {}) => {
  if (isEmpty(kyc) || isEmpty(user)) {
    return false;
  }
  return (
    (user.email === null && kyc.identification?.meta_data?.email_verified) ||
    (user.mobile === null &&
      kyc.identification?.meta_data?.mobile_number_verified)
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
