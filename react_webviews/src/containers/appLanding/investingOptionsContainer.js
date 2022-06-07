import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InvestingOptions from "../../pages/AppLanding/InvestingOptions";
import {
  getAppData,
  setKyc,
  setUser,
} from "businesslogic/dataStore/reducers/app";
import { isEmpty } from "lodash-es";
import {
  getContactVerification,
  getInvestCardsData,
} from "../../business/appLanding/functions";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
} from "../../dashboard/Invest/functions";
import { INVESTING_OPTIONS } from "../../strings/webappLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { storageService } from "../../utils/validators";

const investingOptionsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
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
        user_application_status: "",
        user_investment_status: "",
        user_kyc_status: "",
      },
    };
    if (data.intent) {
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
      eventObj.event_name = "bottom_sheet";
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleCardClick = (data) => () => {
    sendEvents("next", { cardClick: data.eventStatus });
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  return (
    <WrappedComponent
      investmentOptions={investCardsData}
      showSearchIcon={showSearchIcon}
      screenData={screenData}
      kycData={kycData.kycStatusData}
      kycBottomsheetData={kycData.kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      handleCardClick={handleCardClick}
      sendEvents={sendEvents}
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

export default investingOptionsContainer(InvestingOptions);
