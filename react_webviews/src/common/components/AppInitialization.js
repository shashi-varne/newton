import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAppStorage } from "businesslogic/dataStore/reducers/app";
import { getConfig } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const AppInitialization = () => {
  const dispacth = useDispatch();

  const clearBottomsheetDisplays = () => {
    const bottomSheetsArr = [
      "isCampaignDisplayed",
      "isAuthVerificationDisplayed",
      "isKycBottomsheetDisplayed",
      "isPremiumBottomsheetDisplayed",
    ];

    let data = {};
    bottomSheetsArr.forEach((bottomSheet) => {
      data = {
        ...data,
        [bottomSheet]: false,
      };
    });
    dispacth(updateAppStorage(data));
  };

  const initializeSdkData = () => {
    const config = getConfig();
    if (config.isSdk && config.Android) {
      nativeCallback({ action: "get_data" });
    }
  };

  useEffect(() => {
    initializeSdkData();
    clearBottomsheetDisplays();
  }, []);

  return <div></div>;
};

export default AppInitialization;
