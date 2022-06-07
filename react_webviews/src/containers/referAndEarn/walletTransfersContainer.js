import React, { useEffect, useMemo, useState } from "react";
import WalletTransfers from "../../pages/ReferAndEarn/MyReferrals";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import { WALLET_TRANSFERS_FILTER_DATA } from "businesslogic/constants/referAndEarn";

const screen = "WALLET_TRANSFERS";

const walletTransfersContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isUpdateFailed, isFetchFailed, errorMessage } = useErrorState(screen);
  const [filterApplied, setFilterApplied] = useState(
    WALLET_TRANSFERS_FILTER_DATA[0].value
  );
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

  const handleWalletFilter = (e, val) => {
    console.log({ val });
    setFilterApplied(val);
  };

  const onClickCopy = (id) => {};

  return (
    <WrappedComponent
      transactionData={dummyData}
      isWeb={isWeb}
      filterApplied={filterApplied}
      handleWalletFilter={handleWalletFilter}
      sendEvents={sendEvents}
      isPageLoading={isPageLoading}
      navigate={navigate}
    />
  );
};

const dummyData = [
  {
    amount: "₹8,000",
    date: "3 May, 2022",
    account: "HDFC •••••••• 9220",
    status: "pending",
  },
  {
    amount: "₹2000",
    date: "3 May, 2022",
    account: "HDFC •••••••• 9220",
    status: "pending",
  },
];

export default walletTransfersContainer(WalletTransfers);
