import React, { Component } from 'react';
import Container from '../common/Container';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';

import {
  inrFormatDecimal
} from '../../utils/validators';
import { nativeCallback } from 'utils/native_callback';

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      reportData: []
    };

    this.renderReportCards = this.renderReportCards.bind(this);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        backToState: 'report'
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
        canShowReport = true;
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        canShowReport = true;
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

    if (canShowReport && application) {
      let termReport = {
        status: application.status,
        product_name: application.quote.insurance_title,
        cover_amount: application.quote.cover_amount,
        premium: application.quote.quote_json.base_premium_total,
        key: 'TERM_INSURANCE',
        id: application.id
      }

      let data = this.statusMapper(termReport);
      termReport.status  = data.status;
      termReport.cssMapper = data.cssMapper;

      reportData.push(termReport)
    }


    for (var i = 0; i < group_insurance_policies.length; i++) {
      let policy = group_insurance_policies[i];
      let obj = {
        status: policy.status,
        product_name: policy.product_title,
        cover_amount: policy.sum_assured,
        premium: policy.premium,
        key: 'BHARTIAXA',
        id: policy.id
      }

      let data = this.statusMapper(obj);
      obj.status  = data.status;
      obj.cssMapper = data.cssMapper;

      reportData.push(obj);
    }

    this.setState({
      reportData: reportData,
      termRedirectionPath: fullPath
    })
  }

  async componentDidMount() {

    try {

      let res = await Api.get('api/ins_service/api/insurance/get/report')

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var policyData = res.pfwresponse.result.response;
        var next_page = policyData.group_insurance.next_page;
        var has_more = policyData.group_insurance.more;

        this.setState({
          nextPage: (has_more) ? next_page : ''
        })

        let ins_policies = policyData.group_insurance && 
        policyData.group_insurance.ins_policies ? policyData.group_insurance.ins_policies : {};

        this.setReportData(policyData.term_insurance, ins_policies);
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

    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  redirectCards(policy) {
    this.sendEvents('next', policy.key);
    let path = '';
    if (policy.key === 'TERM_INSURANCE') {
      if (this.state.termRedirectionPath) {
        path = this.state.termRedirectionPath;
      }
    } else {
      path = '/group-insurance/common/reportdetails/' + policy.id;
    }

    this.navigate(path);
  }

  statusMapper(policy) {

    let cssMapper = {
      'init' : {
        color: 'yellow',
        disc: 'Policy Pending'
      },
      'policy_issued' : {
        color: 'green',
        disc: 'Policy Issued'
      },
      'policy_expired' : {
        color: 'red',
        disc: 'Policy Expired'
      },
      'rejected' : {
        color: 'red',
        disc: 'Policy Rejected'
      }
    }

    let obj = {}
    if(policy.key === 'TERM_INSURANCE') {
      if(policy.status === 'failed') {
        obj.status = 'rejected';
      } else if(policy.status === 'success') {
        obj.status = 'policy_issued';
      } else {
        obj.status = 'init';
      }
    } else {
      obj.status = policy.status;
    }

    obj.cssMapper = cssMapper[obj.status];

    return obj;
  }

  renderReportCards(props, index) {
    return (
      <div onClick={() => this.redirectCards(props)} key={index} className="card">
        <div className={`report-color-state ${(props.cssMapper.color)}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{(props.cssMapper.disc)}</div>
        </div>
        <div className="report-ins-name">{props.product_name}</div>
        <div className="report-cover">
          <div className="report-cover-amount"><span>Cover amount:</span> {props.cover_amount}</div>
          <div className="report-cover-amount"><span>Premium:</span> {inrFormatDecimal(props.premium)}/yr</div>
        </div>
      </div>
    )
  }

  loadMore = async () => {
    try {

      if(this.state.loading_more) {
        return;
      }
      this.setState({
        loading_more: true
      });

      let res = await Api.get(this.state.nextPage)

      this.setState({
        loading_more: false
      });

      if (res.pfwresponse.status_code === 200) {
        var policyData = res.pfwresponse.result.response;
        var next_page = policyData.group_insurance.next_page;
        var has_more = policyData.group_insurance.more;

        this.setState({
          nextPage: (has_more) ? next_page : null
        });

        var newReportData = [];

        for (var i = 0; i < policyData.group_insurance.ins_policies.length; i++) {
          let policy = policyData.group_insurance.ins_policies[i];
          let obj = {
            status: policy.status,
            product_name: policy.product_title,
            cover_amount: policy.sum_assured,
            premium: policy.premium,
            key: 'BHARTIAXA',
            id: policy.id
          }

          let data = this.statusMapper(obj);
          obj.status  = data.status;
          obj.cssMapper = data.cssMapper;
          newReportData.push(obj);
        }

        this.setState((prevState) => ({
          reportData: prevState.reportData.concat(newReportData)
        }));
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        loading_more: false
      });
      toast('Something went wrong');
    }
  }

  sendEvents(user_action, insurance_type) {

    let reportState = {};
    for (var i = 0; i < this.state.reportData.length; i++) {
      reportState[this.state.reportData[i].key] = this.state.reportData[i].status;
    };

    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_report',
        "type": insurance_type ? insurance_type : '',
        report: reportState
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  hasReachedBottom() {
    var el = document.getElementsByClassName('Container')[0];
    var height = el.getBoundingClientRect().bottom <= window.innerHeight;
    return height;
  }

  onScroll = () => {
    if (this.hasReachedBottom()) {
      if(this.state.nextPage) {
        this.loadMore();
      }
      
    }
  };

  render() {
    return (
      <Container
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        title="Insurance report"
        showLoader={this.state.show_loader}
        classOverRideContainer="report"
      >
        {this.state.reportData.map(this.renderReportCards)}
        {this.state.loading_more && <div className="loader">
          Loading...
        </div>}
      </Container>
    );
  }
}

export default Report;