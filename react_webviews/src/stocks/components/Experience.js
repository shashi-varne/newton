import React, { useState } from "react";
import Container from "../common/Container";
import "./commonStyles.scss";

const tradingExperienceValues = [
  {
    name: "0 to 1 year",
    value: "0-1",
  },
  {
    name: "1 to 3 years",
    value: "1-3",
  },
  {
    name: "3 to 5 years",
    value: "3-5",
  },
  {
    name: "5 year +",
    value: "5+",
  },
];
const Experience = (props) => {
  const [experience, setExperience] = useState("0-1");
  return (
    <Container
      buttonTitle="CONTINUE"
      title="Select trading experience"
      noPadding
    >
      <div className="kyc-trading-experience">
        <div className="generic-page-subtitle kte-subtitle">
          As per SEBI, it is mandatory to share your trading experience
        </div>
        {tradingExperienceValues.map((data, index) => {
          const selected = data.value === experience;
          return (
            <div
              className={`kte-tile ${selected && "kte-selected-tile"}`}
              key={index}
              onClick={() => setExperience(data.value)}
            >
              <div>{data.name}</div>
              {selected && (
                <img alt="" src={require(`assets/completed_step.svg`)} />
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Experience;
