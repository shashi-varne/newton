import { all } from 'redux-saga/effects';
import diySaga from './diySaga';

export default function* rootSaga() {
  yield all([diySaga()]);
}
