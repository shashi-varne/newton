import React, { Component } from 'react';

import Container from '../common/Container';
import qs from 'qs';
import { getConfig } from '../../utils/functions';

class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      link: getConfig().appLink,
    }
  }


  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Terms & Conditions'}
        background='GreyBackground'
        noFooter={true}
      >
        <div className="Terms pad25">
          <div className="List">
            <div className="Number">1.</div>
            <div className="Text">
              The recommended amount per each referral is a special offer for you and may not applicable for other investors. {this.state.type} decides and has the right to allocate or terminate any special offer.
            </div>
          </div>
          <div className="List">
            <div className="Number">2.</div>
            <div className="Text">
              You will be eligible to receive the referral amount only if the person you refer starts investment for at <span className="BoldText">least ₹ 1000</span>, if investing in <span className="BoldText">SIP</span> or for at least <span className="BoldText">₹ 25000</span>, if investing in one time.
            </div>
          </div>
          <div className="List">
            <div className="Number">3.</div>
            <div className="Text">
              You will only receive the referral amount if the person you refer invests before the mentioned <span className="BoldText">deadline</span>.
            </div>
          </div>
          <div className="List">
            <div className="Number">4.</div>
            <div className="Text">
              You will not be eligible for any referral amount if the person you refers doesn’t input your <span className="BoldText">referral code</span> before investing from his/her app.
            </div>
          </div>
          <div className="List">
            <div className="Number">5.</div>
            <div className="Text">
              The person you refer will not receive any kind of referral amount upon starting <span className="BoldText">his/her first investment</span>.
            </div>
          </div>
          <div className="List">
            <div className="Number">6.</div>
            <div className="Text">
              After the person you refer invests, you will receive the eligible referral amount in the form of <span className="BoldText">Paytm cash</span> in your <span className="BoldText">Paytm wallet</span> registered with your number <span className="BoldText">+{this.state.params.mobile}</span>.
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Terms;
