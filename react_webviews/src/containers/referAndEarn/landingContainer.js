import React, { useEffect, useMemo } from "react";
import Landing from "../../pages/ReferAndEarn/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";

const screen = "NOMINEE_LANDING";

const landingContainer = (WrappedComponent) => (props) => {
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

  const onClickCopy = () => {};

  const onClickMail = () => {};

  const onClickShare = () => {};

  return (
    <WrappedComponent
      isWeb={isWeb}
      sendEvents={sendEvents}
      noRewards={false}
      balance={"₹2,000"}
      potentialAmount={"₹2,00,000"}
      referralCode={""}
      onClickCopy={onClickCopy}
      onClickMail={onClickMail}
      onClickShare={onClickShare}
      isPageLoading={isPageLoading}
      navigate={navigate}
    />
  );
};

export default landingContainer(Landing);
