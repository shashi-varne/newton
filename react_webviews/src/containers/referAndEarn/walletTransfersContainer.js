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
import { getFnsFormattedDate } from "../../business/referAndEarn/utils";
import { formatAmountInr } from "businesslogic/utils/common/functions";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import { nativeCallback } from "../../utils/native_callback";
import { capitalizeFirstLetter } from "../../utils/validators";

const screen = "WALLET_TRANSFERS";

const walletTransfersContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { Web: isWeb, mobile, productName } = useMemo(getConfig, []);
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const [errorData, setErrorData] = useState({});

  const [filterApplied, setFilterApplied] = useState(
    WALLET_TRANSFERS_FILTER_DATA[0]
  );

  const walletTransactions = useSelector(getWalletTransactionsData);
  let walletTransactionsViewData = useMemo(
    () => getWalletTransactionsViewData(walletTransactions),
    [walletTransactions]
  );

  const noTransferData = useMemo(
    () => walletTransactions.length === 0,
    [walletTransactions]
  );

  let filteredData = useMemo(
    () =>
      getFilteredTansactionsData(
        walletTransactionsViewData,
        filterApplied.value
      ),
    [walletTransactionsViewData, filterApplied]
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
    if (isFetchFailed) {
      setErrorData({
        handleClick: initialize,
        subtitle: errorMessage,
      });
    }
  }, [isFetchFailed]);

  const handleWalletFilter = (e, val) => {
    setFilterApplied(val);
  };

  const onClickContact = () => {
    navigate("/help", {
      state: {
        popOnBack: true,
      },
    });
  };

  return (
    <WrappedComponent
      transactionData={filteredData}
      isWeb={isWeb}
      filterApplied={filterApplied}
      handleWalletFilter={handleWalletFilter}
      onClickContact={onClickContact}
      isPageLoading={isPageLoading}
      navigate={navigate}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
      productName={productName}
      noData={noTransferData}
    />
  );
};

const getWalletTransactionsViewData = (walletTransactions = []) => {
  let walletTransactionsViewData = walletTransactions.map((item, index) => {
    const acc =
      item?.to_account_number &&
      item?.bank_name &&
      `${item.bank_name}••••••••${item?.to_account_number?.substr(-4)}`;

    const date = getFnsFormattedDate(
      item?.dt_updated,
      "yyyy-MM-dd",
      "dd MMM, yyyy"
    );

    let statusLabel = capitalizeFirstLetter(item.status);
    if (statusLabel === "Success") {
      statusLabel = "Successful";
    }

    return {
      amount: formatAmountInr(item.amount),
      date: date || "NA",
      account: acc || "NA",
      status: item.status,
      statusLabel: statusLabel,
    };
  });

  return walletTransactionsViewData;
};

const getFilteredTansactionsData = (
  walletTransactionsViewData,
  filterApplied
) => {
  let filteredData = walletTransactionsViewData;
  if (!isEmpty(filterApplied) && filterApplied !== "all") {
    filteredData = walletTransactionsViewData.filter(
      (item) => item.status === filterApplied
    );
  }
  return filteredData;
};

export default walletTransfersContainer(WalletTransfers);
