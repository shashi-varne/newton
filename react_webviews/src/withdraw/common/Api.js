import Api from '../../utils/api'
import { isEmpty } from 'utils/validators'
const genericErrMsg = 'Something went wrong'

export const getWithdrawReasons = async () => {
  try {
    const res = await Api.get('api/user-consent/redemption')
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const postWithdrawReasons = async (params) => {
  try {
    const res = await Api.post('api/user-consent/redemption', params)
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const getTaxes = async (params) => {
  
  try {
    const res = await Api.post('api/invest/withdrawal/get_taxes', params);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const postSwitchOrders = async (params) => {
  
  try {
    const res = await Api.post('api/invest/switch/orders', params);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const getRecommendedSwitch = async (amount) => {
  try {
    const res = await Api.get(`api/invest/switch/systematic/recommend?amount=${amount}`);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const getRecommendedFund = async (type, amount = null) => {
  try {
    let api = `api/invest/redeem/recommendv3/mine/${type}`
    if (amount) {
      api += `?amount=${amount}`
    }
    const res = await Api.get(api);
    if (
      !res?.pfwresponse || res.pfwresponse.status_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      if(type === 'insta-redeem' && res.pfwresponse.status_code !== 200){
        throw res;
      } else {
        throw genericErrMsg
      }
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const getBalance = async () => {
  const url = `api/invest/redeem/recommendv3/mine/balance`
  const res = await Api.get(url)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse

  if (status === 200) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}

export const redeemOrders = async (type, params) => {
  const url = `api/invest/redeem/orderv3/mine/${type}`
  const res = await Api.post(url, params)
  if (res.pfwstatus_code >= 400 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse

  if (status === 200 || status === 202) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}

export const verify = async (url, otp) => {
  const res = await Api.post(`${url}?otp=${otp}`)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse
  if (status === 200) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}

export const resend = async (url) => {
  const res = await Api.get(url)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse
  if (status === 200) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}



