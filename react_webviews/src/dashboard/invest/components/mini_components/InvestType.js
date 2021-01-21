import React from "react";
import { getConfig } from "utils/functions";
let productName = getConfig().productName;
const InvestType = (props) => {
  return (
    <div className="invest-type">
      <div className="header">
        <div className="main-top-title">{props.baseData.title}</div>
        {props.baseData.count && props.baseData.total && (
          <div className="step">
            <span className="count">{props.baseData.count}</span>
            <span className="total">/{props.baseData.total}</span>
          </div>
        )}
      </div>
      <div className="type">
        {props.baseData.options &&
          props.baseData.options.map((data, index) => {
            return (
              <div
                key={index}
                className="content"
                onClick={() => props.handleChange(data.value)}
                style={{
                  border:
                    props.selected === data.value
                      ? "1px solid var(--primary)"
                      : "none",
                }}
              >
                <img
                  src={require(`assets/${productName}/${data.icon}`)}
                  alt="sip"
                />
                <div className="text">{data.text}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InvestType;
