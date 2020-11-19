import Api from '../../utils/api';
import { storageService, isEmpty } from 'utils/validators';
import { getConfig } from 'utils/functions';
const genericErrMsg = 'Something went wrong';

export const get_recommended_funds = async () => {
  const pc_urlsafe = getConfig().pc_urlsafe;

  try {
    const res = await Api.get(`/api/rebalance/${pc_urlsafe}/get_recommendations`);
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

export const request_order = async () => {
  const allFunds = storageService().getObject('allFunds');
  const checkMap = storageService().getObject('checkMap');
  const switch_orders = allFunds.filter((fund) => checkMap[fund.id]);
  const pc_urlsafe = getConfig().pc_urlsafe;

  try {
    const res = await Api.post(`/api/rebalance/action/${pc_urlsafe}/order`, {
      switch_orders: switch_orders,
    });
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;
    if (status === 200 || status === 202) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const resend_otp = async (link) => {
  try {
    const res = await Api.get(link);
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

export const verify_otp = async (trx, params) => {
  try {
    const res = await Api.post(`/api/rebalance/${trx}/order/verify?otp=${params.otp}`);
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
