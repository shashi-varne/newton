import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import BankList from "../../pages/AppLanding/BankList";
import { isEmpty } from "lodash-es";
import Api from "../../utils/api";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  getBankList,
  updateBankList,
} from "businesslogic/dataStore/reducers/app";
import useErrorState from "../../common/customHooks/useErrorState";
import useLoadingState from "../../common/customHooks/useLoadingState";

const screen = "BANK_LIST";
const bankListContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const { code } = useMemo(getConfig, []);
  const bankList = useSelector(getBankList);
  const [selectedBank, setSelectedBank] = useState("");
  const { isButtonLoading } = useLoadingState(screen);
  const { isUpdateFailed, errorMessage } = useErrorState(screen);

  const getBankListOptions = () => {
    let bankListData = [];
    // eslint-disable-next-line
    bankList?.forEach((data) => {
      bankListData.push({
        title: data.account_number,
        value: data.account_number,
        leftImgSrc: data.image_url,
      });
    });
    return bankListData;
  };

  const bankListOptions = useMemo(getBankListOptions, [bankList]);

  useEffect(() => {
    if (isUpdateFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isUpdateFailed]);

  const handleChange = (event) => {
    const value = event.target.value || "";
    setSelectedBank(value);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "bank_account_selection",
      properties: {
        user_action: userAction || "",
        screen_name: "select savings account",
        channel: code,
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onClick = () => {
    if (!selectedBank) {
      ToastMessage("Please select bank");
      return;
    }
    sendEvents("continue");
    const updatedBankList = bankList.map((data) => {
      if (data.account_number === selectedBank) {
        data.is_primary = "true";
      }
      return data;
    });
    const sagaCallback = (result) => {
      ToastMessage(result?.success);
      navigate("/");
    };
    dispatch(
      updateBankList({
        Api,
        screen,
        data: updatedBankList,
        sagaCallback,
      })
    );
  };

  return (
    <WrappedComponent
      bankList={bankListOptions}
      selectedValue={selectedBank}
      isButtonLoading={isButtonLoading}
      handleChange={handleChange}
      sendEvents={sendEvents}
      onClick={onClick}
    />
  );
};

export default bankListContainer(BankList);
