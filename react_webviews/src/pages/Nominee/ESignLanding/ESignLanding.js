import Stack from "@mui/material/Stack";
import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { ESIGN_LANDING } from "businesslogic/strings/nominee";
import { ESIGN_STEPS } from "businesslogic/constants/nominee";
import "./ESignLanding.scss";
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader";
import Icon from "../../../designSystem/atoms/Icon";

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

const ESignLanding = ({ sendEvents, productName, onClickProceed }) => {
  return (
    <Container
      sendEvents={sendEvents("just_set_events")}
      headerProps={{
        dataAid: ESIGN_LANDING.title.dataAid,
        headerTitle: "",
      }}
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
    </Container>
  );
};

export default ESignLanding;
