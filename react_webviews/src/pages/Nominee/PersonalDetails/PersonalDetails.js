import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Checkbox from "../../../designSystem/atoms/Checkbox";
import InputField from "../../../designSystem/molecules/InputField";
import { NOMINEE } from "businesslogic/strings/nominee";

import "./PersonalDetails.scss";
const PERSONAL_DETAILS_STRINGS = NOMINEE.personalDetails;
const PersonalDetails = ({
  onClick,
  isMinor = true,
  formData = {},
  onChange,
  availableShare = "",
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
        <Checkbox dataAid="1" checked={isMinor} />
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
        onChange={onChange}
        dataAid="1"
      />
      <InputField
        label={PERSONAL_DETAILS_STRINGS.formLabels.dob}
        value={formData.dob}
        onChange={onChange}
        dataAid="2"
      />
      {!isMinor && (
        <>
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.mobile}
            value={formData.mobile}
            onChange={onChange}
            dataAid="3"
          />
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.email}
            value={formData.email}
            onChange={onChange}
            dataAid="5"
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
        value={formData.share}
        onChange={onChange}
        dataAid={isMinor ? "4" : "6"}
        helperText={PERSONAL_DETAILS_STRINGS.formLabels.helperText}
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
            onChange={onChange}
            dataAid="5"
          />
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.mobile}
            value={formData.mobile}
            onChange={onChange}
            dataAid="7"
          />
          <InputField
            label={PERSONAL_DETAILS_STRINGS.formLabels.email}
            value={formData.email}
            onChange={onChange}
            dataAid="8"
          />
        </>
      )}
    </Container>
  );
};

export default PersonalDetails;
