import React, { useEffect, useState, useRef } from "react";
import { Box, Collapse as CollapseLib, Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import PropTypes from "prop-types";
import "./CollapsibleReferalStatus.scss";
import Icon from "../../../designSystem/atoms/Icon";
import Lottie from "lottie-react";
import Badge from "../../../designSystem/atoms/Badge/Badge";
import Separator from "../../../designSystem/atoms/Separator";
import Button from "../../../designSystem/atoms/Button";
import { MY_REFERRALS } from "businesslogic/strings/referAndEarn";

const STRINGS = MY_REFERRALS;

const CollapsibleReferalStatus = ({
  id,
  imgSrc,
  label,
  onClick,
  disabled,
  sx,
  dataAid = 0,
  onClickCopy,
  showNotification,
  showSeparator = true,
  data = [],
  productName = "fisdom",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleCollapse = () => {
    const val = !isOpen;
    setIsOpen(val);
    onClick({ id, isOpen: val });
  };

  return (
    <>
      <Box
        sx={sx}
        className={`c-ref-wrapper ${disabled && "collapsed-disabled"}`}
        data-aid={`grp_referral` + dataAid}
      >
        <div className="c-label-wrapper" onClick={handleCollapse}>
          <Stack direction="row" alignItems="center">
            <Badge
              variant="dot"
              overlap="circular"
              invisible={!showNotification}
            >
              <Icon
                invisible={!showNotification}
                dataAid={STRINGS.cardImageDataAid}
                size="32px"
                src={imgSrc || require("assets/iv_profile.svg")}
                className="c-icon-wrapper"
              />
            </Badge>
            <Typography
              variant="body1"
              dataAid={STRINGS.cardTitleDataAid}
              style={{ marginLeft: "12px" }}
            >
              {label}
            </Typography>
          </Stack>
          <Icon
            dataAid={STRINGS.collapseIconDataAid}
            size="24px"
            src={
              isOpen
                ? require("assets/arrow_up_new.svg")
                : require("assets/arrow_down_new.svg")
            }
            className="c-icon-wrapper"
          />
        </div>
        <CollapseLib in={isOpen}>
          <>
            {data.map((item, index) => (
              <Stack
                key={index}
                className={`c-child-wrapper`}
                direction="row"
                justifyContent="space-between"
              >
                <Stack>
                  <Typography variant="body2" dataAid={item?.dataAid}>
                    {item?.name}
                  </Typography>
                  {item?.event_pending === true && (
                    <Typography
                      variant="body2"
                      color="foundationColors.secondary.coralOrange.400"
                      dataAid={`status${dataAid}`}
                    >
                      Pending
                    </Typography>
                  )}
                </Stack>
                {item?.event_pending === false ? (
                  <TickAnimationComp
                    isOpen={isOpen}
                    amount={item?.amount}
                    productName={productName}
                  />
                ) : (
                  <Button
                    title={STRINGS.copyBtn.text}
                    onClick={() => onClickCopy(id, index)}
                    variant={"link"}
                    dataAid={STRINGS.copyBtn.dataAid}
                    sx={{ alignSelf: "flex-start" }}
                  />
                )}
              </Stack>
            ))}
          </>
        </CollapseLib>
      </Box>
      {showSeparator && <Separator dataAid={dataAid} />}
    </>
  );
};

const TickAnimationComp = ({ isOpen, amount, productName }) => {
  const [showAinamtion, setShowAnimation] = useState(true);
  const lottieRef = useRef();

  useEffect(() => {
    const animationDuration = lottieRef?.current?.getDuration();
    const animationTimeout = setTimeout(() => {
      lottieRef?.current?.stop();
      setShowAnimation(false);
    }, animationDuration * 1000);

    if (isOpen) {
      lottieRef?.current?.play();
      setShowAnimation(true);
    } else {
      lottieRef?.current?.stop();
    }

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [isOpen]);

  return (
    <Box>
      <div style={{ display: showAinamtion ? "block" : "none" }}>
        <Lottie
          lottieRef={lottieRef}
          animationData={require(`assets/${productName}/lottie/tick.json`)}
          autoplay={false}
          loop={false}
          className="tick-anim"
          data-aid={`iv_${STRINGS.animationDataAid}`}
        />
      </div>
      {!showAinamtion && (
        <Typography
          variant="body2"
          color="foundationColors.secondary.profitGreen.400"
          className="fadein-animation"
          dataAid={STRINGS.amountDataAid}
        >
          {amount}
        </Typography>
      )}
    </Box>
  );
};

CollapsibleReferalStatus.propTypes = {
  isOpen: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  dataAid: PropTypes.string,
};

export default CollapsibleReferalStatus;
