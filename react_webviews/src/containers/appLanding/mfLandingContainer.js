import React, { useMemo, useState } from "react";
import { EXPLORE_CATEGORIES } from "businesslogic/constants/webappLanding";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  getContactVerification,
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
} from "../../business/appLanding/helper";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
} from "../../dashboard/Invest/functions";
import { useDispatch, useSelector } from "react-redux";
import { getAppData, setKyc, setUser } from "businesslogic/dataStore/reducers/app";
import { storageService } from "../../utils/validators";
import { isEmpty } from "lodash-es";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const navigate = navigateFunc.bind(props);
  const { code, mfOptions, landingMarketingBanners, ...baseConfig } = useMemo(
    getConfig,
    []
  );
  const { investCardsData } = getInvestCardsData(mfOptions);
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  const { kyc, user } = useSelector(getAppData);
  const kycData = useMemo(() => getKycData(kyc, user), [kyc, user]);
  const contactDetails = getContactVerification(kyc, false, screen);

  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
  });
  const [bottomsheetStates, setBottomsheetStates] = useState({
    openKycStatusDialog: false,
  });

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "mutual_funds_screen",
      properties: {
        user_action: userAction || "",
        primary_category: data.primaryCategory || "generic type",
        card_click: data.cardClick || "",
        channel: code,
        user_application_status: "",
        user_investment_status: "",
        user_kyc_status: "",
      },
    };

    if (data.intent) {
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
    }

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleCardClick = (data) => () => {
    sendEvents("next", {
      primaryCategory: "product item",
      cardClick: data.eventStatus,
    });
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const handleExploreCategories = (data) => () => {
    sendEvents("next", {
      primaryCategory: "category item",
      cardClick: data.title?.toLowerCase(),
    });
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const handleKyc = (cardClick) => () => {
    sendEvents("next", {
      primaryCategory: "kyc info",
      cardClick,
    });
  };

  const onMarketingBannerClick = (data) => () => {
    handleMarketingBanners(data, sendEvents, navigate);
  };

  const onRightIconClick = () => {
    sendEvents("next", {
      eventName: "diy_search_clicked",
    });
    navigate(WEBAPP_LANDING_PATHNAME_MAPPER.diySearch);
  };

  const updateKyc = (data) => {
    if (!isEmpty(data)) {
      storageService().setObject("kyc", data);
      dispatch(setKyc(data));
    }
  };

  const handleSummaryData = (data) => {
    dispatch(setKyc(data.kyc));
    dispatch(setUser(data.user));
  };

  const closeKycStatusDialog = (outsideClick = false) => {
    sendEvents("back", {
      intent: kycData.kycBottomsheetData?.title,
      outsideClick,
    });
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  const handleBottomsheets = (data) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
  };

  return (
    <WrappedComponent
      kycData={kycData.kycStatusData}
      kycBottomsheetData={kycData.kycBottomsheetData}
      marketingBanners={marketingBanners}
      investmentOptions={investCardsData}
      exploreCategories={EXPLORE_CATEGORIES}
      showMarketingBanners={kycData.isReadyToInvestBase}
      showKycCard={kycData.showKycCard}
      bottomsheetStates={bottomsheetStates}
      sendEvents={sendEvents}
      handleKyc={handleKyc}
      handleCardClick={handleCardClick}
      handleExploreCategories={handleExploreCategories}
      onMarketingBannerClick={onMarketingBannerClick}
      onRightIconClick={onRightIconClick}
      handleKycPrimaryClick={handleKycStatus({
        kyc,
        kycData,
        modalData: kycData.kycBottomsheetData,
        navigate,
        updateKyc,
        closeKycStatusDialog,
        handleLoader,
        sendEvents,
      })}
      handleKycSecondaryClick={handleKycStatusRedirection(
        {
          kyc,
          user,
          kycData,
          modalData: kycData.kycBottomsheetData,
          baseConfig,
          contactDetails,
          navigate,
          handleLoader,
          handleSummaryData,
          handleDialogStates: handleBottomsheets,
        },
        props
      )}
    />
  );
};

export default mfLandingContainer(MfLanding);
