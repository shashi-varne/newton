import { Box } from "@mui/material";
import { isEmpty } from "lodash-es";
import React, { useMemo, useState } from "react";
import Button from "../../designSystem/atoms/Button";
import { Pill, Pills } from "../../designSystem/atoms/Pills";
import ProgressBar from "../../designSystem/atoms/ProgressBar";
import Typography from "../../designSystem/atoms/Typography";
import InvestmentCard from "./InvestmentCard";

function AllocationDetailsTabItem({
  pillData,
  holdingsData,
  sectorsData,
  cardData,
  sendEvents,
}) {
  const [currentProgressData, setCurrentProgressData] = useState(holdingsData);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [showViewAll, setShowViewAll] = useState({
    sectors: true,
    holdings: true,
  });
  const [viewAllLimit, setViewAllLimit] = useState({
    holdings: 5,
    sectors: 5,
  });
  const progressDataMapper = useMemo(() => {
    return {
      0: holdingsData || [],
      1: sectorsData || [],
    };
  });
  const currentPill = pillReturnValue === 1 ? "sectors" : "holdings";
  const handleReturnValue = (e, value) => {
    sendEvents("swapped", value === 1 ? "sectors" : "holdings");
    setPillReturnValue(value);
    setCurrentProgressData(progressDataMapper[value]);
  };
  const handleViewAll = () => {
    sendEvents("view all", "yes");
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
      {!isEmpty(currentProgressData) ? (
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
      ) : (
        <Box className="progressBar-section-empty">
          <Typography
            variant="body8"
            color={"foundationColors.content.secondary"}
            dataAid="title"
          >
            No entries
          </Typography>
        </Box>
      )}
      {showViewAll[currentPill] && !isEmpty(currentProgressData) && (
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
