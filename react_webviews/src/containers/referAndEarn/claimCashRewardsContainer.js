import React, { useEffect, useState } from "react";
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
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../pages/ReferAndEarn/common/constants";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
const screen = "CLAIM_CASH_REWARDS";

const claimCashRewardsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isPageLoading } = useLoadingState(screen);

  const walletBalance = useSelector(getWalletBalanceData);
  const totalBalance = walletBalance.total_amount;
  const minAmount = walletBalance.min_withdraw_limit;
  const [showErrorBottomSheet, setShowErrorBottonSheet] = useState(false);
  const { user, kyc, isLoading } = useUserKycHook();

  const bankName = get(kyc, "bank.meta_data.bank_code", "");
  const accountNumber = get(kyc, "bank.meta_data.account_number", "");
  const accDetails = { name: bankName, number: accountNumber?.slice(-4) };

  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState("");
  const [transferFullFlag, setTransferFullFlag] = useState(false);

  const dispatch = useDispatch();

  const initialize = () => {
    if (isEmpty(walletBalance)) {
      dispatch(
        getWalletBalance({
          Api: Api,
          screen: screen,
        })
      );
    }
  };

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
    const screenName = setShowErrorBottonSheet
      ? "transfer failed"
      : "claim_cash_rewards";

    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: screenName,
        transfer_full_amount: transferFullFlag ? "yes" : "no",
        amount: amount,
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
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
      const resp = await trigger_wallet_transfer(Api, { amount });
      console.log({ resp });
      navigate(REFER_AND_EARN_PATHNAME_MAPPER.withdrawPlaced, {
        state: {
          amount: amount,
        },
      });
    } catch (error) {
      console.error(error);
      setShowErrorBottonSheet(true);
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
      buttonDisabled={
        isPageLoading || isLoading || !isEmpty(inputError) || amount < minAmount
      }
      accDetails={accDetails}
      transferFullFlag={transferFullFlag}
      onCheckTransferFull={onCheckTransferFull}
      onClickTransfer={onClickTransfer}
      showErrorBottomSheet={showErrorBottomSheet}
      setShowErrorBottonSheet={setShowErrorBottonSheet}
    />
  );
};

export default claimCashRewardsContainer(ClaimCashRewards);
