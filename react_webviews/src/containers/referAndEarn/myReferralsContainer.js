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

  const onClickListItem = ({ id, isOpen }) => {};

  const onClickCopy = (id) => {};

  return (
    <WrappedComponent
      isWeb={isWeb}
      data={dummyData}
      pendingReferralsCount="02"
      totalEarned="1000"
      sendEvents={sendEvents}
      isPageLoading={isPageLoading}
      onClickCopy={onClickCopy}
      onClickListItem={onClickListItem}
      navigate={navigate}
    />
  );
};

const dummyData = [
  {
    title: "User A",
    isExpandable: true,
    showNotification: true,
    statusData: [
      {
        label: "Demat account",
        status: "complete",
        amount: "₹100",
        dataAid: "dematAccount",
      },
      {
        label: "SIP or one-time investment",
        status: "pending",
        amount: " ₹150",
        dataAid: "sip",
      },
    ],
  },
  {
    title: "User B",
    isExpandable: false,
    showNotification: false,
  },
  {
    title: "User C",
    isExpandable: true,
    showNotification: true,
    statusData: [
      {
        label: "Demat account",
        status: "complete",
        amount: "₹100",
        dataAid: "dematAccount",
      },
      {
        label: "SIP or one-time investment",
        status: "pending",
        amount: " ₹150",
        dataAid: "sip",
      },
    ],
  },
];

export default myReferralsContainer(MyReferrals);
