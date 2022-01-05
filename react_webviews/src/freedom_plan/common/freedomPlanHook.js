import { useState } from "react";
import { storageService } from "../../utils/validators";
import Toast from "../../common/ui/Toast";
import { getPlanDetails } from "./api";
import isFunction from "lodash/isFunction";
import noop from "lodash/noop";

const DEFAULT_PLAN = {
  duration: 6,
  amount: 5999,
  isDefault: true,
};

function useFreedomDataHook() {
  const planData = storageService().getObject("freedomPlanData") || DEFAULT_PLAN;

  const [freedomPlanData, setFreedomPlanData] = useState(planData);
  const [showLoader, setShowLoader] = useState(false);

  const getFreedomPlanData = async (data, callback = noop) => {
    try {
      setShowLoader(true);
      const result = await getPlanDetails(data);
      setFreedomPlanDetails(result.plan_details);
      if (isFunction(callback)) {
        callback();
      }
    } catch (err) {
      Toast(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const setFreedomPlanDetails = (data) => {
    storageService().setObject("freedomPlanData", data);
    setFreedomPlanData(data);
  };

  return {
    showLoader,
    freedomPlanData,
    getFreedomPlanData,
  };
}

export default useFreedomDataHook;
