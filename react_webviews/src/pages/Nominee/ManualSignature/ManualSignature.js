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

const ManualSignature = ({ email, onClickDownloadForm }) => {
  const dynamicStepsSubtitle = (index, subtitle) => {
    if (index === 0) {
      return (
        <Typography
          color={"foundationColors.content.secondary"}
          variant="body2"
        >
          {subtitle}
          <Typography
            color={"foundationColors.content.primary"}
            variant="body2"
          >
            {email}
          </Typography>
          <Typography
            color={"foundationColors.action.brand"}
            variant="body2"
            onClick={onClickDownloadForm}
          >
            Download forms
          </Typography>
        </Typography>
      );
    } else if (index === 2) {
      return (
        <Typography
          color={"foundationColors.content.primary"}
          variant="body2"
          dataAid={"subtitle"}
        >
          {COMPANY_DETAILS.NAME}
          <Typography
            color={"foundationColors.content.secondary"}
            variant="body2"
          >
            {COMPANY_DETAILS.ADDRESS}
          </Typography>
        </Typography>
      );
    } else {
      return subtitle;
    }
  };

  return (
    <Container
      headerProps={{
        dataAid:  MANUAL_SIGNATURE.title.dataAid,
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
        {MANUAL_SIGNATURE_STEPS.map((item, index) => (
          <OrderStep
            className="ms-order-step"
            stepCount={index + 1}
            title={item.title}
            subtitle={dynamicStepsSubtitle(index, item.subtitle)}
            variant={ORDER_STEP_VARIANTS.SUCCESSFUL}
            showStepLine={index + 1 !== MANUAL_SIGNATURE_STEPS.length}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default ManualSignature;
