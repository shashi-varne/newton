import React, { Component } from 'react';
import Container from '../common/Container';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { getDateBreakup, capitalizeFirstLetter } from 'utils/validators';
import {
  inrFormatDecimalWithoutIcon , inrFormatDecimal, isEmpty, sortArrayOfObjectsByTime
} from '../../utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getCssMapperReport , TitleMaper , ProviderName, reportTopTextMapper} from '../constants';
import DetailsCard from '../../common/ui/DetailsCard';
import { Fragment } from 'react';
import {filterReportData, getReportCardsData, setReportData, getProviderObject, getProviderObject_offline} from '../products/group_health/common_data';

var healthkeyMapper = {
  'hdfc_ergo': 'HDFCERGO',
   'religare': 'RELIGARE', 
   'star': 'STAR', 
   'care_plus': 'GMC'
}

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      reportData: [],
      productName: getConfig().productName,
    };
    this.getReportCardsData = getReportCardsData.bind(this);
    this.setReportData = setReportData.bind(this);
    this.getProviderObject = getProviderObject.bind(this);
    this.getProviderObject_offline = getProviderObject_offline.bind(this);
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
  async componentDidMount() {
    this.onload();
  }

  onload = () =>{
    this.getReportCardsData();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  redirectCards = (policy) => {
    let policy_type = policy.policy_type ? policy.policy_type : ''
    this.sendEvents('next', policy.key, policy_type , policy);
    let path = '';
    let key = policy.key;
    console.log(policy)

    if(policy.product_key === 'offline_insurance'){
      path = `/group-insurance/group-health/offline-to-online-report-details/${policy.id}`;
    }else if (key === 'TERM_INSURANCE' && this.state.termRedirectionPath) {
        path = this.state.termRedirectionPath;
    }else if (['hdfc_ergo','religare','star','care_plus'].indexOf(key) > -1) {
      key = healthkeyMapper[key];
      path = `/group-insurance/group-health/${key}/reportdetails/${policy.id}`;    
    }else if(key === 'FYNTUNE'){
      path =`/group-insurance/life-insurance/savings-plan/report-details/${policy.id}`;
    }else {
      path = '/group-insurance/common/reportdetails/' + policy.id;
    }
    console.log(path)
    // this.navigate(path);
  }

  // renderReportCards(props, index) {
  //   let health_providers = ['hdfc_ergo', 'religare', 'star', 'care_plus'];
  //   return (
  //     <div className="group-insurance-report card"
  //       onClick={() => this.redirectCards(props)} key={index} style={{ cursor: 'pointer' }}>

  //       <div className="top-title">{props.top_title}</div>
  //       <div className={`report-color-state ${(props.cssMapper.color)}`}>
  //         <div className="circle" style={{ backgroundColor: props.cssMapper.color}}></div>
  //         <div className="report-color-state-title" style={{ color: props.cssMapper.color}}>{(props.cssMapper.disc)}</div>
  //       </div>

  //       <div className="flex">
  //         <div>
  //           <img style={{ width: 50 }} src={props.logo} alt="" />
  //         </div>

  //         <div style={{ margin: '0 0 0 20px' }}>
  //           <div className="report-ins-name">{props.product_name}</div>
  //           {props.provider !== 'EDELWEISS' && health_providers.indexOf(props.provider) === -1 &&
  //             <div className="report-cover">
  //               <div className="report-cover-amount"><span className="sub-text-bold">Cover amount:</span> ₹{inrFormatDecimalWithoutIcon(props.sum_assured)}
  //                 {props.product_key === 'HOSPICASH' && <span style={{ fontWeight: 400 }}>/day</span>}
  //               </div>
  //               {props.product_key !== 'CORONA' &&  props.product_key !=='offline_insurance' && <div className="report-cover-amount"><span className="sub-text-bold">Premium:</span> {inrFormatDecimal(props.premium)}
  //               {props.key !== 'TERM_INSURANCE' ? ` ${props.frequency}`: ''}
  //               </div>}
  //               {props.product_key !== 'CORONA' &&  props.product_key ==='offline_insurance' && <div className="report-cover-amount"><span className="sub-text-bold">Premium:</span> {inrFormatDecimal(props.premium)}
  //                 {props.key !== 'TERM_INSURANCE' && props.frequency !== 'Single' &&
  //                 <span style={{textTransform : "lowercase", fontWeight : 'normal'}}> {props.frequency}</span>
  //                 }
  //                  {props.key !== 'TERM_INSURANCE' && props.frequency === 'Single' &&
  //                 <span style={{textTransform : "lowercase", fontWeight : 'normal'}}> (One Time Payment)</span>
  //                 }
  //               </div>}
  //               {props.product_key === 'CORONA' &&
  //                 <div className="report-cover-amount"><span className="sub-text-bold">Cover Peroid:</span> {props.tenure} year</div>
  //               }
  //             </div>
  //           }
  //           {props.provider === 'EDELWEISS' &&
  //             <div className="report-cover">
  //               <div className="report-cover-amount"><span className="sub-text-bold">Transaction ID:</span> {props.transaction_id}
  //               </div>
  //             </div>
  //           }

  //           {health_providers.indexOf(props.provider) !== -1 &&
  //             <div className="report-cover">
  //               <div className="report-cover-amount"><span className="sub-text-bold">Sum insured:</span>
  //                   ₹{inrFormatDecimalWithoutIcon(props.sum_assured)}
  //               </div>
  //               <div className="report-cover-amount" style={{marginTop: '-8px'}}>
  //                 {props.provider !== 'care_plus' ? 
  //                 <p><span className="sub-text-bold">Premium: </span> ₹{inrFormatDecimalWithoutIcon(props.premium)} for {props.tenure} year{props.tenure > 1 && (<span>s</span>)}</p>
  //                 : <p><span className="sub-text-bold">Premium: </span> ₹{inrFormatDecimalWithoutIcon(props.premium)} {props.payment_frequency === 'Yearly' ? 'annually' : 'monthly'}</p>}
  //                 </div>
  //             </div>
  //           }
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  loadMore = async () => {
    try {

      if (this.state.loading_more) {
        return;
      }
      this.setState({
        loading_more: true
      });
      let res = await Api.get(this.state.nextPage);
      this.setState({
        loading_more: false
      });

      if (res.pfwresponse.status_code === 200) {
        var policyData = res.pfwresponse.result.response;
        var next_page = policyData.group_insurance.next_page;
        var has_more = policyData.group_insurance.more;

        this.setState({ nextPage: (has_more) ? next_page : null });

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
        loading_more: false,
        nextPage: ''
      });
      toast('Something went wrong');
    }
  }

  sendEvents(user_action, insurance_type, policy_type, policy) {

    let policy_name = policy ? policy.top_title : undefined
    let policy_status = policy ? policy.status : ''
    let InsuranceNameEvent = policy ? ProviderName(policy.provider) : ProviderName(insurance_type);

    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_report',
        "provider_name": InsuranceNameEvent ? capitalizeFirstLetter(InsuranceNameEvent) : '',
        'policy': policy_name ? policy_name : policy_type ? TitleMaper(policy_type) : '',
        'policy_status': policy_status === "complete" || policy_status === 'policy_issued'  ? 'Issued' : policy_status === "incomplete" ? 'Pending' : capitalizeFirstLetter(policy_status.toLowerCase()),
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({
        events: eventObj
      });
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

  selectTab = (selectedTab) =>{
    var target = document.getElementById(`${selectedTab}`);
    if(target){
      target.classList.add('active');
      var tabs = document.querySelectorAll('[data-tab-target]')
      tabs.forEach((tab) =>{
        if(tab.id !== selectedTab){
          tab.classList.remove('active');
        }
      })
      var filteredReportData = this.state.filteredReportData;
      var selectedReports = filteredReportData[selectedTab]
      var reportTopText = reportTopTextMapper[selectedTab];
      this.setState({selectedReports, selectedTab, reportTopText })
    }
  }

  render() {
    var reportCount = this.state.reportCount;
    return (
      <Container
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        title="Your policies"
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        classOverRideContainer="report"
        skelton={this.state.skelton}
      >
        <div className="insurance-common-report-page">
          <ul className="report-list-tab-container">
            <li className="active" onClick={()=>this.selectTab('activeReports')} id="activeReports" data-tab-target="tab-element" >Active<span>({reportCount && reportCount.active})</span></li>
            <li onClick={()=>this.selectTab('pendingReports')} id="pendingReports" data-tab-target="tab-element">Pending<span>({reportCount && reportCount.pending})</span></li>
            <li onClick={()=>this.selectTab('inactiveReports')} id="inactiveReports" data-tab-target="tab-element">Inactive<span>({reportCount && reportCount.inactive})</span></li>
          </ul>
      
          <div className="insurance-cards-container">
            
            {this.state.selectedReports && this.state.selectedReports.length > 0 ?

              <div>
                <p className="report-top-text">{this.state.reportTopText}</p>
              {this.state.selectedReports.map((report, index) =>(
                  <DetailsCard key={index} handleClick={this.redirectCards} item={report}/>
              ))}
              </div>
              : (
                <Fragment>
                <img className="inactive-policy-background" src={require(`assets/${this.state.productName}/inactive-policy-background.svg`)}/>
                <p className="empty-state-text"> {this.state.selectedTab === 'activeReports'? 'No active policy': 'No pending application'} </p>

                {this.state.selectedTab === 'activeReports' ? (
                  <p className="advisory-link" onClick={() => this.navigate('/group-insurance/advisory/landing')}>
                    CHECK THE RIGHT COVERAGE
                  </p>
                ): null}
                </Fragment>
              )
            }
          </div>
          {/* <div style={{marginBottom: '100px'}}></div>
          {this.state.reportData.map(this.renderReportCards)}
          {this.state.loading_more && <div className="loader">
            Loading...
          </div>} */}
        </div>
      </Container>
    );
  }
}

export default Report;