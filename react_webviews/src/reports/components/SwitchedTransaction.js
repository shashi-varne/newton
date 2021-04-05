import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { isEmpty } from "utils/validators";
import { getPurchaseProcessData } from "../constants";
import { getSummaryV2 } from "../common/api";
import Process from "./mini_components/Process";

const SwitchedTransaction = (props) => {
  const [transactions, setTransactions] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState({});

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const result = await getSummaryV2();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setTransactions(result.report?.pending?.switch_transactions || []);
    setShowSkelton(false);
  };

  const handleProcess = (switched) => {
    setSelectedSwitch(switched);
    setOpenProcess(true);
  };

  return (
    <Container noFooter={true} skelton={showSkelton} title="Pending Switch">
      <div className="report-purchase">
        {!isEmpty(transactions) &&
          transactions.map((switched, index) => {
            return (
              <div className="purchased" key={index}>
                <div className="switch-head">
                  <div className="switch-step">
                    <div className="outline"><div className="circle"></div></div>
                    <div className="mf-name">{switched.from_mf.friendly_name}</div>
                  </div>
                  <div className="switch-step-2">All units</div>
                  <div className="switch-step completed-switch">
                    <div><div className="circle"></div></div>
                    <div>{switched.to_mf.friendly_name}</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress">
                    <div className="content">
                      <hr className="left"></hr>
                      <img src={require(`assets/completed_step.svg`)} alt="" />
                      <hr className="right"></hr>
                    </div>
                    <div className="text">
                      <div>SWITCH REQUESTED</div>
                    </div>
                  </div>
                  <div className="progress">
                    <div className="content">
                      <hr className="left"></hr>
                      {switched.plutus_state === "order_placed" ||
                      switched.plutus_state === "unit_deducted" ? (
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
                      {switched.plutus_state === "unit_deducted" ? (
                        <img
                          src={require(`assets/completed_step.svg`)}
                          alt=""
                        />
                      ) : (
                        <span className="dot"></span>
                      )}
                      <hr className="right"></hr>
                    </div>
                    <div className="text">UNITS SWITCHED</div>
                  </div>
                  <div className="progress">
                    <div className="content">
                      <hr className="left"></hr>
                      <span className="dot"></span>
                      <hr className="right"></hr>
                    </div>
                    <div className="text">SWITCH CONFIRMED</div>
                  </div>
                </div>
                <div className="check-process">
                  <div className="text" onClick={() => handleProcess(switched)}>
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
            data={getPurchaseProcessData()}
            type="switch"
            state={selectedSwitch.plutus_state}
            status={selectedSwitch.status}
          />
        )}
      </div>
    </Container>
  );
};

export default SwitchedTransaction;
