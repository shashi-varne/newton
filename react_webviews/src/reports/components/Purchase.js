import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPurchaseProcessData, storageConstants } from "../constants";
import Process from "./mini-components/Process";
import { storageService } from "../../utils/validators";
import ProgressStep from "./mini-components/ProgressStep";
import { nativeCallback } from "../../utils/native_callback";
import { getSummaryV2 } from "../common/api";

const Purchase = (props) => {
  const stateParams = props.location?.state || {};
  const [transactions, setTransactions] = useState([]);
  const [showSkelton, setShowSkelton] = useState(true);
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState({});

  useEffect(() => {
    const transactionsData = storageService().getObject(
      storageConstants.PENDING_PURCHASE
    ) || [];
    if (!isEmpty(transactionsData) && stateParams.fromPath === "reports") {
      setTransactions(transactionsData);
      setShowSkelton(false);
    } else {
      initialize();
    }
  }, []);

  const initialize = async () => {
    const result = await getSummaryV2();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setTransactions(result.report?.pending?.invested_transactions || []);
    storageService().setObject(
      storageConstants.PENDING_PURCHASE,
      result.report?.pending?.invested_transactions || []
    );
    setShowSkelton(false);
  };

  const handleProcess = (purchased) => {
    setSelectedPurchase(purchased);
    setOpenProcess(true);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "Pending Purchase",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      noFooter={true}
      title="Pending Purchase"
      data-aid='reports-pending-purchase'
      skelton={showSkelton}
    >
      <div className="report-purchase" data-aid='report-purchase'>
        {!isEmpty(transactions) &&
          transactions.map((purchased, index) => {
            return (
              <div className="purchased" key={index} data-aid='reports-purchased'>
                <div className="head" data-aid='reports-head'>
                  <div>{purchased.mfname}</div>
                  {purchased.status === "upcoming" && (
                    <img src={require(`assets/auto_debit.png`)} alt="" />
                  )}
                </div>
                <div className="head-info" data-aid='head-info'>
                  <div className="content">
                    <img alt="" src={require(`assets/invested_amount.png`)} />
                    <div className="text">
                      <h4>Invested amount</h4>
                      <div>{formatAmountInr(purchased.amount)}</div>
                    </div>
                  </div>
                  <div className="content">
                    <img alt="" src={require(`assets/date.png`)} />
                    <div className="text">
                      <h4>Purchased on</h4>
                      <div>{purchased.tran_date}</div>
                    </div>
                  </div>
                </div>
                {purchased.status !== "upcoming" ? (
                  <div className="progress-bar" data-aid='reports-progress-bar'>
                    <ProgressStep
                      isCompleted={true}
                      text="PAYMENT SUCCESSFUL"
                    />
                    <ProgressStep
                      isCompleted={
                        purchased.plutus_state === "order_placed" ||
                        purchased.plutus_state === "unit_alloted"
                      }
                      text="ORDER PLACED"
                    />
                    <ProgressStep
                      isCompleted={purchased.plutus_state === "unit_alloted"}
                      text="UNITS ALLOTED"
                    />
                    <ProgressStep
                      isCompleted={false}
                      text="INVESTMENT CONFIRMED"
                    />
                  </div>
                ) : (
                  <div className="progress-bar upcoming" data-aid='reports-progress-bar-upcoming'>
                    <ProgressStep
                      isCompleted={true}
                      text="AUTO DEBIT REQUEST RAISED"
                    />
                    <ProgressStep isCompleted={false} text="UNITS ALLOTED" />
                    <ProgressStep
                      isCompleted={false}
                      text="INVESTMENT CONFIRMED"
                    />
                  </div>
                )}
                <div className="check-process" data-aid='reports-check-process'>
                  <div
                    className="text"
                    onClick={() => handleProcess(purchased)}
                  >
                    CHECK PROCESS ?
                  </div>
                </div>
              </div>
            );
          })}
        {isEmpty(transactions) && <p className="TextCenter" data-aid='no-transactions-to-show'>No transactions to show</p>}
        {openProcess && (
          <Process
            isOpen={openProcess}
            close={() => setOpenProcess(false)}
            data={getPurchaseProcessData(
              "",
              "",
              selectedPurchase.nfo_recommendation,
            )}
            type="purchase"
            state={selectedPurchase.plutus_state}
            status={selectedPurchase.status}
          />
        )}
      </div>
    </Container>
  );
};

export default Purchase;
