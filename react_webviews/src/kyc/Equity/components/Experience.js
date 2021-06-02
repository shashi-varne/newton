import React, { useState } from "react";
import { nativeCallback } from "../../../utils/native_callback";
import Container from "../../common/Container";
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
  const [experienceName, setExperienceName] = useState("0 to 1 year");

  const sendEvents = (userAction) => {
    // TODO sendEvents('next)
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "select_trading_experience",
        experience:
          experienceName === "5 year +" ? "more than 5 years" : experienceName,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="CONTINUE"
      title="Select trading experience"
      noPadding
      data-aid='select-trading-experience-screen'
    >
      <div className="trading-experience" data-aid='trading-experience'>
        <div className="generic-page-subtitle te-subtitle" data-aid='generic-page-subtitle'>
          As per SEBI, it is mandatory to share your trading experience
        </div>
        {tradingExperienceValues.map((data, index) => {
          const selected = data.value === experience;
          return (
            <div
              className={`te-tile ${selected && "te-selected-tile"}`}
              key={index}
<<<<<<< HEAD
              onClick={() => {
                setExperience(data.value);
                setExperienceName(data.name);
              }}
            >
              <div>{data.name}</div>
=======
              onClick={() => setExperience(data.value)}
            >
              <div data-aid='sebi-name'>{data.name}</div>
>>>>>>> a3780882b8ef100249f01607b916d9f45eca0714
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
