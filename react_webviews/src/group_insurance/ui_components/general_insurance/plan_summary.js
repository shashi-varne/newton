import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import provider from 'assets/provider.svg';
import {numDifferentiation} from '../../../utils/validators';

class PlanSummaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      parent: this.props.parent,
      basic_details_data: this.props.parent.state.basic_details_data || {}
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentDidUpdate(prevState) {

    if (this.state.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }


  }

  handleClickCurrent() {
    this.props.parent.handleClick();
  }

  render() {


    // let summaryData = {
    //   "product_title" : lead.product_title,
    //   "cover_amount" : lead.cover_amount,
    //   "product_coverage" : lead.product_coverage,
    //   "dt_policy_start" : lead.dt_policy_start,
    //   "dt_policy_end" : lead.dt_policy_end,
    //   "base_premium" : lead.base_premium,
    //   "tax_amount" : lead.tax_amount,
    //   "premium" : lead.premium
    // }
    console.log(this.props.parent)

    if (this.props.parent.state && this.props.parent.state.summaryData) {
      return (
        <Container
          fullWidthButton={true}
          buttonTitle='Make Payment'
          onlyButton={true}
          handleClick={()=> this.handleClickCurrent()}
          title="Summary"
          classOverRideContainer="plan-summary"
        >
          <div className="plan-summary-heading">
      <div className="plan-summary-heading-text">{this.props.parent.state.summaryData.product_title}</div>
            <img src={provider} alt="" />
          </div>
          <div className="plan-summary-mid">
            <div className="plan-summary-mid1">
              <div className="plan-summary-mid11">Cover amount</div>
              <div className="plan-summary-mid12">{numDifferentiation(this.props.parent.state.summaryData.cover_amount)}</div>
            </div>
            <div className="plan-summary-mid1">
              <div className="plan-summary-mid11">Cover period</div>
              <div className="plan-summary-mid12">{this.props.parent.state.summaryData.product_coverage} year</div>
            </div>
            <div className="plan-summary-mid1 plan-summary-mid1-bg">
              <div className="plan-summary-mid11">Policy start date</div>
              <div className="plan-summary-mid12">{this.props.parent.state.summaryData.dt_policy_start}</div>
            </div>
            <div className="plan-summary-mid1">
              <div className="plan-summary-mid11">End date</div>
              <div className="plan-summary-mid12">{this.props.parent.state.summaryData.dt_policy_end}</div>
            </div>
          </div>
          <div className="plan-summary-premium">
            <div className="plan-summary-premium-heading">Premium details:</div>
            <div className="plan-summary-premium-list">
              <div className="plan-summary-premium-list1">Base premium</div>
              <div className="plan-summary-premium-list2">₹{this.props.parent.state.summaryData.base_premium}</div>
            </div>
            <div className="plan-summary-premium-list">
              <div className="plan-summary-premium-list1">GST & taxes</div>
              <div className="plan-summary-premium-list2">₹{this.props.parent.state.summaryData.tax_amount}</div>
            </div>
            <div className="divider"></div>
            <div className="plan-summary-premium-list">
              <div className="plan-summary-premium-list1 plan-summary-premium-font">Total payable</div>
              <div className="plan-summary-premium-list2">₹ {this.props.parent.state.summaryData.premium}</div>
            </div>
          </div>
        </Container>
      );
    }

    return null;
    
  }
}

const PlanSummary = (props) => (
  <PlanSummaryClass
    {...props} />
);

export default PlanSummary;