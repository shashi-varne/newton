import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import { Imgc } from "../../../common/ui/Imgc";
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
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);
  const state = props.location.state || {};
  const data = instructionsMapper[state.document] || instructionsMapper["pan"];
  const goBack = () => {
    props.history.goBack();
  };
  return (
    <Container buttonTitle="OKAY" title={data.title} handleClick={goBack} data-aid='kyc-upload-instructions-screen'>
      {data.instructions.map((data, index) => {
        return (
          <div key={index} className="stocks-pan-instructions">
            <div className="spi-text" data-aid={`spi-text-${index}`}>{data.text}</div>
            <Imgc
              alt=""
              src={require(`assets/${productName}/pan_sample_right.svg`)}
              className="spi-img"
            />
            <Imgc
              alt=""
              src={require(`assets/${productName}/${data.wrong_icon}`)}
              className="spi-img"
            />
          </div>
        );
      })}
    </Container>
  );
};

export default UploadInstructions;
