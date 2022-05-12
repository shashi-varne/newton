import React, { useMemo } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Dropdown from "../../../designSystem/molecules/Dropdown";
import InputField from "../../../designSystem/molecules/InputField";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { WVFilePickerWrapper } from "../../../common/ui/FileUploadWrapper/WVFilePickerWrapper";
import NomineeSaved from "../../../featureComponent/Nominee/NomineeSaved";
import ReviewNominee from "../../../featureComponent/Nominee/ReviewNominee";
import HoldingPercentageFull from "../../../featureComponent/Nominee/HoldingPercentageFull";

import { ADDRESS_DETAILS as ADDRESS_DETAILS_STRINGS } from "businesslogic/strings/nominee";
import {
  NOMINEE_PROOF_OF_IDENTITY,
  ADDRESS_DETAILS_FORM_MAPPER,
} from "businesslogic/constants/nominee";

import { SUPPORTED_IMAGE_TYPES } from "../../../utils/constants";
import { isEmpty } from "lodash-es";

import "./AddressDetails.scss";
const AddressDetails = ({
  onClick,
  isMinor,
  formData = {},
  errorData = {},
  hideAddNominee,
  onChange,
  sendEvents,
  onFileSelectStart,
  onFileSelectComplete,
  onFileSelectError,
  isWeb,
  isButtonLoading,
  poiData = {},
  openNomineeSaved,
  openReviewNominee,
  openPercentageHoldingFull,
  handleConfirmNominees,
  onPrimaryClick,
  addAnotherNominee,
  editNominee,
  closeDialogStates,
  disabled,
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
          isLoading: isButtonLoading,
          disabled: disabled,
        },
      }}
      className="nominee-personal-details"
      dataAid={ADDRESS_DETAILS_STRINGS.screenDataAid}
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
        inputProps={{
          maxLength: 200,
        }}
      />
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.city}
        value={formData.city}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.city)}
        dataAid="3"
        error={!isEmpty(errorData.city)}
        helperText={errorData.city}
        disabled
      />
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.state}
        value={formData.state}
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.state)}
        dataAid="4"
        error={!isEmpty(errorData.state)}
        helperText={errorData.state}
        disabled
      />
      <Dropdown
        options={NOMINEE_PROOF_OF_IDENTITY}
        label={ADDRESS_DETAILS_STRINGS.formLabels.poi}
        dataAid={ADDRESS_DETAILS_STRINGS.dropdownDataAid}
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
      <UploadContainer
        filePickerProps={{
          shouldCompress: isWeb,
          nativePickerMethodName: "open_gallery",
          fileName: "address_proof_front",
          onFileSelectStart: onFileSelectStart,
          onFileSelectComplete: onFileSelectComplete("front"),
          onFileSelectError: onFileSelectError,
          supportedFormats: SUPPORTED_IMAGE_TYPES,
          customPickerId: "addressProofFront",
          docType: "image",
        }}
        dataAid={poiData?.numberOfDocs === 2 ? "1" : ""}
        fileName={formData?.frontDoc?.name}
        docSide="front"
        poiData={poiData}
        error={!isEmpty(errorData.frontDoc)}
        helperText={errorData.frontDoc}
      />
      {poiData?.numberOfDocs === 2 && (
        <UploadContainer
          filePickerProps={{
            shouldCompress: isWeb,
            nativePickerMethodName: "open_gallery",
            fileName: "address_proof_back",
            onFileSelectStart: onFileSelectStart,
            onFileSelectComplete: onFileSelectComplete("back"),
            onFileSelectError: onFileSelectError,
            supportedFormats: SUPPORTED_IMAGE_TYPES,
            customPickerId: "addressProofBack",
            docType: "image",
          }}
          dataAid="2"
          fileName={formData?.backDoc?.name}
          docSide="back"
          poiData={poiData}
          error={!isEmpty(errorData.backDoc)}
          helperText={errorData.backDoc}
        />
      )}
      <InputField
        label={ADDRESS_DETAILS_STRINGS.formLabels.password}
        value={formData.password}
        dataAid="5"
        onChange={onChange(ADDRESS_DETAILS_FORM_MAPPER.password)}
        error={!isEmpty(errorData.password)}
        helperText={errorData.password}
        type="password"
      />
      <NomineeSaved
        isOpen={openNomineeSaved}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={handleConfirmNominees}
        hideAddNominee={hideAddNominee}
        handleClose={closeDialogStates("openNomineeSaved")}
      />
      <ReviewNominee
        isOpen={openReviewNominee}
        hideAddNominee={hideAddNominee}
        onPrimaryClick={editNominee}
        onSecondaryClick={addAnotherNominee}
        handleClose={closeDialogStates("openReviewNominee")}
      />
      <HoldingPercentageFull
        isOpen={openPercentageHoldingFull}
        onPrimaryClick={handleConfirmNominees}
        handleClose={closeDialogStates("openPercentageHoldingFull")}
      />
    </Container>
  );
};

export default AddressDetails;

const UploadContainer = ({
  filePickerProps = {},
  dataAid,
  fileName,
  poiData = {},
  docSide,
  helperText = "",
  error = false,
}) => {
  const title = useMemo(() => {
    return !isEmpty(fileName)
      ? fileName || poiData?.value
      : !isEmpty(poiData)
      ? `${poiData?.name} ${poiData.numberOfDocs === 2 ? docSide : ""}`
      : ADDRESS_DETAILS_STRINGS.poiInfoTitle.text;
  }, [poiData, fileName]);
  return (
    <>
      <WrapperBox elevation={1} className="nad-info-wrapper">
        <WVFilePickerWrapper {...filePickerProps}>
          <InfoCard
            dataAid={`${ADDRESS_DETAILS_STRINGS.poiInfoTitle.dataAid}${dataAid}`}
            title={title}
            subtitle={ADDRESS_DETAILS_STRINGS.poiInfoSubtitle.text}
            imgSrc={require(`assets/attach_button.svg`)}
          />
        </WVFilePickerWrapper>
      </WrapperBox>
      {error && (
        <FormControl error={error}>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      )}
    </>
  );
};
