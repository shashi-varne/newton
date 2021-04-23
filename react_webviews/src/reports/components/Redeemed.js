import React, { useState } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPurchaseProcessData, storageConstants } from "../constants";
import Process from "./mini-components/Process";
import { storageService } from "../../utils/validators";
import ProgressStep from "./mini-components/ProgressStep";

const Redeemed = (props) => {
  const transactions = storageService().getObject(
    storageConstants.PENDING_REDEMPTION
  );
  if (!transactions) {
    props.history.goBack();
  }
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedRedeemed, setSelectedRedeemed] = useState({});

  const handleProcess = (redeemed) => {
    setSelectedRedeemed(redeemed);
    setOpenProcess(true);
  };

  return (
    <Container noFooter={true} title="Pending withdrawals">
      <div className="report-purchase">
        {!isEmpty(transactions) &&
          transactions.map((redeemed, index) => {
            return (
              <div className="purchased" key={index}>
                <div className="redeemed-head head">
                  <div>{redeemed.mfname}</div>
                  {redeemed.status === "upcoming" && (
                    <img src={require(`assets/auto_debit.png`)} alt="" />
                  )}
                </div>
                <div className="head-info">
                  <div className="content">
                    <img alt="" src={require(`assets/invested_amount.png`)} />
                    <div className="text redeemed-text">
                      <h4>Withdraw amount</h4>
                      <div>{formatAmountInr(redeemed.amount)}</div>
                    </div>
                  </div>
                  {!redeemed.bank_account_no ? (
                    <div className="content">
                      <img alt="" src={require(`assets/date.png`)} />
                      <div className="text redeemed-text">
                        <h4>Redeemed on</h4>
                        <div>{redeemed.tran_date}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="content">
                      <img alt="" src={require(`assets/add_bank_icon.png`)} />
                      <div className="text">
                        <h4>Account credited</h4>
                        <div>{redeemed.bank_account_no}</div>
                      </div>
                    </div>
                  )}
                </div>
                {redeemed.trans_type !== "insta-redeem" ? (
                  <div className="progress-bar">
                    <ProgressStep
                      isCompleted={true}
                      text="WITHDRAW REQUESTED"
                      subtext={redeemed.dt_created}
                    />
                    <ProgressStep
                      isCompleted={
                        redeemed.plutus_state === "order_placed" ||
                        redeemed.plutus_state === "unit_deducted"
                      }
                      text="ORDER PLACED"
                    />
                    <ProgressStep
                      isCompleted={redeemed.plutus_state === "unit_deducted"}
                      text="UNITS DEDUCTED"
                    />
                    <ProgressStep
                      isCompleted={false}
                      text="AMOUNT CREDITED"
                      subtext={redeemed.expected_credit_date}
                    />
                  </div>
                ) : (
                  <div className="progress-bar upcoming">
                    <ProgressStep
                      isCompleted={true}
                      text="WITHDRAW REQUESTED"
                      subtext={redeemed.dt_created}
                    />
                    <ProgressStep
                      isCompleted={
                        redeemed.units_deducted || redeemed.amount_credited
                      }
                      text="UNITS DEDUCTED"
                    />
                    <ProgressStep
                      isCompleted={redeemed.amount_credited}
                      text="AMOUNT CREDITED"
                      subtext={redeemed.expected_credit_date}
                    />
                  </div>
                )}
                <div className="check-process">
                  <div className="text" onClick={() => handleProcess(redeemed)}>
                    VIEW DETAILS
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
              selectedRedeemed.dt_created,
              selectedRedeemed.expected_credit_date
            )}
            type="withdraw"
            state={selectedRedeemed.plutus_state}
            status={selectedRedeemed.status}
          />
        )}
      </div>
    </Container>
  );
};

export default Redeemed;
