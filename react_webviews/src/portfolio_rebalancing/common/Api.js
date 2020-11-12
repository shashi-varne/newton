import axios from 'axios';
import Api from '../../utils/api';
import { storageService, isEmpty } from 'utils/validators';
const genericErrMsg = 'Something went wrong';
const sip_only =
  'https://wreport-dot-plutus-staging.appspot.com/api/rebalance/ahBzfnBsdXR1cy1zdGFnaW5nchcLEgpQbHV0dXNVc2VyGIGAwISbs8ULDA/get_recommendations';
const new_user =
  'https://wreport-dot-plutus-staging.appspot.com/api/rebalance/ahBzfnBsdXR1cy1zdGFnaW5nchcLEgpQbHV0dXNVc2VyGIGAgK6GyJMKDA/get_recommendations';
const corpus =
  'https://wreport-dot-plutus-staging.appspot.com/api/rebalance/ahBzfnBsdXR1cy1zdGFnaW5nchcLEgpQbHV0dXNVc2VyGIGAwNS--swLDA/get_recommendations';
export const get_recommended_funds = async () => {
  try {
    // const { data: res } = await axios.get(
    //   'https://wreport-dot-plutus-staging.appspot.com/api/rebalance/ahBzfnBsdXR1cy1zdGFnaW5nchcLEgpQbHV0dXNVc2VyGIGAgIDZ1cYLDA/get_recommendations'
    // );
    const { data: res } = await axios.get(corpus);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    storageService().setObject('user_id', res.pfwuser_id);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const request_order = async () => {
  const checked_funds = storageService().getObject('checked_funds');
  try {
    const { data: res } = await axios.post(
      'https://wreport-dot-plutus-staging.appspot.com/api/rebalance/action/ahBzfnBsdXR1cy1zdGFnaW5nchcLEgpQbHV0dXNVc2VyGIGAwISbs8ULDA/order',
      {
        switch_orders: checked_funds,
      }
    );
    console.log('data', res);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      console.log('the error is here');
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;
    console.log(result);
    if (status === 200 || status === 202) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const resend_otp = async (link) => {
  const checked_funds = storageService().getObject('checked_funds');
  try {
    const { data: res } = await axios.get(`https://wreport-dot-plutus-staging.appspot.com${link}`);
    console.log('data', res);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      console.log('the error is here');
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const verify_otp = async (trx, params) => {
  console.log(params);
  try {
    const {
      data: res,
    } = await axios.post(
      `https://wreport-dot-plutus-staging.appspot.com/api/rebalance/${trx}/order/verify`,
      null,
      { params }
    );
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      console.log('the error is here');
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;
    console.log('result', result);
    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    console.log(err);

    throw err;
  }
};
