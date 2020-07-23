import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class LoanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
      this.sendEvents('next');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan summary"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="GET LOAN"
      >
        <div className="loan-summary">
            <div className="container">
              <div style={{padding:'20px 20px 20px 20px'}}>
                <div className="head" style={{paddingBottom: '22px'}}>Loan details</div>
                <div className="items">
                  <div>Sanctioned Loan Amount</div>
                  <div>₹2 lac</div>
                </div>
                <div className="items">
                  <div>Processing fee</div>
                  <div>- ₹5,000</div>
                </div>
                <div className="items">
                  <div>GST</div>
                  <div>- ₹900</div>
                </div>
                <hr style={{background:"#ccd3db"}} />
                <div className="credit">
                  <div>Amount credited to bank a/c</div>
                  <div>₹1,98,100</div>
                </div>
              </div>
            </div>

            <div className="emi-detail">
              <div className="head">EMI detail</div>
              <div style={{fontSize: '13px'}}>
                ₹33,000/month for 3 months
              </div>
            </div>

            <div className='head' style={{paddingBottom: '20px'}}>
              Loan agreement
            </div>

            <div className="agreement">
              Loan agreement for your convenience here.
              We have summarized the key terms of the user loan agreement 
              for your convenience here. Please read the entire agreement 
              below before clicking the “I Agree” tab:
            </div>

            <Grid container spacing={16} alignItems="center">
              <Grid item xs={1} className="TextCenter">
                  <Checkbox
                      defaultChecked
                      checked={this.state.confirm_details_check}
                      color="primary"
                      value="confirm_details_check"
                      name="confirm_details_check"
                      className="Checkbox" />
              </Grid>
              <Grid item xs={11}>
                  <label>I have read the agreement carefully.</label>
              </Grid>
            </Grid>

        </div>
      </Container>
    );
  }
}

export default LoanSummary;
