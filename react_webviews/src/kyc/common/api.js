import Api from 'utils/api'
import { apiConstants, storageConstants } from '../constants'
import { isEmpty } from 'utils/validators'
import { storageService } from 'utils/validators'
import toast from 'common/ui/Toast'
import { getConfig } from 'utils/functions'

const genericErrorMessage = 'Something Went wrong!'

export const handleApi = (res) => {
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw new Error( res?.pfwmessage || genericErrorMessage);
    }
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      return result;
    } else {
      throw new Error( result.error || result.message || genericErrorMessage );
    }
};

export const getUserKycFromSummary = async () => {
  try {
    const res = await Api.post(apiConstants.accountSummary, {
      kyc: ['kyc'],
      user: ['user'],
    })
    const result = handleApi(res)
    if(result) {
      let user = result.data.user.user.data
      let kyc = result.data.kyc.kyc.data
      storageService().setObject(storageConstants.KYC, kyc)
      storageService().setObject(storageConstants.USER, user)
    }
    return result;
  } catch (err) {
    console.log(err)
  }
}

export const getPan = async (data, accountMerge) => {
  const res = await Api.post(apiConstants.getPan, data)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error (res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result
    case 402:
      await accountMerge()
      break
    case 403:
      toast('Network error')
      return
    default:
      throw new Error (result.error || result.message || genericErrorMessage);
  }
}

export const checkMerge = async (pan) => {
  const res = await Api.post(
    `/api/user/account/merge?pan_number=${pan}&verify_only=true`
  )
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error( res?.pfwmessage || genericErrorMessage);
  }
  return res.pfwresponse;
}

export const kycSubmit = async (body) => {
  const res = await Api.post(apiConstants.submit, {
    ...body,
  })
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error( res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      if (result.kyc.identification.meta_data.nationality)
        result.kyc.identification.meta_data.nationality = result.kyc.identification.meta_data.nationality.toUpperCase()
      storageService().setObject(storageConstants.KYC, result.kyc)
      storageService().setObject(storageConstants.USER, result.user)
      return result
    case 402:
      const email = getConfig().email
      let name = 'fisdom'
      if (getConfig().productName === 'finity') {
        name = 'finity'
      }
      const msg = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`
      toast(msg)
      break
    default:
      throw new Error(result.error || result.message || 'Server error')
  }
}

export const getMyAccount = async () => {
  const res = await Api.get(apiConstants.getMyaccount)
  return handleApi(res);
}

export const getIFSC = async (data) => {
  const res = await Api.get(`${apiConstants.getIFSC}${data}`)
  return handleApi(res);
}

export const addAdditionalBank = async (data) => {
  const res = await Api.post(apiConstants.addAdditionalBank, data)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error (res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result
    default:
      throw new Error(result.message || result.error || genericErrorMessage);
  }
}

export const upload = async (file, type, data = {}) => {
  const formData = new FormData()
  formData.set('res', file)
  let addressProofKey = ''
  if (!isEmpty(data)) {
    switch (type) {
      case 'ipvvideo':
        formData.append('ipv_code', data.ipv_code)
        break
      case 'address':
        addressProofKey = data?.addressProofKey
        break
      case 'nri_address':
       addressProofKey = data?.addressProofKey
       break
       default:
         break
    }
  }
  const url = isEmpty(addressProofKey) ? `/api/kyc/v2/doc/mine/${type}` : `/api/kyc/v2/doc/mine/${type}/${addressProofKey}`
  const res = await Api.post(url, formData)
  if (
    res.pfwresponse.status_code === 200 &&
    res.pfwresponse.result.message === 'success'
  ) {
    return res.pfwresponse.result
  }
  throw new Error(
    res?.pfwresponse?.result?.message ||
      res?.pfwresponse?.result?.error ||
      genericErrorMessage
  )
}

export const saveBankData = async (data) => {
  const res = await Api.post(apiConstants.pennyVerification, data)
  return handleApi(res);
}

export const getBankStatus = async (data) => {
  const res = await Api.post(apiConstants.getBankStatus, data)
  return handleApi(res);
}

export const getCVL = async (data) => {
  const res = await Api.post(apiConstants.getCVL, data)
  return handleApi(res);
}

export const uploadBankDocuments = async (file, type, bank_id) => {
  const formData = new FormData()
  formData.set('res', file)
  formData.set('bank_id', bank_id)
  const res = await Api.post(`api/kyc/v2/doc/mine/bank/${type}`, formData)
  return handleApi(res);
}

export const getPinCodeData = async (pincode) => {
  const url = `api/pincode/${pincode}`
  const res = await Api.get(url)
  if (res.pfwresponse.status_code === 200) {
    return res.pfwresponse.result
  }
  throw new Error(
    res?.pfwresponse?.result?.message ||
      res?.pfwresponse?.result?.error ||
      genericErrorMessage
  )
}

export const submit = async (data) => {
  const url = `/api/kyc/v2/mine`
  const res = await Api.post(url, data)
  if (
    res.pfwresponse.status_code === 200 &&
    res.pfwresponse.result.message === 'success'
  ) {
    const result = res.pfwresponse.result
    if (result.kyc.identification.meta_data.nationality) {
      result.kyc.identification.meta_data.nationality = result.kyc.identification.meta_data.nationality.toUpperCase()
    }
    storageService().setObject('kyc', result.kyc)
    storageService().setObject('user', result.user)
    return result
  }
  throw new Error(
    res?.pfwresponse?.result?.message ||
      res?.pfwresponse?.result?.error ||
      genericErrorMessage
  )
}

export const getIpvCode = async () => {
  const url = `api/kyc/ipv_code`
  const res = await Api.get(url)
  if (res.pfwresponse.status_code === 200) {
    return res.pfwresponse.result
  }
  throw new Error(
    res?.pfwresponse?.result?.message ||
      res?.pfwresponse?.result?.error ||
      genericErrorMessage
  )
}

export const setKycType = async (type) => {
  const url = `api/kyc/user/set_kyc_type?kyc_type=${type}`;
  const res = await Api.get(url);
  if (res.pfwresponse.status_code === 200) {
    const result = res.pfwresponse.result;
    storageService().setObject('kyc', result.kyc);
    storageService().setObject('user', result.user);
    return result;
  }
  throw new Error(
    res?.pfwresponse?.result?.message ||
      res?.pfwresponse?.result?.error ||
      genericErrorMessage
  )
}

export const getMerge = async (pan_number) => {
  const res = await Api.post(`${apiConstants.getMerge}${pan_number}`)
  return handleApi(res);
}
