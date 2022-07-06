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
  getSelectedTabIndex,
  setSelectedTab,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { camelCase, get, isEmpty } from "lodash-es";
import {
  getFnsFormattedDate,
  getDiffInHours,
} from "../../business/referAndEarn/utils";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../constants/referAndEarn";
import { isReadyToInvest } from "../../kyc/services";

const screen = "REFER_AND_EARN_LANDING";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { Web: isWeb, productName, appLink } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const [errorData, setErrorData] = useState({});
  const { user, kyc, isLoading } = useUserKycHook();
  const referralCode = get(user, "referral_code", "");

  const activeCampaignData = useSelector(getActiveCampaignsData);
  const campaignTitle = useSelector(getActiveCampaignsTitle);

  const activeCampaignViewData = useMemo(
    () => getActiveCampaignsViewData(activeCampaignData),
    [activeCampaignData]
  );
  const refereeListData = useSelector(getRefereeListData);
  const walletBalance = useSelector(getWalletBalanceData);
  const [activeSheetIndex, setActiveSheetIndex] = useState(-1);
  const [showTransferNotAllowed, setShowTransferNotAllowed] = useState(null);

  const [swiper, setSwiper] = useState(null);

  const handleTabChange = (e, value) => {
    handleSelectTab(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  const handleSlideChange = (swiper) => {
    handleSelectTab(swiper?.activeIndex);
  };

  const tabValue = useSelector(getSelectedTabIndex);
  const handleSelectTab = (value) => {
    dispatch(setSelectedTab(value));
  };

  const noReferrals = useMemo(
    () => isEmpty(refereeListData) || refereeListData?.length === 0,
    [refereeListData]
  );
  const { totalBalance, minWithrawAmount } = useMemo(() => {
    return {
      totalBalance: walletBalance?.balance_amount,
      minWithrawAmount: walletBalance?.min_withdraw_limit,
    };
  }, [walletBalance]);

  const allowClaimRewards = useMemo(() => {
    return walletBalance?.balance_amount >= walletBalance?.min_withdraw_limit;
  }, [walletBalance]);

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
    if (props?.history?.action === "PUSH") {
      handleSelectTab(0);
      if (swiper) {
        swiper?.slideTo(0);
      }
    }
  }, [swiper]);

  useEffect(() => {
    const userAction = showTransferNotAllowed ? "next" : "back";
    if (showTransferNotAllowed !== null) {
      sendEvents(userAction);
    }
  }, [showTransferNotAllowed]);

  useEffect(() => {
    if (activeSheetIndex >= 0) {
      sendEvents("next");
    }
  }, [activeSheetIndex]);

  useEffect(() => {
    if (isFetchFailed) {
      setErrorData({
        handleClick: initialize,
        subtitle: errorMessage,
      });
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
    if (tabValue === 0 && activeSheetIndex >= 0) {
      cardClicked =
        activeCampaignViewData?.[activeSheetIndex]?.title?.toLowerCase();
    }
    const userKycReady = isReadyToInvest();

    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: screenName,
        card_click: cardClicked,
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: userKycReady || false,
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
    msg = msg.replaceAll("{}", referralCode);
    msg = msg + "\n" + appLink;

    if (isWeb) {
      try {
        await navigator.clipboard.writeText(msg);
      } catch (error) {
        console.error(error);
      }
    } else {
      const data = { message: msg };
      nativeCallback({ action: "share_text", message: data });
    }
  };

  const onClickMail = () => {
    sendShareEvents("share_icon");
    let emailBody = "";

    if (activeSheetIndex >= 0) {
      emailBody = activeCampaignViewData?.[activeSheetIndex]?.shareMessage;
    }

    emailBody = emailBody.replace("{}", referralCode);
    emailBody = emailBody.replace(/&/g, "and");
    emailBody = emailBody + " \n" + appLink;

    document.location = `mailto:?&body=${emailBody}`;
  };

  const onClickShare = () => {
    sendShareEvents("share_icon");
    let msg = "";
    if (activeSheetIndex >= 0) {
      msg = activeCampaignViewData?.[activeSheetIndex]?.shareMessage;
    }

    msg = msg.replace("{}", referralCode);
    msg = msg + "\n" + appLink;

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

  const onCloseCampaignSheet = () => {
    sendEvents("back");
    setActiveSheetIndex(-1);
  };

  return (
    <WrappedComponent
      isWeb={isWeb}
      tabValue={tabValue}
      setTabValue={handleSelectTab}
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
      productName={productName}
      minWithrawAmount={minWithrawAmount}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
      handleTabChange={handleTabChange}
      handleSlideChange={handleSlideChange}
      setSwiper={setSwiper}
      onCloseCampaignSheet={onCloseCampaignSheet}
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
    const dataAid = camelCase(item.campaign_name);

    return {
      title: item.campaign_name,
      subtitle: item.description,
      expiryDescription: item.campaign_end_date ? expDate : "",
      isExpiringSoon: isExpiringSoon,
      amount: item.amount_per_referral,
      dataAid: dataAid,
      bottomSheetData: {
        title: item.subtitle,
        dataAid: dataAid,
        stepsData: item.content,
      },
      shareMessage: item.share_message,
    };
  });

  return data || [];
};

export default landingContainer(Landing);
