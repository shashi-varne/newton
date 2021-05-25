import React from "react";
import Container from "../../common/Container";
import "./commonStyles.scss";

const instructionsMapper = {
  pan: {
    title: "How to take picture of your PAN document?",
    instructions: [
      {
        text: "Make sure your signature in your PAN is clearly visible",
        wrong_icon: "pan_incorrect_placed.svg",
      },
      {
        text: "Photo of PAN should be clear and no exposure of flash light.",
        wrong_icon: "pan_flash_on.svg",
      },
    ],
  },
  address: {
    title: "How to take picture of your address proof?",
    instructions: [
      {
        text: "Name on the address proof and PAN should be same.",
        wrong_icon: "pan_incorrect_placed.svg",
      },
      {
        text:
          "Photo of address proof should be clear and no exposure of flash light.",
        wrong_icon: "pan_flash_on.svg",
      },
    ],
  },
};
const UploadInstructions = (props) => {
  const state = props.location.state || {};
  const data = instructionsMapper[state.document] || instructionsMapper["pan"];
  return (
    <Container buttonTitle="OKAY" title={data.title} data-aid='kyc-upload-instructions-screen'>
      {data.instructions.map((data, index) => {
        return (
          <div key={index} className="stocks-pan-instructions">
            <div className="spi-text" data-aid={`spi-text-${index+1}`}>{data.text}</div>
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

export default UploadInstructions;
