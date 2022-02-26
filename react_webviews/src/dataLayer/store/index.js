import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import sagas from 'businesslogic/dataStore/sagas';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import combinedReducers from 'businesslogic/dataStore/reducers';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['error', 'loader'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [sagaMiddleware]
});

export default store;
export const persistor = persistStore(store);

sagaMiddleware.run(sagas);
