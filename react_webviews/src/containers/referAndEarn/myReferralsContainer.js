import React, { useEffect, useMemo } from "react";
import MyReferrals from "../../pages/ReferAndEarn/MyReferrals";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";

const screen = "MY_REFERRALS";

const myReferralsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isUpdateFailed, isFetchFailed, errorMessage } = useErrorState(screen);

  const dispatch = useDispatch();

  const initialize = () => {};

  useEffect(() => {
    initialize();
  }, []);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "",
      properties: {
        user_action: userAction || "",
        screen_name: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <WrappedComponent
      isWeb={isWeb}
      sendEvents={sendEvents}
      isPageLoading={isPageLoading}
      navigate={navigate}
    />
  );
};

export default myReferralsContainer(MyReferrals);
