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
import Slide from "@material-ui/core/Slide";
import { formatAmountInr } from "../../../utils/validators";

const risk_level = ["High", "Low", "Moderate", "Moderate Low"];
const isMobileDevice = getConfig().isMobileDevice;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      recommendations: "",
      all_charges: "",
      openDialog: false,
      openInvestmentSummary: true,
      risk: "high",
      graphData: [],
      display_summary_only: false,
      amount: "",
      url: "",
      pension_house: {},
      skelton: "g",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let currentUser = storageService().getObject("user");
    let { display_summary_only } = this.state;

    display_summary_only = currentUser.nps_investment || false;
    if (storageService().get("nps-pran_number")) {
      display_summary_only = true;
    }

    let amount = storageService().get("npsAmount");
    let prevpath = storageService().get("nps-prevpath") || "";
    let pension_house =
      prevpath === "fund-replace"
        ? storageService().getObject("nps-recommend")
        : {};

    this.setState({
      display_summary_only: display_summary_only,
      amount: amount,
      pension_house: pension_house,
    });

    this.fetchRecommendedFunds();
  };

  fetchRecommendedFunds = async () => {
    this.setState({
      skelton: true,
    });

    let amount = storageService().get("npsAmount");

    const res = await this.get_recommended_funds(amount, true);
    let data = res;

    if (data) {
      let recommendations = data.recommended[0];
      let graphData = [
        {
          id: "E",
          label: "E",
          value: recommendations.e_allocation,
          color: "hsl(227, 70%, 50%)",
        },
        {
          id: "G",
          label: "G",
          value: recommendations.g_allocation,
          color: "hsl(316, 70%, 50%)",
        },
        {
          id: "C",
          label: "C",
          value: recommendations.c_allocation,
          color: "hsl(291, 70%, 50%)",
        },
        {
          id: "A",
          label: "A",
          value: recommendations.a_allocation,
          color: "hsl(262, 70%, 50%)",
        },
      ];

      this.setState(
        {
          recommendations: recommendations,
          all_charges: data.all_charges,
          payment_details: data.payment_breakup,
          skelton: this.state.display_summary_only,
          risk: recommendations.risk,
          graphData: graphData,
        },
        () => {
          this.state.display_summary_only && this.handleClick();
        }
      );
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

  closeInvestment = () => {
    this.setState({
      openInvestmentSummary: false,
    });
    this.navigate("amount/one-time");
  };

  renderInvestmentSummary = () => {
    let { recommendations, all_charges } = this.state;

    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openInvestmentSummary || false}
        onClose={this.closeInvestment}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
      >
        <DialogContent>
          <div
            className="group-health-bmi-dialog"
            id="alert-dialog-description"
          >
            <div className="md-dialog-content">
              {/* <div ng-if="pran_number || (!recommendation_avail && pran_backend)">
                <div className="title">Contribution to your existing NPS</div>
                <div className="subtitle">
                  Continue contributing to your existing NPS account
                        with <b>PRAN - {'{pran_number || pran_backend}'}</b>
                </div>
              </div> */}

              <div style={{ display: "flex", margin: "0 0 20px 0" }}>
                <img
                  src={
                    recommendations.pension_house &&
                    recommendations.pension_house.image
                  }
                  alt="NPS"
                  style={{ width: "70px" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: "0 0 0 10px",
                  }}
                >
                  <div
                    style={{
                      color: "#4A494A",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    TIER 1
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>
                    {recommendations.pension_house &&
                      recommendations.pension_house.name}
                  </div>
                </div>
              </div>

              <div className="mid-content">
                {all_charges &&
                  all_charges.map((item, index) => (
                    <div className="nps-payment" key={index}>
                      {item.value > 0 && (
                        <div
                          className={`mid-content-points ${
                            item.key === "total_amount" && "heading"
                          }`}
                        >
                          <div className="mid-content-points-left">
                            {item.text}
                          </div>
                          <div className="mid-content-points-right">
                            {formatAmountInr(item.value)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => this.payment()}
                className="call-back-popup-button"
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  payment = () => {
    let url = this.state.url;

    window.location.href = url;
  };

  handleClick = async () => {
    let data = {
      amount: this.state.amount,
      order_type: "one_time",
      pension_house_id:
        (!this.state.display_summary_only &&
          this.state.pension_house &&
          this.state.pension_house.pension_house_id) ||
        this.state.recommendations.pension_house
          ? this.state.recommendations.pension_house.pension_house_id
          : "",
      risk: this.state.risk,
    };

    let result = await this.getInvestmentData(data, true);

    if (result) {
      let pgLink = result.investments.pg_link;

      let plutus_redirect_url = encodeURIComponent(
        window.location.origin + `/nps/redirect` + getConfig().searchParams
      );

      pgLink +=
        (pgLink.match(/[\?]/g) ? "&" : "?") +
        "plutus_redirect_url=" +
        plutus_redirect_url;

      if (this.state.display_summary_only) {
        this.setState({
          url: pgLink,
          show_loader: false,
          openInvestmentSummary: true,
        });
      } else {
        window.location.href = pgLink;
      }
    }
  };

  goBack = () => {
    this.navigate("amount/one-time");
  };

  render() {
    let {
      recommendations,
      pension_house,
      show_loader,
      all_charges,
      graphData,
      display_summary_only,
      url,
    } = this.state;

    return (
      <Container
        fullWidthButton
        buttonTitle="PROCEED"
        title="Recommended fund"
        noFooter={display_summary_only}
        title="Recommended fund"
        showLoader={show_loader}
        handleClick={this.handleClick}
        goBack={this.goBack}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        {!display_summary_only && (
          <div>
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
                    src={
                      pension_house.image ||
                      (recommendations && recommendations.pension_house.image)
                    }
                    alt=""
                    width="90"
                  />
                </div>
                <div className="text">
                  <div>
                    {pension_house.name ||
                      (recommendations && recommendations.pension_house.name)}
                  </div>
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
                      openDialog: true,
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
                    data={graphData || {}}
                    colors={[
                      "rgb(74, 144, 226)",
                      "rgb(51, 191, 159)",
                      "rgb(131, 90, 237)",
                      "rgb(185, 176, 64)",
                    ]}
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
                      fontWeight: `${
                        index === all_charges.length - 1 ? 600 : 500
                      }`,
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
                  <span>1.</span> Your subsequent investments will go into the
                  above selected pension fund house. Switch facility can be
                  availed only once per year.
                </div>
                <div>
                  <span>2.</span> At this point, we are only catering customers
                  who will be onboarded by us.
                </div>
                <div>
                  <span>3.</span> Standard charges stipulated by PFRDA will
                  apply on your investment.
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
                ng-className="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
              By tapping on proceed, I agree that I have read the <br />
              <a
                ng-className="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
            </div>
          </div> */}
            </div>
            {this.renderDialog()}
          </div>
        )}
        {this.state.display_summary_only &&
          url &&
          this.renderInvestmentSummary()}
      </Container>
    );
  }
}

export default Recommendations;
