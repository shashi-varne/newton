import React from "react";
import { getConfig } from "utils/functions";
import Button from "../../../common/ui/Button";
let productName = getConfig().productName;
const InvestCard = (props) => {
  return (
    <div className="card invest-card" onClick={() => props.handleClick()} data-aid={`${props.data.key}`}>
      <div className="content">
        <div className="title">{props.data.title}</div>
        <div className="subtitle">{props.data.subtitle}</div>
        <Button
          buttonTitle={props.data.button_text}
          classes={{
            button: "invest-landing-button",
          }}
        />
      </div>
      <div className="image-wrapper">
        <img src={require(`assets/${productName}/${props.data.icon}`)} alt="" />
      </div>
    </div>
  );
};

export default InvestCard;
