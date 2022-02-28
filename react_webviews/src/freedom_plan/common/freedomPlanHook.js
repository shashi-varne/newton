import { useEffect, useState } from "react";
import { storageService } from "../../utils/validators";
import { getAllPlans, triggerPayment } from "./api";
import isEmpty from "lodash/isEmpty";
import { getBasePath, getConfig } from "../../utils/functions";
import { FREEDOM_PLAN_STORAGE_CONSTANTS, PATHNAME_MAPPER } from "./constants";
import { getActivePlans, getDefaultPlan, isNative } from "./functions";
import { getAccountSummary } from "../../kyc/services";

const DEFAULT_ERROR_DATA = {
  showError: false,
  title2: "",
};

/* eslint-disable */
function useFreedomDataHook(initializeData) {
  const planData = storageService().getObject("freedomPlanData") || {};
  const planList = storageService().getObject("freedomPlanList") || [];
  const planCharges = storageService().getObject("freedomPlanCharges") || {};
  const freedomPlanStatus = storageService().getObject(FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionStatus) || {};
  const [freedomPlanData, setFreedomPlanData] = useState(planData);
  const [freedomPlanList, setFreedomPlanList] = useState(planList);
  const [freedomPlanCharges, setFreedomPlanCharges] = useState(planCharges);
  const [subscriptionStatus, setSubscriptionStatus] = useState(freedomPlanStatus);
  const [showLoader, setShowLoader] = useState(false);
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_DATA);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setDefaultPlan();
  }, [freedomPlanList]);

  const initialize = () => {
    if (
      initializeData &&
      (isEmpty(freedomPlanList) || isEmpty(freedomPlanCharges))
    ) {
      getFreedomPlanList();
    }
  };

  const setDefaultPlan = () => {
    if (isEmpty(freedomPlanData)) {
      updateFreedomPlanData(getDefaultPlan(freedomPlanList));
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

  const getSubscriptionStatus = async () => {
    try {
      resetErrorData();
      setShowLoader(true);
      const result = await getAccountSummary({
        equity: ["subscription_status"],
      });
      const subscriptionStatus = result?.data?.equity?.subscription_status?.data || {};
      if(!isEmpty(subscriptionStatus)) {
        setSubscriptionStatus(subscriptionStatus);
      }
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: getSubscriptionStatus,
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
      }redirect_url=${redirectUrl}&partner_code=${config.code}`;
      const upiApps = storageService().getObject("upiApps") || {};
      const isSdkUpiDataAvailable = config.isSdk && ((config.Android && !isEmpty(upiApps)) || config.iOS)
      if (isNative() || isSdkUpiDataAvailable) {
        let nativeData = {
          intent_supported: true,
        };
        if (config.Android) {
          nativeData.upi_apps = upiApps;
        } else if (config.iOS) {
          nativeData.upi_others = true;
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

  const updateSubscriptionStatus = (data) => {
    storageService().setObject(FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionStatus, data);
    setSubscriptionStatus(data);
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
    subscriptionStatus,
    setErrorData,
    resetErrorData,
    initiatePayment,
    resetFreedomPlan,
    updateFreedomPlanData,
    updateSubscriptionStatus,
  };
}

export default useFreedomDataHook;
