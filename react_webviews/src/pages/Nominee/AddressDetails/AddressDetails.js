import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Dropdown from "../../../designSystem/molecules/Dropdown";
import InputField from "../../../designSystem/molecules/InputField";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { ADDRESS_DETAILS as ADDRESS_DETAILS_STRINGS } from "businesslogic/strings/nominee";
import {
  NOMINEE_PROOF_OF_IDENTITY,
  ADDRESS_DETAILS_FORM_MAPPER,
} from "businesslogic/constants/nominee";
import { isEmpty } from "lodash-es";

import "./AddressDetails.scss";
const AddressDetails = ({
  onClick,
  isMinor,
  formData = {},
  errorData = {},
  onChange,
  sendEvents,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: ADDRESS_DETAILS_STRINGS.title.dataAid,
        headerTitle: ADDRESS_DETAILS_STRINGS.title.text,
      }}
      footer={{
        button1Props: {
          title: ADDRESS_DETAILS_STRINGS.buttonTitle,
          onClick,
        },
      }}
      className="nominee-personal-details"
      dataAid="nominee"
      eventData={sendEvents("just_set_events")}
    >
      <Typography
        dataAid={
          isMinor
            ? ADDRESS_DETAILS_STRINGS.guardianSubtext.dataAid
            : ADDRESS_DETAILS_STRINGS.addressDetailsSubtext.dataAid
        }
        variant="heading4"
        sx={{ pt: "24px" }}
        component="div"
      >
        {isMinor
          ? ADDRESS_DETAILS_STRINGS.guardianSubtext.text
          : ADDRESS_DETAILS_STRINGS.addressDetailsSubtext.text}
      </Typography>
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.pincode}
        value={formData.pincode}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.pincode)}
        dataAid="1"
        error={!isEmpty(errorData.pincode)}
        helperText={errorData.pincode}
        inputMode="numeric"
        inputProps={{
          maxLength: 6,
        }}
      />
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.address}
        value={formData.address}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.address)}
        dataAid="2"
        id={ADDRESS_DETAILS_FORM_MAPPER.address}
        error={!isEmpty(errorData.address)}
        helperText={errorData.address}
      />
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.city}
        value={formData.city}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.city)}
        dataAid="3"
        error={!isEmpty(errorData.city)}
        helperText={errorData.city}
      />
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.state}
        value={formData.state}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.state)}
        dataAid="4"
        error={!isEmpty(errorData.state)}
        helperText={errorData.state}
      />
      <Dropdown
        options={NOMINEE_PROOF_OF_IDENTITY}
        label={ADDRESS_DETAILS_STRINGS.formLabels.poi}
        dataAid={ADDRESS_DETAILS_FORM_MAPPER.poi}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.poi)}
        value={formData.poi}
        error={!isEmpty(errorData.poi)}
        helperText={errorData.poi}
      />
      {isMinor ? (
        <Typography
          dataAid={ADDRESS_DETAILS_STRINGS.poiGuardianTitle.dataAid}
          variant="heading4"
          sx={{ mt: "24px" }}
          component="div"
        >
          {ADDRESS_DETAILS_STRINGS.poiGuardianTitle.text}
        </Typography>
      ) : (
        <Typography
          dataAid={ADDRESS_DETAILS_STRINGS.poiNomineeTitle.dataAid}
          variant="heading4"
          sx={{ mt: "24px" }}
          component="div"
        >
          {ADDRESS_DETAILS_STRINGS.poiNomineeTitle.text}
        </Typography>
      )}
      <WrapperBox elevation={1} className="nad-info-wrapper">
        <InfoCard
          dataAid={ADDRESS_DETAILS_STRINGS.poiInfoTitle.dataAid}
          title={ADDRESS_DETAILS_STRINGS.poiInfoTitle.text}
          subtitle={ADDRESS_DETAILS_STRINGS.poiInfoSubtitle.text}
          imgSrc={require(`assets/attach_button.svg`)}
        />
      </WrapperBox>
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.password}
        value={formData.password}
        dataAid="5"
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.password)}
        error={!isEmpty(errorData.password)}
        helperText={errorData.password}
        type="password"
      />
    </Container>
  );
};

export default AddressDetails;
