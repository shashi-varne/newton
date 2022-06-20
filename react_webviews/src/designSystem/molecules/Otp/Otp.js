import { Box, Input } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./Otp.scss";

const OTP_STATUS = {
  DISABLED: "disabled",
  ACTIVE: "active",
  DEFAULT: "default",
  ERROR: "error",
  helper: "HELPER",
};

function Otp({ isDisabled }) {
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);
  const boxList = [box1, box2, box3, box4];
  const [otpStatus, setOtpStatus] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  const customBorderColor = {
    disabled: "#DCDEE6",
    default: "#888FAF",
    active: "#6B40DD",
    error: "#D04954",
    helper: "#6B40DD",
  };

  useEffect(() => {
    if (isDisabled) {
      setOtpStatus(OTP_STATUS.DISABLED);
    } else {
      setOtpStatus(OTP_STATUS.DEFAULT);
    }
    box1.current.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(parseInt(value))) return;
    const otpValuesCopy = [...otpValues];
    otpValuesCopy[index] = value;
    setOtpValues(otpValuesCopy);
    setOtpStatus(OTP_STATUS.ACTIVE);
    if (boxList[index + 1]) {
      console.log(boxList[index + 1]);
      boxList[index + 1].current.focus();
    }
  };

  const getOtpDigits = () => {
    if (!otpValues.every((val) => val !== "")) return;
    console.log(`${parseInt(otpValues.join(""))}`);
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
    <>
      <Box className="otp-container">
        {boxList.map((box, index) => {
          return (
            <Input
              key={index}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="input-item"
              type="text"
              disabled={isDisabled}
              inputRef={box}
              maxLength={1}
              disableUnderline={true}
              value={otpValues[index]}
              style={{
                borderBottomColor: customBorderColor[otpStatus],
              }}
            />
          );
        })}
      </Box>
      <div>
        <button style={{ marginTop: 50 }} onClick={getOtpDigits}>
          get otp
        </button>
      </div>
    </>
  );
}

export default Otp;
