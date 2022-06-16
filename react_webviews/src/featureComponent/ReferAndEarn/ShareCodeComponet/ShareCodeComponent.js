import React from "react";
import { Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import Button from "../../../designSystem/atoms/Button";
import "./ShareCodeComponent.scss";
import { noop } from "lodash-es";
import Icon from "../../../designSystem/atoms/Icon";
import ToastMessage from "../../../designSystem/atoms/ToastMessage";
import { SHARE_COMPONENT } from "businesslogic/strings/referAndEarn";

const STRINGS = SHARE_COMPONENT;

const ShareCodeComponent = ({
  showCopyCode = true,
  showWhatsappShare = false,
  referralCode = "",
  onClickCopy = noop,
  onClickMail = noop,
  onClickShare = noop,
  onClickCta = noop,
  ctaText = "",
  customToastClassName = "",
}) => {
  return (
    <Stack flexDirection="row" spacing={1} className="ref-share-code-wrapper">
      {showCopyCode ? (
        <CopyCodeComponent
          referralCode={referralCode}
          onClickCopy={onClickCopy}
          onClickMail={onClickMail}
          customToastClassName={customToastClassName}
        />
      ) : showWhatsappShare ? (
        <WhatsAppShareCta
          ctaText={ctaText}
          onClickCta={onClickCta}
          onClickShare={onClickShare}
        />
      ) : (
        <Button title={ctaText || STRINGS.ctaText} onClick={onClickCta} />
      )}
    </Stack>
  );
};

const WhatsAppShareCta = ({ onClickShare, onClickCta, ctaText }) => {
  return (
    <>
      <Button
        startIcon={
          <Icon
            src={require("assets/iv_whatsapp.svg")}
            size="24px"
            alt="whatsapp_icon"
            dataAid="right"
          />
        }
        title={ctaText || STRINGS.WhatsAppShareCta}
        onClick={onClickCta}
        dataAid="primary"
        style={{ maxHeight: "48px" }}
      />
      <span onClick={onClickShare} style={{ marginTop: 0, marginLeft: "8px" }}>
        <Icon
          src={require("assets/iv_share_contacts.svg")}
          size="48px"
          alt="share_icon"
          dataAid={STRINGS.shareIconDataAid}
        />
      </span>
    </>
  );
};

const CopyCodeComponent = ({
  referralCode,
  onClickCopy,
  onClickMail,
  customToastClassName = "",
}) => {
  const handleCopy = async () => {
    await onClickCopy();
    ToastMessage(STRINGS.toastMessage, "default", customToastClassName);
  };

  return (
    <>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        className="copy-code-container"
      >
        <Typography
          variant="actionText"
          color="foundationColors.content.secondary"
        >
          {referralCode}
        </Typography>
        <Button
          title={STRINGS.copyCode}
          variant="link"
          size="small"
          dataAid="primary"
          onClick={handleCopy}
        />
      </Stack>
      <span onClick={onClickMail} style={{ marginTop: 0, marginLeft: "8px" }}>
        <Icon
          src={require("assets/iv_share_mail.svg")}
          size="48px"
          alt="info_icon"
          dataAid={STRINGS.shareIconDataAid}
        />
      </span>
    </>
  );
};

export default ShareCodeComponent;
