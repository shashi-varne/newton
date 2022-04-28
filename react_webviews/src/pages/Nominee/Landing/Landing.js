import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Button from "../../../designSystem/atoms/Button";
import { NOMINEE } from "businesslogic/strings/nominee";
import { isEmpty } from "lodash-es";

import "./Landing.scss";

const LANDING_STRINGS = NOMINEE.nomineeLanding;
const Landing = ({ onClick, mfNomineeData }) => {
  return (
    <Container
      headerProps={{
        dataAid: LANDING_STRINGS.title.dataAid,
        headerTitle: LANDING_STRINGS.title.text,
      }}
      noFooter={true}
      className="nominee-landing"
      dataAid="nominee"
    >
      <WrapperBox elevation={1} className="nl-nominee-wrapper">
        <Typography
          variant="heading4"
          dataAid={LANDING_STRINGS.mfTitle.dataAid}
        >
          {LANDING_STRINGS.mfTitle.text}
        </Typography>
        <Stack
          sx={{ pt: "16px" }}
          direction="row"
          justifyContent="space-between"
          spacing="4px"
        >
          <Typography variant="body2" dataAid={mfNomineeData.subtitle.dataAid}>
            {mfNomineeData.subtitle.text}
          </Typography>
          {!isEmpty(mfNomineeData?.share?.value) && (
            <Typography
              variant="body5"
              color="foundationColors.content.secondary"
              dataAid={mfNomineeData.share.dataAid}
            >
              {mfNomineeData.share.value}
            </Typography>
          )}
        </Stack>
        {!isEmpty(mfNomineeData?.subtext?.text) && (
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid={mfNomineeData.subtext.dataAid}
          >
            {mfNomineeData.subtext.text}
          </Typography>
        )}
      </WrapperBox>
      <WrapperBox elevation={1} className="nl-nominee-wrapper">
        <Typography
          variant="heading4"
          dataAid={LANDING_STRINGS.dematTitle.dataAid}
        >
          {LANDING_STRINGS.dematTitle.text}
        </Typography>
        <Typography variant="body2" sx={{ pt: "16px", pb: "32px" }}>
          0 nominees added
        </Typography>
        <Button title="Add nominees" onClick={onClick} />
      </WrapperBox>
    </Container>
  );
};

export default Landing;
