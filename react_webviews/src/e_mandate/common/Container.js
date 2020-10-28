import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';
import Footer from './footer';
import Banner from '../../common/ui/Banner';

import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner_otm';
import { getConfig, setHeights } from 'utils/functions';


class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      productName: getConfig().productName
    }
    this.handleTopIcon = this.handleTopIcon.bind(this);
  }

  componentDidMount() {
    setHeights({ 'header': true, 'container': false });
    let that = this;
    if (getConfig().generic_callback) {
      if (getConfig().iOS) {
        nativeCallback({ action: 'hide_top_bar' });
      }
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    } else {
      window.PaymentCallback.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    }
  }

  componentWillUnmount() {
    if (getConfig().generic_callback) {
      window.callbackWeb.remove_listener({});
    } else {
      window.PaymentCallback.remove_listener({});
    }
  }

  navigate = (pathname) => {
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

  historyGoBack = () => {

    let current_params = getConfig().current_params;

    this.setState({
      back_pressed: true
    })


    if (this.props.popupOpen) {
      return;
    }
    let pathname = this.props.history.location.pathname;
    let { params } = this.props.location;

    if (pathname.indexOf('consent/about') >= 0
      && this.props.disableBack) {
      this.setState({
        callbackType: 'exit',
        openPopup: true,
        popupText: 'You are almost there, do you really want to go back?'
      })
      return;
    }

    if(pathname === '/e-mandate' && current_params && 
      current_params.referral_code) {
        return;
    }

    if ((params && params.disableBack) || this.props.disableBack) {
      nativeCallback({ action: 'exit', events: this.getEvents('exit') });
      return;
    }

    switch (pathname) {
      case "/e-mandate":
      case "/e-mandate/success":
      case "/e-mandate/enps/about":
      case "/e-mandate/enps/success":
      case "/e-mandate/enps/failure":
        nativeCallback({ action: 'exit', events: this.getEvents('exit') });
        break;
      default:
        if (this.getEvents('back')) {
          nativeCallback({ events: this.getEvents('back') });
        }
        this.props.history.goBack();
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });
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

    nativeCallback({ action: this.state.callbackType });

  }

  renderPopup = () => {
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

  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: 'Are you sure you want to exit ?'
    })
  }

  renderPageLoader = () => {
    if (this.props.showLoader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    setHeights({ 'header': true, 'container': false });
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active'
          style={{ background: getConfig().primary, marginRight: 0 }} key={i}></span>);
      } else {
        steps.push(<span key={i} style={{ marginRight: 0 }}></span>);
      }
    }

    return (
      <div className={`ContainerWrapper ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`} >
        {/* Header Block */}
        {(!this.props.noHeader && !getConfig().hide_header) && <Header
          disableBack={this.props.disableBack}
          title={this.props.title}
          smallTitle={this.props.smallTitle}
          provider={this.props.provider}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          noBack={this.props.noBack}
          type={getConfig().productName}
          resetpage={this.props.resetpage}
          handleReset={this.props.handleReset}
          topIcon={this.props.topIcon}
          handleTopIcon={this.handleTopIcon} />
        }
        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 56 }}>

          {/* Loader Block */}
          {this.renderPageLoader()}

          {steps && <div className="Step">
            {steps}
          </div>}

          {/* Banner Block */}
          {this.props.banner && <Banner text={this.props.bannerText} />}

        </div>

        {/* Children Block */}
        <div className={`Container ${this.props.classOverRideContainer}`}>
          {this.props.children}
        </div>

        {/* Footer Block */}
        {!this.props.noFooter &&
          <Footer
            fullWidthButton={this.props.fullWidthButton}
            logo={this.props.logo}
            buttonTitle={this.props.buttonTitle}
            provider={this.props.provider}
            premium={this.props.premium}
            paymentFrequency={this.props.paymentFrequency}
            edit={this.props.edit}
            resetpage={this.props.resetpage}
            handleClick={this.props.handleClick}
            handleReset={this.props.handleReset}
            onlyButton={this.props.onlyButton}
            noFooter={this.props.noFooter}
            isDisabled={this.props.isDisabled} />
        }
        {/* No Internet */}
        {this.renderDialog()}
        {this.renderPopup()}
      </div>
    );
  }
};

export default withRouter(Container);
