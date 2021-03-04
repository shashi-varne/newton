import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPurchaseProcessData } from "../constants";
import { initData } from "../services";
import { getSummaryV2 } from "../common/api";
import Process from "./mini_components/Process";

const Redeemed = (props) => {
  const [transactions, setTransactions] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedRedeemed, setSelectedRedeemed] = useState({});

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    initData();
    const result = await getSummaryV2();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setTransactions(result.report.pending.redeemed_transactions);
    setShowSkelton(false);
  };

  const handleProcess = (redeemed) => {
    setSelectedRedeemed(redeemed);
    setOpenProcess(true);
  };

  return (
    <Container
      hideInPageTitle={true}
      noFooter={true}
      skelton={showSkelton}
      headerTitle="Pending Purchase"
    >
      <div className="report-purchase">
        {!showSkelton &&
          !isEmpty(transactions) &&
          transactions.map((redeemed, index) => {
            return (
              <div className="purchased" key={index}>
                <div className="head">
                  <div>{redeemed.mfname}</div>
                  {redeemed.status === "upcoming" && (
                    <img src={require(`assets/auto_debit.png`)} alt="" />
                  )}
                </div>
                <div className="head-info">
                  <div className="content">
                    <img alt="" src={require(`assets/invested_amount.png`)} />
                    <div className="text">
                      <h4>Withdraw amount</h4>
                      <div>{formatAmountInr(redeemed.amount)}</div>
                    </div>
                  </div>
                  {!redeemed.bank_account_no && (
                    <div className="content">
                      <img alt="" src={require(`assets/date.png`)} />
                      <div className="text">
                        <h4>Redeemed on</h4>
                        <div>{redeemed.tran_date}</div>
                      </div>
                    </div>
                  )}
                  {redeemed.bank_account_no && (
                    <div className="content">
                      <img alt="" src={require(`assets/add_bank_icon.png`)} />
                      <div className="text">
                        <h4>Account credited</h4>
                        <div>{redeemed.bank_account_no}</div>
                      </div>
                    </div>
                  )}
                </div>
                {redeemed.trans_type !== "insta-redeem" && (
                  <div className="progress-bar">
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        <img
                          src={require(`assets/completed_step.svg`)}
                          alt=""
                        />
                        <hr className="right"></hr>
                      </div>
                      <div className="text">
                        <div>WITHDRAW REQUESTED</div>
                        <div className="small">{redeemed.dt_created}</div>
                      </div>
                    </div>
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        {redeemed.plutus_state === "order_placed" ||
                        redeemed.plutus_state === "unit_deducted" ? (
                          <img
                            src={require(`assets/completed_step.svg`)}
                            alt=""
                          />
                        ) : (
                          <span className="dot"></span>
                        )}
                        <hr className="right"></hr>
                      </div>
                      <div className="text">ORDER PLACED</div>
                    </div>
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        {redeemed.plutus_state === "unit_deducted" ? (
                          <img
                            src={require(`assets/completed_step.svg`)}
                            alt=""
                          />
                        ) : (
                          <span className="dot"></span>
                        )}
                        <hr className="right"></hr>
                      </div>
                      <div className="text">UNITS DEDUCTED</div>
                    </div>
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        <span className="dot"></span>
                        <hr className="right"></hr>
                      </div>
                      <div className="text">AMOUNT CREDITED</div>
                    </div>
                  </div>
                )}
                {redeemed.trans_type === "insta-redeem" && (
                  <div className="progress-bar upcoming">
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        <img
                          src={require(`assets/completed_step.svg`)}
                          alt=""
                        />
                        <hr className="right"></hr>
                      </div>
                      <div className="text">
                        <div>WITHDRAW REQUESTED</div>
                        <div className="small">{redeemed.dt_created}</div>
                      </div>
                    </div>
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        {redeemed.units_deducted || redeemed.amount_credited ? (
                          <img
                            src={require(`assets/completed_step.svg`)}
                            alt=""
                          />
                        ) : (
                          <span className="dot"></span>
                        )}
                        <hr className="right"></hr>
                      </div>
                      <div className="text">UNITS DEDUCTED</div>
                    </div>
                    <div className="progress">
                      <div className="content">
                        <hr className="left"></hr>
                        {redeemed.amount_credited ? (
                          <img
                            src={require(`assets/completed_step.svg`)}
                            alt=""
                          />
                        ) : (
                          <span className="dot"></span>
                        )}
                        <hr className="right"></hr>
                      </div>
                      <div className="text">
                        <div>AMOUNT CREDITED</div>
                        <div className="small">
                          {redeemed.expected_credit_date}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="check-process">
                  <div className="text" onClick={() => handleProcess(redeemed)}>
                    View Details
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
