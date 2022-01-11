import { useEffect, useState } from "react";
import { storageService } from "../../utils/validators";
import { getAllPlans, triggerPayment } from "./api";
import isEmpty from "lodash/isEmpty";
import { getBasePath, getConfig } from "../../utils/functions";
import { PATHNAME_MAPPER } from "./constants";
import { getActivePlans, getDefaultPlan, isNative } from "./functions";

const DEFAULT_ERROR_DATA = {
  showError: false,
  title2: "",
};

/* eslint-disable */
function useFreedomDataHook(initializeData) {
  const planData = storageService().getObject("freedomPlanData") || {};
  const planList = storageService().getObject("freedomPlanList") || [];
  const planCharges = storageService().getObject("freedomPlanCharges") || {};

  const [freedomPlanData, setFreedomPlanData] = useState(planData);
  const [freedomPlanList, setFreedomPlanList] = useState(planList);
  const [freedomPlanCharges, setFreedomPlanCharges] = useState(planCharges);
  const [showLoader, setShowLoader] = useState(false);
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_DATA);

  useEffect(() => {
    if(initializeData) {
      initialize();
    }
  }, []);

  useEffect(() => {
    setDefaultPlan();
  }, [freedomPlanList]);

  const initialize = () => {
    if (isEmpty(freedomPlanList) || isEmpty(freedomPlanCharges)) {
      getFreedomPlanList();
    }
  };

  const setDefaultPlan = () => {
    if (isEmpty(freedomPlanData)) {
      setFreedomPlanData(getDefaultPlan(freedomPlanList));
    }
  };

  const getFreedomPlanList = async () => {
    try {
      resetErrorData();
      setShowLoader(true);
      const result = await getAllPlans();
      const activePlans = getActivePlans(result.plan_details);
      updateFreedomPlanList(activePlans);
      updateFreedomPlanCharges(result.equity_account_charges);
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: getFreedomPlanList,
      });
    } finally {
      setShowLoader(false);
    }
  };

  const initiatePayment = async (data) => {
    try {
      setShowLoader("button");
      const result = await triggerPayment(data);
      setShowLoader("page");
      const config = getConfig();
      const redirectUrl = encodeURIComponent(
        `${getBasePath()}${PATHNAME_MAPPER.paymentStatus}${config.searchParams}`
      );
      let paymentLink = result.payment_link;
      paymentLink = `${paymentLink}${
        paymentLink.match(/[\?]/g) ? "&" : "?"
      }redirect_url=${redirectUrl}`;
      if (isNative()) {
        const upiApps = storageService().getObject("upiApps") || {};
        let nativeData = {
          intent_supported: true,
        };
        if (config.Android) {
          nativeData.upi_apps = upiApps;
        }
        nativeData = JSON.stringify(nativeData);
        paymentLink = `${paymentLink}&payment_data=${encodeURI(nativeData)}`;
      }
      window.location.href = paymentLink;
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: resetErrorData,
      });
      setShowLoader(false);
    }
  };

  const resetErrorData = () => {
    setErrorData(DEFAULT_ERROR_DATA);
  };

  const updateFreedomPlanData = (data) => {
    storageService().setObject("freedomPlanData", data);
    setFreedomPlanData(data);
  };

  const updateFreedomPlanList = (data) => {
    storageService().setObject("freedomPlanList", data);
    setFreedomPlanList(data);
  };

  const updateFreedomPlanCharges = (data) => {
    storageService().setObject("freedomPlanCharges", data);
    setFreedomPlanCharges(data);
  };

  const resetFreedomPlan = () => {
    updateFreedomPlanData({});
    updateFreedomPlanList([]);
    updateFreedomPlanCharges({});
  };

  return {
    showLoader,
    freedomPlanData,
    errorData,
    freedomPlanList,
    freedomPlanCharges,
    setErrorData,
    resetErrorData,
    initiatePayment,
    resetFreedomPlan,
    updateFreedomPlanData,
  };
}

export default useFreedomDataHook;
