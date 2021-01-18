import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import {  formatAmountInr } from "../../../utils/validators";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';

class LoanEligible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      checked: false
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      vendor_info: vendor_info,
      application_info: application_info
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan eligibility',
        "stage": 'eligible'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  triggerConversion= async () => {

    this.setState({
      show_loader: true
    });
    try {

      let res = await Api.get(`/relay/api/loan/dmi/accept_offer/${this.state.application_id}${this.state.checked ? '?is_insured=true' : ''}`);

      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.navigate('journey');

      } else {
        this.setState({
          show_loader: false
        });
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }
    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  handleClick = () => {
    this.sendEvents('next');
    this.triggerConversion();
  }

  handleChange = () => {
    let { checked } = this.state;

    this.setState({
      checked: !checked
    })
  }

  render() {

    let vendor_info = this.state.vendor_info || {};
    return (
      <Container
        showLoader={this.state.show_loader}
        title=''
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        hidePageTitle={true}
        headerData={{
          icon: 'close'
        }}
      >
        <div className="loan-status">
          <img
            src={ require(`assets/${this.state.productName}/ils_loan_status.svg`)}
            style={{width:"100%"}}
            alt="" 
          />

          <div className="loan-eligible">
            <b>Congratulation!</b> You are eligible for a loan of
          </div>

          <div className="loan-amount">
            {formatAmountInr(vendor_info.approved_amount_decision)}
          </div>

          <div className="opt-in-checkbox">
            <Grid id="agreeScroll" ref={this.agreeRef} container spacing={16} alignItems="center">
              <Grid item xs={1} className="TextCenter">
                <Checkbox
                  defaultChecked
                  checked={this.state.checked}
                  color="primary"
                  value="confirm_details_check"
                  name="confirm_details_check"
                  onChange={this.handleChange}
                  className="Checkbox" />
              </Grid>
              <Grid item xs={11}>
                <label><b>Opt-in for Credit Insurance</b></label>
              </Grid>
            </Grid>

            <div className='inner-checkbox'>
            <Grid id="agreeScroll" ref={this.agreeRef} container spacing={16} alignItems="center">
                <Grid item xs={1} className="TextCenter">
                  <Checkbox
                    defaultChecked
                    checked={this.state.checked}
                    color="primary"
                    value="confirm_details_check"
                    name="confirm_details_check"
                    onChange={this.handleChange}
                    className="Checkbox" />
                </Grid>
                <Grid item xs={11}>
                  <label>In order to secure the interest of my legal heir(s). I hereby declare, request and authorise Edelweiss General Insurance Company for the following:
                    1. that I have authorized DMi
                  </label>
                </Grid>
              </Grid>
              <Grid id="agreeScroll" ref={this.agreeRef} container spacing={16} alignItems="center">
                <Grid item xs={1} className="TextCenter">
                  <Checkbox
                    defaultChecked
                    checked={this.state.checked}
                    color="primary"
                    value="confirm_details_check"
                    name="confirm_details_check"
                    onChange={this.handleChange}
                    className="Checkbox" />
                </Grid>
                <Grid item xs={11}>
                  <label>I declare that I am of good health and i do not have any physical defect</label>
                </Grid>
              </Grid>
              <div className="tnc">I hereby declare the I have read policy 
                <b style={{color:'var(--primary'}} onClick={() => this.navigate('/loan/dmi/tnc')}> Terms and Conditions </b>
               carefully.</div>
            </div>
          </div>
          

          <div className="loan-value">
            <div>
              <div>EMI amount</div>
              <div className="values">{formatAmountInr(vendor_info.approved_emi)}</div>
            </div>
            <div>
              <div>Tenor</div>
              <div className="values">{vendor_info.tenor} months</div>
            </div>
            <div>
              <div>Annual interest rate</div>
                <div className="values">{vendor_info.loan_rate}%</div>
            </div>
          </div>

          <div className="container">
            <div style={{padding:'20px 20px 19px 20px'}}>
              <div className="head" style={{paddingBottom: '22px'}}>
                Loan details
              </div>
              <div className="items">
                <div>Sanctioned Loan Amount</div>
                <div>{formatAmountInr(vendor_info.approved_amount_decision)}</div>
              </div>
              <div className="items">
                <div>Credit insurance (@1%)</div>
                <div>{this.state.checked ? '- '+formatAmountInr(vendor_info.insurance_premium_decision) : '- ₹0'}</div>
              </div>
              <div className="items">
                <div>Processing fee</div>
                <div>{'- '+formatAmountInr(vendor_info.processing_fee_decision)}</div>
              </div>
              <div className="items">
                <div>GST (@18%)</div>
                <div>{'- '+formatAmountInr(vendor_info.gst_decision)}</div>
              </div>
              <hr style={{background:"#ccd3db"}} />
              <div className="credit">
                <div>Amount credited to bank a/c</div>
                <div>{formatAmountInr(vendor_info.net_amount_decision)}</div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    );
  }
}

export default LoanEligible;
