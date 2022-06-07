import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import { Skeleton, Stack } from "@mui/material";
import { numDifferentiationInr } from "../../utils/validators";

const PortfolioOverview = ({
  showLoader,
  portfolioOverViewData = {},
  portfolioData,
  showPortfolioOverview,
}) => {
  if (
    (!showPortfolioOverview || portfolioOverViewData.investedValue === 0) &&
    !showLoader
  ) {
    return null;
  }
  return (
    <WrapperBox className="lmw-portfolio-overview">
      <Typography variant="heading3" dataAid={portfolioData.titleDataAid}>
        {portfolioData.title}
      </Typography>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: "16px" }}
      >
        <Tile
          title={portfolioData.currentData.title}
          titleDataAid={portfolioData.currentData.titleDataAid}
          value={portfolioOverViewData.currentValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: portfolioData.currentData.valueDataAid,
          }}
          showLoader={showLoader}
        />
        <Tile
          title={portfolioData.investedData.title}
          titleDataAid={portfolioData.investedData.titleDataAid}
          value={portfolioOverViewData.investedValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: portfolioData.investedData.valueDataAid,
            textAlign: "right",
          }}
          showLoader={showLoader}
        />
      </Stack>
      <Tile
        title={portfolioData.profitOrLossData.title}
        titleDataAid={portfolioData.profitOrLossData.titleDataAid}
        value={portfolioOverViewData.profitOrLoss}
        flexDirection="row"
        gap="4px"
        sx={{ pt: "16px" }}
        valueProps={{
          variant: "body2",
          color: portfolioOverViewData.isProfit
            ? "foundationColors.secondary.profitGreen.400"
            : "foundationColors.secondary.lossRed.400",
          dataAid: portfolioData.profitOrLossData.valueDataAid,
        }}
        showLoader={showLoader}
      />
    </WrapperBox>
  );
};

const Tile = ({
  title,
  titleDataAid,
  value,
  showLoader,
  valueProps,
  ...restProps
}) => {
  return (
    <Stack {...restProps}>
      <Typography
        dataAid={titleDataAid}
        variant="body2"
        color="foundationColors.content.secondary"
      >
        {title}
      </Typography>
      {showLoader ? (
        <Skeleton variant="rectangular" className="lmw-po-loader" />
      ) : (
        <Typography {...valueProps}>
          {numDifferentiationInr(value, 2, false, true)}
        </Typography>
      )}
    </Stack>
  );
};

export default PortfolioOverview;
