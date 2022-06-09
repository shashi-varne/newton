import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InvestingOptions from "../../pages/AppLanding/InvestingOptions";
import { getAppData } from "businesslogic/dataStore/reducers/app";
import {
  getContactVerification,
  getInvestCardsData,
} from "../../business/appLanding/functions";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
  handleStocksAndIpoCards,
} from "../../dashboard/Invest/functions";
import { INVESTING_OPTIONS } from "../../strings/webappLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { isEmpty } from "lodash-es";

const investingOptionsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [kycBottomsheetData, setKycBottomsheetData] = useState({});
  const { code, investingOptions, featuresList, ...baseConfig } = useMemo(
    getConfig,
    []
  );
  const { kyc, user } = useSelector(getAppData);
  const kycData = useMemo(() => getKycData(kyc, user), [kyc, user]);
  const contactDetails = getContactVerification(kyc, false);
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
  });
  const [bottomsheetStates, setBottomsheetStates] = useState({
    openKycStatusDialog: false,
  });
  const { updateKyc } = useUserKycHook();

  const closeKycStatusDialog = (outsideClick = false) => {
    sendEvents("back", {
      intent: kycBottomsheetData?.title,
      outsideClick,
    });
    handleBottomsheets({
      openKycStatusDialog: false,
    });
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  const handleBottomsheets = (data, modalData) => {
    if (!isEmpty(modalData)) {
      setKycBottomsheetData(modalData);
    }
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
  };

  const initializeData = () => {
    const showFeaturesList = props.match?.params?.type === "category";
    let list = investingOptions,
      eventName = "investing_options_screen",
      screenData = INVESTING_OPTIONS.default,
      showSearchIcon = true;
    if (showFeaturesList) {
      list = featuresList;
      eventName = "category_screen";
      screenData = INVESTING_OPTIONS.category;
      showSearchIcon = false;
    }
    const { investCardsData } = getInvestCardsData(list);
    return {
      investCardsData,
      eventName,
      screenData,
      showSearchIcon,
    };
  };

  const { investCardsData, eventName, screenData, showSearchIcon } = useMemo(
    initializeData,
    [props]
  );

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: eventName,
      properties: {
        user_action: userAction || "",
        primary_category: "product item",
        card_click: data.cardClick,
        channel: code,
        user_application_status: kycData.applicationStatus,
        user_investment_status: kycData.isMfInvested,
        user_kyc_status: kycData.isReadyToInvestBase,
      },
    };
    if (data.intent) {
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
      eventObj.event_name = "bottom_sheet";
      delete eventObj.properties.card_click;
      delete eventObj.properties.primary_category;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleCardClick = (data = {}) => () => {
    sendEvents("next", { cardClick: data.eventStatus });
    if (["stocks", "ipo"].includes(data.id)) {
      handleStocksAndIpoCards(
        {
          ...kycData,
          key: data.id,
          kyc,
          user,
          navigate,
          handleLoader,
          handleDialogStates: handleBottomsheets,
          closeKycStatusDialog,
        },
        props
      );
      return;
    }
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const onRightIconClick = () => {
    sendEvents("next", {
      eventName: "diy_search_clicked",
    });
    navigate(WEBAPP_LANDING_PATHNAME_MAPPER.diySearch);
  };

  return (
    <WrappedComponent
      investmentOptions={investCardsData}
      showSearchIcon={showSearchIcon}
      screenData={screenData}
      kycData={kycData.kycStatusData}
      kycBottomsheetData={kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      onRightIconClick={onRightIconClick}
      handleCardClick={handleCardClick}
      closeKycBottomsheet={closeKycStatusDialog}
      sendEvents={sendEvents}
      isPageLoading={loaderData.skelton || loaderData.pageLoader}
      handleKycPrimaryClick={handleKycStatus({
        kyc,
        kycData,
        modalData: kycBottomsheetData,
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
          modalData: kycBottomsheetData,
          baseConfig,
          contactDetails,
          navigate,
          handleLoader,
          handleDialogStates: handleBottomsheets,
        },
        props
      )}
    />
  );
};

export default investingOptionsContainer(InvestingOptions);
