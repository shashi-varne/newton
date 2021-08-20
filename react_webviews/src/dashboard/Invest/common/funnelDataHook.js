import { useState } from 'react'
import { storageService } from "../../../utils/validators";
import { isArray } from 'lodash';
import { get_recommended_funds } from './api';

function useFunnelDataHook() {
  const sessionFunnelData = storageService().getObject('funnelData') || {};
  const sessionFunnelGoalData = storageService().getObject('funnelGoalData') || {};
  const sessionFunnelReturnRates = storageService().getObject('funnelReturnRates') || {};
  const sessionUserRiskProfile = storageService().get('userSelectedRisk') || '';
  
  const [funnelData, funnelDataSetter] = useState(sessionFunnelData);
  const [funnelGoalData, funnelGoalDataSetter] = useState(sessionFunnelGoalData);
  const [funnelReturnRates, funnelReturnRatesSetter] = useState(sessionFunnelReturnRates);
  const [userRiskProfile, userRiskProfileSetter] = useState(sessionUserRiskProfile);

  const initFunnelData = async ({ apiParams, appendToFunnelData }) => {
    const data = await get_recommended_funds(apiParams);

    const { recommendation } = data;
    if (recommendation && !isArray(recommendation)) {
      if (recommendation.goal) {
        setFunnelGoalData(recommendation.goal);
        setFunnelReturnRates({
          stockReturns: recommendation.expected_return_eq || 10,
          bondReturns: recommendation.expected_return_debt || 6.5
        });
      }
      
      setFunnelData({
        ...data,
        equity: recommendation.equity,
        debt: recommendation.debt,
        ...appendToFunnelData
      });
    } else {
      setFunnelReturnRates({
        stockReturns: data.expected_return_eq || 10,
        bondReturns: data.expected_return_debt || 6.5
      });
      setFunnelData({
        ...data,
        ...appendToFunnelData
      });
    }
  };

  const setFunnelData = (data) => {
    console.log('data', data);
    storageService().setObject('funnelData', data);
    funnelDataSetter(data);
  };

  const setFunnelGoalData = (data) => {
    storageService().setObject('funnelGoalData', data);
    funnelGoalDataSetter(data);
  };

  const setFunnelReturnRates = (data) => {
    storageService().setObject('funnelReturnRates', data);
    funnelReturnRatesSetter(data);
  };

  const setUserRiskProfile = (data) => {
    storageService().set('userSelectedRisk', data);
    userRiskProfileSetter(data);
  };
  
  const updateFunnelData = (propsToAppend) => {
    const newFunnelData = { ...funnelData, ...propsToAppend };
    setFunnelData(newFunnelData);
  };

  return {
    funnelData,
    funnelGoalData,
    funnelReturnRates,
    userRiskProfile,
    initFunnelData,
    setFunnelData,
    setFunnelGoalData,
    setFunnelReturnRates,
    setUserRiskProfile,
    updateFunnelData,
  };
}

export default useFunnelDataHook;
