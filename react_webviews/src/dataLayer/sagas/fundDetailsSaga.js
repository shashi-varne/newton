import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchFundDetails, setFundDetails } from '../store/dataStore/reducers/fundDetails';
import { fetch_fund_details } from 'businesslogic/apis/fundDetails';
import Api from '../../utils/api';

export default function* sagaFetchFundDetails() {
  yield takeLatest(fetchFundDetails.toString(), handleFetchFundDetails);
};

function* handleFetchFundDetails({payload}) {
  try {
    const fundData = yield call(fetch_fund_details,Api,payload);
    const textReport = fundData?.text_report[0];
    yield put(setFundDetails(textReport));
  } catch (err) {
    console.log('error is', err);
  }
};
