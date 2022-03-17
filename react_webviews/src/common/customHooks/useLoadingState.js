import { shallowEqual, useSelector } from "react-redux";
import {
  getButtonLoading,
  getPageLoading,
  getLoadingData,
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

  const loadingData = useSelector(
    (state) => getLoadingData(state, currentScreen),
    shallowEqual
  );

  return { isPageLoading, isButtonLoading, loadingData };
};

export default useLoadingState;
