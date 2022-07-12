import { getMfAssetAllocation } from "businesslogic/dataStore/reducers/portfolioV2";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../utils/validators";
import AllocationDetails from "./../AllocationDetails/AllocationDetails";

const AssetAllocationContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const assetData = getMfAssetAllocation(state);
  const categories = assetData?.categories;
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

  useEffect(() => {}, []);
  return (
    <WrappedComponent
      tabHeaders={tabHeaders}
      equityData={equityData}
      debtData={debtData}
    />
  );
};

export default AssetAllocationContainer(AllocationDetails);
