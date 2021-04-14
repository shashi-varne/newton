import React, { useState, useEffect } from 'react'
import { storageService } from "../../../utils/validators";
import { isEmpty, isArray } from 'lodash';
import { get_recommended_funds } from './api';

function useFunnelDataHook() {
  const sessionFunnelData = storageService().getObject('funnelData') || {};
  const sessionFunnelGoalData = storageService().getObject('funnelGoalData') || {};
  const sessionFunnelReturnRates = storageService().getObject('funnelReturnRates') || {};
  
  const [funnelData, setFunnelData] = useState(sessionFunnelData);
  const [funnelGoalData, setFunnelGoalData] = useState(sessionFunnelGoalData);
  const [funnelReturnRates, setFunnelReturnRates] = useState(sessionFunnelReturnRates);
  const [isLoading, setIsLoading] = useState(function () {
    if (isEmpty(funnelData) || isEmpty(funnelGoalData)) {
      return true;
    }
    return false;
  });

  const initFunnelData = async (type) => {
    const data = await get_recommended_funds({ type });
    setIsLoading(false);

    const { recommendation } = data;
    if (recommendation && !isArray(recommendation)) {
      if (recommendation.goal) {
        setFunnelGoalData(recommendation.goal);
        setFunnelReturnRates({
          stockReturns: recommendation.expected_return_eq || 10,
          bondReturns: recommendation.expected_return_debt || 6.5
        });
        setFunnelData({
          ...data,
          equity: recommendation.equity,
          debt: recommendation.debt,
        });
      }
    } else {
      setFunnelReturnRates({
        stockReturns: data.expected_return_eq || 10,
        bondReturns: data.expected_return_debt || 6.5
      });
      setFunnelData(data);
    }
  };

  useEffect(() => {
    storageService().setObject('funnelReturnRates', funnelReturnRates);
  }, [funnelReturnRates]);

  useEffect(() => {
    storageService().setObject('funnelGoalData', funnelGoalData);
  }, [funnelGoalData]);

  useEffect(() => {
    storageService().setObject('funnelData', funnelGoalData);
  }, [funnelGoalData]);

  const updateFunnelData = (propsToAppend) => {
    const newFunnelData = { ...funnelData, ...propsToAppend };
    setFunnelData(newFunnelData);
  }

  return {
    isLoading,
    funnelData,
    funnelGoalData,
    funnelReturnRates,
    updateFunnelData,
    initFunnelData
  };
}

export default useFunnelDataHook;
