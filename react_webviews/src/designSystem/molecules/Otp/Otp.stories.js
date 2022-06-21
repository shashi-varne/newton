import React from "react";
import Otp from "./Otp";

export default {
  component: Otp,
  title: "Molecules/Otp",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const Default = (args) => <Otp {...args} />;

Default.args = {
  isDisabled: false,
  infoText: "OTP will recieve in",
  otpTimerInSeconds: 10,
  buttonText: "Retry",
  onClickButton: () => {},
  onChange: () => {},
};
