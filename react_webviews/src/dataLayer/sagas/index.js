import { all } from 'redux-saga/effects';
import sagaFetchFundDetails from './fundDetailsSaga';

export default function* rootSaga() {
	yield all([sagaFetchFundDetails()]);
}
