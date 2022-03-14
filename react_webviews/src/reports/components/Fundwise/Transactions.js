import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getTransactions, getNextTransactions } from "../../common/api";
import "./commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";
import { navigate as navigateFunc } from "../../../utils/functions";

const FundswiseTransactions = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props?.match?.params || {};
  const amfi = params.amfi || "";
  if (amfi === "" && props.type === "fundswise") props.history.goBack();
  const [reportData, setReportData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [showSkelton, setShowSkelton] = useState(true);
  const [isApiRunning, setIsApiRunning] = useState(false);

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
    setReportData(data);
    setShowSkelton(false);
  };

  const handleClick = async () => {
    setIsApiRunning("button");
    try {
      const result = await getNextTransactions({ url: reportData.next_page });
      if (!result) {
        setIsApiRunning(false);
        return;
      }

      let data = [...transactions];
      data.push(...result.transactions);
      setTransactions(data);
      let report_data = { ...reportData };
      report_data.more = result.more;
      report_data.next_page = result.next_page;
      setReportData(report_data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const sendEvents = (userAction, fundClicked = "no") => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "transactions",
        fund_clicked: fundClicked,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const goToFundDetails = (transaction) => () => {
    sendEvents('next', "yes");
    navigate(`/diyv2/fundinfo/direct/${transaction.isin}`);
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      title="Transactions"
      noFooter={!reportData.more}
      buttonTitle="SHOW MORE"
      handleClick={handleClick}
      skelton={showSkelton}
      showLoader={isApiRunning}
      data-aid='reports-transactions-screen'
    >
      <div className="reports-fundswise-transactions" data-aid='reports-fundswise-transactions'>
        {!isEmpty(transactions) &&
          transactions.map((transaction, index) => {
            return (
              <div key={index} className="transaction" data-aid='transaction' onClick={goToFundDetails(transaction)} >
                <div className="folio-no" data-aid={transaction.folio_number}>
                  <span>Folio No: {transaction.folio_number}</span>
                  <span
                    className={`text ${
                      transaction.ttype === "purchase" && "fundswise-green-text"
                    } ${transaction.ttype === "redemption" && "fundswise-red-text"}`}
                  >
                    {transaction.ttype}
                  </span>
                </div>
                <div className="transaction-header">{transaction.mf_name}</div>
                <div className="details" data-aid='details'>
                  <div className="content" data-aid='reports-date'>
                    <div className="text">Date</div>
                    <h5 className="fund-info">{transaction.tdate}</h5>
                  </div>
                  <div className="content" data-aid='reports-units'>
                    <div className="text">Units</div>
                    <h5 className="fund-info">
                      {transaction.units.toFixed(4)}
                    </h5>
                  </div>
                  <div className="content" data-aid='reports-nav'>
                    <div className="text">Nav</div>
                    <h5 className="fund-info">
                      ₹ {transaction.nav.toFixed(4)}
                    </h5>
                  </div>
                  <div className="content" data-aid='reports-amount'>
                    <div className="text">Amount</div>
                    <h5 className="fund-info">
                      {formatAmountInr(transaction.amount)}
                    </h5>
                  </div>
                </div>
              </div>
            );
          })}
        {isEmpty(transactions) && <p data-aid='no-transactions-to-show'>No transactions to show</p>}
      </div>
    </Container>
  );
};

export default FundswiseTransactions;
