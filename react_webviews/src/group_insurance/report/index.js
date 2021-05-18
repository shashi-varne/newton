import React, { Component } from 'react';
import Container from '../common/Container';
import {storageService} from "utils/validators";
import Api from 'utils/api';
import SwipeableViews from "react-swipeable-views";
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { capitalizeFirstLetter } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { TitleMaper , ProviderName, reportTopTextMapper} from '../constants';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import {getReportCardsData, setReportData, getProviderObject, getProviderObject_offline} from '../products/group_health/common_data';
import PropTypes from "prop-types";
import RenderReports from './renderReports';
import { isEmpty } from '../../utils/validators';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

var healthkeyMapper = {
  'hdfc_ergo': 'HDFCERGO',
   'religare': 'RELIGARE', 
   'star': 'STAR', 
   'care_plus': 'GMC'
}
var emptyStateText = {
  'activeReports': 'No active policy',
  'pendingReports': 'No pending application',
  'inactiveReports': 'No inactive policy'
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

  componentDidUpdate(){
    this.swipeableActions.updateHeight();
    //always scroll to top on tab switch
    window.scrollTo({top:'0px' , behavior: 'smooth'});
    
  }

  onload = () =>{
    this.getReportCardsData();
  }

  componentWillMount() {
    window.removeEventListener("scroll", this.onScroll, false);
    nativeCallback({ action: 'take_control_reset' });
  }

  redirectCards = (policy) => {
    let policy_type = policy.policy_type ? policy.policy_type : ''
    this.sendEvents('next', policy.key, policy_type , policy);
    let path = '';
    let key = policy.key;

    if(policy.product_key === 'offline_insurance'){
      path = `/group-insurance/group-health/offline-to-online-report-details/${policy.id}`;
    }else if (policy.product_key === 'TERM_INSURANCE' && this.state.termRedirectionPath) {
        path = this.state.termRedirectionPath;
    }else if (['hdfc_ergo','religare','star','care_plus'].indexOf(key) > -1) {
      key = healthkeyMapper[key];
      path = `/group-insurance/group-health/${key}/reportdetails/${policy.id}`;    
    }else if(key === 'FYNTUNE'){
      path =`/group-insurance/life-insurance/savings-plan/report-details/${policy.id}`;
    }else {
      path = '/group-insurance/common/reportdetails/' + policy.id;
    }
    this.navigate(path);
  }

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

  sendEvents(user_action, insurance_type, policy_type, policy, selectedTab) {
    
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
        'policy_status': policy_status === "complete" || policy_status === 'policy_issued'  ? 'Issued' : policy_status === "incomplete" ? 'Pending' : policy_status && capitalizeFirstLetter(policy_status.toLowerCase()),
        'policy_changed_to' : selectedTab ? selectedTab.replace('Reports', '') : '',
        'no_policy': selectedTab ? this.state.reportCount[selectedTab.replace('Reports', '')] ? 'no' : 'yes' : ''
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

  toAdvisory = () =>{
    storageService().remove('advisory_from_landing');
    this.navigate('/group-insurance/advisory/landing');
    return;
  }

  setSwipe = (index) =>{
    var filteredReportData = this.state.filteredReportData;
    var tabsMap = ['activeReports', 'pendingReports', 'inactiveReports']
    if(index !== undefined && index <= tabsMap.length && !isEmpty(filteredReportData)){
      var selectedTab = tabsMap[index]
      this.sendEvents('policy_type_switched', '', '', '', selectedTab)
      var selectedReports = filteredReportData[selectedTab]
      var reportTopText = reportTopTextMapper[selectedTab];
      this.setState({selectedReports, selectedTab, reportTopText, tabIndex: index })
    }
  }

  handleChangeIndex = (event, index) => {
    this.setSwipe(index);    
  };

  handleChangeSwipe =(index) =>{
    this.setSwipe(index);
  }

  render() {
    var reportCount = this.state.reportCount;
    if(this.state.filteredReportData)
    var {activeReports, pendingReports, inactiveReports} = this.state.filteredReportData;
    return (
      <Container
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        title="Your policies"
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        classOverRide="report-list-page"
        skelton={this.state.skelton}
        background="report-list-page"
      >
          <div className="insurance-common-report-page">

            <ul className="report-list-tab-container">

            <Tabs value={this.state.tabIndex}  onChange={this.handleChangeIndex} className="tab-swipe">
              <Tab className="individual-tab" label={
                <li className={`${this.state.tabIndex === 0 ? "selected" : ""}`} onClick={()=>this.handleChangeIndex(0)} >
                  Active<span style={{ color: this.state.selectedTab === 'activeReports' ? this.state.bracketColor : '' }}>({reportCount && reportCount.active})</span>
                </li>
              } />
              <Tab className="individual-tab" label={
                <li className={`${this.state.tabIndex === 1 ? "selected" : ""}`} onClick={()=>this.handleChangeIndex(1)} >
                 Pending<span style={{ color: this.state.selectedTab === 'pendingReports' ? this.state.bracketColor : '' }}>({reportCount && reportCount.pending})</span>
               </li>
              } />
              <Tab className="individual-tab" label={
                <li
                className={`${this.state.tabIndex === 2 ? "selected" : ""}`}
                onClick={()=>this.handleChangeIndex(2)}  
                >
                 Inactive<span style={{ color: this.state.selectedTab === 'inactiveReports' ? this.state.bracketColor : '' }}>({reportCount && reportCount.inactive})</span>
               </li>
              } />
            </Tabs>
            </ul>

            <SwipeableViews
              ref={this.swipeableViewsRef}
              index={this.state.tabIndex}
              onChangeIndex={this.handleChangeSwipe}
              action={actions => {this.swipeableActions = actions;}}
              className="tab-wrapper"
              id="tab-wrapper"
              animateHeight
              enableMouseEvents
             >
              <TabContainer dir={"ltr"}>
              <RenderReports class="activeReports" redirectCards={this.redirectCards} topText={reportTopTextMapper['activeReports']} bottomText={emptyStateText['activeReports']} reports={activeReports}/>
              {
                activeReports && activeReports.length === 0 && <p className="advisory-link" onClick={() => this.toAdvisory()}>
                CHECK THE RIGHT COVERAGE
                </p>
              }
              </TabContainer>
              <TabContainer dir={"ltr"}>
                  <RenderReports  class="pendingReports" redirectCards={this.redirectCards} topText={reportTopTextMapper['inactiveReports']} bottomText={emptyStateText['pendingReports']} reports={pendingReports}/>
              </TabContainer>
              <TabContainer dir={"ltr"}>
                  <RenderReports class="inactiveReports"  redirectCards={this.redirectCards} topText={reportTopTextMapper['pendingReports']} bottomText={emptyStateText['inactiveReports']} reports={inactiveReports}/>
              </TabContainer>

            </SwipeableViews>
        </div>
      </Container>
    );
  }
}

export default Report;