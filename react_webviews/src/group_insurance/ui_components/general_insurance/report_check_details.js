import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { numDifferentiation } from '../../../utils/validators';
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
      show_loader: true,
      noFooter: true
    };

    this.handleClick = this.handleClick.bind(this);

  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    const { policy_id } = this.props.match.params;

    this.setState({
      lead_id: lead_id || '',
      policy_id: policy_id || ''
    })

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async componentDidMount() {

    try {

      let res = await Api.get('ins_service/api/insurance/bhartiaxa/policy/get/' + this.state.policy_id)

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var policyData = res.pfwresponse.result.lead;
        console.log(policyData);
        let buttonTitle = 'Resume';

        let path = '';
        let noFooter = false;
        if (policyData.status === 'expired') {
          buttonTitle = 'Buy Again';
          path = '';
        } else if (policyData.status === 'init' && policyData.payment_status === 'payment_done') {
          path = 'payment-success';
        } else if (policyData.status === 'init') {
          path = 'plan';
        } else {
          noFooter = true;
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

  openInBrowser(url) {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  toggleAccordion = () => {
    this.setState(prevState => ({
      accordionTab: !prevState.accordionTab
    }));
  }

  handleClick = () => {
    let lead_id = this.state.policyData.lead_id;
    window.localStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate(this.state.redirectPath);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }



  render() {
    return (
      <Container
        noFooter={this.state.noFooter}
        handleClick={this.handleClick}
        fullWidthButton={true}
        buttonTitle={this.state.buttonTitle}
        onlyButton={true}
        title={this.state.policyData.product_title}
        showLoader={this.state.show_loader}
        classOverRideContainer="report-detail"
      >
        <div className="card">
          <div className="report-detail-header">
            <div className="report-detail-icon">
              <img src={provider} alt="" />
            </div>
            <div>
              <div className="report-detail-ins-name">{this.state.policyData.product_title}</div>
              <div className="report-detail-status">Status: <span className={`${(this.state.policyData.status === 'init') ? 'yellow' : (this.state.policyData.status === 'policy_issued') ? 'green' : 'red'}`}>{(this.state.policyData.status === 'init') ? 'Policy Pending' : (this.state.policyData.status === 'policy_issued' ? 'Policy Issued' : 'Policy Expired')}</span></div>
            </div>
          </div>
          <div className="report-detail-summary">
            <div className="report-detail-summary-item"><span>Policy:</span> {this.state.policyData.product_title} insurance</div>
            <div className="report-detail-summary-item"><span>Issuer:</span> {this.state.policyData.issuer}</div>
            {this.state.policyData.status === 'policy_issued' &&
              <div className="report-detail-summary-item"><span>Policy number:</span> {this.state.policyData.master_policy_number}</div>}
            <div className="report-detail-summary-item"><span>Premium:</span> {this.state.policyData.premium}/yr</div>
            <div className="report-detail-summary-item"><span>Sum assured:</span> {numDifferentiation(this.state.policyData.sum_assured)}</div>
            <div className="report-detail-summary-item"><span>Cover period:</span> {this.state.policyData.insured_details.product_coverage} yr
            ({this.state.policyData.policy_start_date} {this.state.policyData.policy_end_date})</div>
          </div>
        </div>
        {this.state.policyData.status === 'policy_issued' &&
          <div onClick={() => this.openInBrowser(this.state.policyData.coi_blob_key)} className="report-detail-download">
            {/* <img src={} alt="" /> */}
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