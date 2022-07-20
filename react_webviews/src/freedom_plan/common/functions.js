import { storageService } from "../../utils/validators";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { FREEDOM_PLAN_STORAGE_CONSTANTS } from "./constants";

export const getDefaultPlan = (plans = []) => {
  return plans.find((data) => data.is_default) || {};
};

export const getActivePlans = (plans = []) => {
  return plans.filter((data) => data.is_active) || {};
};

export const isNative = () => storageService().getBoolean("native");

export const handleExit = (props) => {
  if (isNative()) {
    nativeCallback({ action: "exit_web" });
  } else {
    const navigate = navigateFunc.bind(props);
    const storageKey = FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionFromMyAccount
    const fromMyAccountFlow = storageService().getBoolean(storageKey);
    if (fromMyAccountFlow) {
      storageService().setBoolean(storageKey, false);
      navigate("/my-account");
    } else {
      navigate("/");
    }
  }
};
