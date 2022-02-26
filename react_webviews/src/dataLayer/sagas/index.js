import { all } from 'redux-saga/effects';
import sagaFetchFundDetails from './fundDetailsSaga';
import diySaga from './diySaga';

export default function* rootSaga() {
	yield all([sagaFetchFundDetails(), diySaga()]);
}
