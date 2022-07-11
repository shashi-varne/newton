import { Box, Stack } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Pill, Pills } from "../../designSystem/atoms/Pills";
import ProgressBar from "../../designSystem/atoms/ProgressBar";
import Button from "../../designSystem/atoms/Button";
import InvestmentCard from "./InvestmentCard";

function AllocationDetailsTabItem({
  pillData,
  holdingsData,
  sectorsData,
  cardData,
}) {
  const [currentProgressData, setCurrentProgressData] = useState(holdingsData);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [showViewAll, setShowViewAll] = useState({
    sectors: true,
    holdings: true,
  });
  const [viewAllLimit, setViewAllLimit] = useState({
    holdings: 10,
    sectors: 10,
  });
  const progressDataMapper = useMemo(() => {
    return {
      0: holdingsData || [],
      1: sectorsData || [],
    };
  });
  const currentPill = pillReturnValue === 1 ? "sectors" : "holdings";
  const handleReturnValue = (e, value) => {
    setPillReturnValue(value);
    setCurrentProgressData(progressDataMapper[value]);
  };
  const handleViewAll = () => {
    setViewAllLimit({
      ...viewAllLimit,
      [currentPill]: progressDataMapper[pillReturnValue]?.length,
    });
    setShowViewAll({
      ...showViewAll,
      [currentPill]: false,
    });
  };

  return (
    <Box className="allocation-tab-item">
      <InvestmentCard
        currentValue={cardData?.current_amount}
        profitLoss={cardData?.earnings}
      />
      <Box>
        <Pills value={pillReturnValue} onChange={handleReturnValue}>
          {pillData?.map((el, idx) => {
            return <Pill key={idx} {...el} />;
          })}
        </Pills>
      </Box>
      <Box className="progressBar-section">
        {currentProgressData
          ?.slice(0, viewAllLimit[currentPill])
          .map((item, index) => (
            <ProgressBar
              key={index}
              percentage={item.share}
              dataAidSuffix={""}
              title={item?.name || item?.instrument_name}
              label={`${item?.share.toFixed(2)}%`}
              progressBackgroundColor="foundationColors.supporting.athensGrey"
              progressColor="foundationColors.primary.200"
            />
          ))}
      </Box>
      {showViewAll[currentPill] && (
        <Button
          variant={"link"}
          onClick={handleViewAll}
          title={`View all ${currentPill}`}
        />
      )}
    </Box>
  );
}

export default AllocationDetailsTabItem;
