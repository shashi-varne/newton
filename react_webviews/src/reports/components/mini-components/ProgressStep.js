import React from "react";
import { getConfig } from "../../../utils/functions";

const productName = getConfig().productName;
const ProgressStep = ({ isCompleted, text, subtext }) => {
  return (
    <div className="progress" data-aid='progress-step'>
      <div className="content">
        <hr className="left"></hr>
        {isCompleted ? (
          <img src={require(`assets/${productName}/completed_step.svg`)} alt="" />
        ) : (
          <span className="dot"></span>
        )}
        <hr className="right"></hr>
      </div>
      <div className="text">
        <div>{text}</div>
        <div className="small">{subtext}</div>
      </div>
    </div>
  );
};

export default ProgressStep;
