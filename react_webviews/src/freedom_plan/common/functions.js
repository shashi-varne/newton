import { storageService } from "../../utils/validators";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

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
    const fromMyAccountFlow = storageService().getBoolean("subscriptionFromMyAccount");
    if (fromMyAccountFlow) {
      storageService().setBoolean("subscriptionFromMyAccount", false);
      navigate("/my-account");
    } else {
      navigate("/");
    }
  }
};
