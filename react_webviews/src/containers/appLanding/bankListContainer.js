import React, { useState } from "react";
import BankList from "../../pages/AppLanding/BankList";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const bankList = [
  {
    title: "1827 8329 84",
    leftImgSrc: require(`assets/stocks.svg`),
    value: "0",
  },
  {
    title: "1827 8329 85",
    leftImgSrc: require(`assets/stocks.svg`),
    value: "1",
  },
];

const screen = "BANK_LIST";
const bankListContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [selectedBank, setSelectedBank] = useState("");

  const handleChange = (event) => {
    const value = event.target.value || "";
    setSelectedBank(value);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "bank_account_selection",
      properties: {
        user_action: userAction || "",
        screen_name: "select savings account",
        channel: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onClick = () => {
    sendEvents("continue");
  };

  return (
    <WrappedComponent
      bankList={bankList}
      handleChange={handleChange}
      selectedValue={selectedBank}
      sendEvents={sendEvents}
      onClick={onClick}
    />
  );
};

export default bankListContainer(BankList);
