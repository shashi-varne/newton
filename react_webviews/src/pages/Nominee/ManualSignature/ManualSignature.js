import Stack from "@mui/material/Stack";
import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OrderStep, {
  ORDER_STEP_VARIANTS,
} from "../../../designSystem/atoms/OrderStep/OrderStep";
import { MANUAL_SIGNATURE } from "businesslogic/strings/nominee";
import {
  COMPANY_DETAILS,
  MANUAL_SIGNATURE_STEPS,
} from "businesslogic/constants/nominee";
import "./ManualSignature.scss";

const ManualSignature = ({ email, onClickDownloadForm, sendEvents }) => {
  const dynamicStepsSubtitle = (index, subtitle) => {
    if (index === 0) {
      return (
        <>
          <Typography
            color={"foundationColors.content.secondary"}
            variant="body2"
          >
            {subtitle}
          </Typography>
          <Typography
            color={"foundationColors.content.primary"}
            variant="body2"
          >
            {email}
          </Typography>
        </>
      );
    } else if (index === 2) {
      return (
        <>
          <Typography
            color={"foundationColors.content.primary"}
            variant="body2"
          >
            {COMPANY_DETAILS.NAME}
          </Typography>
          <Typography
            color={"foundationColors.content.secondary"}
            variant="body2"
          >
            {COMPANY_DETAILS.ADDRESS}
          </Typography>
        </>
      );
    } else {
      return subtitle;
    }
  };

  return (
    <Container
      eventData={sendEvents("just_set_events")}
      headerProps={{
        dataAid: MANUAL_SIGNATURE.title.dataAid,
        headerTitle: MANUAL_SIGNATURE.title.text,
        subtitle: MANUAL_SIGNATURE.subtitle,
      }}
      footer={{
        noFooter: true,
      }}
      className="manual-signature-wrapper"
      dataAid={MANUAL_SIGNATURE.screenDataAid}
    >
      <Stack direction="column">
        <Typography
          dataAid={MANUAL_SIGNATURE.stepsTitle.dataAid}
          variant="heading4"
          sx={{ pt: "40px", pb: "24px" }}
        >
          {MANUAL_SIGNATURE.stepsTitle.text}
        </Typography>
        {MANUAL_SIGNATURE_STEPS.map((item, index) => {
          const isLastItem = index + 1 !== MANUAL_SIGNATURE_STEPS.length;
          return (
            <OrderStep
              key={index}
              className="ms-order-step"
              stepCount={index + 1}
              title={item?.title}
              subtitle={dynamicStepsSubtitle(index, item?.subtitle)}
              variant={ORDER_STEP_VARIANTS.SUCCESSFUL}
              showStepLine={isLastItem}
              buttonTitle={item?.buttonTitle}
              onClickButton={onClickDownloadForm}
            />
          );
        })}
      </Stack>
    </Container>
  );
};

export default ManualSignature;
