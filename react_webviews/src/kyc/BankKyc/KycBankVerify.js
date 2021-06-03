import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import Alert from "../mini-components/Alert";
import { isEmpty } from "utils/validators";
import { navigate as navigateFunc } from "utils/functions";
import { PATHNAME_MAPPER } from "../constants";
import { saveBankData, getBankStatus } from "../common/api";
import toast from "../../common/ui/Toast";
import PennyDialog from "../mini-components/PennyDialog";
import PennyFailedDialog from "../mini-components/PennyFailedDialog";
import PennySuccessDialog from "../mini-components/PennySuccessDialog";
import PennyExhaustedDialog from "../mini-components/PennyExhaustedDialog";
import { SkeltonRect } from "common/ui/Skelton";
import useUserKycHook from "../common/hooks/userKycHook";

const KycBankVerify = (props) => {
  const [count, setCount] = useState(20);
  const [countdownInterval, setCountdownInterval] = useState();
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isPennyOpen, setIsPennyOpen] = useState(false);
  const [isPennyFailed, setIsPennyFailed] = useState(false);
  const [isPennySuccess, setIsPennySuccess] = useState(false);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  const isEdit = props.location.state?.isEdit || false;
  const params = props.match.params || {};
  const userType = params.userType || "";
  const [bankData, setBankData] = useState({});
  const navigate = navigateFunc.bind(props);
  const [dl_flow, setDlFlow] = useState(false);
  const {kyc} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
    if (
      kyc.kyc_status !== "compliant" &&
      !kyc.address.meta_data.is_nri &&
      kyc.dl_docs_status !== "" &&
      kyc.dl_docs_status !== "init" &&
      kyc.dl_docs_status !== null
    ) {
      setDlFlow(true);
    }
    setBankData({ ...kyc.bank.meta_data });
  };

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      const result = await saveBankData({ bank_id: bankData.bank_id });
      if (!result) return;
      if (result.code === "ERROR") {
        toast(result.message);
      } else if (kyc.address.meta_data.is_nri) {
        uploadDocuments();
      } else {
        pennyLoader();
      }
    } catch (err) {
      console.log(err);
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
      const result = await getBankStatus({ bank_id: bankData.bank_id });
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
      const result = await getBankStatus({ bank_id: bankData.bank_id });
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
    navigate(`/kyc/${userType}/bank-details`);
  };

  const uploadDocuments = () => {
    navigate(`/kyc/${userType}/upload-documents`);
  };

  const handleSuccess = () => {
    if (userType === "compliant") {
      if (isEdit) goToJourney();
      else {
        if (kyc.sign.doc_status !== "submitted" && kyc.sign.doc_status !== "approved") {
          navigate(PATHNAME_MAPPER.uploadSign, {
            state: {
              backToJourney: true,
            },
          });
        } else goToJourney();
      }
    } else {
      if (dl_flow) {
        if (
          (kyc.all_dl_doc_statuses.pan_fetch_status === null ||
          kyc.all_dl_doc_statuses.pan_fetch_status === "" ||
          kyc.all_dl_doc_statuses.pan_fetch_status === "failed") &&
          kyc.pan.doc_status !== "approved"
        ) {
          navigate(PATHNAME_MAPPER.uploadPan);
        } else navigate(PATHNAME_MAPPER.kycEsign);
      } else navigate(PATHNAME_MAPPER.uploadProgress);
    }
  };

  const goToJourney = () => navigate(PATHNAME_MAPPER.journey);

  const edit = () => () => {
    navigate(`/kyc/${userType}/bank-details`);
  };

  return (
    <Container
      buttonTitle="VERIFY BANK ACCOUNT"
      showLoader={isApiRunning}
      noFooter={isEmpty(bankData)}
      handleClick={handleClick}
      title="Verify your bank account"
      data-aid='kyc-verify-bank-accont-screen'
    >
      <div className="kyc-approved-bank-verify" data-aid='kyc-approved-bank-verify'>
        <Alert
          variant="info"
          title="Important"
          message="We will credit ₹1 to verify your bank account."
          dataAid='kyc-bankverify-alertbox'
        />
        {isEmpty(bankData) && (
          <>
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
            <SkeltonRect className="verify-skelton" />
          </>
        )}
        {!isEmpty(bankData) && (
          <>
            <div className="item" data-aid='kyc-bank-data'>
              <div className="flex">
                <div className="left">
                  <img
                    className="ifsc-new-img2"
                    src={bankData.ifsc_image}
                    alt="bank-logo"
                  />
                </div>
                <div className="right" data-aid='kyc-bank-name'>
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
        <PennySuccessDialog isOpen={isPennySuccess} redirect={handleSuccess} />
        <PennyExhaustedDialog
          isOpen= {isPennyExhausted}
          redirect={goToJourney}
          uploadDocuments={uploadDocuments}
        />
      </div>
    </Container>
  );
};

export default KycBankVerify;
