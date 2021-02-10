import React, { Component } from "react";
import Container from "../../common/Container";
import { get_recommended_funds } from "../common/api";
import { formatAmountInr } from "utils/validators";
import toast from "common/ui/Toast";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import { navigate } from "../common/commonFunctions";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

const risk_level = ["High", "Low", "Moderate", "Moderate Low"];

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      recommendations: "",
      all_charges: "",
      openDialog: false,
    };
    this.navigate = navigate.bind(this);
  }

  componentWillMount() {
    this.fetchRecommendedFunds();
  }

  fetchRecommendedFunds = async () => {
    try {
      this.setState({
        show_loader: true,
      });

      const params = {
        type: "buildwealth",
      };
      const data = await get_recommended_funds(params);

      this.setState({
        recommendations: data.recommended[0],
        all_charges: data.all_charges,
        show_loader: false,
      });
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast(err);
    }
  };

  getFormatted = (value) => {
    return value
      .split("_")
      .join(" ")
      .replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      });
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  handleChange = (name) => {
    this.setState({
      selectedValue: name,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
        className="risk-level"
      >
        <DialogTitle id="form-dialog-title" className="edit-title">
          Choose Risk Level
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="nps-flex-box">
            {risk_level.map((item, index) => (
              <div className="edit-risk" key={index}>
                <div>{item}</div>
                <Radio
                  checked={this.state.selectedValue === item}
                  onChange={() => this.handleChange(item)}
                  value={this.state.selectedValue || ""}
                  name="radio-button-demo"
                  color="primary"
                />
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            color="default"
            autoFocus
            onClick={this.handleClose}
          >
            APPLY NOW
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleClick = () => {

  }
  
  render() {
    let { recommendations, show_loader, all_charges } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Recommended fund"
        showLoader={show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="fund">
          <div className="replace" onClick={() => {
            this.navigate("fundreplace");
          }}>Replace</div>
          <div className="name">
            <div className="icon">
              <img
                src={recommendations && recommendations.pension_house.image}
                alt={recommendations}
                width="90"
              />
            </div>
            <div className="text">
              <div>{recommendations && recommendations.pension_house.name}</div>
            </div>
          </div>
        </div>

        <div className="fund-detail">
          <div className="risk">
            <p>
              <b>Risk:</b> {this.getFormatted(recommendations.risk || "")}
            </p>
            <span
              className="edit-icon edit"
              onClick={() =>
                this.setState({
                  openDialog: true,
                })
              }
            >
              Edit
            </span>
          </div>
          <div className="allocation">
            <div className="graph">
              <canvas
                id="doughnut"
                className="chart chart-doughnut"
                chart-data="data"
                chart-labels="labels"
                chart-colors="colors"
                chart-options="options"
              ></canvas>
              <div
                className="text-center"
                style={{ color: "rgb(135, 135, 135)", marginTop: "10px" }}
              >
                Asset allocation
              </div>
            </div>
            <div className="stats">
              <ul>
                <li>
                  <div className="">
                    <b>Class E</b>
                  </div>
                  <div className="">
                    <span className="color3">
                      {recommendations && recommendations.e_allocation}%
                    </span>{" "}
                    in equity
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class C</b>
                  </div>
                  <div className="">
                    <span className="color4">
                      {recommendations && recommendations.c_allocation}%
                    </span>{" "}
                    in corporate debt
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class G</b>
                  </div>
                  <div className="">
                    <span className="color2">
                      {recommendations && recommendations.g_allocation}%
                    </span>{" "}
                    in govt. bonds
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class A</b>
                  </div>
                  <div className="">
                    <span className="color1">
                      {recommendations && recommendations.a_allocation}%
                    </span>{" "}
                    in AIFs
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bill">
          {all_charges &&
            all_charges.map((item, index) => (
              <div
                className="flex-box"
                style={{
                  fontWeight: `${index === all_charges.length - 1 ? 600 : 500}`,
                }}
                key={index}
              >
                <div className="left">{item.text}</div>
                <div className="right">{formatAmountInr(item.value)}</div>
              </div>
            ))}
          <div className="note">
            <div className="heading">Note:</div>
            <div>
              <span>1.</span> Your subsequent investments will go into the above
              selected pension fund house. Switch facility can be availed only
              once per year.
            </div>
            <div>
              <span>2.</span> At this point, we are only catering customers who
              will be onboarded by us.
            </div>
            <div>
              <span>3.</span> Standard charges stipulated by PFRDA will apply on
              your investment.
            </div>
          </div>
          {/* <div className="terms">
            <img src="../assets/img/terms_agree.png" alt="" width="25" />
            <div ng-if="!finity && isWeb">
              By tapping on proceed, I agree that I have read the <br />
              <a href="https://www.fisdom.com/terms/" target="_blank">
                terms & conditions
              </a>
              .
            </div>
            <div ng-if="!finity && !isWeb">
              By tapping on proceed, I agree that I have read the <br />
              <a ng-click="native_Intent('https://www.fisdom.com/terms/')">
                terms & conditions
              </a>
              .
            </div>
            <div ng-if="finity">
              By tapping on accept, I agree that I have read the <br />
              <a
                ng-class="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
              By tapping on proceed, I agree that I have read the <br />
              <a
                ng-class="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
            </div>
          </div> */}
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Recommendations;
