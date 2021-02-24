import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import Button from "@material-ui/core/Button";
import Slider from "common/ui/Slider";
import { getPathname, storageConstants } from "../constants";
import { initData } from "../services";
import { getReportGoals } from "../common/api";
import { navigate as navigateFunc } from "../common/functions";

const Goals = (props) => {
  const sliderConstants = {
    min: 0,
    max: 100,
  };
  const navigate = navigateFunc.bind(props);
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  const [goals, setGoals] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
      setCurrentUser(user);
      setUserKyc(userkycDetails);
    }
    const result = await getReportGoals();
    if (!result) {
      showSkelton(false);
      return;
    }
    setGoals(result.report.current.goals);
    setShowSkelton(false);
  };

  const redirectToInvestType = (goal) => {
    switch (goal.itag.itype) {
      case "buildwealth":
        navigate(getPathname.buildwealth);
        break;
      case "savetax":
        navigate(getPathname.savetax);
        break;
      case "reliancesimplysave":
        navigate(getPathname.reliancesmartsaveBreakUp);
        break;
      case "investsurplus":
        navigate(getPathname.parkmoney);
        break;
      case "saveforgoal":
        navigate(`${getPathname.savegoal}${goal.itag.subtype}`);
        break;
      case "monthlyincomeplan":
        navigate(getPathname.monthlyincomeplan);
        break;
      case "midcap":
        navigate(getPathname.midcap);
        break;
      case "arbitrage":
        navigate(getPathname.arbitrage);
        break;
      case "index":
        navigate(getPathname.advancedInvestingIndex);
        break;
      case "shariah":
        navigate(getPathname.shariah);
        break;
      case "balanced":
        navigate(getPathname.balanced);
        break;
      case "legacy":
        navigate(getPathname.legacy);
        break;
      case "sectoral":
        navigate(getPathname.sectoral);
        break;
      case "gold":
        navigate(getPathname.investGold);
        break;
      case "diy":
        navigate(getPathname.explore);
        break;
      case "insta-redeem":
        navigate(getPathname.instaredeem);
        break;
      default:
        break;
    }
  };

  return (
    <Container hideInPageTitle={true} noFooter={true} skelton={showSkelton}>
      <div className="report-goals">
        {!showSkelton &&
          !isEmpty(goals) &&
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
                      <div className="amount green">
                        {formatAmountInr(goal.earnings)}
                        {goal.earnings_percent && goal.earnings_percent !== 0 && (
                          <div
                            className={`earning-percent ${
                              goal.earnings_percent >= 0 ? "green" : "red"
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
