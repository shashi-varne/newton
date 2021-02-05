import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "../../utils/functions";

const productName = getConfig().productName;
const AddBankVerify = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [bankData, setBankData] = useState({
    account_number: "06301010001111",
    account_type: "SB",
    ifsc_code: "ANDO1234000",
    bank_name: "SBI BANK",
    branch_name: "HYDERABAD",
  });

  const handleClick = () => {};

  const bankIcon =
    "https://sdk-dot-plutus-staging.appspot.com/static/img/bank_logos/ADB.png";

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-approved-bank"
      buttonTitle="VERIFY BANK ACCOUNT"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-approved-bank-verify">
        <div className="kyc-main-title">Verify your bank account</div>
        <header>
          <img src={require(`assets/${productName}/info_icon.svg`)} alt="" />
          <div className="text">
            <div className="title">Important</div>
            <div>We will credit ₹1 to your bank account for verification.</div>
          </div>
        </header>
        <div className="item">
          <div className="flex">
            <div className="left">
              <img className="ifsc-new-img2" src={bankIcon} alt="bank-logo" />
            </div>
            <div className="right">
              <div>{bankData.bank_name}</div>
              <div className="text">{bankData.branch_name} </div>
            </div>
          </div>
          <div className="edit">EDIT</div>
        </div>
        <div className="item">
          <div className="left">Account number</div>
          <div className="right"> {bankData.account_number} </div>
        </div>
        <div className="item">
          <div className="left">IFSC code</div>
          <div className="right">{bankData.ifsc_code} </div>
        </div>
        <div className="item">
          <div className="left">Account type</div>
          <div className="right"> {bankData.account_type} </div>
        </div>
      </div>
    </Container>
  );
};

export default AddBankVerify;
