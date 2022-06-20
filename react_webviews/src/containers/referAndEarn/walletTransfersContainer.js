import React, { useEffect, useMemo, useState } from "react";
import WalletTransfers from "../../pages/ReferAndEarn/WalletTransfer";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import { WALLET_TRANSFERS_FILTER_DATA } from "businesslogic/constants/referAndEarn";
import {
  getWalletTransactions,
  getWalletTransactionsData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import { isEmpty } from "lodash-es";
import { getFnsFormattedDate } from "../../pages/ReferAndEarn/common/utils";
import { formatAmountInr } from "businesslogic/utils/common/functions";
import ToastMessage from "../../designSystem/atoms/ToastMessage";

const screen = "WALLET_TRANSFERS";

const walletTransfersContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { isWeb } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const [filterApplied, setFilterApplied] = useState(
    WALLET_TRANSFERS_FILTER_DATA[0].value
  );

  const walletTransactions = useSelector(getWalletTransactionsData);
  let walletTransactionsViewData = getWalletTransactionsViewData(
    walletTransactions,
    filterApplied
  );

  const dispatch = useDispatch();

  const initialize = () => {
    dispatch(
      getWalletTransactions({
        Api: Api,
        screen: screen,
      })
    );
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isFetchFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed]);

  const handleWalletFilter = (e, val) => {
    setFilterApplied(val);
  };

  const onClickContact = () => {};

  return (
    <WrappedComponent
      transactionData={walletTransactionsViewData}
      isWeb={isWeb}
      filterApplied={filterApplied}
      handleWalletFilter={handleWalletFilter}
      onClickContact={onClickContact}
      isPageLoading={isPageLoading}
      navigate={navigate}
    />
  );
};

const getWalletTransactionsViewData = (walletTransactions, filterApplied) => {
  let walletTransactionsViewData = walletTransactions.map((item, index) => {
    const acc =
      item?.to_account_number &&
      item?.bank_name &&
      `${item.bank_name}••••••••${item?.to_account_number?.substring(6)}`;
    const date = getFnsFormattedDate(
      item?.dt_updated,
      "yyyy-MM-dd",
      "dd MMM, yyyy"
    );
    return {
      amount: formatAmountInr(item.amount),
      date: date || "NA",
      account: acc || "NA",
      status: item.status,
    };
  });

  if (!isEmpty(filterApplied) && filterApplied !== "all") {
    walletTransactionsViewData = walletTransactionsViewData.filter(
      (item) => item.status === filterApplied
    );
  }
  return walletTransactionsViewData;
};

export default walletTransfersContainer(WalletTransfers);
