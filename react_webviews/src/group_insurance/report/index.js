import React, { Component } from 'react';
import Container from '../common/Container';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';

import {
 inrFormatDecimal
} from '../../utils/validators';

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      reportData: []
    };

    this.renderReportCards  = this.renderReportCards.bind(this);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        backToState : 'report'
      }
    });
  }

  setReportData(termData, group_insurance_policies) {

   
    let canShowReport = false;
    let application;
    let pathname = ''

    if (!termData.error) {
      canShowReport = true;
      let insurance_apps = termData.insurance_apps;
      if (insurance_apps.complete.length > 0) {
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        application = insurance_apps.failed[0];
        pathname = 'report';
      } else if (insurance_apps.init.length > 0) {
        application = insurance_apps.init[0];
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
        return;
      }

    }

    let fullPath = '/group-insurance/term/' + pathname;
    
    let reportData = [];

    console.log(application);
    console.log(canShowReport)
    if(canShowReport && application) {
      console.log("going inside")
      let termReport = {
        status: application.status,
        product_name: application.quote.insurance_title,
        cover_amount: application.quote.cover_amount,
        premium: application.quote.quote_json.base_premium_total,
        key: 'TERM_INSURANCE',
        id: application.id
      }

      reportData.push(termReport)
    }


    for (var i = 0; i < group_insurance_policies.length; i++) {
      let policy = group_insurance_policies[i];
      let obj = {
        status: policy.status,
        product_name: policy.product_name,
        cover_amount: policy.sum_assured,
        premium: policy.premium,
        key: 'BHARTIAXA',
        id: policy.id
      }

      reportData.push(obj);
    }

    console.log(reportData)

    this.setState({
      reportData: reportData,
      termRedirectionPath : fullPath
    })
  
  }

  async componentDidMount() {

    try {

      let res = await Api.get('ins_service/api/insurance/get/report')

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var policyData = res.pfwresponse.result.response;

        this.setReportData(policyData.term_insurance, policyData.group_insurance.ins_policies);
        

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

  redirectCards(policy) {
    console.log(policy);
    let path = '';
    if (policy.key === 'TERM_INSURANCE') {
      if (this.state.termRedirectionPath) {
        path  = this.state.termRedirectionPath;
      }
    }else {
      path  = '/group-insurance/common/reportdetails/' + policy.id;
    }

    this.navigate(path);
  }

  renderReportCards(props, index) {
    return (
      <div onClick={() => this.redirectCards(props)} key={index} className="card">
        <div className="report-color-state">{props.status}</div>
        <div className="report-ins-name">{props.product_name}</div>
        <div className="report-cover">
          <div className="report-cover-amount"><span>Cover amount:</span> {props.cover_amount}</div>
          <div className="report-cover-amount"><span>Premium:</span> {inrFormatDecimal(props.premium)}/yr</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Container
        noFooter={true}
        title="Insurance report"
        showLoader={this.state.show_loader}
        classOverRideContainer="report"
      >
        <div>
          {this.state.reportData.map(this.renderReportCards)}
        </div>
      </Container>
    );
  }
}

export default Report;