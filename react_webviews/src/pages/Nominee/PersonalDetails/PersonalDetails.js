import React from "react";
import Stack from "@mui/material/Stack";
import Checkbox from "../../../designSystem/atoms/Checkbox";
import Typography from "../../../designSystem/atoms/Typography";
import Dropdown from "../../../designSystem/molecules/Dropdown";
import InputField from "../../../designSystem/molecules/InputField";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { NOMINEE } from "businesslogic/strings/nominee";
import {
  NOMINEE_RELATIONSHIP,
  PERSONAL_DETAILS_FORM_MAPPER,
} from "businesslogic/constants/nominee";
import { isEmpty } from "lodash-es";

import "./PersonalDetails.scss";
const PERSONAL_DETAILS_STRINGS = NOMINEE.personalDetails;
const PersonalDetails = ({
  onClick,
  isMinor,
  formData = {},
  errorData = {},
  onChange,
  availableShare = "",
  handleCheckbox,
  sendEvents
}) => {
  return (
    <Container
      headerProps={{
        dataAid: PERSONAL_DETAILS_STRINGS.title.dataAid,
        headerTitle: PERSONAL_DETAILS_STRINGS.title.text,
      }}
      footer={{
        button1Props: {
          title: PERSONAL_DETAILS_STRINGS.buttonTitle,
          onClick,
        },
      }}
      className="nominee-personal-details"
      dataAid="nominee"
      eventData={sendEvents("just_set_events")}
    >
      <Typography
        dataAid={PERSONAL_DETAILS_STRINGS.personalDetailsSubtext.dataAid}
        variant="heading4"
        sx={{ pt: "24px" }}
        component="div"
      >
        {PERSONAL_DETAILS_STRINGS.personalDetailsSubtext.text}
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
          dataAid={PERSONAL_DETAILS_STRINGS.minorNominee.dataAid}
          color="foundationColors.content.secondary"
        >
          {PERSONAL_DETAILS_STRINGS.minorNominee.text}
        </Typography>
      </Stack>
      <InputField
        label={PERSONAL_DETAILS_STRINGS.formLabels.name}
        value={formData.name}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.name)}
        dataAid="1"
        error={!isEmpty(errorData.name)}
        helperText={errorData.name}
      />
      <InputField
        label={PERSONAL_DETAILS_STRINGS.formLabels.dob}
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
        label={PERSONAL_DETAILS_STRINGS.formLabels.relationship}
        dataAid={PERSONAL_DETAILS_FORM_MAPPER.relationship}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.relationship)}
        value={formData.relationship}
        error={!isEmpty(errorData.relationship)}
        helperText={errorData.relationship}
      />
      {!isMinor && (
        <>
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.mobile}
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
            label={PERSONAL_DETAILS_STRINGS.formLabels.email}
            value={formData.email}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.email)}
            dataAid="4"
            error={!isEmpty(errorData.email)}
            helperText={errorData.email}
          />
        </>
      )}
      <Typography
        dataAid={PERSONAL_DETAILS_STRINGS.percentageOfHoldings.dataAid}
        variant="heading4"
        sx={{ mt: "24px" }}
        component="div"
      >
        {PERSONAL_DETAILS_STRINGS.percentageOfHoldings.text}
      </Typography>
      <Typography
        dataAid={PERSONAL_DETAILS_STRINGS.percentageSubtext.dataAid}
        variant="body2"
        component="div"
        color="foundationColors.content.secondary"
      >
        {availableShare}% {PERSONAL_DETAILS_STRINGS.percentageSubtext.text}
      </Typography>
      <InputField
        label={PERSONAL_DETAILS_STRINGS.formLabels.share}
        inputMode="numeric"
        value={formData.share}
        dataAid={isMinor ? "3" : "5"}
        onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.share)}
        inputProps={{
          maxLength: 3,
        }}
        error={!isEmpty(errorData.share)}
        helperText={
          errorData.share || PERSONAL_DETAILS_STRINGS.formLabels.shareHelperText
        }
      />
      {isMinor && (
        <>
          <Typography
            dataAid={PERSONAL_DETAILS_STRINGS.guardianSubtext.dataAid}
            variant="heading4"
            component="div"
            sx={{ mt: "24px" }}
          >
            {PERSONAL_DETAILS_STRINGS.guardianSubtext.text}
          </Typography>
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.guardianName}
            value={formData.guardianName}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.guardianName)}
            dataAid="4"
            error={!isEmpty(errorData.guardianName)}
            helperText={errorData.guardianName}
          />
          <Dropdown
            options={NOMINEE_RELATIONSHIP}
            label={PERSONAL_DETAILS_STRINGS.formLabels.guardianRelationship}
            dataAid={PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship}
            onChange={onChange(
              PERSONAL_DETAILS_FORM_MAPPER.guardianRelationship
            )}
            value={formData.guardianRelationship}
            error={!isEmpty(errorData.guardianRelationship)}
            helperText={errorData.guardianRelationship}
          />
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.mobile}
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
            label={PERSONAL_DETAILS_STRINGS.formLabels.email}
            value={formData.email}
            onChange={onChange(PERSONAL_DETAILS_FORM_MAPPER.email)}
            dataAid="6"
            error={!isEmpty(errorData.email)}
            helperText={errorData.email}
          />
        </>
      )}
    </Container>
  );
};

export default PersonalDetails;
