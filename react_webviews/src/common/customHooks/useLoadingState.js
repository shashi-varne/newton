import { shallowEqual, useSelector } from "react-redux";
import {
  getButtonLoading,
  getPageLoading,
} from "businesslogic/dataStore/reducers/loader";

const useLoadingState = (currentScreen) => {
  const isPageLoading = useSelector(
    (state) => getPageLoading(state, currentScreen),
    shallowEqual
  );

  const isButtonLoading = useSelector(
    (state) => getButtonLoading(state, currentScreen),
    shallowEqual
  );

  return { isPageLoading, isButtonLoading };
};

export default useLoadingState;
