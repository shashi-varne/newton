import React from "react";
import Stack from "@mui/material/Stack";
import Checkbox from "../../../designSystem/atoms/Checkbox";
import Typography from "../../../designSystem/atoms/Typography";
import Dropdown from "../../../designSystem/molecules/Dropdown";
import InputField from "../../../designSystem/molecules/InputField";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import {
  PERSONAL_DETAILS,
  BOTTOMSHEETS_CONTENT,
} from "businesslogic/strings/nominee";
import {
  NOMINEE_RELATIONSHIP,
  PERSONAL_DETAILS_FORM_MAPPER,
} from "businesslogic/constants/nominee";
import { isEmpty } from "lodash-es";

import "./PersonalDetails.scss";

const EXIT_NOMINEE = BOTTOMSHEETS_CONTENT.exitNominee;
const PersonalDetails = ({
  onClick,
  isMinor,
  formData = {},
  errorData = {},
  onChange,
  availableShare = "",
  handleCheckbox,
  sendEvents,
  openExitNominee,
  handleClose,
  handleExit,
  onBackClick,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: PERSONAL_DETAILS.title.dataAid,
        headerTitle: PERSONAL_DETAILS.title.text,
        onBackClick,
      }}
      footer={{
        button1Props: {
          title: PERSONAL_DETAILS.buttonTitle,
          onClick,
        },
      }}
      className="nominee-personal-details"
      dataAid={PERSONAL_DETAILS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <Typography
        dataAid={PERSONAL_DETAILS.personalDetailsSubtext.dataAid}
        variant="heading4"
        sx={{ pt: "24px" }}
        component="div"
      >
        {PERSONAL_DETAILS.personalDetailsSubtext.text}
      </Typography>
      <Stack
        direction="row"
        sx={{ pt: "16px" }}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Checkbox dataAid="1" checked={isMinor} onChange={handleCheckbox} />
        <Typography
          variant="body2"
          dataAid={PERSONAL_DETAILS.minorNominee.dataAid}
          color="foundationColors.content.secondary"
        >
          {PERSONAL_DETAILS.minorNominee.text}
        </Typography>
      </Stack>
      <InputField
        label={PERSONAL_DETAILS.formLabels.name}
        value={formData.name}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.name)}
        dataAid="1"
        error={!isEmpty(errorData.name)}
        helperText={errorData.name}
      />
      <InputField
        label={PERSONAL_DETAILS.formLabels.dob}
        value={formData.dob}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.dob)}
        dataAid="2"
        id={PERSONAL_DETAILS_FORM_MAPPER.dob}
        inputProps={{
          maxLength: 10,
        }}
        error={!isEmpty(errorData.dob)}
        helperText={errorData.dob}
      />
      <Dropdown
        options={NOMINEE_RELATIONSHIP}
        label={PERSONAL_DETAILS.formLabels.relationship}
        dataAid={PERSONAL_DETAILS_FORM_MAPPER.relationship}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.relationship)}
        value={formData.relationship}
        error={!isEmpty(errorData.relationship)}
        helperText={errorData.relationship}
      />
      {!isMinor && (
        <>
          <InputField
            label={PERSONAL_DETAILS.formLabels.mobile}
            value={formData.mobile}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.mobile)}
            inputMode="numeric"
            dataAid="3"
            inputProps={{
              maxLength: 10,
            }}
            error={!isEmpty(errorData.mobile)}
            helperText={errorData.mobile}
          />
          <InputField
            label={PERSONAL_DETAILS.formLabels.email}
            value={formData.email}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.email)}
            dataAid="4"
            error={!isEmpty(errorData.email)}
            helperText={errorData.email}
          />
        </>
      )}
      <Typography
        dataAid={PERSONAL_DETAILS.percentageOfHoldings.dataAid}
        variant="heading4"
        sx={{ mt: "24px" }}
        component="div"
      >
        {PERSONAL_DETAILS.percentageOfHoldings.text}
      </Typography>
      <Typography
        dataAid={PERSONAL_DETAILS.percentageSubtext.dataAid}
        variant="body2"
        component="div"
        color="foundationColors.content.secondary"
      >
        {availableShare}% {PERSONAL_DETAILS.percentageSubtext.text}
      </Typography>
      <InputField
        label={PERSONAL_DETAILS.formLabels.share}
        inputMode="numeric"
        value={formData.share}
        dataAid={isMinor ? "3" : "5"}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.share)}
        inputProps={{
          maxLength: 3,
        }}
        error={!isEmpty(errorData.share)}
        helperText={
          errorData.share || PERSONAL_DETAILS.formLabels.shareHelperText
        }
      />
      {isMinor && (
        <>
          <Typography
            dataAid={PERSONAL_DETAILS.guardianSubtext.dataAid}
            variant="heading4"
            component="div"
            sx={{ mt: "24px" }}
          >
            {PERSONAL_DETAILS.guardianSubtext.text}
          </Typography>
          <InputField
            label={PERSONAL_DETAILS.formLabels.guardianName}
            value={formData.guardianName}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.guardianName)}
            dataAid="4"
            error={!isEmpty(errorData.guardianName)}
            helperText={errorData.guardianName}
          />
          <Dropdown
            options={NOMINEE_RELATIONSHIP}
            label={PERSONAL_DETAILS.formLabels.guardianRelationship}
            dataAid={PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship}
            onChange={onChange(
              PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship
            )}
            value={formData.guardianRelationship}
            error={!isEmpty(errorData.guardianRelationship)}
            helperText={errorData.guardianRelationship}
          />
          <InputField
            label={PERSONAL_DETAILS.formLabels.mobile}
            value={formData.mobile}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.mobile)}
            dataAid="5"
            inputMode="numeric"
            inputProps={{
              maxLength: 10,
            }}
            error={!isEmpty(errorData.mobile)}
            helperText={errorData.mobile}
          />
          <InputField
            label={PERSONAL_DETAILS.formLabels.email}
            value={formData.email}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.email)}
            dataAid="6"
            error={!isEmpty(errorData.email)}
            helperText={errorData.email}
          />
        </>
      )}
      <BottomSheet
        isOpen={openExitNominee}
        onClose={handleClose}
        title={EXIT_NOMINEE.title}
        imageTitleSrc={require(`assets/caution.svg`)}
        subtitle={EXIT_NOMINEE.subtitle}
        primaryBtnTitle={EXIT_NOMINEE.primaryButtonTitle}
        secondaryBtnTitle={EXIT_NOMINEE.secondaryButtonTitle}
        onPrimaryClick={handleClose}
        onSecondaryClick={handleExit}
        dataAid={EXIT_NOMINEE.dataAid}
      />
    </Container>
  );
};

export default PersonalDetails;
