import { createAction, createReducer } from '@reduxjs/toolkit';

const Actions = {
  setMfOrders: 'setMfOrders',
  filterMfOrders: 'filterMfOrders',
  getfundOrderDetails: 'getfundOrderDetails',
  setDiyCart: 'setDiyCart',
  setFundOrderDetails: 'setFundOrderDetails',
};

// Actions
export const setMfOrders = createAction(Actions.setMfOrders);
export const filterMfOrders = createAction(Actions.filterMfOrders);
export const setDiyCart = createAction(Actions.setDiyCart);
export const getfundOrderDetails = createAction(Actions.getfundOrderDetails);
export const setFundOrderDetails = createAction(Actions.setFundOrderDetails);

const initialState = {
  diyCart: {},
  mfOrders: {},
  fundOrderDetails: [],
};

export default createReducer(initialState, (builder) => {
  builder.addCase(setMfOrders, (state, action) => {
    state.mfOrders = { ...state.mfOrders, ...action.payload };
  });
  builder.addCase(filterMfOrders, (state, action) => {
    state.mfOrders = action.payload;
  });
  builder.addCase(setDiyCart, (state, action) => {
    state.diyCart = { ...state.diyCart, ...action.payload };
  });
  builder.addCase(setFundOrderDetails, (state, action) => {
    state.fundOrderDetails = action.payload;
  });
});
