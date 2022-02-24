import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import sagas from 'businesslogic/dataStore/sagas';
import combinedReducers from 'businesslogic/dataStore/reducers';


const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: combinedReducers,
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(sagas);