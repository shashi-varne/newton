import React, { useEffect, useMemo, useState } from "react";
import ClaimCashRewards from "../../pages/ReferAndEarn/ClaimCashRewards";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import { isEmpty } from "lodash-es";
import { ERROR_MESSAGES } from "businesslogic/constants/referAndEarn";

const screen = "CLAIM_CASH_REWARDS";

const claimCashRewardsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isUpdateFailed, isFetchFailed, errorMessage } = useErrorState(screen);
  //Temporary data: these will come from api
  const totalBalance = 2000;
  const minAmount = 200;
  const accDetails = { name: "HFFC", number: "9220" };
  //end Temporary data: these will come from api

  const [amount, setAmount] = useState(minAmount);
  const [inputError, setInputError] = useState("");
  const [transferFullFlag, setTransferFullFlag] = useState(false);
  const isButtonDisabled =
    isPageLoading || !isEmpty(inputError) || amount < minAmount;

  const dispatch = useDispatch();

  const initialize = () => {};

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (transferFullFlag) {
      setAmount(totalBalance);
    }
  }, [transferFullFlag]);

  const onChangeAmount = (event) => {
    const val = event.target.value;

    if (transferFullFlag) {
      setTransferFullFlag(false);
    }

    if (inputError) {
      setInputError("");
    }

    setAmount(val);
    if (val > totalBalance) {
      setInputError(ERROR_MESSAGES.transferAmountExceeded);
    }
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "",
      properties: {
        user_action: userAction || "",
        screen_name: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onCheckTransferFull = () => {
    setTransferFullFlag(!transferFullFlag);
  };

  return (
    <WrappedComponent
      minAmount={minAmount}
      totalBalance={totalBalance}
      amount={amount}
      onChangeAmount={onChangeAmount}
      inputError={inputError}
      sendEvents={sendEvents}
      isPageLoading={isPageLoading}
      buttonDisabled={isButtonDisabled}
      accDetails={accDetails}
      transferFullFlag={transferFullFlag}
      onCheckTransferFull={onCheckTransferFull}
    />
  );
};

export default claimCashRewardsContainer(ClaimCashRewards);
