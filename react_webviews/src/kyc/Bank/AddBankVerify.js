import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService } from "utils/validators";
import { navigate as navigateFunc } from "utils/functions";
import { STORAGE_CONSTANTS, PATHNAME_MAPPER } from "../constants";
import { getFlow } from "../common/functions";
import {
  saveBankData,
  getBankStatus,
  getUserKycFromSummary,
} from "../common/api";
import toast from "../../common/ui/Toast";
import PennyDialog from "../mini-components/PennyDialog";
import PennyFailedDialog from "../mini-components/PennyFailedDialog";
import PennySuccessDialog from "../mini-components/PennySuccessDialog";
import PennyExhaustedDialog from "../mini-components/PennyExhaustedDialog";
import { SkeltonRect } from "common/ui/Skelton";
import { getConfig } from "utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import useUserKycHook from "../common/hooks/userKycHook";

const AddBankVerify = (props) => {
  const [count, setCount] = useState(20);
  const [showLoader, setShowLoader] = useState(true);
  const [countdownInterval, setCountdownInterval] = useState();
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isPennyOpen, setIsPennyOpen] = useState(false);
  const [isPennyFailed, setIsPennyFailed] = useState(false);
  const [isPennySuccess, setIsPennySuccess] = useState(false);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  const [userKyc, setUserKyc] = useState({});
  const bank_id = props.match.params?.bank_id;
  if (!bank_id) {
    props.history.goBack();
  }
  const [bankData, setBankData] = useState({});
  const navigate = navigateFunc.bind(props);
  const { isLoading, updateKyc } = useUserKycHook();
  const stateParams = props.location?.state || {};

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await getUserKycFromSummary();
    let kyc = storageService().getObject(STORAGE_CONSTANTS.KYC) || {};
    updateKyc(kyc);
    let data = kyc.additional_approved_banks.find(
      (obj) => obj.bank_id?.toString() === bank_id
    );
    if(!data && kyc.bank.meta_data.bank_id === Number(bank_id)) {
      data = kyc.bank.meta_data;
      data.status = "default";
    }
    setShowLoader(false);
    setBankData({ ...data });
    setUserKyc(kyc);
  };

  const handleClick = async () => {
    sendEvents("next")
    try {
      setIsApiRunning("button");
      const result = await saveBankData({ bank_id: bank_id });
      if (!result) throw new Error("No result. Something went wrong");
      if (result.code === "ERROR") {
        toast(result.message);
      } else if (userKyc.address.meta_data.is_nri) {
        uploadDocuments();
      } else {
        pennyLoader();
      }
    } catch (err) {
      console.log(err);
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const pennyLoader = () => {
    setIsPennyOpen(true);
    let value = count;
    let intervalId = setInterval(() => {
      value--;
      if (value === 10) {
        checkBankStatusStep1();
        setCount(value);
      } else if (value === 0) {
        setCount(0);
        clearInterval(intervalId);
        setCountdownInterval(null);
        checkBankStatusStep2();
      } else {
        setCount(value);
      }
    }, 1000);
    setCountdownInterval(intervalId);
  };

  const checkBankStatusStep1 = async () => {
    try {
      const result = await getBankStatus({ bank_id: bank_id });
      if (!result) return;
      if (result.code === "ERROR") {
        throw new Error(result.message);
      }
      if (result.records.PBI_record.bank_status === "verified") {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
        setIsPennyOpen(false);
        setIsPennySuccess(true);
      }
      if (result.records.PBI_record.bank_status === "rejected") {
        setCountdownInterval(null);
        setIsPennyOpen(false);
        if (result.records.PBI_record.user_rejection_attempts === 0) {
          setIsPennyExhausted(true);
        } else {
          setIsPennyFailed(true);
        }
      }
      updateKyc(result.kyc);
    } catch (err) {
      console.log(err);
      clearInterval(countdownInterval);
      setCountdownInterval(null);
      setIsPennyOpen(false);
      setIsPennyFailed(true);
    }
  };

  const checkBankStatusStep2 = async () => {
    try {
      const result = await getBankStatus({ bank_id: bank_id });
      setIsPennyOpen(false);
      if (!result) return;
      if (result.code === "ERROR") {
        throw new Error(result.message);
      }
      if (result.records.PBI_record.bank_status === "verified") {
        setIsPennySuccess(true);
      } else if (result.records.PBI_record.user_rejection_attempts === 0) {
        setIsPennyExhausted(true);
      } else {
        setIsPennyFailed(true);
      }
      updateKyc(result.kyc);
    } catch (err) {
      console.log(err);
      setIsPennyFailed(true);
    }
  };

  const checkBankDetails = () => {
    navigate(PATHNAME_MAPPER.addBank, {
      state: {
        bank_id: bankData.bank_id,
      },
    });
  };

  const uploadDocuments = () => {
    navigate(
      `/kyc/${
        userKyc.kyc_status === "compliant" ? "compliant" : "non-compliant"
      }/upload-documents`,
      {
        searchParams: `${
          getConfig().searchParams
        }&additional=true${bankData.status !== "default" ? `&bank_id=${bank_id}` : ""}`,
      }
    );
  };

  const goTobankLists = () => {
    navigate(PATHNAME_MAPPER.bankList);
  };

  const edit = () => () => {
    navigate(PATHNAME_MAPPER.addBank, {
      state: {
        bank_id: bankData.bank_id,
      },
    });
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "KYC_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "bank_details",
        account_number: bankData.account_number ? "yes" : "no",
        ifsc_code: bankData.ifsc_code ? "yes" : "no",
        account_type: bankData.account_type ? "yes" : "no",
        c_account_number: bankData.account_number ? "yes" : "no",
        flow: getFlow(userKyc) || "",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const goBack = () => {
    if(stateParams.goBackToAddBank) {
      navigate(PATHNAME_MAPPER.addBank, {
        state: {
          bank_id: bankData.bank_id
        }
      })
    } else {
      props.history.goBack();
    }
  }

  return (
    <Container
      buttonTitle="VERIFY BANK ACCOUNT"
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning}
      noFooter={showLoader || isLoading}
      handleClick={handleClick}
      title="Verify your bank account"
      data-aid='kyc-approved-bank-verify-screen'
      headerData={{ goBack }}
    >
      <div className="kyc-approved-bank-verify" data-aid='kyc-approved-bank-verify'>
        <WVInfoBubble
          type="info"
          hasTitle
          customTitle="Important"
          dataAid='kyc-verification-wvinfo'
        >
          We will credit ₹1 to your bank account for verification.
        </WVInfoBubble>
        {showLoader && (
          <>
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
          </>
        )}
        {!showLoader && (
          <>
            <div className="item" data-aid='kyc-bank-name'>
              <div className="flex">
                <div className="left">
                  <img
                    className="ifsc-new-img2"
                    src={bankData.ifsc_image}
                    alt="bank-logo"
                  />
                </div>
                <div className="right" data-aid='bank-name'>
                  <div>{bankData.bank_name}</div>
                  <div className="text">{bankData.branch_name} </div>
                </div>
              </div>
              <div className="edit" data-aid='kyc-edit' onClick={edit()}>
                EDIT
              </div>
            </div>
            <div className="item" data-aid='kyc-account-number'>
              <div className="left">Account number</div>
              <div className="right"> {bankData.account_number} </div>
            </div>
            <div className="item" data-aid='kyc-ifsc-code'>
              <div className="left">IFSC code</div>
              <div className="right">{bankData.ifsc_code} </div>
            </div>
            <div className="item" data-aid='kyc-account-type'>
              <div className="left">Account type</div>
              <div className="right"> {bankData.account_type} </div>
            </div>
          </>
        )}
        <PennyDialog isOpen={isPennyOpen} count={count} />
        <PennyFailedDialog
          isOpen={isPennyFailed}
          uploadDocuments={uploadDocuments}
          checkBankDetails={checkBankDetails}
        />
        <PennySuccessDialog isOpen={isPennySuccess} kyc={userKyc} redirect={goTobankLists} />
        <PennyExhaustedDialog
          isOpen={isPennyExhausted}
          redirect={goTobankLists}
          uploadDocuments={uploadDocuments}
        />
      </div>
    </Container>
  );
};

export default AddBankVerify;
