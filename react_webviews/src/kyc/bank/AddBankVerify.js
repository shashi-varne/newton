import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Alert from "../mini_components/Alert";
import { storageService } from "utils/validators";
import { storageConstants, getPathname } from "../constants";
import { navigate as navigateFunc } from "../common/functions";
import {
  saveBankData,
  getBankStatus,
  getUserKycFromSummary,
} from "../common/api";
import toast from "common/ui/Toast";
import PennyDialog from "../mini_components/PennyDialog";
import PennyFailedDialog from "../mini_components/PennyFailedDialog";
import PennySuccessDialog from "../mini_components/PennySuccessDialog";
import PennyExhaustedDialog from "../mini_components/PennyExhaustedDialog";
import { SkeltonRect } from "../../common/ui/Skelton";

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
  const bank_id = props.match.params.bank_id;
  if (!bank_id) {
    props.history.goBack();
  }
  const [bankData, setBankData] = useState({});
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await getUserKycFromSummary();
    let kyc = storageService().getObject(storageConstants.KYC) || {};
    let data = kyc.additional_approved_banks.find(
      (obj) => obj.bank_id?.toString() === bank_id
    );
    setShowLoader(false);
    setBankData({ ...data });
    setUserKyc(kyc);
  };

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      const result = await saveBankData({ bank_id: bank_id });
      if (!result) return;
      if (result.code === "ERROR") {
        toast(result.message);
      } else if (userKyc.address.meta_data.is_nri) {
        navigate();
      } else {
        pennyLoader();
      }
    } catch (err) {
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
    } catch (err) {
      console.log(err);
    }
  };

  const checkBankStatusStep2 = async () => {
    try {
      const result = await getBankStatus({ bank_id: bank_id });
      setIsPennyOpen(false);
      if (!result) return;
      if (result.records.PBI_record.bank_status === "verified") {
        setIsPennySuccess(true);
      } else if (result.records.PBI_record.user_rejection_attempts === 0) {
        setIsPennyExhausted(true);
      } else {
        setIsPennyFailed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkBankDetails = () => {
    navigate(`${getPathname.bankDetails}${bank_id}`);
  };

  const uploadDocuments = () => {
    navigate();
  };

  const goTobankLists = () => {
    navigate(getPathname.bankList);
  };

  const edit = () => () => {
    navigate(getPathname.addBank, {
      state: {
        bank_id: bankData.bank_id,
      },
    });
  };

  return (
    <Container
      hideInPageTitle
      id="kyc-approved-bank"
      buttonTitle="VERIFY BANK ACCOUNT"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-approved-bank-verify">
        <div className="kyc-main-title">Verify your bank account</div>
        <Alert
          variant="info"
          title="Important"
          message="We will credit ₹1 to your bank account for verification."
        />
        {showLoader ? (
          <SkeltonRect className="verify-skelton-top" />
        ) : (
          <div className="item">
            <div className="flex">
              <div className="left">
                <img
                  className="ifsc-new-img2"
                  src={bankData.ifsc_image}
                  alt="bank-logo"
                />
              </div>
              <div className="right">
                <div>{bankData.bank_name}</div>
                <div className="text">{bankData.branch_name} </div>
              </div>
            </div>
            <div className="edit" onClick={edit()}>
              EDIT
            </div>
          </div>
        )}
        <div className="item">
          <div className="left">Account number</div>
          {showLoader ? (
            <SkeltonRect className="verify-skelton" />
          ) : (
            <div className="right"> {bankData.account_number} </div>
          )}
        </div>
        <div className="item">
          <div className="left">IFSC code</div>
          {showLoader ? (
            <SkeltonRect className="verify-skelton" />
          ) : (
            <div className="right">{bankData.ifsc_code} </div>
          )}
        </div>
        <div className="item">
          <div className="left">Account type</div>
          {showLoader ? (
            <SkeltonRect className="verify-skelton" />
          ) : (
            <div className="right"> {bankData.account_type} </div>
          )}
        </div>
        <PennyDialog isOpen={isPennyOpen} count={count} />
        <PennyFailedDialog
          isOpen={isPennyFailed}
          uploadDocuments={uploadDocuments}
          checkBankDetails={checkBankDetails}
        />
        <PennySuccessDialog
          isOpen={isPennySuccess}
          goTobankLists={goTobankLists}
        />
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
