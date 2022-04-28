import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Button from "../../../designSystem/atoms/Button";
import Icon from "../../../designSystem/atoms/Icon";
import Status from "../../../designSystem/atoms/Status";
import { NOMINEE } from "businesslogic/strings/nominee";
import { isEmpty, isArray } from "lodash-es";

import "./Landing.scss";

const LANDING_STRINGS = NOMINEE.nomineeLanding;
const Landing = ({
  onClick,
  mfNomineeData = {},
  dematNomineeData = {},
  onMoreClick,
}) => {
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
        <NomineeDetails data={mfNomineeData} index={1} />
      </WrapperBox>
      <WrapperBox elevation={1} className="nl-nominee-wrapper">
        <Stack direction="row" justifyContent="space-between" spacing="4px">
          <Typography
            variant="heading4"
            dataAid={LANDING_STRINGS.dematTitle.dataAid}
          >
            {LANDING_STRINGS.dematTitle.text}
          </Typography>
          {!isEmpty(dematNomineeData?.statusTitle) && (
            <Status
              title={dematNomineeData.statusTitle}
              variant={dematNomineeData.statusVariant}
            />
          )}
          {dematNomineeData?.showEdit && (
            <Icon
              src={require(`assets/more.svg`)}
              dataAid={dematNomineeData.iconDataAid}
              onClick={onMoreClick}
            />
          )}
        </Stack>
        {isArray(dematNomineeData.options) &&
          dematNomineeData.options.map((el, idx) => (
            <NomineeDetails data={el} index={idx + 2} key={idx} />
          ))}
        {!isEmpty(dematNomineeData.buttonTitle) && (
          <Button
            sx={{ mt: "32px" }}
            title={dematNomineeData.buttonTitle}
            onClick={onClick}
          />
        )}
      </WrapperBox>
    </Container>
  );
};

export default Landing;

const NomineeDetails = ({ data, index }) => (
  <>
    <Stack
      sx={{ pt: "16px" }}
      direction="row"
      justifyContent="space-between"
      spacing="4px"
    >
      <Typography
        variant="body2"
        dataAid={`${data?.subtitle?.dataAid}${index}`}
      >
        {data?.subtitle?.text}
      </Typography>
      {!isEmpty(data?.share?.value) && (
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`${data?.share?.dataAid}${index}`}
        >
          {data.share.value}
        </Typography>
      )}
    </Stack>
    {!isEmpty(data?.subtext?.text) && (
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        dataAid={`${data?.subtext?.dataAid}${index}`}
      >
        {data.subtext.text}
      </Typography>
    )}
  </>
);
