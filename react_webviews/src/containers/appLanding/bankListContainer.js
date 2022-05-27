import React, { useState } from "react";
import BankList from "../../pages/AppLanding/BankList";
import { navigate as navigateFunc } from "../../utils/functions";

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

  return (
    <WrappedComponent
      bankList={bankList}
      handleChange={handleChange}
      selectedValue={selectedBank}
    />
  );
};

export default bankListContainer(BankList);
