import React from "react";
import { Dialog, Stack } from "@mui/material";
import { Box } from "@mui/system";
import Typography from "../../../designSystem/atoms/Typography";
import Icon from "../../../designSystem/atoms/Icon";
import { isEmpty, noop } from "lodash-es";
import ShareCodeComponent from "../ShareCodeComponet/ShareCodeComponent";
import "./ReferralStepsBottomSheet.scss";
import OrderStep from "../../../designSystem/atoms/OrderStep/OrderStep";

const dummyData = [
  { text: "Refer a friend to open a Trading & Demat account" },
  {
    text: `Your friend opens an account`,
  },
  { text: "You get ₹150 " },
];

const ReferralStepsBottomSheet = ({
  isOpen,
  title = "Refer & earn cash rewards",
  stepsData = dummyData,
  handleClose = noop,
  dataAid = "",
  isWeb = true,
  refferalCode = "ABCD1234",
  onClickCopy = noop,
  onClickMail = noop,
  onClickShare = noop,
  onClickCta = noop,
}) => {
  return (
    <Dialog
      variant="bottomsheet"
      keepMounted
      open={isOpen}
      onClose={handleClose}
      data-aid={`bottomsheet_${dataAid}`}
      disablePortal={true}
    >
      <Stack className={`ref-steps-bottom-sheet-wrapper`}>
        <Stack
          justifyContent="center"
          alignItems="center"
          className="rs-btm-sheet-indicator"
        >
          <Box
            component="span"
            sx={{ backgroundColor: "foundationColors.supporting.athensGrey" }}
          />
        </Stack>
        <Icon
          size="110px"
          src={require("assets/fisdom/iv_earn_reward.svg")}
          className="rs-btm-sheet-img"
          dataAid="top"
        />
        {!isEmpty(title) && (
          <Typography
            className="rs-btm-sheet-title"
            variant="heading3"
            color={"foundationColors.content.primary"}
            component="div"
            dataAid="title"
          >
            {title}
          </Typography>
        )}
        <Stack>
          {stepsData.map((item, index) => (
            <OrderStep
              key={index}
              className="rs-btm-sheet-order-step"
              stepCount={index + 1}
              stepCountColor={"foundationColors.primary.500"}
              stepColor={"foundationColors.primary.200"}
              subtitle={item.text}
              subtitleColor={"foundationColors.content.primary"}
              showStepLine={index !== stepsData.length - 1}
            />
          ))}
        </Stack>
        <Stack className="rs-btm-share-wrapper">
          <ShareCodeComponent
            showCopyCode={isWeb}
            refferalCode={refferalCode}
            onClickCopy={onClickCopy}
            onClickMail={onClickMail}
            onClickShare={onClickShare}
            onClickCta={onClickCta}
          />
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ReferralStepsBottomSheet;
