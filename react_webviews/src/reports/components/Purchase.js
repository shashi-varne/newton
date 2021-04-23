import React, { useState } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPurchaseProcessData, storageConstants } from "../constants";
import Process from "./mini-components/Process";
import { storageService } from "../../utils/validators";
import ProgressStep from "./mini-components/ProgressStep";

const Purchase = (props) => {
  const transactions = storageService().getObject(
    storageConstants.PENDING_PURCHASE
  );
  if (!transactions) {
    props.history.goBack();
  }
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState({});

  const handleProcess = (purchased) => {
    setSelectedPurchase(purchased);
    setOpenProcess(true);
  };

  return (
    <Container noFooter={true} title="Pending Purchase">
      <div className="report-purchase">
        {!isEmpty(transactions) &&
          transactions.map((purchased, index) => {
            return (
              <div className="purchased" key={index}>
                <div className="head">
                  <div>{purchased.mfname}</div>
                  {purchased.status === "upcoming" && (
                    <img src={require(`assets/auto_debit.png`)} alt="" />
                  )}
                </div>
                <div className="head-info">
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
                  <div className="progress-bar">
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
                  <div className="progress-bar upcoming">
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
                <div className="check-process">
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
        {openProcess && (
          <Process
            isOpen={openProcess}
            close={() => setOpenProcess(false)}
            data={getPurchaseProcessData(
              "",
              "",
              selectedPurchase.nfo_recommendation
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
