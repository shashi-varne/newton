import { Box, Input, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import "./Otp.scss";
import PropTypes from "prop-types";

const OTP_STATUS = {
  DISABLED: "disabled",
  ACTIVE: "active",
  DEFAULT: "default",
  ERROR: "error",
  helper: "helper",
};

const Otp = ({
  isDisabled,
  errorMessage,
  helperText,
  infoText,
  buttonText,
  onClickButton,
  onChange,
  otpTimerInSeconds,
}) => {
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);
  const boxList = [box1, box2, box3, box4];
  const [otpStatus, setOtpStatus] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(otpTimerInSeconds || 30);
  const [showRetryButton, setShowRetryButton] = useState(false);

  const customBorderColor = {
    disabled: "foundationColors.supporting.gainsboro",
    default: "foundationColors.content.tertiary",
    active: "foundationColors.primary.500",
    error: "foundationColors.secondary.lossRed.400",
    helper: "foundationColors.primary.500",
  };

  useEffect(() => {
    if (isDisabled) {
      setOtpStatus(OTP_STATUS.DISABLED);
    } else if (!!errorMessage) {
      setOtpStatus(OTP_STATUS.ERROR);
    } else {
      setOtpStatus(OTP_STATUS.DEFAULT);
    }
    box1.current.focus();
    runTimer();
  }, []);

  const runTimer = () => {
    let currentTime = otpTimer;
    let timer = setInterval(() => {
      if (currentTime >= 0) {
        setOtpTimer(currentTime);
        currentTime--;
      } else {
        clearInterval(timer);
        setShowRetryButton(true);
      }
    }, 1000);
  };
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (otpStatus !== OTP_STATUS.DEFAULT) {
      setOtpStatus(OTP_STATUS.DEFAULT);
    }
    if (isNaN(parseInt(value))) return;
    if (value.length > 1) return;
    const otpValuesCopy = [...otpValues];
    otpValuesCopy[index] = value;
    if (index === otpValues.length - 1) {
      onChange(`${parseInt(otpValuesCopy.join(""))}`);
    }
    setOtpValues(otpValuesCopy);
    setOtpStatus(OTP_STATUS.ACTIVE);
    if (boxList[index + 1]) {
      boxList[index + 1].current.focus();
    }
  };

  const getOtpDigits = () => {
    if (!otpValues.every((val) => val !== "")) return;
    return `${parseInt(otpValues.join(""))}`;
  };

  const handleBackspace = (e, index) => {
    const otpValuesCopy = [...otpValues];
    if (e.key !== "Backspace") return;
    if (!boxList[index - 1]) return;

    if (otpValuesCopy[index] !== "") {
      otpValuesCopy[index] = "";
    } else {
      boxList[index - 1].current.focus();
      otpValuesCopy[index - 1] = "";
    }
    let isAllValuesEmpty = otpValuesCopy.every((val) => val === "");
    if (isAllValuesEmpty) {
      setOtpStatus(OTP_STATUS.DEFAULT);
    }
    setOtpValues(otpValuesCopy);
  };

  return (
    <Box className="otp-container">
      <Box className="otp-items-container">
        <Box className="input-container">
          {boxList.map((box, index) => {
            return (
              <Input
                key={index}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="input-item"
                type="text"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                autoComplete="off"
                disabled={isDisabled}
                inputRef={box}
                maxLength={1}
                onFocus={(e) => e.target.select()}
                disableUnderline={true}
                value={otpValues[index]}
                sx={{
                  borderBottomColor: customBorderColor[otpStatus],
                }}
              />
            );
          })}
        </Box>
        <Box className="otp-info-box">
          {(!!errorMessage || !!helperText) && (
            <Typography
              variant="body5"
              color={
                !!errorMessage
                  ? "foundationColors.secondary.lossRed.400"
                  : "foundationColors.content.tertiary"
              }
              className={!!errorMessage ? "error" : "helper-text"}
              dataAid={!!errorMessage ? "error" : "helperText"}
            >
              {!!errorMessage ? errorMessage : helperText}
            </Typography>
          )}
        </Box>
        <Stack
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          className="otp-retry"
        >
          {showRetryButton ? (
            <Button onClick={onClickButton} variant="link" title={buttonText} />
          ) : (
            <Typography
              variant="body2"
              color={"foundationColors.content.secondary"}
              dataAid="otpTime"
              className="otp-info-text"
            >
              {infoText} {otpTimer}s
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

Otp.defaultProps = {
  isDisabled: false,
  errorMessage: "",
  helperText: "",
  infoText: "",
  buttonText: "",
  onClickButton: () => {},
  onChange: () => {},
  otpTimerInSeconds: 30,
};

Otp.propTypes = {
  isDisabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  helperText: PropTypes.string,
  infoText: PropTypes.string,
  buttonText: PropTypes.string,
  onClickButton: () => {},
  onChange: () => {},
  otpTimerInSeconds: PropTypes.number,
};

export default Otp;
