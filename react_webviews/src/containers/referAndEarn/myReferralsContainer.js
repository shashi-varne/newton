import React, { useState, useEffect, useMemo } from "react";
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
import { capitalizeName } from "businesslogic/utils/common/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { get, isEmpty } from "lodash-es";
import { isReadyToInvest } from "../../kyc/services";

const screen = "MY_REFERRALS";

const myReferralsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { Web: isWeb, productName, appLink } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const [errorData, setErrorData] = useState({});
  const refereeListData = useSelector(getRefereeListData);

  const { kyc, user, isLoading } = useUserKycHook();
  const referralCode = useMemo(() => get(user, "referral_code", ""), [user]);

  const { refereeListViewData, pendingReferralsCount } = useMemo(
    () => getRefereeListViewData(refereeListData),
    [refereeListData]
  );

  const walletBalance = useSelector(getWalletBalanceData);
  const earnedCash = useMemo(
    () => walletBalance.balance_amount,
    [walletBalance]
  );

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
    if (isFetchFailed) {
      setErrorData({
        handleClick: initialize,
        subtitle: errorMessage,
      });
    }
  }, [isFetchFailed]);

  const sendEvents = (userAction) => {
    const userKycReady = isReadyToInvest();
    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: "my_referrals",
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: userKycReady || false,
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
    msg = msg.replaceAll("{}", referralCode);
    msg = msg + "\n" + appLink;

    if (isWeb) {
      try {
        await navigator.clipboard.writeText(msg);
        ToastMessage(SHARE_COMPONENT.toastMessage);
      } catch (error) {
        console.error(error);
      }
    } else {
      const data = { message: msg };
      nativeCallback({ action: "share_text", message: data });
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
      productName={productName}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
    />
  );
};

const getRefereeListViewData = (refereeListData = []) => {
  let pendingReferralsCount = 0;
  const refereeListViewData = refereeListData.map((item, index) => {
    if (item.pending) {
      pendingReferralsCount += 1;
    }

    const name = capitalizeName(item.name);

    return {
      dataAid: index,
      title: name,
      isExpandable: !item.pending,
      showNotification: item.new_notification,
      message: item.remind_message,
      events: item.events,
    };
  });

  return { refereeListViewData, pendingReferralsCount };
};

export default myReferralsContainer(MyReferrals);
