import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { TNC } from "businesslogic/strings/referAndEarn";
import { Box, Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import "./TermsAndCondtions.scss";

const STRINGS = TNC;

const TermsAndCondtions = ({ points = [] }) => {
  return (
    <Container
      headerProps={{
        headerTitle: STRINGS.title.text,
        dataAid: STRINGS.title.dataAid,
      }}
      renderComponentAboveFooter={<FooterComponent />}
      className="refer-and-earn-tnc"
      dataAid={STRINGS.screenDataAid}
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

const FooterComponent = () => {
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
        {STRINGS.footer.text}
      </Typography>
    </Stack>
  );
};

export default TermsAndCondtions;
