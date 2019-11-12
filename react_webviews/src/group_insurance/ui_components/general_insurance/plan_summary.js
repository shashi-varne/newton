import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import provider from 'assets/provider.svg';

class PlanSummary extends Component {
  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Make Payment'
        onlyButton={true}
        title="Summary"
        classOverRideContainer="plan-summary"
      >
        <div className="plan-summary-heading">
          <div className="plan-summary-heading-text">Personal Accident</div>
          <img src={provider} alt="" />
        </div>
        <div className="plan-summary-mid">
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">Cover amount</div>
            <div className="plan-summary-mid12">2Lacs</div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">Cover period</div>
            <div className="plan-summary-mid12">1 year</div>
          </div>
          <div className="plan-summary-mid1 plan-summary-mid1-bg">
            <div className="plan-summary-mid11">Policy start date</div>
            <div className="plan-summary-mid12">20 october 2019</div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">End date</div>
            <div className="plan-summary-mid12">19 October 2020</div>
          </div>
        </div>
        <div className="plan-summary-premium">
          <div className="plan-summary-premium-heading">Premium details:</div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">Base premium</div>
            <div className="plan-summary-premium-list2">₹200</div>
          </div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">GST & taxes</div>
            <div className="plan-summary-premium-list2">₹36</div>
          </div>
          <div className="divider"></div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1 plan-summary-premium-font">Total payable</div>
            <div className="plan-summary-premium-list2">₹ 236</div>
          </div>
        </div>
      </Container>
    );
  }
}

export default PlanSummary;