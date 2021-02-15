import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getConfig, manageDialog, setHeights } from 'utils/functions';
import Header from './Header';
import Footer from './footer';
import Banner from '../../common/ui/Banner';

import { nativeCallback, openModule } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner';
import {checkStringInString} from 'utils/validators';
import { back_button_mapper } from '../constants';
import { renderPageLoader, renderGenericError } from '../../common/components/container_functions';
import UiSkelton from '../../common/ui/Skelton';


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
      force_hide_inpage_title: false
    }
    this.historyGoBack = this.historyGoBack.bind(this);
    this.renderPageLoader = renderPageLoader.bind(this);
    this.renderGenericError = renderGenericError.bind(this);
  }

  componentDidMount() {

    window.addEventListener("scroll", this.onScroll, false);
    let pathname = this.props.history.location.pathname;

    if (pathname === '/group-insurance' 
       || pathname.indexOf('other-insurance') >= 0 
       || pathname.indexOf('life-insurance') >= 0 
       || pathname.includes('/group-insurance/group-health')
       || pathname === '/group-insurance/group-insurance/add-policy' 
       || pathname === '/group-insurance/health/landing'
       || pathname === '/group-insurance/call-back-details') {
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

    setHeights({ 'header': true, 'container': false });
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    } else {
      window.PlutusSdk.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    }
  }

  checkStringInString = (string) => {
    let pathname = this.props.history.location.pathname;

    return checkStringInString(pathname, string);
  }

  componentWillUnmount() {
  
    if (getConfig().generic_callback) {
      window.callbackWeb.remove_listener({});
    } else {
      window.PlutusSdk.remove_listener({});
    }

    window.removeEventListener("scroll", this.onScroll, false);
  }

  getHeightFromTop() {
    var el = document.getElementsByClassName('Container')[0];
    var height = el.getBoundingClientRect().top;
    return height;
  }

  check_hide_header_title() {
    let force_hide_inpage_title;
    let restrict_in_page_titles = [];
    if(restrict_in_page_titles.indexOf(this.props.headerType) !== -1) {
      force_hide_inpage_title = true;
    }

    this.setState({
      force_hide_inpage_title: force_hide_inpage_title || false
    })

    if(this.props.updateChild) {
      this.props.updateChild('inPageTitle', force_hide_inpage_title);
    }

  }

  onScroll = () => {
   
    if(!this.state.new_header) {
      this.setState({
        inPageTitle: false
      })
      return;
    }
    let inPageTitle = this.state.inPageTitle;
    if (this.getHeightFromTop() >= 56) {
      //show down
      inPageTitle = true;

    } else {
      //show up
      inPageTitle = false;
    }

    if(this.state.force_show_inpage_title) {
      inPageTitle = true;
      let that = this;
      setTimeout(function(){ 
        that.setState({
          force_show_inpage_title: false
        })
     }, 100);
      
    }

    this.setState({
      inPageTitle: inPageTitle
    })

    if(this.props.updateChild) {
      this.props.updateChild('inPageTitle', inPageTitle);
    }

  };

  navigate = (pathname, user_action) => {

    let action = user_action ? user_action : this.props.disableBack ? 'close' : 'back';
    nativeCallback({ events: this.getEvents(action) });
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  }

  getEvents(user_action) {
    if (!this || !this.props || !this.props.events) {
      return;
    }
    let events = this.props.events;
    events.properties.user_action = user_action;
    return events;
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
        nativeCallback({ action: 'exit', events: this.getEvents('back') });
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
        if (back_button_mapper[pathname] && back_button_mapper[pathname].length > 0) {
          this.navigate(back_button_mapper[pathname]);
        } else {
          nativeCallback({ events: this.getEvents('back') });
          this.props.history.goBack();
        }
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });

    // if (this.state.callbackType === 'show_quotes') {
    //   let eventObj = {
    //     "event_name": 'exit_from_payment',
    //     "properties": {
    //       "user_action": 'no',
    //       "source": 'summary'
    //     }
    //   };
    //   nativeCallback({ events: eventObj });
    // }
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
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

  renderPopup = () => {
    if (getConfig().insurance_v2) {
      return (
        <Dialog
          fullScreen={false}
          open={this.state.openPopup}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              {this.state.popupText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="default">
              No
            </Button>
            <Button onClick={this.handlePopup} color="default" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    setHeights({ 'header': true, 'container': false });
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active'
          style={{ background: getConfig().primary }} key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    return (
      <div className={`ContainerWrapper ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`}  >
        {/* Header Block */}
        {!this.props.hide_header && this.props.showLoader !== true && !this.props.showLoaderModal && <Header
          disableBack={this.props.disableBack}
          title={this.props.title}
          smallTitle={this.props.smallTitle}
          provider={this.props.provider}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          type={getConfig().productName}
          resetpage={this.props.resetpage}
          inPageTitle={this.state.inPageTitle}
          force_hide_inpage_title={this.state.force_hide_inpage_title}
          handleReset={this.props.handleReset}
          filterPgae={this.props.filterPgae}
          handleFilter={this.props.handleFilter} 
          new_header={this.state.new_header} 
          headerData={this.props.headerData}
        />}

        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 56 }}>


          {/* Loader Block covering entire screen*/}
          {this.renderPageLoader()}

          {/* Error Block */}
          {this.renderGenericError()}

          {!this.props.showLoader && !this.props.showLoaderModal && steps && <div className={`Step ${(this.props.type !== 'fisdom') ? 'blue' : ''}`}>
            {steps}
          </div>}

          {/* Banner Block */}
          {!this.props.showLoader && !this.props.showLoaderModal && this.props.banner && <Banner text={this.props.bannerText} />}

        </div>

        {!this.state.force_hide_inpage_title && this.state.new_header &&
          <div 
            id="header-title-page"
            style={this.props.styleHeader} 
            className={`header-title-page  ${this.props.classHeader}`}
            >
               <div className={`header-title-page-text ${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`} style={{width: this.props.count ? '75%': ''}}>
                 {this.props.title}
              </div>
              {this.state.inPageTitle && this.props.count &&
                <span color="inherit" 
                className={`${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
                style={{ fontSize: 10 }}>
                  <span style={{ fontWeight: 600 }}>{this.props.current}</span>/<span>{this.props.total}</span>
                </span>}
          </div>
         }

          { this.props.skelton && 
            <UiSkelton 
            type={this.props.skelton}
            />
          }


        {/* Children Block */}
        <div 
        style={{...this.props.styleContainer, backgroundColor: this.props.skelton ? '#fff': 'initial'}}
        className={`Container ${this.props.classOverRideContainer}`}>
           <div 
            className={`${!this.props.skelton ? 'fadein-animation' : ''}`}
            style={{display: this.props.skelton ? 'none': ''}}
            > {this.props.children}
             </div>
        </div>

        {/* Footer Block */}
        {!this.props.noFooter && !this.props.skelton &&
          <Footer
            dualbuttonwithouticon={this.props.dualbuttonwithouticon}
            fullWidthButton={this.props.fullWidthButton}
            twoButtons={this.props.twoButtons}
            logo={this.props.logo}
            buttonTitle={this.props.buttonTitle}
            buttonDisabled={this.props.buttonDisabled}
            buttonOneTitle={this.props.buttonOneTitle}
            buttonTwoTitle={this.props.buttonTwoTitle}
            provider={this.props.provider}
            premium={this.props.premium}
            paymentFrequency={this.props.paymentFrequency}
            edit={this.props.edit}
            resetpage={this.props.resetpage}
            handleClick={this.props.handleClick}
            handleClick2={this.props.handleClick2}
            handleClickOne={this.props.handleClickOne}
            handleClickTwo={this.props.handleClickTwo}
            handleReset={this.props.handleReset}
            onlyButton={this.props.onlyButton}
            showDotDot={this.props.showDotDot}
            noFooter={this.props.noFooter}
            withProvider={this.props.withProvider}
            buttonData={this.props.buttonData}
            showLoader={this.props.showLoader}
            {...this.props}
             />
        }
        {/* No Internet */}
        {this.renderDialog()}
        {this.renderPopup()}
      </div>
    );
  }
};

export default withRouter(Container);
