import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { TNC } from "businesslogic/strings/referAndEarn";
import { Box, Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import "./TermsAndCondtions.scss";
import { capitalizeFirstLetter } from "../../../utils/validators";

const STRINGS = TNC;

const TermsAndCondtions = ({ points = [], productName, isPageLoading }) => {
  return (
    <Container
      headerProps={{
        headerTitle: STRINGS.title.text,
        dataAid: STRINGS.title.dataAid,
      }}
      fixedFooter={true}
      renderComponentAboveFooter={<FooterComponent productName={productName} />}
      isPageLoading={isPageLoading}
      className="refer-and-earn-tnc"
      dataAid={STRINGS.screenDataAid}
      containerSx={{ backgroundColor: "foundationColors.supporting.grey" }}
    >
      <Stack className="tnc-wrapper">
        <Box
          component="ul"
          sx={{ color: "foundationColors.content.secondary" }}
        >
          {points.map((item, index) => {
            return (
              <li key={index}>
                <Typography
                  variant="body2"
                  align="left"
                  color="foundationColors.content.secondary"
                  dataAid={`point${index + 1}`}
                  component="div"
                >
                  {item}
                </Typography>
              </li>
            );
          })}
        </Box>
      </Stack>
    </Container>
  );
};

const FooterComponent = ({ productName }) => {
  const footerText = STRINGS.footer.text.replace("{product}", productName);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "foundationColors.primary.100",
      }}
      className="tnc-footer"
      data-aid={`grp_${STRINGS.footer.dataAid}`}
    >
      <Typography
        variant="body2"
        dataAid={STRINGS.footer.dataAid}
        color="foundationColors.content.tertiary"
        align="center"
      >
        {capitalizeFirstLetter(footerText)}
      </Typography>
    </Stack>
  );
};

export default TermsAndCondtions;
