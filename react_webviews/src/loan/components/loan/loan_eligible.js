import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { formatAmountInr } from "../../../utils/validators";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class LoanEligible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      checkbox: {
        one: true,
        two: true,
        three: true
      },
      tncClicked: false,
      numPages: null,
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

  triggerConversion = async () => {

    this.setState({
      show_loader: true
    });
    try {

      let res = await Api.get(`/relay/api/loan/dmi/accept_offer/${this.state.application_id}${this.state.checkbox.one ? '?is_insured=true' : ''}`);

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

  handleChange = (name) => {
    let {checkbox} = this.state;

    checkbox[name] = !checkbox[name];

    if (name !== 'one' && (checkbox.two && checkbox.three)) {
      checkbox.one = true;
    } else if (name !== 'one' && (!checkbox.two || !checkbox.three)) {
      checkbox.one = false;
    }
    
    if (name === 'one') {
      checkbox.two = checkbox.one;
      checkbox.three = checkbox.one;
    } 

    this.setState({
      checkbox: checkbox
    })
  }

  handleTnC = () => {
    this.setState({
      tncClicked: true
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages: numPages
    })
  }

  goBack = () => {
    this.sendEvents('back')

    if (this.state.tncClicked) {
      this.setState({
        tncClicked: false
      })
    } else {
      this.navigate('/loan/dmi/journey')
    }
  }

  render() {
    let {checkbox} = this.state;
    let vendor_info = this.state.vendor_info || {};
    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.tncClicked ? 'Terms and Conditions' : ''}
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        hidePageTitle={!this.state.tncClicked}
        noFooter={this.state.tncClicked}
        headerData={{
          icon: 'close',
          goBack: this.goBack
        }}
        styleContainer={{
          overflow: this.state.tncClicked && 'hidden'
        }}
      >
        {!this.state.tncClicked && <div className="loan-status">
          <img
            src={require(`assets/${this.state.productName}/ils_loan_status.svg`)}
            style={{ width: "100%" }}
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
                  // defaultChecked
                  checked={checkbox.one}
                  color="primary"
                  value="confirm_details_check"
                  name="confirm_details_check"
                  onChange={() => this.handleChange('one')}
                  className="Checkbox" />
              </Grid>
              <Grid item xs={11}>
                <label><b>Opt-in for Credit Insurance</b></label>
              </Grid>
            </Grid>

            <div id="agreement" className="agreement-block" style={{
            }} onScroll={this.onScroll}>
              <div className='inner-checkbox'>
                <Grid container spacing={16}>
                  <Grid item xs={1}>
                    <Checkbox
                      checked={checkbox.two}
                      color="primary"
                      id="checkbox"
                      name="checkbox"
                      disableRipple
                      className="Checkbox"
                      onChange={() => this.handleChange('two')}
                    />
                  </Grid>

                  <Grid item xs={11}>
                    <div className="label">In order to secure the interest of my legal heir(s). I hereby declare, request and authorize Edelweiss General Insurance Company for the following:</div>
                    <div className="label">1. that I authorized DMI Finance to submit requests on my behalf, in relation to the benefits available under my Policy. May
                    accept and act in accordance with the request submitted, under my Policy, through DMI Finance, without sending any notice or seeking any further confirmation from me/ my legal heirs.
                  </div>
                    <div className="label">2. To make any payout that is due and payable under my Policy, including claim payout/ refund, in the following manner: by crediting such amount, as is equivalent to the outstanding loan amount with the Financer, in my Loan Account Number held with
                    the Financer, or the remaining balance, i.e differential amount between the amount payable under my Policy; and the outstanding loan amount, to myself or to my nominee, as may be applicable.
                  </div>
                  </Grid>
                </Grid>

                <div className="label">By acting on my request in accordance with this Authorization, I hereby agree to indemnify Edelweiss General Insurance in case it incurs/ suffers any loss. Further, I relinquish my rights towards any and all claims and shall discharge from any and all liabilites under
                my Policy and the same shall be binding on me and my heirs, executors, administrators, successors or legal representatives, as the case may be.
              </div>

                <div className="label"><b>Good Health Declaration</b></div>

                <Grid container spacing={16}>
                  <Grid item xs={1}>
                    <Checkbox
                      checked={checkbox.three}
                      color="primary"
                      id="checkbox"
                      name="checkbox"
                      disableRipple
                      className="Checkbox"
                      onChange={() => this.handleChange('three')}
                    />
                  </Grid>

                  <Grid item xs={11}>
                    <div className="label">I declare that I am of good health and i do not have any physical defect, deformity or disability. I further declare that I perform all my routine activities independently, that I do not have any history of, have never suffered from, am not currently suffering from,
                   nor have I received, nor am I currently receiving, nor do I expect to receive amy treatment, nor have been hospitalized, nor do I expect to be hospitalized for any ailment or disease or critical illness of any nature.</div>
                  </Grid>
                </Grid>

                <div className="tnc label">I hereby declare the I have read policy
                <b style={{ color: 'var(--primary', cursor: 'pointer' }} onClick={() => this.handleTnC()}> Terms and Conditions </b>
               carefully.</div>
              </div>
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
            <div style={{ padding: '20px 20px 19px 20px' }}>
              <div className="head" style={{ paddingBottom: '22px' }}>
                Loan details
              </div>
              <div className="items">
                <div>Sanctioned Loan Amount</div>
                <div>{formatAmountInr(vendor_info.approved_amount_decision)}</div>
              </div>
              <div className="items">
                <div>Insurance Premium (with GST)</div>
                <div>{this.state.checkbox.one ? '- ' + formatAmountInr(vendor_info.insurance_premium_decision) : '- ₹0'}</div>
              </div>
              <div className="items">
                <div>Processing fee</div>
                <div>{'- ' + formatAmountInr(vendor_info.processing_fee_decision)}</div>
              </div>
              <div className="items">
                <div>GST (@18%)</div>
                <div>{'- ' + formatAmountInr(vendor_info.gst_decision)}</div>
              </div>
              <hr style={{ background: "#ccd3db" }} />
              <div className="credit">
                <div>Amount credited to bank a/c</div>
                <div>{formatAmountInr(vendor_info.net_amount_decision)}</div>
              </div>
            </div>
          </div>

        </div>}

        {this.state.tncClicked && <div className="tnc">
          <Document
            file={vendor_info.insurance_tnc}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {Array.from(
              new Array(this.state.numPages),
              (el, index) => (
                <div style={{ marginBottom: '20px' }} key={`page_${index + 1}`}>
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    loading=''
                  />
                </div>
              ),
            )}
          </Document>
        </div>}
      </Container>
    );
  }
}

export default LoanEligible;
