import React from "react";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
let productName = getConfig().productName;
const InvestCard = (props) => {
  return (
    <div className="card invest-card" onClick={() => props.handleClick()}>
      <div className="content">
        <div className="title">{props.data.title}</div>
        <div className="subtitle">{props.data.subtitle}</div>
        <Button className="invest-landing-button">{props.data.button_text}</Button>
      </div>
      <div className="image-wrapper">
        <img src={require(`assets/${productName}/${props.data.icon}`)} alt="" />
      </div>
    </div>
  );
};

export default InvestCard;
