import React, { useEffect, useMemo, useState } from "react";
import ClaimCashRewards from "../../pages/ReferAndEarn/ClaimCashRewards";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import { isEmpty, get } from "lodash-es";
import { ERROR_MESSAGES } from "businesslogic/constants/referAndEarn";
import {
  getWalletBalance,
  getWalletBalanceData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import { trigger_wallet_transfer } from "businesslogic/apis/referAndEarn";
import Api from "../../utils/api";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../constants/referAndEarn";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { isReadyToInvest } from "../../kyc/services";
import useErrorState from "../../common/customHooks/useErrorState";

const screen = "CLAIM_CASH_REWARDS";

const claimCashRewardsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isPageLoading } = useLoadingState(screen);

  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const [errorData, setErrorData] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  const walletBalance = useSelector(getWalletBalanceData);
  const totalBalance = walletBalance.balance_amount;
  const minAmount = walletBalance.min_withdraw_limit;
  const [showErrorBottomSheet, setShowErrorBottonSheet] = useState(false);
  const { user, kyc, isLoading } = useUserKycHook();

  const accDetails = useMemo(() => {
    const bankName = get(kyc, "bank.meta_data.bank_code", "");
    const accountNumber = get(kyc, "bank.meta_data.account_number", "");
    return { name: bankName, number: accountNumber?.slice(-4) };
  }, [kyc]);

  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState("");
  const [transferFullFlag, setTransferFullFlag] = useState(false);
  const isButtonDisabled =
    isPageLoading ||
    isLoading ||
    !isEmpty(inputError) ||
    amount < minAmount ||
    !amount ||
    amount == 0;

  const dispatch = useDispatch();

  const initialize = () => {
    dispatch(
      getWalletBalance({
        Api: Api,
        screen: screen,
      })
    );
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (transferFullFlag) {
      setAmount(totalBalance);
    }
  }, [transferFullFlag]);

  useEffect(() => {
    if (isFetchFailed) {
      setErrorData({
        handleClick: initialize,
        subtitle: errorMessage,
      });
    }
  }, [isFetchFailed]);

  const onChangeAmount = (event) => {
    const val = event.target.value;

    if (isNaN(val)) {
      return;
    }

    if (transferFullFlag) {
      setTransferFullFlag(false);
    }

    if (inputError) {
      setInputError("");
    }

    setAmount(Math.trunc(val));
    if (val > totalBalance) {
      setInputError(ERROR_MESSAGES.transferAmountExceeded);
    }
  };

  const sendEvents = (userAction) => {
    const screenName = showErrorBottomSheet
      ? "transfer failed"
      : "claim_cash_rewards";
    const userKycReady = isReadyToInvest();

    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: screenName,
        transfer_full_amount: transferFullFlag ? "yes" : "no",
        amount: amount,
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: userKycReady || false,
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

  const onClickTransfer = async () => {
    sendEvents("transfer_now");
    try {
      setShowLoader(true);
      await trigger_wallet_transfer(Api, { amount });
      navigate(REFER_AND_EARN_PATHNAME_MAPPER.withdrawPlaced, {
        state: {
          amount: amount,
        },
        edit: true,
      });
    } catch (error) {
      console.error(error);
      setShowErrorBottonSheet(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <WrappedComponent
      minAmount={minAmount}
      totalBalance={totalBalance}
      amount={amount}
      onChangeAmount={onChangeAmount}
      inputError={inputError}
      sendEvents={sendEvents}
      isPageLoading={isPageLoading || isLoading}
      buttonDisabled={isButtonDisabled}
      isButtonLoading={showLoader}
      accDetails={accDetails}
      transferFullFlag={transferFullFlag}
      onCheckTransferFull={onCheckTransferFull}
      onClickTransfer={onClickTransfer}
      showErrorBottomSheet={showErrorBottomSheet}
      setShowErrorBottonSheet={setShowErrorBottonSheet}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
    />
  );
};

export default claimCashRewardsContainer(ClaimCashRewards);
