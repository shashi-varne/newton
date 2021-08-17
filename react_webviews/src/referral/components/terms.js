import React, { Component } from 'react';

import Container from '../common/Container';
import qs from 'qs';
import { getConfig } from '../../utils/functions';
import { capitalize } from '../../utils/validators';

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
        <div className="Terms">
          <div className="List">
            <div className="Number">1.</div>
            <div className="Text">
              The reward amount per referral is an exclusive offer just for you & may not be applicable for other investors. {capitalize(this.state.type)} reserves the right to allocate, withhold and amend this special offer at any time.
            </div>
          </div>
          <div className="List">
            <div className="Number">2.</div>
            <div className="Text">
              You will be eligible to receive the referral money only if your referred friend makes an investment for a minimum of ₹500 for SIP and ₹1,000 for a one-time investment.
            </div>
          </div>
          <div className="List">
            <div className="Number">3.</div>
            <div className="Text">
              You will receive the referral amount only if your referred friend makes the investment within the deadline specified.
            </div>
          </div>
          <div className="List">
            <div className="Number">4.</div>
            <div className="Text">
              You will not receive the referral amount if your referred friend doesn’t enter your referral code upon app installation.
            </div>
          </div>
          <div className="List">
            <div className="Number">5.</div>
            <div className="Text">
              Your referred friends will not receive any reward amount upon making their first investment on {capitalize(this.state.type)}.
            </div>
          </div>
          <div className="List">
            <div className="Number">6.</div>
            <div className="Text">
              You will receive the referral amount (Paytm cash) in your Paytm wallet registered with your mobile number.
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Terms;