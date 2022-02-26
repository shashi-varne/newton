import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { fetchfundsInfo } from '../../pages/DIY/api';
import {
  getfundOrderDetails,
  setFundOrderDetails,
} from '../store/dataStore/reducers/diy';
import merge from 'lodash/merge';
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';

export default function* handleDiySagas() {
  yield takeEvery(getfundOrderDetails.toString(), handleFetchSipLumpsumOrderDetails);
}

function* handleFetchSipLumpsumOrderDetails({ payload }) {
  const { Api, isins, fundsData } = payload;
  try {
    const sipDetails = yield call(fetchfundsInfo, Api, 'sip', isins);
    const newSipData = sipDetails?.funds_data?.map((el) => {
      return {
        ...el,
        addl_purchase: {
          sip: el.addl_purchase,
        },
      };
    });
    const lumpsumDetails = yield call(fetchfundsInfo, Api, 'onetime', isins);
    const newLumpsumData = lumpsumDetails?.funds_data?.map((el) => {
      return {
        ...el,
        addl_purchase: {
          lumpsum: el.addl_purchase,
        },
      };
    });
    const merged = merge(
      keyBy(fundsData, 'isin'),
      keyBy(newSipData, 'isin'),
      keyBy(newLumpsumData, 'isin')
    );
    yield put(setFundOrderDetails(values(merged)));
  } catch (err) {
    console.log('error is', err);
  }
}
