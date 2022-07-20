import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Typography from "designSystem/atoms/Typography";
import { RETURN_CALCULATOR } from "businesslogic/strings/portfolio";
import Tooltip, { TOOLTIP_PLACEMENTS } from "designSystem/atoms/Tooltip";
import { Pills } from "designSystem/atoms/Pills";
import Slider from "designSystem/atoms/Slider";
import { Pill } from "designSystem/atoms/Pills/Pills";
import "./ReturnCalculator.scss";
import { formatAmountInr } from "businesslogic/utils/common/functions";
import { Timelines, TimeLine } from "../../../designSystem/atoms/TimelineList";
import {
  getEstimatedReturn,
  TimeLineYearData,
} from "businesslogic/constants/portfolio";
import Separator from "../../../designSystem/atoms/Separator";
import { Stack } from "@mui/material";
import Icon from "../../../designSystem/atoms/Icon";
import Button from "../../../designSystem/atoms/Button";
import { formatAmount, numDifferentiation } from "../../../utils/validators";
import { ReturnCalculatorDefaultValues } from "businesslogic/constants/portfolio";

const PILL_LIST = [
  { label: "Mutual Funds", dataAid: "mutualFunds" },
  { label: "Stocks", dataAid: "stocks" },
];

function ReturnCalculator({ sendEvents, screenType }) {
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(
    ReturnCalculatorDefaultValues.sliderValue
  );
  const [investmentPeriod, setInvestmentPeriod] = useState(
    ReturnCalculatorDefaultValues.selectedYear
  );
  const [returnResult, setReturnResult] = useState({});
  const [investmentType, setInvestmentType] = useState("mutual_funds");
  const handleSliderChange = (e, val) => {
    sendEvents({ slider_use: "yes", slider_amount: val });
    setSliderValue(val);
    calculateReturn(val, investmentPeriod, investmentType);
  };

  useEffect(() => {
    const type = pillReturnValue === 1 ? "stocks" : "mutual_funds";
    calculateReturn(sliderValue, investmentPeriod, type);
  }, []);

  const calculateReturn = (investedVal, investmentPeriod, investmentType) => {
    const returnResult = getEstimatedReturn(
      investedVal,
      investmentPeriod,
      investmentType
    );
    setReturnResult(returnResult);
  };

  const handlePillChange = (e, val) => {
    const type = val === 1 ? "stocks" : "mutual_funds";
    sendEvents({ calculated_for: type });
    setInvestmentType(investmentType);
    setPillReturnValue(val);
    calculateReturn(sliderValue, investmentPeriod, type);
  };

  const handlePeriodChange = (e, val) => {
    sendEvents({ "investment period": `${val}Y` });
    setInvestmentPeriod(val);
    calculateReturn(sliderValue, val, investmentType);
  };

  const handleStartInvesting = () => {
    sendEvents({}, "start investing");
    //TODO: redirection
  };
  return (
    <Box className="return-calculator">
      <Typography
        variant="heading3"
        color="foundationColors.content.primary"
        dataAid={RETURN_CALCULATOR.sheetTitle.dataAid}
      >
        {RETURN_CALCULATOR.sheetTitle.text}
      </Typography>
      {screenType !== "main_portfolio" && (
        <Box>
          <Pills value={pillReturnValue} onChange={handlePillChange}>
            {PILL_LIST?.map((el, idx) => {
              return <Pill key={idx} {...el} />;
            })}
          </Pills>
        </Box>
      )}

      <Box className={screenType === "main_portfolio" && "no-pills"}>
        <Typography
          variant="heading2"
          color="foundationColors.content.primary"
          dataAid={RETURN_CALCULATOR.amount.dataAid}
          className="invested-value"
        >
          {formatAmountInr(sliderValue)}
        </Typography>
      </Box>
      <Box className="return-slider">
        <Slider
          min={ReturnCalculatorDefaultValues.sliderMinValue}
          max={ReturnCalculatorDefaultValues.sliderMaxValue}
          step={12}
          onChange={handleSliderChange}
          sliderValue={sliderValue}
          dataAidSuffix={RETURN_CALCULATOR.slider.dataAid}
        />
      </Box>
      <Typography
        variant="heading4"
        color="foundationColors.content.secondary"
        dataAid={RETURN_CALCULATOR.investmentPeriod.dataAid}
        className="investment-period"
      >
        {RETURN_CALCULATOR.investmentPeriod.text}
      </Typography>

      <Timelines value={investmentPeriod} onChange={handlePeriodChange}>
        {TimeLineYearData.map((el, index) => (
          <TimeLine
            dataAid={index}
            disabled={false}
            key={index}
            label={el.label}
            value={el.value}
          />
        ))}
      </Timelines>
      <Separator dataAid={1} />
      <Stack
        flexDirection={"row"}
        alignItems="center"
        justifyContent="space-between"
        className="return-results"
      >
        <Box>
          <Typography
            variant="heading2"
            color={"foundationColors.content.primary"}
            dataAid={RETURN_CALCULATOR.valueInvested.dataAid}
            style={{ marginBottom: 4 }}
          >
            ₹{sliderValue * investmentPeriod}
          </Typography>
          <Typography
            variant="body1"
            color={"foundationColors.content.secondary"}
            dataAid={RETURN_CALCULATOR.keyInvested.dataAid}
          >
            {RETURN_CALCULATOR.keyInvested.text}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="heading2"
            color={"foundationColors.content.primary"}
            dataAid={RETURN_CALCULATOR.valueInvested.dataAid}
            style={{ marginBottom: 4 }}
          >
            {numDifferentiation(
              returnResult?.estimatedValue,
              true,
              0,
              false,
              true
            )}
            <Tooltip
              dataAid="info"
              title={
                "Estimated return is calculated based on 70% equity and 30% debt allocation with a 9.9% rate of return"
                //TODO: dynamic tooltip text
              }
              placement={TOOLTIP_PLACEMENTS.TOP}
            >
              <Icon
                src={require("assets/info_icon_ds.svg")}
                size={14}
                dataAid={RETURN_CALCULATOR.valueEstimatedReturn.infoIconDataAid}
                style={{ marginLeft: 5 }}
              />
            </Tooltip>
          </Typography>
          <Stack
            flexDirection={"row"}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <Typography
              variant="body1"
              color={"foundationColors.content.secondary"}
              dataAid={RETURN_CALCULATOR.keyEstimatedReturn.dataAid}
              style={{ marginRight: 4 }}
            >
              {RETURN_CALCULATOR.keyEstimatedReturn.text}
            </Typography>
            <Typography
              variant="body1"
              color={"foundationColors.secondary.profitGreen.400"}
            >
              {`(+${returnResult?.returnPercentage || "-"})%`}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Button
        title={RETURN_CALCULATOR.cta.title}
        dataAid={RETURN_CALCULATOR.cta.dataAid}
        onClick={handleStartInvesting}
        variant={"primary"}
      />
    </Box>
  );
}

export default ReturnCalculator;
