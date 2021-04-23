import React from "react";

const ProgressStep = ({ isCompleted, text, subtext }) => {
  return (
    <div className="progress">
      <div className="content">
        <hr className="left"></hr>
        {isCompleted ? (
          <img src={require(`assets/completed_step.svg`)} alt="" />
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
