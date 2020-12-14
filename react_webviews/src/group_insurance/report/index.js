import React, { Component } from 'react';
import Container from '../common/Container';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { getDateBreakup } from 'utils/validators';
import {
  inrFormatDecimalWithoutIcon, capitalizeFirstLetter
} from '../../utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getCssMapperReport } from '../constants';

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      reportData: []
    };

    this.renderReportCards = this.renderReportCards.bind(this);
  }


  navigate = (pathname, provider) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        backToState: 'report'
      }
    });
  }

  getProviderObject = (policy) => {
    let provider = policy.vendor || policy.provider;
    let obj = policy;
    let formatted_valid_from = ''
    obj.key = provider;

    if(['hdfc_ergo','star','religare'].indexOf(provider) !== -1 ){
      let valid_from = obj.valid_from ? getDateBreakup(obj.valid_from): '';
      let formatted_day = valid_from && valid_from.plainDate.toString().length === 1 ? '0'+valid_from.plainDate : valid_from.plainDate ;
      formatted_valid_from = formatted_day +' '+ valid_from.month +' '+ valid_from.year;
    }
    
    if (provider === 'hdfc_ergo') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }else if( provider === 'FYNTUNE'){
      obj = {
        ...obj,
        product_name: policy.base_plan_title,
        top_title: 'Life Insurance',
        key: 'FYNTUNE',
        id: policy.fyntune_ref_id, 
        premium: policy.total_amount
      };
    } else if (provider === 'religare') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }  else if (provider === 'star') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }  else if (provider === 'BHARTIAXA') {
      obj = {
        ...obj,
        // product_name: policy.product_title,
        product_name: 'Bharti AXA General Insurances',
        top_title: policy.product_title,
        product_key: policy.product_name,
        id: policy.policy_id
      }
    } else if (provider === 'EDELWEISS') {
      obj = {
        ...obj,
        product_name: 'Term insurance (Edelweiss tokio life zindagi plus)',
        top_title: 'Term insurance',
        id: policy.policy_id
      }
    }

    let data = getCssMapperReport(obj);
    obj.status = data.status;
    obj.cssMapper = data.cssMapper;

    return obj;
  }

  getProviderObject_offline(o2o_details){
    let obj = o2o_details;
    obj.key = 'o2o_details';
    obj.top_title = capitalizeFirstLetter(o2o_details.provider)
    obj.sum_assured = o2o_details.total_amount
    let data = getCssMapperReport(obj);
    obj.status = data.status;
    obj.cssMapper = data.cssMapper;

    return obj;
  }

  setReportData(termData, group_insurance_policies, health_insurance_policies  , o2o_applications ) {


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
        canShowReport = true;
        application = insurance_apps.init[0];
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        canShowReport = true;
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
      }

    } 

    let fullPath = '/group-insurance/term/' + pathname;

    let reportData = [];

    if (canShowReport && application) {
      let termReport = {
        status: application.status,
        product_name: application.quote.insurance_title,
        sum_assured: application.quote.sum_assured,
        premium: application.quote.quote_json.premium,
        key: 'TERM_INSURANCE',
        id: application.id
      }

      if (!termReport.product_name) {
        termReport.product_name = application.quote.quote_provider + ' ' + application.quote.quote_json.cover_plan;
      }

      let data = getCssMapperReport(termReport);
      termReport.status = data.status;
      termReport.cssMapper = data.cssMapper;

      reportData.push(termReport)
    }


    let hs_policies = health_insurance_policies || '';
    for (let i = 0; i < hs_policies.length; i++) {
      let policy = this.getProviderObject(hs_policies[i]);
      reportData.push(policy);
    }

    let ins_policies = group_insurance_policies.ins_policies || [];
    for (var i = 0; i < ins_policies.length; i++) {
      let policy = this.getProviderObject(ins_policies[i]);
      reportData.push(policy);
    }

    // reportData.push(o2o_applications);
    let o2o_details = o2o_applications || []; 
    for(var i = 0; i< o2o_details.length; i++){
      let policy = this.getProviderObject_offline(o2o_details[i]);
      reportData.push(policy);
    }

    this.setState({
      reportData: reportData,
      termRedirectionPath: fullPath
    })
  }

  async componentDidMount() {

    try {

      let res = await Api.get('api/ins_service/api/insurance/get/report');

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

        let o2o_applications = policyData.o2o_applications;          
        // this.setReportData(policyData.term_insurance, ins_policies, o2o_applications);
        let group_insurance_policies = policyData.group_insurance || {};
        let health_insurance_policies = policyData.health_insurance || {};
        let term_insurance_policies = policyData.term_insurance || {};

        this.setReportData(term_insurance_policies, group_insurance_policies, health_insurance_policies , o2o_applications);
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      console.log(err)
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

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  redirectCards(policy) {
    this.sendEvents('next', policy.key);
    let path = '';
    let key = policy.key;

    if (key === 'TERM_INSURANCE') {
      if (this.state.termRedirectionPath) {
        path = this.state.termRedirectionPath;
      }
    } else if (['HDFCERGO', 'RELIGARE', 'STAR'].indexOf(key) !== -1) {
      path = `/group-insurance/group-health/${key}/reportdetails/${policy.id}`;
    } else if(key === 'o2o_details'){
      path = `/group-insurance/group-health/offline-to-online-report-details/${policy.id}`;
    } else if (['HDFCERGO', 'hdfc_ergo','RELIGARE','religare','STAR','star'].indexOf(key) !== -1) {
      if(key === 'hdfc_ergo'){
        key = 'HDFCERGO';
      }else if(key === 'star'){
        key = 'STAR';
      }else if(key === 'religare'){
        key = 'RELIGARE';
      }
      path = `/group-insurance/group-health/${key}/reportdetails/${policy.id}`;    
    }else if(key === 'FYNTUNE'){
      path =`/group-insurance/life-insurance/savings-plan/report-details/${policy.id}`;
    }else {
      path = '/group-insurance/common/reportdetails/' + policy.id;
    }

    this.navigate(path, policy.provider);
  }

  renderReportCards(props, index) {
    let health_providers = ['hdfc_ergo', 'religare', 'star'];
    return (
      <div className="group-insurance-report card"
        onClick={() => this.redirectCards(props)} key={index} style={{ cursor: 'pointer' }}>

        <div className="top-title">{props.top_title}</div>
        <div className={`report-color-state ${(props.cssMapper.color)}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{(props.cssMapper.disc)}</div>
        </div>

        <div className="flex">
          <div>
            <img style={{ width: 50 }} src={props.logo} alt="" />
          </div>

          <div style={{ margin: '0 0 0 7px' }}>
            <div className="report-ins-name">{props.product_name}</div>
            {props.provider !== 'EDELWEISS' && health_providers.indexOf(props.provider) === -1 &&
              <div className="report-cover">
                <div className="report-cover-amount"><span>Cover amount:</span> ₹{inrFormatDecimalWithoutIcon(props.sum_assured)}
                  {props.product_key === 'HOSPICASH' && <span style={{ fontWeight: 400 }}>/day</span>}
                </div>
                {props.product_key !== 'CORONA' && <div className="report-cover-amount"><span>Premium:</span> ₹{inrFormatDecimalWithoutIcon(props.premium)}
                  {props.key !== 'TERM_INSURANCE' &&
                    ' annually'
                  }
                </div>}
                {props.product_key === 'CORONA' &&
                  <div className="report-cover-amount"><span>Cover Peroid:</span> {props.tenure} year</div>
                }
              </div>
            }
            {props.provider === 'EDELWEISS' &&
              <div className="report-cover">
                <div className="report-cover-amount"><span>Transaction ID:</span> {props.transaction_id}
                </div>
              </div>
            }

            {health_providers.indexOf(props.provider) !== -1 &&
              <div className="report-cover">
                <div className="report-cover-amount"><span>Sum insured:</span>
                    ₹{inrFormatDecimalWithoutIcon(props.sum_assured)}
                </div>
                <div className="report-cover-amount"><span>Premium:
                    </span> ₹{inrFormatDecimalWithoutIcon(props.premium)} for {props.tenure} year{props.tenure > 1 && (<span>s</span>)}
                  </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

  loadMore = async () => {
    try {

      if (this.state.loading_more) {
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
          let policy = this.getProviderObject(policyData.group_insurance.ins_policies[i]);
          newReportData.push(policy);
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
      if (this.state.nextPage) {
        this.loadMore();
      }
    }
  };

  render() {
    return (
      <Container
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        title="Insurance Report"
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