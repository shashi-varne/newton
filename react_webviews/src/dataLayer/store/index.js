import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas';
import combinedReducers from './dataStore/reducers';


const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: combinedReducers,
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(sagas);