import { useEffect, useState } from "react";
import { storageService } from "../../utils/validators";
import { getAllPlans, triggerPayment } from "./api";
import isEmpty from "lodash/isEmpty";
import { getBasePath, getConfig } from "../../utils/functions";
import { PATHNAME_MAPPER } from "./constants";
import { getActivePlans, getDefaultPlan } from "./functions";

const DEFAULT_ERROR_DATA = {
  showError: false,
  title2: "",
};

/* eslint-disable */
function useFreedomDataHook() {
  const planData = storageService().getObject("freedomPlanData") || {};
  const planList = storageService().getObject("freedomPlanList") || [];

  const [freedomPlanData, setFreedomPlanData] = useState(planData);
  const [freedomPlanList, setFreedomPlanList] = useState(planList);
  const [showLoader, setShowLoader] = useState(false);
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_DATA);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setDefaultPlan();
  }, [freedomPlanList]);

  const initialize = () => {
    if (isEmpty(freedomPlanList)) {
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

  const updateFreedomPlan = (data) => {
    storageService().setObject("freedomPlanData", data);
    setFreedomPlanData(data);
  };

  const updateFreedomPlanList = (data) => {
    storageService().setObject("freedomPlanList", data);
    setFreedomPlanList(data);
  };

  const resetFreedomPlan = () => {
    updateFreedomPlan({});
    updateFreedomPlanList([]);
  }

  return {
    showLoader,
    freedomPlanData,
    errorData,
    freedomPlanList,
    setErrorData,
    initiatePayment,
    resetErrorData,
    updateFreedomPlan,
    resetFreedomPlan,
  };
}

export default useFreedomDataHook;
