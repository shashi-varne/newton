import { getMfAssetAllocation } from "businesslogic/dataStore/reducers/portfolioV2";
import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import { capitalizeFirstLetter } from "../../utils/validators";
import AllocationDetails from "./../AllocationDetails/AllocationDetails";

const AssetAllocationContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const assetData = getMfAssetAllocation(state);
  const { kyc, isLoading, user } = useUserKycHook();
  const categories = assetData?.categories;
  const eventRef = useRef({
    screen_name: "allocation details",
    user_action: "back",
    clicked_on: "equity",
    swapped: "holdings",
    "view all": "no",
    user_application_status: kyc?.application_status_v2 || "init",
    user_investment_status: user?.active_investment,
    user_kyc_status: kyc?.mf_kyc_processed || false,
  });

  const tabHeaders = useMemo(() => {
    return categories.map((category, index) => {
      return {
        name: `${capitalizeFirstLetter(
          category.type
        )} • ${category.allocation.toFixed(2)}%`,
        key: category.type,
        disabled: category.type === "others",
      };
    });
  }, [categories]);

  const equityData = {
    list: assetData?.detailed_exposure?.equity,
    card: categories.find((item) => item.type === "equity"),
  };

  const debtData = {
    list: assetData?.detailed_exposure?.debt,
    card: categories.find((item) => item.type === "debt"),
  };
  const sendEvents = (eventKey, eventVal, userAction = "back") => {
    const eventObj = {
      event_name: "mf_portfolio",
      properties: eventRef.current,
    };
    const properties = {
      ...eventObj.properties,
      [eventKey]: eventVal,
      userAction,
    };
    eventObj.properties = properties;
    eventRef.current = properties;
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };
  useEffect(() => {}, []);
  return (
    <WrappedComponent
      tabHeaders={tabHeaders}
      equityData={equityData}
      debtData={debtData}
      sendEvents={sendEvents}
    />
  );
};

export default AssetAllocationContainer(AllocationDetails);
