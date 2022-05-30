import React from "react";
import Stack from "@mui/material/Stack";
import Icon from "../../../designSystem/atoms/Icon";
import Button from "../../../designSystem/atoms/Button";
import Status from "../../../designSystem/atoms/Status";
import Typography from "../../../designSystem/atoms/Typography";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import MenuOverlay from "../../../designSystem/atoms/MenuOverlay";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import {
  NOMINEE_LANDING,
  BOTTOMSHEETS_CONTENT,
} from "businesslogic/strings/nominee";
import { isEmpty, isArray } from "lodash-es";
import { capitalize } from "../../../utils/validators";

import "./Landing.scss";

const RESET_NOMINEES_STRINGS = BOTTOMSHEETS_CONTENT.resetNominees;
const Landing = ({
  handleEquityRedirection,
  mfNomineeData = {},
  dematNomineeData = {},
  menuOptions,
  onMoreClick,
  onClickMenuItem,
  onMenuClose,
  anchorEl,
  confirmEditNominees,
  closeResetNominee,
  openResetNominees = false,
  isPageLoading,
  onBackClick,
  sendEvents,
  handleMfRedirection,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: NOMINEE_LANDING.title.dataAid,
        headerTitle: NOMINEE_LANDING.title.text,
        onBackClick,
      }}
      noFooter={true}
      isPageLoading={isPageLoading}
      className="nominee-landing"
      dataAid={NOMINEE_LANDING.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <WrapperBox
        elevation={1}
        className="nl-nominee-wrapper"
        onClick={handleMfRedirection}
      >
        <Typography
          variant="heading4"
          dataAid={NOMINEE_LANDING.mfTitle.dataAid}
        >
          {NOMINEE_LANDING.mfTitle.text}
        </Typography>
        <NomineeDetails data={mfNomineeData} index={1} />
      </WrapperBox>
      <WrapperBox elevation={1} className="nl-nominee-wrapper">
        <Stack direction="row" justifyContent="space-between" spacing="4px">
          <Typography
            variant="heading4"
            dataAid={NOMINEE_LANDING.dematTitle.dataAid}
          >
            {NOMINEE_LANDING.dematTitle.text}
          </Typography>
          {!isEmpty(dematNomineeData?.statusTitle) && (
            <Status
              title={dematNomineeData.statusTitle}
              variant={dematNomineeData.statusVariant}
              dataAid={dematNomineeData.statusDataAid}
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
            onClick={handleEquityRedirection}
          />
        )}
      </WrapperBox>
      <BottomSheet
        isOpen={openResetNominees}
        onClose={closeResetNominee}
        title={RESET_NOMINEES_STRINGS.title}
        imageTitleSrc={require(`assets/caution.svg`)}
        subtitle={RESET_NOMINEES_STRINGS.subtitle}
        primaryBtnTitle={RESET_NOMINEES_STRINGS.primaryButtonTitle}
        secondaryBtnTitle={RESET_NOMINEES_STRINGS.secondaryButtonTitle}
        onPrimaryClick={closeResetNominee}
        onSecondaryClick={confirmEditNominees}
        dataAid={RESET_NOMINEES_STRINGS.dataAid}
      />
      <MenuOverlay
        anchorEl={anchorEl}
        onClose={onMenuClose}
        onClickLabel={onClickMenuItem}
        options={menuOptions}
        dataAid={NOMINEE_LANDING.menuOverlayDataAid}
      />
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
          {data?.share?.value}
        </Typography>
      )}
    </Stack>
    <Stack direction="row" justifyContent="space-between" spacing="4px">
      {!isEmpty(data?.subtext?.text) && (
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`${data?.subtext?.dataAid}${index}`}
        >
          {capitalize(data.subtext.text)}
        </Typography>
      )}
      {!isEmpty(data?.status?.text) && (
        <Typography
          variant="body5"
          color="foundationColors.secondary.lossRed.400"
          dataAid={`${data?.status?.dataAid}${index}`}
        >
          {data?.status?.text}
        </Typography>
      )}
    </Stack>
  </>
);
