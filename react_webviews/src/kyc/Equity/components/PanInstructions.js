import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const instructions = [
  {
    text: "Make sure your signature in your PAN is clearly visible",
    wrong_icon: "pan_incorrect_placed.svg",
  },
  {
    text: "Photo of PAN should be clear and no exposure of flash light.",
    wrong_icon: "pan_flash_on.svg",
  },
];
const PanInstructions = (props) => {
  return (
    <Container
      buttonTitle="OKAY"
      title="How to take picture of your PAN document?"
    >
      {instructions.map((data, index) => {
        return (
          <div key={index} className="stocks-pan-instructions">
            <div className="spi-text">{data.text}</div>
            <img
              alt=""
              className="left-img"
              src={require(`assets/pan_sample_right.svg`)}
            />
            <img
              alt=""
              className="left-img"
              src={require(`assets/${data.wrong_icon}`)}
            />
          </div>
        );
      })}
    </Container>
  );
};

export default PanInstructions;
