import React, { useEffect } from "react";
// import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import TermsAndCondtions from "../../pages/ReferAndEarn/TermsAndCondtions";
import {
  getTnc,
  getTncData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";

const screen = "REFER_AND_EARN_TNC";

const tncContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const tncPoints = useSelector(getTncData);
  console.log({ tncPoints });

  const initialize = () => {
    if (tncPoints.length === 0) {
      dispatch(
        getTnc({
          Api: Api,
          screen: screen,
        })
      );
    }
  };

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

  return <WrappedComponent points={tncPoints} sendEvents={sendEvents} />;
};

export default tncContainer(TermsAndCondtions);
