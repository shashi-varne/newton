import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox/WrapperBox";
import { formatAmountInr } from "../../utils/validators";
import "./ExternalPortfolioCard.scss";

function ExternalPortfolioCard({
  data,
  externalInvestment,
  xirr,
  isLoading,
  date,
}) {
  return (
    <WrapperBox elevation={1} data-aid="cardHorizontal-externalPortfolio">
      <Box className="ext-card">
        <Box className="top-section">
          <Typography
            variant="body1"
            color="foundationColors.content.primary"
            dataAid={data?.title?.dataAid}
          >
            {data?.title?.text}
            <EPRow
              title={data?.keyExternalInvestments?.text}
              dataAid={"ExternalInvestments"}
              value={formatAmountInr(23482)}
            />
            <EPRow
              title={data?.keyXirr?.text}
              dataAid={"Xirr"}
              value={"+54.4%"}
            />
          </Typography>
        </Box>

        <Box
          className="bottom-section"
          sx={{ backgroundColor: "foundationColors.primary.100" }}
        >
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid={`text`}
          >
            {data?.bottomText?.text} 8 Sept 2021
          </Typography>
        </Box>
      </Box>
    </WrapperBox>
  );
}

const EPRow = ({ title, value, dataAid, isLoading }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent="space-between"
      className="ext-row"
    >
      <Typography
        variant="body2"
        color="foundationColors.content.secondary"
        dataAid={`key${dataAid}`}
      >
        {title}
      </Typography>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          sx={{
            height: 20,
            width: 100,
            borderRadius: 12,
          }}
        />
      ) : (
        <Typography
          variant="body2"
          color="foundationColors.content.primary"
          dataAid={`value${dataAid}`}
        >
          {value}
        </Typography>
      )}
    </Stack>
  );
};

export default ExternalPortfolioCard;
