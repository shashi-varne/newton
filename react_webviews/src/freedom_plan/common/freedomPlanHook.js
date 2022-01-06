import { useState } from "react";
import { storageService } from "../../utils/validators";
import { getPlanDetails, triggerPayment } from "./api";
import isFunction from "lodash/isFunction";
import noop from "lodash/noop";
import { getBasePath, getConfig } from "../../utils/functions";
import { getDefaultPlan, PATHNAME_MAPPER } from "./constants";

const DEFAULT_ERROR_DATA = {
  showError: false,
  title2: "",
};

function useFreedomDataHook() {
  const planData = storageService().getObject("freedomPlanData") || getDefaultPlan();

  const [freedomPlanData, setFreedomPlanData] = useState(planData);
  const [showLoader, setShowLoader] = useState(false);
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_DATA);

  const getFreedomPlanData = async (data, callback = noop) => {
    try {
      setShowLoader("button");
      const result = await getPlanDetails(data);
      setFreedomPlanDetails(result.plan_details);
      if (isFunction(callback)) {
        callback();
      }
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: resetErrorData,
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

  const setFreedomPlanDetails = (data) => {
    storageService().setObject("freedomPlanData", data);
    setFreedomPlanData(data);
  };

  return {
    showLoader,
    freedomPlanData,
    errorData,
    setErrorData,
    initiatePayment,
    getFreedomPlanData,
    resetErrorData,
  };
}

export default useFreedomDataHook;
