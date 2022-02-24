import { useEffect, useRef } from "react";
import { isEmpty } from "lodash-es";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  setError,
  getError,
  getErrorMessage,
  getFetchFailed,
  getUpdateFailed,
} from "businesslogic/dataStore/reducers/error";

const useErrorState = (currentScreen) => {
  const dispatch = useDispatch();
  const errorRef = useRef({});

  //This state is to monitor if the fetch request failed for an api on a particular screen
  const isFetchFailed = useSelector(
    (state) => getFetchFailed(state, currentScreen),
    shallowEqual
  );

  //This state is to monitor if the update request failed for an api on a particular screen
  const isUpdateFailed = useSelector(
    (state) => getUpdateFailed(state, currentScreen),
    shallowEqual
  );

  const errorStateMessage = useSelector(
    (state) => getErrorMessage(state, currentScreen),
    shallowEqual
  );

  const errorData = useSelector(
    (state) => getError(state, currentScreen),
    shallowEqual
  );

  useEffect(() => {
    errorRef.current = errorData;
  }, [errorData]);

  useEffect(() => {
    return () => {
      resetError(currentScreen);
    };
  }, []);

  const resetError = (currentScreen) => {
    if (isEmpty(errorRef.current)) {
      return;
    }
    dispatch(
      setError({
        screen: currentScreen,
        isUpdateFailed: false,
        isFetchFailed: false,
        message: "",
      })
    );
  };

  return { isFetchFailed, isUpdateFailed, errorStateMessage };
};

export default useErrorState;
