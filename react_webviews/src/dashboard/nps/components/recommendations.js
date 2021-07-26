import React, { Component, useEffect, useState } from "react";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { inrFormatDecimal2 } from "utils/validators";
import { getConfig } from "utils/functions";
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
import { getBasePath } from "../../../utils/functions";
import { keyBy } from 'lodash';
import { isEmpty } from "../../../utils/validators";

const config = getConfig();
const isMobileDevice = config.isMobileDevice;
const partnerCode = config.code;

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
      pieChartData: [],
      display_summary_only: false,
      amount: "",
      url: "",
      pension_house: {},
      skelton: "g",
      pran: '',
      alternativeRiskOptsMap: {}
    };
    this.initialize = initialize.bind(this);
;  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let currentUser = storageService().getObject("user");
    let { display_summary_only, pran } = this.state;

    display_summary_only = currentUser.nps_investment || false;
    pran = storageService().get("nps_pran_number");
    if (pran) {
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
      pran: pran
    });

    this.fetchRecommendedFunds();
  };

  fetchRecommendedFunds = async () => {
    this.setState({
      skelton: true,
    });

    let amount = storageService().get("npsAmount");
    let { pran } = this.state;

    const res = await this.get_recommended_funds(amount, true);
    let data = res;
    if (data && !pran) {
      const [recommendations] = data.recommended;
      const altRiskOptsMap = keyBy([...data.alternatives, ...data.recommended], 'risk');
      const assetAlloc = altRiskOptsMap[recommendations?.risk || this.state.risk]

      this.setState(
        {
          recommendations: recommendations,
          all_charges: data.all_charges,
          payment_details: data.payment_breakup,
          alternativeRiskOptsMap: altRiskOptsMap,
          assetAllocation: assetAlloc,
          pieChartData: createPieChartData(assetAlloc),
          skelton: this.state.display_summary_only,
          risk: recommendations?.risk || this.state.risk,
        },
        () => {
          this.state.display_summary_only && this.handleClick();
        }
      );
    } else {
      this.setState({
        all_charges: data?.all_charges,
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

  changeRiskSelection = (name) => {
    const assetAlloc = this.state.alternativeRiskOptsMap[name];
    this.setState({
      openDialog: false,
      risk: name,
      assetAllocation: assetAlloc,
      pieChartData: createPieChartData(assetAlloc)
    });
  };

  closeInvestment = () => {
    this.setState({
      openInvestmentSummary: false,
    });
    this.navigate("/nps/amount/one-time");
  };

  renderInvestmentSummary = () => {
    let { recommendations, all_charges, pran } = this.state;

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
            data-aid='alert-dialog-description'
          >
            <div className="md-dialog-content" data-aid='nps-md-dialog-content'>
              {pran && <div>
                <div className="pran-title">Contribution to your existing NPS</div>
                <div className="pran-subtitle">
                  Continue contributing to your existing NPS account
                        with <b>PRAN - {pran}</b>
                </div>
              </div>}

              {!pran && <div style={{ display: "flex", margin: "0 0 20px 0" }}>
                <img
                  src={
                    recommendations.pension_house &&
                    recommendations.pension_house.image
                  }
                  alt="NPS"
                  className="nrd-pension-house-image"
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
              </div>}

              <div className="mid-content" data-aid='nps-mid-content'>
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
                            {inrFormatDecimal2(item.value)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div data-aid='nps-call-back-popup-button'>
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
    let { pran, pension_house, recommendations, amount } = this.state;

    let data = {
      amount: this.state.amount,
      order_type: "one_time",
    };

    if (!pran) {
      data.pension_house_id = !isEmpty(pension_house)
        ? pension_house.pension_house_id
        : recommendations.pension_house
        ? recommendations.pension_house.pension_house_id
        : "";
      data.risk = this.state.risk;
    } else {
      data.pran = pran;
    }

    let result = await this.getInvestmentData(data, true);

    if (result) {
      if(partnerCode) {
        storageService().set("partner", partnerCode)
      }
      let pgLink = result.investments.pg_link;

      let plutus_redirect_url = encodeURIComponent(
        // getBasePath() + `/nps/redirect` + getConfig().searchParams
        `${getBasePath()}/nps/payment/callback/one-time/${amount}/${result.investments.id}`
      );

      pgLink +=
        // eslint-disable-next-line no-useless-escape
        (pgLink.match(/[\?]/g) ? "&" : "?") +
        "plutus_redirect_url=" +
        plutus_redirect_url;

      if (this.state.display_summary_only) {
        this.setState({
          url: pgLink,
          skelton: false,
          openInvestmentSummary: true,
        });
      } else {
        window.location.href = pgLink;
      }
    }
  };

  handleReplace = () => {
    const { recommendations, pension_house } = this.state;
    const replaceObject = pension_house || recommendations?.pension_house;
    storageService().setObject("nps-current", replaceObject);
    this.navigate("/nps/fundreplace");
  }

  goBack = () => {
    this.navigate('/nps/amount/one-time')
  }
 
  render() {
    const {
      assetAllocation,
      recommendations,
      pension_house,
      show_loader,
      all_charges,
      pieChartData,
      display_summary_only,
      url,
    } = this.state;

    return (
      <Container
        data-aid='nps-recommended-fund-screen'
        fullWidthButton
        buttonTitle="PROCEED"
        title="Recommended fund"
        noFooter={display_summary_only}
        showLoader={show_loader}
        handleClick={this.handleClick}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        headerData={{
          goBack: this.goBack
        }}
      >
        {!display_summary_only && (
          <div data-aid='nps-display-summary-only'>
            <div className="fund" data-aid='nps-fund'>
              <div
                className="replace"
                onClick={() => {
                  this.handleReplace();
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

            <div className="fund-detail" data-aid='nps-fund-detail'>
              <div className="risk" data-aid='nps-risk'>
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
                <RiskSelectDialog
                  open={this.state.openDialog}
                  onClose={this.handleClose}
                  onApply={this.changeRiskSelection}
                  currentRisk={this.state.risk}
                />
              </div>
              <div className="allocation" data-aid='nps-allocation'>
                <div className="graph" data-aid='nps-graph'>
                  <PieChart
                    height={isMobileDevice ? 100 : 180}
                    width={isMobileDevice ? 100 : 180}
                    data={pieChartData || {}}
                  ></PieChart>
                  <div
                    className="text-center"
                    style={{ color: "rgb(135, 135, 135)", marginTop: "10px" }}
                  >
                    Asset allocation
                  </div>
                </div>
                <div className="stats" data-aid='nps-stats'>
                  <ul>
                    <li>
                      <div className="">
                        <b>Class E</b>
                      </div>
                      <div className="">
                        <span style={{ color: classColorMap['E'] }}>
                          {assetAllocation?.e_allocation}% 
                        </span>
                        &nbsp;in equity
                      </div>
                    </li>
                    <li>
                      <div className="">
                        <b>Class C</b>
                      </div>
                      <div className="">
                        <span style={{ color: classColorMap['C'] }}>
                          {assetAllocation?.c_allocation}%
                        </span>
                        &nbsp;in corporate debt
                      </div>
                    </li>
                    <li>
                      <div className="">
                        <b>Class G</b>
                      </div>
                      <div className="">
                        <span style={{ color: classColorMap['G'] }}>
                          {assetAllocation?.g_allocation}%
                        </span>
                        &nbsp;in govt. bonds
                      </div>
                    </li>
                    <li>
                      <div className="">
                        <b>Class A</b>
                      </div>
                      <div className="">
                        <span style={{ color: classColorMap['A'] }}>
                          {assetAllocation?.a_allocation}%
                        </span>
                        &nbsp;in AIFs
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bill" data-aid='nps-bill'>
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
              <div className="note" data-aid='nps-note'>
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
              <div className="terms" data-aid='nps-terms'>
                <img src={require("assets/terms_agree.png")} alt="" width="25" />
                <div>
                  By tapping on proceed, I agree that I have read the {" "}
                  <span onClick={() => this.openInBrowser(config.termsLink)} style={{textDecoration:'underline', cursor:'pointer'}}>
                    terms & conditions
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.display_summary_only &&
          url &&
          this.renderInvestmentSummary()}
      </Container>
    );
  }
}

const createPieChartData = (allocData = {}) => {
  return [
    {
      id: "E",
      label: "E",
      value: allocData?.e_allocation,
      color: classColorMap['E'],
    },
    {
      id: "G",
      label: "G",
      value: allocData?.g_allocation,
      color: classColorMap['G'],
    },
    {
      id: "C",
      label: "C",
      value: allocData?.c_allocation,
      color: classColorMap['C'],
    },
    {
      id: "A",
      label: "A",
      value: allocData?.a_allocation,
      color: classColorMap['A'],
    },
  ]
};

const classColorMap = {
  E: "rgb(74, 144, 226)",
  G: "rgb(51, 191, 159)",
  C: "rgb(131, 90, 237)",
  A: "rgb(185, 176, 64)"
};

export default Recommendations;


const riskLevelMap = {
  high: "High",
  low: "Low",
  moderate: "Moderate",
  moderately_low: "Moderately Low",
  moderately_high: "Moderately High"
};

const RiskSelectDialog = ({
  open,
  onClose,
  currentRisk,
  onApply
}) => {
  const [selectedRisk, setSelectedRisk] = useState(currentRisk);

  useEffect(() => {
    setSelectedRisk(currentRisk)
  }, [currentRisk])

  return (
    <Dialog
      data-aid='dialog-recommendations'
      fullScreen={false}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      classes={{
        paperScrollPaper: 'risk-level'
      }}
    >
      <DialogTitle id="form-dialog-title" className="edit-title" data-aid='form-dialog-title'>
        Choose Risk Level
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="nps-flex-box" component="div">
          {Object.entries(riskLevelMap).map(([key, value]) => (
            <div className="edit-risk" key={key} onClick={() => setSelectedRisk(key)} data-aid='nps-edit-risk'>
              <div>{value}</div>
              <Radio
                checked={key === selectedRisk}
                value={selectedRisk}
                name="radio-button-demo"
                color="primary"
              />
            </div>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          data-aid='nps-dialog-apply-btn'
          className="DialogButtonFullWidth"
          color="default"
          autoFocus
          onClick={() => onApply(selectedRisk)}
        >
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
};
