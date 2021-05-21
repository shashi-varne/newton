import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import Button from "@material-ui/core/Button";
import Slider from "common/ui/Slider";
import { getPathname } from "../constants";
import { getReportGoals } from "../common/api";
import { navigate as navigateFunc, getAmountInInr } from "../common/functions";
import { nativeCallback } from "../../utils/native_callback";

const sliderConstants = {
  min: 0,
  max: 100,
};
const Goals = (props) => {
  const navigate = navigateFunc.bind(props);
  const [goals, setGoals] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const result = await getReportGoals();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setGoals(result.report.current.goals);
    setShowSkelton(false);
  };

  const redirectToInvestType = (goal) => {
    sendEvents("next", goal);
    let pathname = getPathname[goal?.itag?.itype] || "";
    if (!pathname) return;
    if (goal.itag.itype === "saveforgoal")
      pathname = `${pathname}/${goal.itag.subtype}`;
    navigate(pathname);
  };

  const sendEvents = (userAction, data) => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "Track my goals",
        goal: data || "",
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
      hidePageTitle={true}
      noFooter={true}
      events={sendEvents("just_set_events")}
      skelton={showSkelton}
    >
      <div className="report-goals">
        {!isEmpty(goals) &&
          goals.map((goal, index) => {
            return (
              <div className="goal" key={index}>
                <div
                  className="goal-info"
                  onClick={() =>
                    navigate(
                      `${getPathname.reportsFunds}${goal.itag.itype}/${
                        goal.itag.subtype ? goal.itag.subtype : ""
                      }`
                    )
                  }
                >
                  <h5>{goal.itag.title}</h5>
                  <div className="summary">
                    <div className="content">
                      <div className="amount">
                        {formatAmountInr(goal.current)}
                      </div>
                      <div className="text">
                        Current <br /> Value
                      </div>
                    </div>
                    <div className="content">
                      <div className="amount">
                        {formatAmountInr(goal.invested)}
                      </div>
                      <div className="text">
                        Amount <br />
                        Invested
                      </div>
                    </div>
                    <div className="content">
                      <div
                        className={`amount ${
                          goal.earnings >= 0
                            ? "goals-green-text"
                            : "goals-red-text"
                        }`}
                      >
                        {getAmountInInr(goal.earnings)}
                        {goal.earnings_percent && goal.earnings_percent !== 0 && (
                          <div
                            className={`earning-percent ${
                              goal.earnings_percent >= 0
                                ? "goals-green-text"
                                : "goals-red-text"
                            }`}
                          >
                            ( {goal.earnings_percent > 0 && "+"}{" "}
                            {goal.earnings_percent.toFixed(2)}% )
                          </div>
                        )}
                      </div>
                      <div className="text">
                        Total <br />
                        Earnings
                        <img
                          src={require(`assets/ic_secure_right.png`)}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="slider-container">
                    <div className="slider-head">
                      <div className="left">STOCKS ({goal.stock}%) </div>
                      <div className="right">BONDS ({goal.bond}%) </div>
                    </div>
                    <Slider
                      value={goal.stock}
                      min={sliderConstants.min}
                      max={sliderConstants.max}
                      disabled={true}
                    />
                  </div>
                </div>
                {goal.itag.itype !== "legacy" && (
                  <Button onClick={() => redirectToInvestType(goal)}>
                    INVEST MORE
                  </Button>
                )}
              </div>
            );
          })}
      </div>
    </Container>
  );
};

export default Goals;
