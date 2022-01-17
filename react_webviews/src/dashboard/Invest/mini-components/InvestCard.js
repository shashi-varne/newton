import React from "react";
import { getConfig } from "utils/functions";
import ReactHtmlParser from "react-html-parser";
import Button from "../../../common/ui/Button";
import { Imgc } from "../../../common/ui/Imgc";
import WVTag from "../../../common/ui/Tag/WVTag";

const InvestCard = (props) => {
  const productName = getConfig().productName;
  return (
    <>
    <div className="card invest-card" onClick={() => props.handleClick()} data-aid={`${props.data.key}`}>
      <div className="content" data-aid={`${props.data.key}-content`}>
        {props.data.tagTitle && <WVTag content={props.data.tagTitle} />}
        <div className="title">{props.data.title}</div>
        <div className="subtitle"> {ReactHtmlParser(props?.data.subtitle)}</div>
        <Button
          dataAid={`${props.data.key}-btn`}
          buttonTitle={props.data.button_text}
          classes={{
            button: "invest-landing-button",
          }}
        />
      </div>
      <div className="image-wrapper">
        <Imgc className="invest-card-icon" src={require(`assets/${productName}/${props.data.icon}`)} alt="" />
      </div>
    </div>
      {props?.data?.belowCardDescription && <div className="invest-card">
          <p className="below-card-description"> {props?.data.belowCardDescription} </p></div>}
    </>
  );
};

export default InvestCard;
