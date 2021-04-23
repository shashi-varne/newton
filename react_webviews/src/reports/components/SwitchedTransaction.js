import React, { useState } from "react";
import Container from "../common/Container";
import { isEmpty } from "utils/validators";
import { getPurchaseProcessData, storageConstants } from "../constants";
import Process from "./mini-components/Process";
import { storageService } from "../../utils/validators";
import ProgressStep from "./mini-components/ProgressStep";

const SwitchedTransaction = (props) => {
  const transactions = storageService().getObject(
    storageConstants.PENDING_SWITCH
  );
  if (!transactions) {
    props.history.goBack();
  }
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState({});

  const handleProcess = (switched) => {
    setSelectedSwitch(switched);
    setOpenProcess(true);
  };

  return (
    <Container noFooter={true} title="Pending Switch">
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
