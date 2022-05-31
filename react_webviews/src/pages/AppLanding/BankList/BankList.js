import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import SelectionMode from "../../../designSystem/molecules/SelectionMode";
import { BANK_LIST } from "businesslogic/strings/webappLanding";

import "./BankList.scss";

const BankList = ({
  bankList,
  selectedValue,
  handleChange,
  onClick,
  sendEvents,
}) => {
  return (
    <Container
      headerProps={{
        headerTitle: BANK_LIST.headerData.title,
        subtitle: BANK_LIST.headerData.subtitle,
        dataAid: BANK_LIST.headerData.dataAid,
        disableSeeMoreFeature: true,
        hideLeftIcon: true,
      }}
      className="bank-list-wrapper"
      dataAid={BANK_LIST.dataAid}
      footer={{
        button1Props: {
          title: BANK_LIST.buttonTitle,
          onClick,
        },
      }}
      eventsData={sendEvents("just_set_events")}
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

export default BankList;
