import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import SelectionMode from "../../../designSystem/molecules/SelectionMode";

import "./BankList.scss";

const MfLanding = ({ bankList, selectedValue, handleChange, onClick }) => {
  return (
    <Container
      headerProps={{
        headerTitle: "Select savings account",
        subtitle:
          "The selected account will be your primary account & will be used for investments & withdrawal",
        dataAid: "selectAccount",
        disableSeeMoreFeature: true,
        hideLeftIcon: true,
      }}
      className="bank-list-wrapper"
      dataAid="onboarding"
      footer={{
        button1Props: {
          title: "Continue",
          onClick,
        },
      }}
    >
      <SelectionMode
        variant="radio"
        options={bankList}
        handleChange={handleChange}
        selectedValue={selectedValue}
        dataAid="bankAccount"
        className="sm-bank-list"
      />
    </Container>
  );
};

export default MfLanding;
