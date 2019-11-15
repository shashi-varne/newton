import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import provider from 'assets/provider.svg';
import { numDifferentiation } from '../../../utils/validators';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { insuranceStateMapper } from '../../constants';
import { nativeCallback } from 'utils/native_callback';

class PlanSummaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      show_loader: true,
      parent: this.props.parent,
      summaryData: {}
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentWillMount() {


    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {
    try {
      let res = await Api.get('ins_service/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)

      if (res.pfwresponse.status_code === 200) {

        var lead = res.pfwresponse.result.lead;
        console.log(lead);
        let summaryData = {
          "product_title": lead.product_title || '',
          "cover_amount": lead.cover_amount || '',
          "product_coverage": lead.product_coverage || '',
          "dt_policy_start": lead.dt_policy_start || '',
          "dt_policy_end": lead.dt_policy_end || '',
          "base_premium": lead.base_premium || '',
          "tax_amount": lead.tax_amount || '',
          "premium": lead.premium || ''
        }

        this.setState({
          summaryData: summaryData,
          show_loader: false
        })

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }


  componentDidUpdate(prevState) {

    if (this.state.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }


  }

  navigate = (pathname) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async handleClickCurrent() {

    try {
      this.setState({
        show_loader: true
      })
      let res2;
      res2 = await Api.get('ins_service/api/insurance/bhartiaxa/start/payment?lead_id=' + this.state.lead_id)

      console.log(res2)
      if (res2.pfwresponse.status_code === 200) {

        let current_url = window.location.origin + 'journey' + getConfig().searchParams;
        let paymentRedirectUrl = encodeURIComponent(
          window.location.origin + '/group-insurance/' + insuranceStateMapper[this.props.parent.state.product_key] + '/payment'
        );

        var payment_link = res2.pfwresponse.result.payment_link;
        var pgLink = payment_link;


        let app = getConfig().app;
        var back_url = encodeURIComponent(current_url);
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
          '&app=' + app + '&back_url=' + back_url;
        if (getConfig().generic_callback) {
          pgLink += '&generic_callback=' + getConfig().generic_callback;
        }
        this.sendEvents('next');

        window.localStorage.setItem('group_insurance_payment_url', pgLink);

        window.location.href = pgLink;



      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      toast('Something went wrong');
    }
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'summary',
        "type": this.props.parent.state.product_key
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {

    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Make Payment'
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClickCurrent()}
        title="Summary"
        classOverRideContainer="plan-summary"
      >
        <div className="plan-summary-heading">
          <div className="plan-summary-heading-text">{this.state.summaryData.product_title}</div>
          <img src={provider} alt="" />
        </div>
        <div className="plan-summary-mid">
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">Cover amount</div>
            <div className="plan-summary-mid12">{numDifferentiation(this.state.summaryData.cover_amount || 0)}</div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">Cover period</div>
            <div className="plan-summary-mid12">{this.state.summaryData.product_coverage} year</div>
          </div>
          <div className="plan-summary-mid1 plan-summary-mid1-bg">
            <div className="plan-summary-mid11">Policy start date</div>
            <div className="plan-summary-mid12">{this.state.summaryData.dt_policy_start}</div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">End date</div>
            <div className="plan-summary-mid12">{this.state.summaryData.dt_policy_end}</div>
          </div>
        </div>
        <div className="plan-summary-premium">
          <div className="plan-summary-premium-heading">Premium details:</div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">Base premium</div>
            <div className="plan-summary-premium-list2">₹{this.state.summaryData.base_premium}</div>
          </div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">GST & taxes</div>
            <div className="plan-summary-premium-list2">₹{this.state.summaryData.tax_amount}</div>
          </div>
          <div className="divider"></div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1 plan-summary-premium-font">Total payable</div>
            <div className="plan-summary-premium-list2">₹ {this.state.summaryData.premium}</div>
          </div>
        </div>
      </Container>
    );


  }
}

const PlanSummary = (props) => (
  <PlanSummaryClass
    {...props} />
);

export default PlanSummary;