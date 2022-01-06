import { useEffect, useState } from "react";
import { storageService } from "../../utils/validators";
import { getAllPlans, triggerPayment } from "./api";
import isEmpty from "lodash/isEmpty";
import { getBasePath, getConfig } from "../../utils/functions";
import { getDefaultPlan, PATHNAME_MAPPER } from "./constants";

const DEFAULT_ERROR_DATA = {
  showError: false,
  title2: "",
};

function useFreedomDataHook() {
  const planData = storageService().getObject("freedomPlanData") || getDefaultPlan();
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
      const defaultPlan = freedomPlanList.find((data) => data.is_default) || {};
      setFreedomPlanData(defaultPlan);
    }
  };

  const getFreedomPlanList = async () => {
    try {
      resetErrorData();
      setShowLoader(true);
      const result = await getAllPlans();
      setFreedomPlanList(result.plan_details);
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

  return {
    showLoader,
    freedomPlanData,
    errorData,
    freedomPlanList,
    setErrorData,
    initiatePayment,
    resetErrorData,
    updateFreedomPlan,
  };
}

export default useFreedomDataHook;
