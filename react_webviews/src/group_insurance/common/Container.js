import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { getConfig, manageDialog } from 'utils/functions';

import { nativeCallback, openModule } from 'utils/native_callback';
import '../../utils/native_listner';
import {checkStringInString} from 'utils/validators';
import { back_button_mapper } from '../constants';
import { storageService } from '../../utils/validators';
import {didMount ,commonRender} from '../../common/components/container_functions';

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      productName: getConfig().productName,
      inPageTitle: false,
      force_hide_inpage_title: false,
      project: 'group-insurance',
    }
    this.historyGoBack = this.historyGoBack.bind(this);

    this.didMount = didMount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  componentDidMount() {

    this.didMount();


    window.addEventListener("scroll", this.onScroll, false);
    let pathname = this.props.history.location.pathname;

    if (pathname === '/group-insurance' 
       || pathname.indexOf('other-insurance') >= 0 
       || pathname.indexOf('life-insurance') >= 0 
       || pathname.includes('/group-insurance/group-health')
       || pathname === '/group-insurance/group-insurance/add-policy' 
       || pathname === '/group-insurance/health/landing'
       || pathname === '/group-insurance/advisory/landing'
       || pathname === '/group-insurance/advisory/basic-details'
       || pathname === '/group-insurance/advisory/income-details'
       || pathname === '/group-insurance/advisory/liability-details'
       || pathname === '/group-insurance/advisory/asset-details'
       || pathname === '/group-insurance/advisory/recommendations'
       || pathname === '/group-insurance/advisory/email-report'
       || pathname === '/group-insurance/call-back-details'
       ) {
      this.setState({
        new_header: true,
        inPageTitle: true,
        force_show_inpage_title: true
      }, () => {
        this.onScroll();
      })
    } else {
      this.setState({
        new_header: false
      })
    }

    
  }

  checkStringInString = (string) => {
    let pathname = this.props.history.location.pathname;

    return checkStringInString(pathname, string);
  }

  componentWillUnmount() {
  
    this.unmount();
  }



  navigate = (pathname, user_action) => {

    let action = user_action ? user_action : this.props.disableBack ? 'close' : 'back';
    nativeCallback({ events: this.getEvents(action) });
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  }


  backMapperBharti(path) {
    let backMapperBharti = {
      '/summary': 'form',
      '/form': 'plan',
      '/plan' : '/group-insurance/other-insurance/entry'
    }

    let redirectPath  = backMapperBharti[path] ? backMapperBharti[path] : '/group-insurance';

    this.navigate(redirectPath);
  }

  historyGoBack = () => {

    if(this.props.forceBackState) {
      this.navigate(this.props.forceBackState);
      return;
    }

    let project_child = getConfig().project_child;
    if (manageDialog('general-dialog', 'none', 'enableScroll')) {
      if (this.props.closePopup) {
        this.props.closePopup();
      }
      return;
    }
    let { params } = this.props.location;
    if(!params) {
      params = {};
    }
    let pathname = this.props.history.location.pathname;
    
    if(this.checkStringInString('/group-insurance/advisory/basic-details')){
      let resume_case = storageService().getObject('advisory_resume_present');
      if(resume_case){
        this.navigate('/group-insurance');
      }else{
        this.navigate('/group-insurance/advisory/landing')
      }  
      return;
    }

    let from_advisory = storageService().getObject('from_advisory')
    let advisory_paths = ['/group-insurance/health/critical_illness/plan', '/group-insurance/group-health/RELIGARE/landing', '/group-insurance/corona/plan','/group-insurance/life-insurance/term/landing'];
    if(from_advisory && advisory_paths.indexOf(pathname) >= 0){
      
      this.navigate('/group-insurance/advisory/recommendations')
      return;
    }

      if (this.checkStringInString('/group-insurance/other-insurance/entry')) {
        this.navigate('/group-insurance');
        return;
      }
      
      if (this.checkStringInString('group-insurance/corona/plan') 
      || this.checkStringInString('/group-insurance/dengue/plan') 
      || this.checkStringInString('/group-insurance/hospicash/plan')){
        this.navigate('/group-insurance/health/landing');
        return;
      }
     
    if(this.checkStringInString('group-health')) {

      // #TODO need to handle back accoridng to entry/landing
      let group_health_landing = '/group-insurance/group-health/landing';
      if(this.props.provider) {
        group_health_landing = `/group-insurance/group-health/${this.props.provider}/landing`;
      }

      if(this.checkStringInString('insure-type') || this.checkStringInString('payment') || 
      this.checkStringInString('final-summary')) {
        this.navigate(group_health_landing);
        return;
      }

      if(this.checkStringInString('reportdetails')) {
        this.navigate('/group-insurance/common/report');
        return;
      }


      if(this.checkStringInString('group-insurance/group-health') && this.checkStringInString('landing')) {
        this.navigate('/group-insurance/health/landing');
        return;
      }
      
    }

    if (project_child === 'bhartiaxa' && pathname.indexOf('payment-success') >= 0 && ( pathname === '/group-insurance/accident/payment-success' || 
        pathname === '/group-insurance/wallet/payment-success') &&
      this.props.disableBack) {
      this.setState({
        callbackType: 'web_home_other_page',
        openPopup: true,
        popupText: 'Address is mandatory for policy document, are you sure you want to go back?'
      })
      return;
    }
    
    if (project_child === 'bhartiaxa' && pathname.indexOf('payment-success') >= 0
      && this.props.disableBack) {
      this.setState({
        callbackType: 'web_home_health_page',
        openPopup: true,
        popupText: 'Address is mandatory for policy document, are you sure you want to go back?'
      })
      return;
    }

    if (project_child === 'bhartiaxa' && pathname.indexOf('success') >= 0
      && this.props.disableBack) {
        this.navigate('/group-insurance');
      return;
    }

    if(pathname === '/group-insurance/accident/payment-success' || pathname === '/group-insurance/wallet/payment-success'){
      this.navigate('/group-insurance/other-insurance/entry')
      return
    }

    if(pathname === '/group-insurance/dengue/payment-success'
    || pathname === '/group-insurance/corona/payment-success'
    || pathname === '/group-insurance/hospicash/payment-success'){
      this.navigate('/group-insurance/health/landing')
      return
    }

    if (pathname.indexOf('payment-success') >= 0 ||
      pathname.indexOf('summary-success') >= 0 || pathname.indexOf('payment-failed') >= 0) {
      this.navigate('/group-insurance');
      return;
    }

    if ((params && params.backToState === 'report') ||
      (pathname.indexOf('reportdetails') >= 0)) {
      this.navigate('/group-insurance/common/report');
      return;
    }

    if (project_child === 'bhartiaxa' && pathname.indexOf('/summary') >= 0) {
      this.backMapperBharti('/summary');
      return;
    }

    if (project_child === 'bhartiaxa' && pathname.indexOf('/form') >= 0) {
      this.backMapperBharti('/form');
      return;
    }

    if(pathname.indexOf('/group-health') < 0) {
      if (project_child === 'bhartiaxa' && pathname.indexOf('/home_insurance') >= 0 && 
      pathname.indexOf('/plan') >= 0) {
        this.navigate('/group-insurance/other-insurance/entry');
        return;
      }
  
     
      if (project_child === 'bhartiaxa' && pathname.indexOf('/plan') >= 0 &&
      pathname.indexOf('/health') >= 0) {
        this.navigate('/group-insurance/health/landing');
        return;
      }
  
      if (project_child === 'bhartiaxa' && pathname.indexOf('/plan') >= 0) {
        this.backMapperBharti('/plan');
        return;
      }
  
      if (project_child === 'bhartiaxa' && pathname.indexOf('/health/landing') >= 0) {
        this.navigate('/group-insurance');
        return;
      }
    }
   

    if (project_child === 'term') {
      if(params && params.backToState === 'report') {
        this.navigate('/group-insurance/common/report');
        return;
      }
      if (pathname === '/group-insurance/term/journey' || pathname === '/group-insurance/term/summary') {
        if (this.props.isJourney) {
          let eventObj = {
            "event_name": 'term_insurance',
            "properties": {
              "user_action": 'close',
              "screen_name": 'insurance_summary'
            }
          };
          nativeCallback({ events: eventObj });
          this.setState({
            callbackType: 'show_quotes',
            openPopup: true,
            popupText: 'Are you sure you want to explore more options? We will save your information securely.'
          })

          return;
        }

        if (params && params.disableBack) {
          this.setState({
            callbackType: 'web_home',
            openPopup: true,
            popupText: 'Are you sure you want to exit the application process? You can resume it later.'
          })
          return;
        }
      }
    }


    switch (pathname) {
      case "/group-insurance":
        // nativeCallback({ action: 'exit', events: this.getEvents('back') });
        this.navigate("/landing");
        break;
      case "/group-insurance/common/report":
        openModule('app/portfolio')
        break;
      case "/group-insurance/term/resume":
      case "/group-insurance/term/journey":
        this.setState({
          callbackType: 'web_home',
          openPopup: true,
          popupText: 'Are you sure you want to exit the application process? You can resume it later.'
        })
        break;
      case "/group-insurance/term/summary":
        this.navigate(back_button_mapper[pathname]);
        break;
      case '/group-insurance/term/intro':
        this.navigate('/group-insurance');
        break;
      case '/group-insurance/life-insurance/savings-plan/landing': 
        this.navigate(back_button_mapper[pathname]);
        break;
        case '/group-insurance/life-insurance/entry': 
        this.navigate(back_button_mapper[pathname]);
        break;
      default:
        nativeCallback({ events: this.getEvents('back') });
        if (back_button_mapper[pathname] && back_button_mapper[pathname].length > 0) {
          this.navigate(back_button_mapper[pathname]);
        } else {
          this.props.history.goBack();
        }
    }
  }



  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    if (this.state.callbackType === 'show_quotes') {
      let eventObj = {
        "event_name": 'exit_from_payment',
        "properties": {
          "user_action": 'yes',
          "source": 'summary'
        }
      };
      nativeCallback({ events: eventObj });
      window.sessionStorage.setItem('show_quotes', true);
      this.navigate('/group-insurance/term/quote');
    } else if (this.state.callbackType === 'web_home') {
      this.navigate('/group-insurance')
    } else if(this.state.callbackType === 'web_home_other_page'){
      this.navigate('/group-insurance/other-insurance/entry')
    } else if(this.state.callbackType === 'web_home_health_page'){
      this.navigate('/group-insurance/health/landing')
    }


    nativeCallback({ action: this.state.callbackType });
  }

  
  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {

    return(
      <Fragment>
      {this.commonRender()}
      </Fragment>
    )
  }
};

export default withRouter(Container);
