import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import Button from "@material-ui/core/Button";
import {
  initialize,
  getFormattedEndDate,
  getFormattedStartDate,
  getSchemeOption,
} from "../functions";

class NfoFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_funds",
      nfoFunds: [
        {
          addedToCart: false,
          allotment_date: "",
          allow_purchase: true,
          amc: "Aditya Birla Sun Life Mutual Fund",
          amc_id: "BIRLASUNLIFEMUTUALFUND_MF",
          amc_logo_big:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/high-res/aditya_birla_new.png",
          amc_logo_small:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/aditya_birla_new.png",
          amfi: "INF084M01AF9",
          bond_stock: null,
          cams: "",
          camsv2: [],
          curr_nav: 34.0682,
          end_date: "22/04/2020",
          exit_load:
            "Nil - If the units redeemed or switched out are upto 10% of the units purchased or switched in (the limit) within 1 year from the date of allotment. 1% - If units redeemed or switched out are over and above the limit within 1 year from the date of allotment. Nil - If units are redeemed or switched out on or after 1 year from the date of allotment.",
          friendly_name: "Aditya Birla Sun Life Asset Allocator Fof",
          ft: "",
          ftype: null,
          fund_manager: "Mr. Parveen Ayathan",
          growth_or_dividend: "dividend",
          is_fisdom_recommended: true,
          isin: "INF084M01AF9",
          karvy: "",
          lockin_in: "",
          mfid: "INF084M01AF9",
          mfname:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          name:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          nav_date: "01/15/2021",
          nfo_priority_order: 3,
          nfo_recommendation: true,
          overview:
            "The scheme will adopt a passive investment strategy. The scheme will invest in stocks comprising the Nifty Next 50 index in the same proportion as in the index with the objective of achieving returns equivalent to the Total Returns Index of Nifty Next 50 index by minimizing the performance difference between the benchmark index and the scheme. The Total Returns Index is an index that reflects the returns on the index from index gain/ loss plus dividend payments by the constituent stocks.",
          purchase_allowed: true,
          redemption_disclosure:
            "The Scheme will offer Units for Purchase and Redemption at NAV related prices on every Business Day.The Mutual Fund will endeavour to despatch the Redemption proceeds within 3 Business Days from the date of acceptance of the Redemption request",
          risk_value: 4,
          riskometer: "Moderately High",
          scheme_option: "open_ended",
          sid_link: "http://portal.amfiindia.com/spages/12113.pdf",
          sip_allowed: true,
          start_date: "24/03/2020",
          sundaram: [],
          sundaramv2: "",
          tax_plan: "debt",
        },
        {
          addedToCart: false,
          allotment_date: "",
          allow_purchase: true,
          amc: "Aditya Birla Sun Life Mutual Fund",
          amc_id: "BIRLASUNLIFEMUTUALFUND_MF",
          amc_logo_big:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/high-res/aditya_birla_new.png",
          amc_logo_small:
            "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/aditya_birla_new.png",
          amfi: "INF084M01AF9",
          bond_stock: null,
          cams: "",
          camsv2: [],
          curr_nav: 34.0682,
          end_date: "22/04/2020",
          exit_load:
            "Nil - If the units redeemed or switched out are upto 10% of the units purchased or switched in (the limit) within 1 year from the date of allotment. 1% - If units redeemed or switched out are over and above the limit within 1 year from the date of allotment. Nil - If units are redeemed or switched out on or after 1 year from the date of allotment.",
          friendly_name: "Aditya Birla Sun Life Asset Allocator Fof",
          ft: "",
          ftype: null,
          fund_manager: "Mr. Parveen Ayathan",
          growth_or_dividend: "dividend",
          is_fisdom_recommended: true,
          isin: "INF084M01AF9",
          karvy: "",
          lockin_in: "",
          mfid: "INF084M01AF9",
          mfname:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          name:
            "Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Dividend Option",
          nav_date: "01/15/2021",
          nfo_priority_order: 3,
          nfo_recommendation: true,
          overview:
            "The scheme will adopt a passive investment strategy. The scheme will invest in stocks comprising the Nifty Next 50 index in the same proportion as in the index with the objective of achieving returns equivalent to the Total Returns Index of Nifty Next 50 index by minimizing the performance difference between the benchmark index and the scheme. The Total Returns Index is an index that reflects the returns on the index from index gain/ loss plus dividend payments by the constituent stocks.",
          purchase_allowed: true,
          redemption_disclosure:
            "The Scheme will offer Units for Purchase and Redemption at NAV related prices on every Business Day.The Mutual Fund will endeavour to despatch the Redemption proceeds within 3 Business Days from the date of acceptance of the Redemption request",
          risk_value: 4,
          riskometer: "Moderately High",
          scheme_option: "open_ended",
          sid_link: "http://portal.amfiindia.com/spages/12113.pdf",
          sip_allowed: true,
          start_date: "24/03/2020",
          sundaram: [],
          sundaramv2: "",
          tax_plan: "debt",
        },
      ],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  handleClick = () => {
    this.navigate("/advanced-investing/new-fund-offers/funds/checkout");
  };

  render() {
    let { nfoFunds } = this.state;
    return (
      <Container showLoader={this.state.show_loader} noFooter={true}>
        <div className="nfo-funds">
          {!nfoFunds && (
            <div className="message">
              We are sorry ! There are no funds that match your requirements.
            </div>
          )}
          {nfoFunds &&
            nfoFunds.map((data, index) => {
              return (
                <div key={index} className="content">
                  <div
                    className="card icon"
                    onClick={() => this.detailView(data)}
                  >
                    <img alt={data.friendly_name} src={data.amc_logo_small} />
                  </div>
                  <div className="text">
                    <div
                      className="title"
                      onClick={() => this.detailView(data)}
                    >
                      {data.friendly_name}
                    </div>
                    <div className="item">
                      <div className="sub-item">
                        <p>Type: {getSchemeOption(data.scheme_option)}</p>
                        <p>Category: {data.tax_plan}</p>
                      </div>
                      <div className="invest">
                        <Button onClick={this.handleClick}>INVEST</Button>
                      </div>
                    </div>
                    <div className="date">
                      from {getFormattedStartDate(data.start_date)} - to{" "}
                      {getFormattedEndDate(data.end_date)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    );
  }
}

export default NfoFunds;
