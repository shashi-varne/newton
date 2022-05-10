import Stack from "@mui/material/Stack";
import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import {
  BOTTOMSHEETS_CONTENT,
  ESIGN_LANDING,
} from "businesslogic/strings/nominee";
import { ESIGN_STEPS } from "businesslogic/constants/nominee";
import "./ESignLanding.scss";
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader";
import Icon from "../../../designSystem/atoms/Icon";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";

const ESIGN_FAILED = BOTTOMSHEETS_CONTENT.esignFailed;
const LINK_AADHAAR_WITH_MOBILE = BOTTOMSHEETS_CONTENT.linkAadhaarWithMobile;

const ImageWithText = ({ title, dataAid, imgSrc }) => {
  return (
    <Stack
      direction="row"
      spacing={"16px"}
      alignItems="center"
      sx={{ pb: "16px" }}
    >
      <Icon src={imgSrc} width="64px" height="64px" dataAid={dataAid} />
      <Typography
        variant="body2"
        color={"foundationColors.content.secondary"}
        dataAid={dataAid}
      >
        {title}
      </Typography>
    </Stack>
  );
};

const esignStepsImageMapper = (productName, index) => {
  const stepImageList = [
    { imgSrc: require(`assets/${productName}/iv_aadhar.svg`) },
    { imgSrc: require(`assets/${productName}/iv_otp.svg`) },
    { imgSrc: require(`assets/${productName}/iv_esign.svg`) },
  ];
  return stepImageList[index].imgSrc;
};

const ESignLanding = ({
  sendEvents,
  productName,
  onClickProceed,
  openAadharBottomsheet,
  openEsignFailure,
  redirectToEsign,
  redirectToManualSignature,
  retryEsign,
  showLoader
}) => {
  return (
    <Container
      sendEvents={sendEvents("just_set_events")}
      headerProps={{
        dataAid: ESIGN_LANDING.title.dataAid,
        headerTitle: "",
      }}
      isPageLoading={showLoader}
      footer={{
        button1Props: {
          title: ESIGN_LANDING.ctaText,
          onClick: { onClickProceed },
        },
      }}
      className="esign-wrapper"
      dataAid={ESIGN_LANDING.screenDataAid}
    >
      <LandingHeader
        variant="center"
        dataAid={ESIGN_LANDING.LandingHeader.dataAid}
      >
        <LandingHeaderImage
          imgSrc={require(`assets/${productName}/iv_esign_top.svg`)}
        />
        <LandingHeaderTitle>
          {ESIGN_LANDING.LandingHeader.title}
        </LandingHeaderTitle>
        <LandingHeaderSubtitle dataIdx={1}>
          <Typography
            variant="body2"
            color={"foundationColors.content.secondary"}
          >
            {ESIGN_LANDING.LandingHeader.subtitle}
            <Typography
              variant="body2"
              color={"foundationColors.content.primary"}
              component="span"
            >
              {ESIGN_LANDING.LandingHeader.boldSubtitle}
            </Typography>
          </Typography>
        </LandingHeaderSubtitle>
      </LandingHeader>
      <Stack direction="column">
        <Typography
          dataAid={ESIGN_LANDING.stepsTitle.dataAid}
          variant="heading4"
          component="div"
          className="es-steps-title"
        >
          {ESIGN_LANDING.stepsTitle.text}
        </Typography>
        {ESIGN_STEPS.map((item, index) => (
          <ImageWithText
            key={index}
            title={item.text}
            dataAid={item.dataAid}
            imgSrc={esignStepsImageMapper(productName, index)}
          />
        ))}
      </Stack>
      <BottomSheet
        isOpen={openEsignFailure}
        onClose={retryEsign(true)}
        title={ESIGN_FAILED.title}
        imageTitleSrc={require(`assets/caution.svg`)}
        subtitle={ESIGN_FAILED.subtitle}
        primaryBtnTitle={ESIGN_FAILED.primaryButtonTitle}
        secondaryBtnTitle={ESIGN_FAILED.secondaryButtonTitle}
        onPrimaryClick={retryEsign(false)}
        onSecondaryClick={redirectToManualSignature}
        dataAid={ESIGN_FAILED.dataAid}
      />
      <BottomSheet
        isOpen={openAadharBottomsheet}
        onClose={closeAadharBottomsheet}
        title={LINK_AADHAAR_WITH_MOBILE.title}
        subtitle={LINK_AADHAAR_WITH_MOBILE.subtitle}
        primaryBtnTitle={LINK_AADHAAR_WITH_MOBILE.primaryButtonTitle}
        secondaryBtnTitle={LINK_AADHAAR_WITH_MOBILE.secondaryButtonTitle}
        onPrimaryClick={redirectToEsign}
        onSecondaryClick={redirectToManualSignature}
        dataAid={LINK_AADHAAR_WITH_MOBILE.dataAid}
      />
    </Container>
  );
};

export default ESignLanding;
