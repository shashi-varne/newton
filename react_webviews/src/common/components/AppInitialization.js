import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

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

  useEffect(() => {
    clearBottomsheetDisplays();
  }, []);

  return <div></div>;
};

export default AppInitialization;
