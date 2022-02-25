import {createAction, createReducer} from '@reduxjs/toolkit';

const Actions = {
    fetchFundDetails: 'fetchFundDetails',
    setFundDetails: 'setFundDetails',
    setInvestmentType: 'investmentType',
    setInvestmentPeriod: 'setInvestmentPeriod',
    setInvestedAmount: 'setInvestedAmount',
    setExpectedAmount: 'setExpectedAmount',
    setExpectedReturnPerc: 'setExpectedReturnPerc',
    setAmount: 'setAmount',
};

// Actions
export const fetchFundDetails = createAction(Actions.fetchFundDetails);
export const setFundDetails = createAction(Actions.setFundDetails);
export const setInvestmentType = createAction(Actions.setInvestmentType);
export const setInvestmentPeriod = createAction(Actions.setInvestmentPeriod);
export const setInvestedAmount = createAction(Actions.setInvestedAmount);
export const setExpectedAmount = createAction(Actions.setExpectedAmount);
export const setExpectedReturnPerc = createAction(Actions.setExpectedReturnPerc);
export const setAmount = createAction(Actions.setAmount);


export const getFundData = (state) => {
    return state?.fundDetails?.fundData;
}

const defaultSipAmount = 1000;
const defaultLumpsumAmount = 10000;
const defaultInvestmentType = 'sip';

const initialState = {
    fundData: {},
    investmentType: defaultInvestmentType,
    sip: defaultSipAmount,
    lumpsum: defaultLumpsumAmount,
    investmentPeriod: 5,
    investedAmount: 0,
    expectedAmount: 0,
    expectedReturnPerc: 0,
};

export default createReducer(initialState, builder => {
    builder.addCase(setFundDetails, (state, action) => {
        state.fundData = action.payload;
    });
    builder.addCase(setInvestmentType, (state, action) => {
        state.investmentType = action.payload;
    })
    builder.addCase(setInvestmentPeriod, (state, action) => {
        state.investmentPeriod = action.payload;
    })
    builder.addCase(setInvestedAmount, (state, action) => {
        state.investedAmount = action.payload;
    })
    builder.addCase(setExpectedAmount, (state, action) => {
        state.expectedAmount = action.payload;
    })
    builder.addCase(setExpectedReturnPerc, (state, action) => {
        state.expectedReturnPerc = action.payload;
    })
    builder.addCase(setAmount, (state, action) => {
        state[state.investmentType] = action.payload;
    })
});