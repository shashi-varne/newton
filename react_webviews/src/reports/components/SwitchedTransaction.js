import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { isEmpty } from "utils/validators";
import { getPurchaseProcessData, storageConstants } from "../constants";
import Process from "./mini-components/Process";
import { storageService } from "../../utils/validators";
import ProgressStep from "./mini-components/ProgressStep";
import { getSummaryV2 } from "../common/api";
import { nativeCallback } from "../../utils/native_callback";

const SwitchedTransaction = (props) => {
  const stateParams = props.location?.state || {};
  const [transactions, setTransactions] = useState({});
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    const transactionsData = storageService().getObject(
      storageConstants.PENDING_SWITCH
    );
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
    setTransactions(result.report?.pending?.switch_transactions || {});
    storageService().setObject(
      storageConstants.PENDING_SWITCH,
      result.report?.pending?.switch_transactions || {}
    );
    setShowSkelton(false);
  };

  const handleProcess = (switched) => {
    setSelectedSwitch(switched);
    setOpenProcess(true);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "Pending Switch",
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
      title="Pending Switch"
      skelton={showSkelton}
    >
      <div className="report-purchase">
        {!isEmpty(transactions) &&
          transactions.map((switched, index) => {
            return (
              <div className="purchased" key={index}>
                <div className="switch-head">
                  <div className="switch-step">
                    <div className="outline">
                      <div className="circle"></div>
                    </div>
                    <div className="mf-name">
                      {switched.from_mf.friendly_name}
                    </div>
                  </div>
                  <div className="switch-step-2">All units</div>
                  <div className="switch-step completed-switch">
                    <div>
                      <div className="circle"></div>
                    </div>
                    <div>{switched.to_mf.friendly_name}</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <ProgressStep isCompleted={true} text="SWITCH REQUESTED" />
                  <ProgressStep
                    isCompleted={
                      switched.plutus_state === "order_placed" ||
                      switched.plutus_state === "unit_deducted"
                    }
                    text="ORDER PLACED"
                  />
                  <ProgressStep
                    isCompleted={switched.plutus_state === "unit_deducted"}
                    text="UNITS SWITCHED"
                  />
                  <ProgressStep isCompleted={false} text="SWITCH CONFIRMED" />
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
