import React, { useState, useEffect, useMemo } from "react";
import Landing from "../../pages/ReferAndEarn/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import {
  getActiveCampaigns,
  getActiveCampaignsData,
  getActiveCampaignsTitle,
  getRefereeList,
  getRefereeListData,
  getWalletBalance,
  getWalletBalanceData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { get, isEmpty } from "lodash-es";
import { capitalizeFirstLetter } from "../../utils/validators";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import {
  getFnsFormattedDate,
  getDiffInHours,
} from "../../pages/ReferAndEarn/common/utils";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../pages/ReferAndEarn/common/constants";

const screen = "REFER_AND_EARN_LANDING";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { user, kyc, isLoading } = useUserKycHook();
  const referralCode = get(user, "referral_code", "");

  const activeCampaignData = useSelector(getActiveCampaignsData);
  const campaignTitle = useSelector(getActiveCampaignsTitle);

  const activeCampaignViewData = getActiveCampaignsViewData(activeCampaignData);
  const refereeListData = useSelector(getRefereeListData);
  const walletBalance = useSelector(getWalletBalanceData);
  const [activeSheetIndex, setActiveSheetIndex] = useState(-1);
  const [showTransferNotAllowed, setShowTransferNotAllowed] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const noReferrals =
    !isEmpty(refereeListData) && refereeListData?.length === 0;
  const allowClaimRewards =
    !walletBalance?.balance_amount >= walletBalance?.min_withdraw_limit;

  const totalBalance = "₹" + walletBalance?.balance_amount;

  const dispatch = useDispatch();

  const fetchRefreeData = () => {
    dispatch(
      getRefereeList({
        Api: Api,
        screen: screen,
        sagaCallback: () => {
          dispatch(
            getWalletBalance({
              Api: Api,
              screen: screen,
            })
          );
        },
      })
    );
  };

  const initialize = () => {
    dispatch(
      getActiveCampaigns({
        Api: Api,
        screen: screen,
        sagaCallback: fetchRefreeData(),
      })
    );
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const userAction = showTransferNotAllowed ? "next" : "back";
    sendEvents(userAction);
  }, [showTransferNotAllowed]);

  useEffect(() => {
    if (isFetchFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed]);

  const sendEvents = (userAction, shareVia = "", activeCard = "") => {
    const screenName =
      tabValue === 0
        ? "referrals"
        : noReferrals
        ? "empty_cash_reward"
        : showTransferNotAllowed
        ? "transfer_not_allowed"
        : "cash_rewards";

    let cardClicked = activeCard;
    if (!isEmpty(activeCard) && tabValue === 0 && activeSheetIndex >= 0) {
      cardClicked =
        activeCampaignViewData?.[activeSheetIndex]?.title?.toLowerCase();
    }

    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: screenName,
        card_click: cardClicked,
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };

    if (!isEmpty(shareVia)) {
      eventObj.share_via = shareVia;
    }

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const sendShareEvents = (shareVia) => {
    if (showTransferNotAllowed) {
      sendEvents("next", shareVia);
    } else {
      sendEvents(shareVia);
    }
  };

  const onClickCopy = async () => {
    sendShareEvents("share_icon");

    let msg = "";
    if (activeSheetIndex >= 0) {
      msg = activeCampaignViewData?.[activeSheetIndex]?.shareMessage;
    }
    msg = msg.replace("{}", referralCode);
    try {
      await navigator.clipboard.writeText(msg);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMail = () => {
    sendShareEvents("share_icon");
    let subject = "";
    let emailBody = "";

    if (activeSheetIndex >= 0) {
      subject = activeCampaignViewData?.[activeSheetIndex]?.subtitle;
      emailBody = activeCampaignViewData?.[activeSheetIndex]?.shareMessage;
    }
    emailBody.replace("{}", referralCode);

    document.location =
      "mailto:" + "?subject=" + subject + "&body=" + emailBody;
  };

  const onClickShare = () => {
    sendShareEvents("share_icon");
    let msg = "";
    if (activeSheetIndex >= 0) {
      msg = activeCampaignViewData?.[activeSheetIndex]?.shareMessage;
    }

    msg = msg.replace("{}", referralCode);

    const data = { message: msg };
    nativeCallback({ action: "share_text", message: data });
  };

  const onClickTnc = () => {
    sendEvents("next");
    navigate(REFER_AND_EARN_PATHNAME_MAPPER.tnc);
  };

  const onClickRewardsInfoCard = (id, navLink) => {
    if (id === "rewards" && !allowClaimRewards) {
      setShowTransferNotAllowed(true);
      return;
    }
    sendEvents("next", "", id);
    navigate(navLink);
  };

  return (
    <WrappedComponent
      isWeb={isWeb}
      tabValue={tabValue}
      setTabValue={setTabValue}
      activeSheetIndex={activeSheetIndex}
      setActiveSheetIndex={setActiveSheetIndex}
      sendEvents={sendEvents}
      noRewardsView={noReferrals}
      balance={totalBalance}
      campaignTitle={campaignTitle}
      referralCode={referralCode}
      onClickCopy={onClickCopy}
      onClickMail={onClickMail}
      onClickShare={onClickShare}
      onClickTnc={onClickTnc}
      onClickInfoCard={onClickRewardsInfoCard}
      isPageLoading={isPageLoading || isLoading}
      navigate={navigate}
      referralData={activeCampaignViewData}
      showTransferNotAllowed={showTransferNotAllowed}
      setShowTransferNotAllowed={setShowTransferNotAllowed}
    />
  );
};

const getActiveCampaignsViewData = (activeCampaignData) => {
  const data = activeCampaignData.map((item) => {
    const hoursLeft = getDiffInHours(
      item.campaign_end_date,
      "yyyy-MM-dd HH:mm:ss"
    );
    const isExpiringSoon = !!hoursLeft && hoursLeft < 48;
    const expDate = isExpiringSoon
      ? `Expiring in ${hoursLeft} hours`
      : `Expiring on ${getFnsFormattedDate(
          item.campaign_end_date,
          "yyyy-MM-dd HH:mm:ss"
        )}`;

    return {
      title: item.campaign_name,
      subtitle: item.description,
      expiryDescription: expDate,
      isExpiringSoon: isExpiringSoon,
      amount: item.amount_per_referral,
      dataAid: capitalizeFirstLetter(item.campaign_name),
      bottomSheetData: {
        title: item.subtitle,
        dataAid: capitalizeFirstLetter(item.campaign_name),
        stepsData: item.content,
      },
      shareMessage: item.share_message,
    };
  });

  return data || [];
};

export default landingContainer(Landing);
