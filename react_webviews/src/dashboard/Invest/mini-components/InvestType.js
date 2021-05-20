import React from "react";
import { getConfig } from "utils/functions";
import './mini-components.scss';
let productName = getConfig().productName;
const InvestType = (props) => {
  return (
    <div className="invest-type" data-aid='invest-type'>
      {props.baseData.subtitle && (
        <div className="generic-page-subtitle" data-aid='generic-page-subtitle'>{props.baseData.subtitle}</div>
      )}
      <div className="type" data-aid='invest-type'>
        {props.baseData.options &&
          props.baseData.options.map((data, index) => {
            return (
              <div
                data-aid={`${data.value}-type`}
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
                  alt=""
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
