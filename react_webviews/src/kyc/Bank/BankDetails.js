import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { formatAmountInr, storageService, isEmpty } from "utils/validators";
import { navigate as navigateFunc } from "../common/functions";
import { storageConstants } from "../constants";
import { getConfig } from "utils/functions";
import { getMyAccount } from "../common/api";
import toast from "../../common/ui/Toast";
import useUserKycHook from "../common/hooks/userKycHook";
import "./BankDetails.scss";

const BankDetails = (props) => {
  const [showLoader, setShowLoader] = useState(true);
  const [banks, setBanks] = useState(
    storageService().getObject(storageConstants.BANK_MANDATES) || []
  );
  const bank_id = props.match.params.bank_id;
  if (!bank_id) {
    props.history.goBack();
  }
  const [bank, setBank] = useState({});
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (bank.status === "default") {
      navigate(`/kyc/${kyc.kyc_status}/upload-documents`);
    } else {
      navigate(`/kyc/${kyc.kyc_status}/upload-documents`, {
        searchParams: `${
          getConfig().searchParams
        }&additional=true&bank_id=${bank_id}`,
      });
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  useEffect(() => {
    initialize();
  }, []);

  let initialize = async () => {
    let banksInfo = [...banks];
    if (isEmpty(banksInfo)) {
      try {
        setShowLoader(true);
        const result = await getMyAccount();
        if (!result) return;
        banksInfo = result.bank_mandates.banks || [];
        setBanks(banksInfo);
        storageService().setObject(
          storageConstants.BANK_MANDATES,
          result.bank_mandates.banks
        );
        storageService().setObject(
          storageConstants.CHANGE_REQUEST,
          result.change_requests
        );
      } catch (err) {
        console.log(err);
        toast(err.message);
      }
    }
    const bankData =
      banksInfo.find((obj) => obj.bank_id?.toString() === bank_id) || {};
    setBank(bankData);
    setShowLoader(false);
  };

  return (
    <Container
      showSkelton={showLoader || isLoading}
      hideInPageTitle
      buttonTitle="RE-UPLOAD DOCUMENT"
      handleClick={handleClick}
      noFooter={bank.bank_status !== "rejected"}
      title="Bank accounts"
      data-aid='kyc-bank-details-page'
    >
      <div className="bank-details">
        {!showLoader && (
          <>
            <div className="bank-info" data-aid='kyc-bank-info'>
              <img src={bank.bank_image} className="left-icon" alt="" />
              <div className="content">
                <div className="bank-name">
                  <div className="name" data-aid='bank-name'>
                    {bank.bank_name}
                    {bank.bank_status === "rejected" && (
                      <img
                        src={require("assets/alert_icon.svg")}
                        className="alert-icon"
                        alt=""
                      />
                    )}
                  </div>
                  {bank.status === "default" &&
                    bank.bank_status !== "rejected" && (
                      <div className="tag">PRIMARY</div>
                    )}
                </div>
                <div className="branch-name">{bank.branch_name}</div>
              </div>
            </div>
            <div className="item" data-aid='kyc-account-number'>
              <div className="left">Account number</div>
              <div className="right"> {bank.account_number} </div>
            </div>
            <div className="item" data-aid='kyc-ifsc-code'>
              <div className="left">IFSC code</div>
              <div className="right">{bank.ifsc_code} </div>
            </div>
            <div className="item" data-aid='kyc-account-type'>
              <div className="left">Account type</div>
              <div className="right"> {bank.account_type} </div>
            </div>
            <div className="item" data-aid='kyc-status'>
              <div className="left">Status</div>
              <div
                className={`status ${
                  bank.bank_status === "rejected" && "failed"
                } ${bank.bank_status === "verified" && "verified"}`}
                data-aid={`mapped-bank-status`}
              >
                {bank.mapped_bank_status}
              </div>
            </div>
            {bank.bank_status !== "rejected" && (
              <div className="mandate-section" data-aid='kyc-mandate-section'>
                <div className="title">Mandates</div>
                {bank.mandates && bank.mandates.length > 0 ? (
                  bank.mandates.map((mandate, index) => {
                    return (
                      <div key={index} className="content">
                        <div className="item" data-aid='kyc-id'>
                          <div className="left">ID</div>
                          <div className="right">{mandate.id} </div>
                        </div>
                        <div className="item" data-aid='kyc-account-type'>
                          <div className="left">Account type</div>
                          <div className="right">
                            {" "}
                            {formatAmountInr(mandate.amount)}{" "}
                          </div>
                        </div>
                        <div className="item" data-aid='kyc-status'>
                          <div className="left">Status</div>
                          <div
                            className={`status ${
                              mandate.status === "rejected" && "failed"
                            } ${mandate.status === "verified" && "verified"} ${
                              mandate.status === "init" && "underprocess"
                            }`}
                            data-aid='kyc-mapped-mandate-status'
                          >
                            {mandate.mapped_mandate_status}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="info-text" data-aid='kyc-info-text'>
                    You do not have any mandates associated with this bank
                    account
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default BankDetails;
