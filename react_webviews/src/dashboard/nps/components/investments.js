import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../common/commonFunctions";
import Api from "utils/api";
import toast from "common/ui/Toast";
import { storageService } from "utils/validators";
import { formatAmountInr } from "../../../utils/validators";
import { getConfig } from "utils/functions";

class NpsInvestments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nps_data: '',
      currentUser: '',
      npscampaign: false,
      npsCampActionUrl: '',
      skelton: 'g'
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let currentUser = storageService().getObject('user');
    let campaigns = storageService().getObject("campaign");
    let { npscampaign, npsCampActionUrl } = this.state;

    let npsCampaignData = {
      notification_visual_data: {
        target: []
      }
    };

    campaigns.forEach(item => {
      if (item.campaign === 'nps_esign') {
        npscampaign = true;
        npsCampaignData = item;
      }
    })

    let target = npsCampaignData.notification_visual_data.target;

    if (target.length > 0) {
      target.forEach(item => {
        if (item.url) {
          npsCampActionUrl = item.url;
        }
      })
    }

    this.setState({
      currentUser: currentUser,
      npscampaign: npscampaign,
      npsCampActionUrl: npsCampActionUrl
    })
    
    try {
      this.setState({
        skelton: true,
      });
      const res = await Api.get(`/api/nps/summary`);

      let { result, status_code: status } = res.pfwresponse;

      storageService().setObject('nps_pending_orders', result.pending_orders);
      storageService().setObject('nps_performance', result.portfolio_data);
      storageService().set('nps_pran', result.pran);

      this.setState({
        skelton: false,
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
        skelton: false,
      });
      throw err;
    }
  }

  redirection = (url) => {
    let paymentRedirectUrl = encodeURIComponent(
      window.location.origin + `/nps/investments` + getConfig().searchParams
    );

    let back_url = paymentRedirectUrl;

    // for web no issue
    if(getConfig().Web) {
      this.openInBrowser(url)
    } else {
      var payment_link = url;
      var pgLink = payment_link;
      let app = getConfig().app;
      // eslint-disable-next-line
      pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
        '&app=' + app + '&back_url=' + back_url;
      if (getConfig().generic_callback) {
        pgLink += '&generic_callback=' + getConfig().generic_callback;
      }


      this.openInTabApp({
        url: pgLink,
        back_url: back_url
      });
    }
  }

  optionClicked = (route, item) => {

    let cardClicked = item;
    this.setState({
      cardClicked: cardClicked
    })

    this.navigate('/kyc/kyc-journey', '', true);
  }

  investMore = () => {
    this.navigate('amount/one-time')
  }

  render() {
    return (
      <Container
        fullWidthButton
        buttonTitle="INVEST MORE"
        title="NPS Investments"
        showLoader={this.state.show_loader}
        handleClick={this.investMore}
        skelton={this.state.skelton}
      >
        <section className="page invest nps">
          <div className="nps-investments">
            {this.state.npscampaign && <div
              className="list"
              onClick={() => this.redirection(this.state.npsCampActionUrl)}
            >
              <div className="icon">
                <img
                  alt='' src={require("assets/warning_icon.svg")} width="40" />
              </div>
              <div className="text">
                <div className="title">NPS activation pending</div>
                <div className="sub-title">e-Sign through Aadhaar</div>
              </div>
            </div>}

            <div className="list" onClick={() => this.redirection( this.state.nps_data.nps_tax_statement_url)}>
              <div className="icon">
                <img
                  alt=''
                  src={require("assets/fisdom/icn_tax_statement.svg")}
                  width="40"
                />
              </div>
              <div className="text">
                <div className="title">Tax Statement </div>
                <div className="sub-title">PRAN: {this.state.nps_data.pran}</div>
              </div>
              <div
                className={`status ${this.state.nps_data.pran_status === 'active' ? 'green' : 'yellow'}`}
              >
                <div className="circle"></div>
                {this.state.nps_data.pran_status === 'active' && <div>ACTIVE</div>}
                {this.state.nps_data.pran_status !== 'active' && <div>FREEZED</div>}
              </div>
            </div>
            {this.state.productName !== 'bfdlmobile' && (this.state.currentUser.kyc_registration_v2 === 'init' || 
            this.state.currentUser.kyc_registration_v2 === 'incomplete') &&
              <div
                className="list"
                onClick={() => this.optionClicked('kyc/kyc-journey', 'complete nps transaction')}
              >
                <div className="icon">
                  <img
                    alt=''
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
                <img
                  alt='' src="../assets/img/sip.png" width="50" />
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
                  alt=''
                  src={require("assets/fisdom/icn_fundwise_summary.svg")}
                  width="40"
                />
              </div>
              <div className="text">
                <div className="title">Track NPS Performance</div>
                <div className="sub-title">View fund wise summary</div>
              </div>
            </div>}
            {this.state.nps_data && this.state.nps_data.pending_orders.length > 0 && <div
              className="list"
              onClick={() => this.optionClicked('pending', 'pending order')}
            >
              <div className="icon">
                <img
                  alt=''
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
            </div>}
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsInvestments;
