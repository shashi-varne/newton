import React, { useState, useEffect } from "react";
import Container from "fund_details/common/Container";
import { get_recommended_funds } from "../common/api";
import toast from "common/ui/Toast";
import "../style.scss";

const Recommendations = (props) => {
  const [loader, setLoader] = useState(false);
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    fetchRecommendedFunds();
  }, []);

  const fetchRecommendedFunds = async () => {
    const params = {
      type: "buildwealth",
    };
    setLoader(true);
    try {
      // const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      setRecommendations(data.recommended[0]);

      // const graphData = {
      //   recommendation: data.recommendation,
      //   amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
      //   term,
      //   // eslint-disable-next-line radix
      //   year: parseInt(date.getFullYear() + term),
      //   corpus: otiAmount,
      //   investType: params.type,
      //   stockSplit: data.recommendation.equity,
      //   bondSplit: data.recommendation.debt,
      //   isRecurring: recurring,
      //   investTypeDisplay,
      // };
      // storageService().setObject('goalRecommendations', data.recommendation.goal);
      // storageService().setObject('graphData', graphData);
      // setData(graphData);
      setLoader(false);
      // goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
    }
  };

  return (
    <Container
      classOverRide="pr-error-container"
      fullWidthButton
      buttonTitle="PROCEED"
      hideInPageTitle
      hidePageTitle
      title="Recommended fund"
      showLoader={loader}
      // handleClick={replaceFund}
      classOverRideContainer="pr-container"
    >
      <div className="fund">
        <div className="replace">Replace</div>
        <div className="name">
          <div className="icon">
            <img
              src={recommendations && recommendations.pension_house.image}
              alt={recommendations}
              width="90"
            />
          </div>
          <div className="text">
            <h3>{recommendations && recommendations.pension_house.name}</h3>
          </div>
        </div>
      </div>

      <div class="fund-detail">
        <div class="risk">
          <p >
            <b>Risk:</b> {`{"getFormatted('recommended.risk')"}`}
          </p>
          <span
            class="edit-icon edit"
            ng-click="showMenu($event)"
            ng-show="alternatives.length > 0"
          >
            Edit
          </span>
        </div>
        <div class="allocation">
          <div class="graph">
            <canvas
              id="doughnut"
              class="chart chart-doughnut"
              chart-data="data"
              chart-labels="labels"
              chart-colors="colors"
              chart-options="options"
            ></canvas>
            <div
              class="text-center"
              style="color: rgb(135, 135, 135);margin-top: 10px;"
            >
              Asset allocation
            </div>
          </div>
          <div class="stats">
            <ul>
              <li>
                <div class="">
                  <b>Class E</b>
                </div>
                <div class="">
                  <span class="color3">{"{'recommended.e_allocation'}"}%</span>{" "}
                  in equity
                </div>
              </li>
              <li>
                <div class="">
                  <b>Class C</b>
                </div>
                <div class="">
                  <span class="color4">{"{'recommended.c_allocation'}"}%</span>{" "}
                  in corporate debt
                </div>
              </li>
              <li>
                <div class="">
                  <b>Class G</b>
                </div>
                <div class="">
                  <span class="color2">{"{'recommended.g_allocation'}"}%</span>{" "}
                  in govt. bonds
                </div>
              </li>
              <li>
                <div class="">
                  <b>Class A</b>
                </div>
                <div class="">
                  <span class="color1">{"{'recommended.a_allocation'}"}%</span>{" "}
                  in AIFs
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Recommendations;
