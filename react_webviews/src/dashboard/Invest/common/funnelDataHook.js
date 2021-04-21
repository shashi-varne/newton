import { useState, useEffect } from 'react'
import { storageService } from "../../../utils/validators";
import { isArray } from 'lodash';
import { get_recommended_funds } from './api';

function useFunnelDataHook() {
  const sessionFunnelData = storageService().getObject('funnelData') || {};
  const sessionFunnelGoalData = storageService().getObject('funnelGoalData') || {};
  const sessionFunnelReturnRates = storageService().getObject('funnelReturnRates') || {};
  const sessionUserRiskProfile = storageService().get('userSelectedRisk') || '';
  
  const [funnelData, setFunnelData] = useState(sessionFunnelData);
  const [funnelGoalData, setFunnelGoalData] = useState(sessionFunnelGoalData);
  const [funnelReturnRates, setFunnelReturnRates] = useState(sessionFunnelReturnRates);
  const [userRiskProfile, setUserRiskProfile] = useState(sessionUserRiskProfile);

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

  useEffect(() => {
    storageService().setObject('funnelReturnRates', funnelReturnRates);
  }, [funnelReturnRates]);

  useEffect(() => {
    storageService().setObject('funnelGoalData', funnelGoalData);
  }, [funnelGoalData]);

  useEffect(() => {
    storageService().setObject('funnelData', funnelData);
  }, [funnelData]);
  
  useEffect(() => {
    storageService().set('userSelectedRisk', userRiskProfile);
  }, [userRiskProfile]);
  
  const updateFunnelData = (propsToAppend) => {
    const newFunnelData = { ...funnelData, ...propsToAppend };
    setFunnelData(newFunnelData);
  }

  const updateUserRiskProfile = (risk) => {
    setUserRiskProfile(risk);
  }

  return {
    funnelData,
    funnelGoalData,
    funnelReturnRates,
    userRiskProfile,
    initFunnelData,
    updateFunnelData,
    updateUserRiskProfile,
  };
}

export default useFunnelDataHook;
