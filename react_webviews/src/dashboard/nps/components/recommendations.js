import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { inrFormatDecimal2 } from "utils/validators";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import { initialize } from "../common/commonFunctions";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import PieChart from "./piegraph";

const risk_level = ["High", "Low", "Moderate", "Moderate Low"];
const isMobileDevice = getConfig().isMobileDevice;

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      recommendations: "",
      all_charges: "",
      openDialog: false,
      openInvestmentSummary: false,
      risk: '',
      graphData: [],
      display_summary_only: false
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
  //   $scope.display_summary_only = $rootScope.currentUser.nps_investment || false;
  // if($scope.pran_number) {
  //   $scope.display_summary_only = true;
  // }
    let currentUser = storageService().getObject('user');
    let { display_summary_only } = this.state;

    display_summary_only = currentUser.nps_investment || false;
    if (storageService().get('nps-pran_number')) {
      display_summary_only = true;
    }

    this.setState({
      display_summary_only: display_summary_only
    })

    this.fetchRecommendedFunds();
  };

  fetchRecommendedFunds = async () => {
    try {
      this.setState({
        show_loader: true,
      });

      let amount = storageService().get('npsAmount')

      const res = await this.get_recommended_funds(amount);
      let data = res.result;

      if (res.status_code === 200) {
        let recommendations = data.recommended[0];
        let graphData =[
          {
            "id": "E",
            "label": "E",
            "value": recommendations.e_allocation,
            "color": "hsl(227, 70%, 50%)"
          },
          {
            "id": "G",
            "label": "G",
            "value": recommendations.g_allocation,
            "color": "hsl(316, 70%, 50%)"
          },
          {
            "id": "C",
            "label": "C",
            "value": recommendations.c_allocation,
            "color": "hsl(291, 70%, 50%)"
          },
          {
            "id": "A",
            "label": "A",
            "value": recommendations.a_allocation,
            "color": "hsl(262, 70%, 50%)"
          },
        ]

        this.setState({
          recommendations: recommendations,
          all_charges: data.all_charges,
          show_loader: false,
          risk: recommendations.risk,
          graphData: graphData
        });
      } else {
        toast("something went wrong")
      }
      
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
      risk: name,
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
          <DialogContentText className="nps-flex-box" component="div">
          {risk_level.map((item, index) => (
                <div className="edit-risk" key={index}>
                  <div>{item}</div>
                  <Radio
                    checked={this.state.risk === item}
                    onChange={() => this.handleChange(item)}
                    value={this.state.risk || ""}
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

  renderInvestmentSummary = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openInvestmentSummary || false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            color="default"
            autoFocus
            onClick={this.handleClose}
          >
            CONTINUE TO PAYMENT
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  handleClick = async () => {
    let data = {
      amount: "50000",
      order_type: "one_time",
      pension_house_id: "PFM008",
      risk: "moderately_high",
    };

    let result = await this.getInvestmentData(data);
    let pgLink = result.investments.pg_link;

    let plutus_redirect_url = encodeURIComponent(
      window.location.origin + `/nps/redirect` + getConfig().searchParams
    );

    pgLink +=
      (pgLink.match(/[\?]/g) ? "&" : "?") +
      "plutus_redirect_url=" +
      plutus_redirect_url;
    window.location.href = pgLink;
  };

  render() {
    let { recommendations, show_loader, all_charges, graphData } = this.state;
    
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
          <div
            className="replace"
            onClick={() => {
              this.navigate("fundreplace");
            }}
          >
            Replace
          </div>
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
              <b>Risk:</b> {this.getFormatted(this.state.risk || "")}
            </p>
            <span
              className="edit-icon edit"
              onClick={() =>
                this.setState({
                  openInvestmentSummary: true,
                })
              }
            >
              Edit
            </span>
          </div>
          <div className="allocation">
            <div className="graph">
              <PieChart
                height={isMobileDevice ? 100 : 180}
                width={isMobileDevice ? 100 : 180}
                data={graphData}
                colors={["rgb(74, 144, 226)", "rgb(51, 191, 159)", "rgb(131, 90, 237)", "rgb(185, 176, 64)"]}
              ></PieChart>
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
                <div className="right">{inrFormatDecimal2(item.value)}</div>
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
        {this.state.display_summary_only && this.renderInvestmentSummary()}
      </Container>
    );
  }
}

export default Recommendations;
