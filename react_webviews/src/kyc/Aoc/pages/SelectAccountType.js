import React, { useMemo, useState } from "react";
import Container from "../../common/Container";
import { AccountType } from "../mini-components/AccountType";
import DematCharges from "../mini-components/DematCharges";
import TermsAndConditions from "../../mini-components/TermsAndConditions";
import { navigate as navigateFunc } from "../../../utils/functions";
import Toast from "../../../common/ui/Toast";
import {
  handleNativeExit,
  nativeCallback,
} from "../../../utils/native_callback";
import useUserKycHook from "../../common/hooks/userKycHook";
import { ACCOUNT_TYPES } from "../common/constants";
import { PATHNAME_MAPPER } from "../../constants";
import "./PaymentStatus.scss";
import ConfirmBackDialog from "../../mini-components/ConfirmBackDialog";
import { getAocData, isEquityAocApplicable } from "../common/functions";

const SelectAccountType = (props) => {
  const navigate = navigateFunc.bind(props);
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_TYPES[0]);
  const [checkTermsAndConditions, setCheckTermsAndConditions] = useState(true);
  const [showSkelton, setShowSkelton] = useState(false);
  const [openDematCharges, setOpenDematCharges] = useState(false);
  const [openConfirmBackModal, setOpenConfirmBackModal] = useState(false);
  const { kyc, isLoading } = useUserKycHook();

  const initializeKycData = () => {
    const isAocApplicable = isEquityAocApplicable(kyc);
    const aocData = getAocData(kyc);
    return {
      isAocApplicable,
      aocData,
    };
  };

  const { isAocApplicable, aocData } = useMemo(initializeKycData, [kyc]);

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
    if (selectedAccount.value === "trading") {
      navigate(PATHNAME_MAPPER.aocPaymentSummary);
    } else {
      navigate(PATHNAME_MAPPER.aocMfVsTrading);
    }
  };

  const handleDematCharges = (value) => () => {
    setOpenDematCharges(value);
  };

  const handleConfirmBackDialog = (value) => () => {
    setOpenConfirmBackModal(value);
  };

  const redirectToHome = () => {
    handleNativeExit(props, { action: "exit" });
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
      headerData={{ goBack: handleConfirmBackDialog(true) }}
    >
      {ACCOUNT_TYPES.map((data, index) => (
        <AccountType
          key={index}
          data={data}
          isSelected={selectedAccount.value === data.value}
          handleClick={handleAccountType(data)}
          amount={aocData.amount}
          isFree={!isAocApplicable}
          onElementClick={handleDematCharges(true)}
        />
      ))}
      <TermsAndConditions
        checkTermsAndConditions={checkTermsAndConditions}
        handleCheckBox={handleCheckBox}
        setShowSkelton={setShowSkelton}
      />
      <DematCharges
        equityChargesData={kyc.equity_account_charges_v2}
        isOpen={openDematCharges}
        onClose={handleDematCharges(false)}
      />
      <ConfirmBackDialog
        isOpen={openConfirmBackModal}
        close={handleConfirmBackDialog(false)}
        goBack={redirectToHome}
      />
    </Container>
  );
};

export default SelectAccountType;
