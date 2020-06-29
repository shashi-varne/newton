import Api from '../../utils/api';
import FHC from '../FHCClass'; 

export const fetchFHCData = async () => {
  try {
    const res = await Api.get('page/financialhealthcheck/edit/mine', {
      format: 'json',
    });
    const { result: fhc_data, status_code: status } = res.pfwresponse;
    if (status === 200) {
      return new FHC(fhc_data);
    } else {
      throw (fhc_data.error || fhc_data.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const uploadFHCData = async (fhc_data, ignoreErr) => {
  try {
    const res = await Api.post('api/financialhealthcheck/mine', fhc_data);
    const { result, status_code: status } = res.pfwresponse;

    if (status !== 200 && !ignoreErr) {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
    return result;
  } catch (e) {
    throw e;
  }
}

export const fetchFHCReport = async () => {
  try {
    const res = await Api.get('page/financialhealthcheck/view/mine', {
      format: 'json',
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

