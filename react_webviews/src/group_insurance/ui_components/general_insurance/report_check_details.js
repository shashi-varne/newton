import React, { Component } from 'react';
import Container from '../../common/Container';
// import provider from 'assets/provider.svg';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import download from 'assets/download.svg';
import icn_call_fisdom from 'assets/icn_call_fisdom.svg';
import icn_call_myway from 'assets/icn_call_myway.svg';

import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { numDifferentiation, inrFormatDecimal, getUrlParams, capitalizeFirstLetter, storageService } from '../../../utils/validators';
import { insuranceStateMapper } from '../../constants';
import { nativeCallback } from 'utils/native_callback';

class ReportDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accordionTab: false,
      policyData: {
        insured_details: {

        }
      },
      skelton: true,
      noFooter: true,
      icn_call: getConfig().productName !== 'fisdom' ? icn_call_myway : icn_call_fisdom,
      params: getUrlParams()
    };

    this.handleClick = this.handleClick.bind(this);

  }

  componentWillMount() {

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    const { policy_id } = this.props.match.params;

    this.setState({
      lead_id: lead_id || '',
      policy_id: policy_id || '',
      provider: this.state.params.provider || 'BHARTIAXA'
    })

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Dismiss'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  onload = async() => {

    let error = '';
    let errorType = '';
    this.setErrorData('onload');
    try {
      let service = this.state.provider.toLowerCase() === 'bhartiaxa' ? 'insurancev2': 'ins_service';

      let res = await Api.get('api/'+ service +'/api/insurance/' + (this.state.provider).toLowerCase() + 
      '/policy/get/' + this.state.policy_id);
      

      
      if (res.pfwresponse.status_code === 200) {
        
        var policyData = res.pfwresponse.result.policy;
        policyData.provider = this.state.provider;
        let buttonTitle = 'Resume';

        let path = '';
        let noFooter = false;
        if (policyData.status === 'expired') {
          buttonTitle = 'Buy Again';
          path = '';
        } else if (policyData.status === 'init' && policyData.lead_payment_status === 'payment_done') {
          path = 'payment-success';
        } else if (policyData.status === 'init') {
          path = 'plan';
        } else {
          noFooter = true;
        }

        if(storageService().getObject('report_from_landing')){
          storageService().setObject('reportSelectedTab', 'activeReports')
        }
        let redirectPath = '/group-insurance';

        if (path) {
          redirectPath += '/' + insuranceStateMapper[policyData.product_name] + '/' + path;
        }
        this.setState({
          policyData: policyData,
          noFooter: noFooter,
          redirectPath: redirectPath,
          buttonTitle: buttonTitle
        })
        this.setState({
          skelton: false
        })
      } else {
        error = res.pfwresponse.result.error || res.pfwresponse.result.message
          || true;
      }

    } catch (err) {
      this.setState({
        skelton: false,
      });
      error = true;
      errorType = "crash";

    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:'page'
      })
    }

  }

  async componentDidMount() {
     this.onload();
  }

  openInBrowser(url) {
    this.setState({ download : true})
    // this.sendEvents('download');
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  toggleAccordion = () => {
    this.setState(prevState => ({
      accordionTab: !prevState.accordionTab,
      how_to_claim: true
    }));
    // this.sendEvents('how_to_claim')
  }


  handleClick = () => {

    this.sendEvents(this.state.buttonTitle);
    let lead_id = this.state.policyData.lead_id;
    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate(this.state.redirectPath);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'policy_details',
        'policy': this.state.policyData.product_title ? this.state.policyData.product_title: '',
        'policy_status':  this.state.policyData.status === 'init' ? 'Pending' : this.state.policyData.status === 'policy_issued' ? 'Issued' : 'Rejected',
        'provider_name': this.state.policyData.provider ? capitalizeFirstLetter(this.state.policyData.provider.toLowerCase()) : '',
        'how_to_claim': this.state.how_to_claim ? 'yes' : 'no',
        'download_policy': this.state.download ? 'yes' : 'no',
        'plan_details': 'no',
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
        events={this.sendEvents('just_set_events')}
        noFooter={this.state.noFooter}
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClick={this.handleClick}
        fullWidthButton={true}
        buttonTitle={this.state.buttonTitle}
        onlyButton={true}
        title={this.state.policyData.provider === 'EDELWEISS' ?  'Term insurance' : this.state.policyData.product_title}
        skelton={this.state.skelton}
        classOverRideContainer="report-detail"
      >
        <div className="card">
          <div className="report-detail-header">
            <div className="report-detail-icon">
              <img src={this.state.policyData.logo} alt="" />
            </div>
            <div>
              <div className="report-detail-ins-name">{this.state.policyData.product_title}</div>
              <div className="report-detail-status">Status: <span 
              className={`${(this.state.policyData.status === 'init') ? 'yellow' : 
                  ((this.state.policyData.status === 'policy_issued' || 
                  (this.state.policyData.provider === 'EDELWEISS' && this.state.policyData.status === 'payment_done') )) ? 'green' : 'red'}`}>
                    {
                      (this.state.policyData.provider === 'EDELWEISS' && this.state.policyData.status === 'payment_done' ? 'Payment Done':
                      this.state.policyData.status === 'init' ? 'Policy Pending' : 
                      this.state.policyData.status === 'policy_issued' ? 'Policy Issued' : 'Policy Expired')
                    }
                </span>
              </div>
            </div>
          </div>
          {this.state.policyData.provider !== 'EDELWEISS' && 
            <div className="report-detail-summary">
              <div className="report-detail-summary-item"><span>Policy:</span> {this.state.policyData.product_title}</div>
              <div className="report-detail-summary-item"><span>Issuer:</span> {this.state.policyData.issuer}</div>
              {this.state.policyData.status === 'policy_issued' &&
                <div className="report-detail-summary-item"><span>Policy number:</span> {this.state.policyData.master_policy_number}</div>}
              <div className="report-detail-summary-item"><span>Premium:</span> {inrFormatDecimal(this.state.policyData.premium)}/yr</div>
              <div className="report-detail-summary-item"><span>Sum assured:</span> {numDifferentiation(this.state.policyData.sum_assured)}</div>
              <div className="report-detail-summary-item"><span>Cover period:</span> {this.state.policyData.insured_details ? this.state.policyData.insured_details.product_coverage : ''} yr
              ({this.state.policyData.policy_start_date} - {this.state.policyData.policy_end_date})</div>
            </div>
          }
          {this.state.policyData.provider === 'EDELWEISS' && 
            <div className="report-detail-summary">
              <div className="report-detail-summary-item"><span>Transaction ID:</span> {this.state.policyData.transaction_id}</div>
              <div className="report-detail-summary-item"><span>Transaction date:</span> {this.state.policyData.transaction_date}</div>
            </div>
          }
          {this.state.policyData.provider === 'EDELWEISS' && 
            <div style={{display: 'flex', alignItems: 'end', margin: '30px 0 0 0'}}>
              <img src={this.state.icn_call} alt="" />
              <div style={{color: '#4A4A4A', fontSize:13, fontWeight: 400, margin: '0 0 0 10px'}}>
                Edelweiss team will call you to assist in policy issuance.
              </div>
            </div>
          }
        </div>
        {this.state.policyData.status === 'policy_issued' &&
          <div onClick={() => this.openInBrowser(this.state.policyData.coi_blob_key)} className="report-detail-download">
            <img src={download} alt="" />
            <div className="report-detail-download-text">Download Policy</div>
          </div>}
        {this.state.policyData.status === 'policy_issued' && <div className="Accordion">
          <div className="AccordionTitle" onClick={() => this.toggleAccordion()}>
            <div className="AccordionList">
              <span className="AccordionList1">
                <img className="AccordionListIcon" src={(this.state.accordionTab) ? shrink : expand} alt="" width="20" />
              </span>
              <span>How to claim the policy?</span>
            </div>
          </div>
          {this.state.accordionTab && <div className="AccordionDescription">
            <p>Bharti Axa provides multiple options to intimate the claim to the company. By following ways:</p>
            <ul>
              <li>Call on toll free call centre of the insurance company (24x7) - <span>1800-103-2292</span></li>
              <li>Login to the website of the insurance company and intimate the claim. <span><a href="http://www.bhartiaxagi.co.in/contact-us">http://www.bhartiaxagi.co.in/contact-us</a></span></li>
              <li>Send an email to the insurance company on <span>customer.service@bharti-axagi.com</span></li>
              <li>Post/courier to Bharti AXA General Insurance <span>Spectrum Towers, 3rd floor, Malad Link Road, Malad (west), Mumbai- 400064</span></li>
              <li>Directly contact Bharti AXA office but in writing.</li>
            </ul>
            <p>In all the above, the intimations are directed to a central team for prompt and immediate action</p>
          </div>}
        </div>}
      </Container>
    );
  }
}

export default ReportDetails;