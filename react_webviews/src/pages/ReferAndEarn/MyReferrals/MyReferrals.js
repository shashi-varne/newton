import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Typography from "../../../designSystem/atoms/Typography";
import { MY_REFERRALS } from "businesslogic/strings/referAndEarn";
import CollapsibleReferalStatus from "../../../featureComponent/ReferAndEarn/CollapsibleReferalStatus";
import { Stack } from "@mui/material";
import Icon from "../../../designSystem/atoms/Icon";
import Button from "../../../designSystem/atoms/Button";
import Separator from "../../../designSystem/atoms/Separator";
import "./MyReferrals.scss";
import { inrFormatDecimal } from "../../../utils/validators";

const STRINGS = MY_REFERRALS;

const MyReferrals = ({
  data,
  pendingReferralsCount,
  totalEarned,
  sendEvents,
  isPageLoading,
  onClickListItem,
  onClickCopy,
  productName,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: STRINGS.title.dataAid,
        headerTitle: STRINGS.title.text,
      }}
      isPageLoading={isPageLoading}
      className="my-referrals"
      dataAid={STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <Stack direction={"row"} justifyContent="space-between">
        <Stack>
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid={STRINGS.earnedCash.dataAid}
          >
            {STRINGS.earnedCash.text}
          </Typography>
          <Typography
            variant="body8"
            color="foundationColors.content.primary"
            dataAid={STRINGS.earnedCash.valueDataAid}
          >
            {inrFormatDecimal(totalEarned, 0)}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid={STRINGS.pendingReferrals.dataAid}
          >
            {STRINGS.pendingReferrals.text}
          </Typography>
          <Typography
            variant="body8"
            color="foundationColors.content.primary"
            dataAid={STRINGS.pendingReferrals.valueDataAid}
          >
            {pendingReferralsCount}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        variant="heading3"
        color="foundationColors.content.primary"
        component="div"
        className="mr-referred-title"
        dataAid={STRINGS.referredTitle.dataAid}
      >
        {STRINGS.referredTitle.text}
      </Typography>
      {data.map((item, index) => {
        const isLastItem = index + 1 === data.length;
        if (item.isExpandable) {
          return (
            <CollapsibleReferalStatus
              key={index}
              id={index}
              label={item.title}
              showNotification={item.showNotification}
              onClick={onClickListItem}
              data={item.events}
              dataAid={`${index + 1}`}
              onClickCopy={onClickCopy}
              showSeparator={!isLastItem}
              productName={productName}
            />
          );
        } else {
          return (
            <ReferralStatusCard
              key={index}
              id={index}
              label={item.title}
              dataAid={`${index + 1}`}
              onClickCopy={onClickCopy}
              showSeparator={!isLastItem}
              productName={productName}
            />
          );
        }
      })}
    </Container>
  );
};

const ReferralStatusCard = ({
  id,
  label = "",
  dataAid,
  onClickCopy,
  showSeparator,
  productName,
}) => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        data-aid={`grp_referral` + dataAid}
        className="mr-card-wrapper"
      >
        <Icon
          dataAid={STRINGS.cardImageDataAid}
          size="32px"
          src={require(`assets/${productName}/iv_profile.svg`)}
          className="c-icon-wrapper"
        />
        <Stack style={{ marginLeft: "12px", flexGrow: 1 }}>
          <Typography variant="body1" dataAid={STRINGS.cardTitleDataAid}>
            {label}
          </Typography>
          <Typography
            variant="body2"
            color="foundationColors.secondary.coralOrange.400"
            dataAid={`status${dataAid}`}
          >
            Pending
          </Typography>
        </Stack>
        <Button
          title={STRINGS.copyBtn.text}
          onClick={() => onClickCopy(id)}
          variant={"link"}
          dataAid={STRINGS.copyBtn.dataAid}
          sx={{ alignSelf: "center" }}
        />
      </Stack>
      {showSeparator && <Separator dataAid={dataAid} />}
    </>
  );
};

export default MyReferrals;
