import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../common/commonFunctions";
import Api from "utils/api";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";
import { formatAmountInr } from "../../../utils/validators";

class NpsInvestments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nps_data: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {

    let currentUser = storageService().get('currentUser');
    
    try {
      this.setState({
        show_loader: true,
      });
      const res = await Api.get(`/api/nps/summary`);

      let { result, status_code: status } = res.pfwresponse;

      this.setState({
        show_loader: false,
      });

      if (status === 200) {

        let nps_data = result

        this.setState({
          nps_data: nps_data
        })
      } else {
        toast(result.error || result.message);
      }

    } catch (err) {
      this.setState({
        show_loader: false,
      });
      throw err;
    }
  }

  nps_tax_statement = () => {
    // windows.
  }

  optionClicked = (route, item) => {
    this.navigate('pending')
    let cardClicked = item;
    this.setState({
      cardClicked: cardClicked
    })

    this.navigate(route);
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="INVEST MORE"
        hideInPageTitle
        hidePageTitle
        title="NPS Investments"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <section className="page invest nps">
          <div className="nps-investments">
            <div
              className="list"
              ng-if="npscampaign"
              ng-click="redirectNpsCampLink('nps activation pending')"
            >
              <div className="icon">
                <img src={require("assets/warning_icon.svg")} width="40" />
              </div>
              <div className="text">
                <div className="title">NPS activation pending</div>
                <div className="sub-title">e-Sign through Aadhaar</div>
              </div>
            </div>

            <div className="list" onClick={() => this.nps_tax_statement()}>
              <div className="icon">
                <img
                  src={require("assets/fisdom/icn_tax_statement.svg")}
                  width="40"
                />
              </div>
              <div className="text">
                <div className="title">Tax Statement </div>
                <div className="sub-title">PRAN: {this.state.nps_data.pran}</div>
              </div>
              <div
                className="status"
                style={{ color: `${this.state.nps_data.pran_status === 'active' ? 'green' : '#c2a20c'}`}}
              >
                <div className="circle"></div>
                {this.state.nps_data.pran_status === 'active' && <div>ACTIVE</div>}
                {this.state.nps_data.pran_status !== 'active' && <div>FREEZED</div>}
              </div>
            </div>
            {getConfig().partner_code !== 'bfdlmobile' &&
              <div
                className="list"
                onClick={() => this.optionClicked('kyc-journey', 'complete nps transaction')}
                // ng-if="currentUser.kyc_registration_v2 === 'init' || currentUser.kyc_registration_v2 === 'incomplete'"
              >
                <div className="icon">
                  <img
                    src={require("assets/kyc_icon.svg")}
                    height="40"
                    width="40"
                  />
                </div>
                <div className="text">
                  <div className="title">KYC</div>
                  <div className="sub-title">Complete nps transaction</div>
                </div>
              </div>}
            {/* <!-- <div className="list" ui-sref="nps-sip-schedule" ng-show="sipIntents.length > 0">
              <div className="icon">
                <img src="../assets/img/sip.png" width="50" />
              </div>
              <div className="text">
                <div className="title">NPS SIP Schedule</div>
                <div className="sub-title"></div>
              </div>
            </div> --> */}
            {this.state.nps_data && this.state.nps_data.portfolio_data.length > 0 && <div
              className="list"
              onClick={() => this.optionClicked('performance', 'track nps performance')}
            >
              <div className="icon">
                <img
                  src={require("assets/fisdom/icn_fundwise_summary.svg")}
                  width="40"
                />
              </div>
              <div className="text">
                <div className="title">Track NPS Performance</div>
                <div className="sub-title">View fund wise summary</div>
              </div>
            </div>}
            <div
              className="list"
              onClick={() => this.optionClicked('pending', 'pending order')}
            >
              <div className="icon">
                <img
                  src={require("assets/fisdom/icn_fundwise_summary.svg")}
                  width="40"
                />
              </div>
              <div className="text">
                <div className="title">Pending Order</div>
                <div className="sub-title">
                  {formatAmountInr(this.state.nps_data.total_pending_amount)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsInvestments;
