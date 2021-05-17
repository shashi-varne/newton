import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const instructions = [
  {
    text: "While taking the selfie look straight to the phone.",
    right_icon: "right_selfie.svg",
    wrong_icon: "wrong_selfie.svg",
  },
  {
    text: "Take your selfie in a well lighted environment",
    right_icon: "right_selfie.svg",
    wrong_icon: "dark_selfie.svg",
  },
];
const SelfieInstructions = (props) => {
  return (
    <Container buttonTitle="OKAY" title="How to take selfie?">
      {instructions.map((data, index) => {
        return (
          <div key={index} className="stocks-selfie-instructions">
            <div className="ssi-text">{data.text}</div>
            <div className="flex-between-center">
              <img
                alt=""
                className="left-img"
                src={require(`assets/${productName}/${data.right_icon}`)}
              />
              <img
                alt=""
                className="left-img"
                src={require(`assets/${productName}/${data.wrong_icon}`)}
              />
            </div>
          </div>
        );
      })}
    </Container>
  );
};

export default SelfieInstructions;
