import React, { useState } from "react";
import Container from "../../common/Container";
import { AccountType } from "../mini-components/AccountType";
import TermsAndConditions from "../../mini-components/TermsAndConditions";
import Toast from "../../../common/ui/Toast";
import { nativeCallback } from "../../../utils/native_callback";
import useUserKycHook from "../../common/hooks/userKycHook";
import { ACCOUNT_TYPES } from "../common/constants";
import "./PaymentStatus.scss";

const SelectAccountType = (props) => {
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_TYPES[0]);
  const [checkTermsAndConditions, setCheckTermsAndConditions] = useState(true);
  const [showSkelton, setShowSkelton] = useState(false);
  const { kyc, isLoading } = useUserKycHook();

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "select_account_type",
        account_selected: selectedAccount.eventValue,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleAccountType = (data) => () => {
    setSelectedAccount(data);
  };

  const handleCheckBox = () => {
    setCheckTermsAndConditions(!checkTermsAndConditions);
  };

  const handleClick = () => {
    sendEvents("next");
    if (!checkTermsAndConditions) {
      Toast("Tap on T&C check box to continue");
      return;
    }
  };

  return (
    <Container
      skelton={isLoading || showSkelton}
      buttonTitle="Continue"
      title="Select account type"
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="aocSelectAccountType"
      noBackIcon={showSkelton}
    >
      {ACCOUNT_TYPES.map((data, index) => (
        <AccountType
          key={index}
          data={data}
          isSelected={selectedAccount.value === data.value}
          handleClick={handleAccountType(data)}
          amount={kyc?.equity_account_charges?.account_opening.charges}
          isFree={!kyc?.is_equity_aoc_applicable}
        />
      ))}
      <TermsAndConditions
        checkTermsAndConditions={checkTermsAndConditions}
        handleCheckBox={handleCheckBox}
        setShowSkelton={setShowSkelton}
      />
    </Container>
  );
};

export default SelectAccountType;
