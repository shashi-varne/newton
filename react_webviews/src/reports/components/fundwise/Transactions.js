import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { storageConstants } from "../../constants";
import { initData } from "../../services";
import { getTransactions } from "../../common/api";

const FundswiseTransactions = (props) => {
  const params = props?.match?.params || {};
  const amfi = params.amfi || "";
  if (amfi === "") props.history.goBack();
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  const [reportData, setReportData] = useState({});
  const [transactions, setTransactions] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const data = await getTransactions({ amfi });
    if (!data) {
      setShowSkelton(false);
      return;
    }
    setTransactions(data.transactions);
    const result = await getTransactions();
    if (result) {
      setReportData(result);
    }
    setShowSkelton(false);
    let userkycDetails = { ...userkyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
      setCurrentUser(user);
      setUserKyc(userkycDetails);
    }
  };

  const handleClick = () => {};

  return (
    <Container
      hideInPageTitle={true}
      headerTitle="Transactions"
      noFooter={!reportData.more}
      buttonTitle="SHOW MORE"
      handleClick={handleClick}
      skelton={showSkelton}
    >
      <div className="reports-fundswise-transactions">
        {!showSkelton && (
          <>
            {!isEmpty(transactions) &&
              transactions.map((transaction, index) => {
                return (
                  <div key={index} className="transaction">
                    <div className="folio-no">
                      <span>Folio No: {transaction.folio_number}</span>
                      <span
                        className={`text ${
                          transaction.ttype === "purchase" && "green"
                        } ${transaction.ttype === "redemption" && "red"}`}
                      >
                        {transaction.ttype}
                      </span>
                    </div>
                    <div className="transaction-header">
                      {transaction.mf_name}
                    </div>
                    <div className="details">
                      <div className="content">
                        <div className="text">Date</div>
                        <h5 className="fund-info">{transaction.tdate}</h5>
                      </div>
                      <div className="content">
                        <div className="text">Units</div>
                        <h5 className="fund-info">
                          {transaction.units.toFixed(4)}
                        </h5>
                      </div>
                      <div className="content">
                        <div className="text">Nav</div>
                        <h5 className="fund-info">
                          ₹ {transaction.nav.toFixed(4)}
                        </h5>
                      </div>
                      <div className="content">
                        <div className="text">Amount</div>
                        <h5 className="fund-info">
                          {formatAmountInr(transaction.amount)}
                        </h5>
                      </div>
                    </div>
                  </div>
                );
              })}
            {isEmpty(transactions) && <p>No transactions to show</p>}
          </>
        )}
      </div>
    </Container>
  );
};

export default FundswiseTransactions;
