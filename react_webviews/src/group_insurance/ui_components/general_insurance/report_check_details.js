import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { numDifferentiation } from '../../../utils/validators';

class ReportDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accordianTab: false,
      policyData: {
        insured_details : {
          
        }
      },
      show_loader: true
    };

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
          console.log(policyData)
          this.setState({
            policyData: policyData
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


  render() {
    return (
      <Container
        noFooter={true}
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
              <div className="report-detail-status">Status: <span>{this.state.policyData.status}</span></div>
            </div>
          </div>
          <div className="report-detail-summary">
            <div className="report-detail-summary-item"><span>Policy:</span> {this.state.policyData.product_title} insurance</div>
            <div className="report-detail-summary-item"><span>Issuer:</span> {this.state.policyData.issuer}</div>
            <div className="report-detail-summary-item"><span>Policy number:</span> {this.state.policyData.master_policy_number}</div>
            <div className="report-detail-summary-item"><span>Premium:</span> {this.state.policyData.premium}/yr</div>
            <div className="report-detail-summary-item"><span>Sum assured:</span> {numDifferentiation(this.state.policyData.sum_assured)}</div>
            <div className="report-detail-summary-item"><span>Cover period:</span> {this.state.policyData.insured_details.product_coverage} yr 
            ({this.state.policyData.policy_start_date} {this.state.policyData.policy_end_date})</div>
          </div>
        </div>
        <div className="report-detail-download">
          {/* <img src={} alt="" /> */}
          <div className="report-detail-download-text">Download Policy</div>
        </div>
        <div className="Accordion">
          <div className="AccordionTitle" onClick={() => console.log('KK')}>
            <div className="AccordionList">
              <span className="AccordionList1">
                <img className="AccordionListIcon" src={(this.state.accordianTab) ? shrink : expand} alt="" width="20" />
              </span>
              <span>Benefits</span>
            </div>
          </div>
          <div>
            {/* Render body */}
          </div>
        </div>
      </Container>
    );
  }
}

export default ReportDetails;