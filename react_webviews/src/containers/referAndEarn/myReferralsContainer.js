import React, { useEffect, useMemo } from "react";
import MyReferrals from "../../pages/ReferAndEarn/MyReferrals";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";

import {
  getRefereeList,
  getRefereeListData,
  setRefereeList,
  getWalletBalanceData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import { update_notification } from "businesslogic/apis/referAndEarn";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import { SHARE_COMPONENT } from "businesslogic/strings/referAndEarn";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { get, isEmpty } from "lodash-es";

const screen = "MY_REFERRALS";

const myReferralsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const refereeListData = useSelector(getRefereeListData);

  const { kyc, user, isLoading } = useUserKycHook();
  const referralCode = get(user, "referral_code", "");

  const { refereeListViewData, pendingReferralsCount } =
    getRefereeListViewData(refereeListData);

  const walletBalance = useSelector(getWalletBalanceData);
  const earnedCash = walletBalance.balance_amount || 0;

  const dispatch = useDispatch();

  const initialize = () => {
    dispatch(
      getRefereeList({
        Api: Api,
        screen: screen,
      })
    );
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isFetchFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed]);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: "my_referrals",
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onClickListItem = async ({ id, isOpen }) => {
    const hasNotification = refereeListData[id].new_notification;
    console.log({ id, isOpen, hasNotification });

    if (hasNotification && isOpen) {
      const referee_id = refereeListData[id].id;

      let nRefereeListData = refereeListData.map((item, index) => {
        if (index === id) {
          return { ...item, new_notification: false };
        }
        return item;
      });
      dispatch(setRefereeList(nRefereeListData));
      await update_notification(Api, { referee_id: referee_id });
    }
  };

  const onClickCopy = async (cardIndex, eventIndex = -1) => {
    let msg = refereeListViewData[cardIndex].message;
    if (eventIndex !== -1) {
      msg = refereeListViewData[cardIndex].events[eventIndex].remind_message;
    }
    msg = msg.replace("{}", referralCode);

    try {
      await navigator.clipboard.writeText(msg);
      ToastMessage(SHARE_COMPONENT.toastMessage);
    } catch (error) {
      console.error(error);
    }
    sendEvents("remind");
  };

  return (
    <WrappedComponent
      isWeb={isWeb}
      data={refereeListViewData}
      pendingReferralsCount={pendingReferralsCount}
      totalEarned={earnedCash}
      sendEvents={sendEvents}
      isPageLoading={isPageLoading || isLoading}
      onClickCopy={onClickCopy}
      onClickListItem={onClickListItem}
      navigate={navigate}
    />
  );
};

const getRefereeListViewData = (refereeListData) => {
  let pendingReferralsCount = 0;
  const refereeListViewData = refereeListData.map((item, index) => {
    if (item.pending) {
      pendingReferralsCount += 1;
    }
    return {
      dataAid: index,
      title: item.name,
      isExpandable: !item.pending,
      showNotification: item.new_notification,
      message: item.remind_message,
      events: item.events,
    };
  });

  return { refereeListViewData, pendingReferralsCount };
};

export default myReferralsContainer(MyReferrals);
