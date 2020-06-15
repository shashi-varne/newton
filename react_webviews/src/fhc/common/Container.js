import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import Header from './Header';
import Footer from './footer';
import Banner from '../../common/ui/Banner';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import { getConfig, setHeights } from 'utils/functions';
import PopUp from './PopUp';
import { storageService } from '../../utils/validators';
import { uploadFHCData } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { navigate } from './commonFunctions';

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      show_loader: false,
      popupText: '',
      callbackType: '',
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
    this.handleTopIcon = this.handleTopIcon.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.navigate = navigate.bind(this);
  }

  componentDidMount() {
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

  componentWillUnmount() {
    if (getConfig().generic_callback) {
      window.callbackWeb.remove_listener({});
    } else {
      window.PlutusSdk.remove_listener({});
    }
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
    this.setState({
      back_pressed: true,
    });
    let pathname = this.props.history.location.pathname;
    let { params } = this.props.location;
    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' });
      return;
    }
    switch (pathname) {
      case "/fhc":
      case "/fhc/final-report":
        storageService().remove('fhc_data'); // remove cached fhc data
        nativeCallback({ action: 'exit', events: this.getEvents('back') });
        break;
      case "/fhc/personal1":
        if (params && params.fromLanding) {
          this.navigate('/fhc', { fromScreen1: true });
        } else {
          nativeCallback({ action: 'exit', events: this.getEvents('back') });
        }
        break;
      default:
        this.props.history.goBack();
    }
  }

  handleClose = () => {
    if (this.state.openPopup) {
      storageService().remove('fhc_data'); // remove cached fhc data
      nativeCallback({ events: this.getEvents('exit_no') });
    }
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

  handleYes = async () => {
    this.setState({
      openPopup: false
    });
    this.setState({ show_loader: true });
    try {
      const fhc_data = storageService().getObject('fhc_data');
      await uploadFHCData(fhc_data);
      nativeCallback({ action: this.state.callbackType, events: this.getEvents('exit_yes') });
    } catch (e) {
      this.setState({ show_loader: false });
      console.log(e);
      toast(e);
    }
  }

  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: <Fragment>Are you sure you want to <b>exit</b>? 
        <br />We will save your information securely.
      </Fragment>
    })
  }

  renderPageLoader = () => {
    if (this.props.showLoader || this.state.show_loader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={this.state.loaderMain} alt="" />
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
    let show_loader = this.props.showLoader || this.state.show_loader;
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active'
          style={{ background: getConfig().primary, marginRight: 1 }} key={i}></span>);
      } else {
        steps.push(<span key={i} style={{ marginRight: 1 }}></span>);
      }
    }

    return (
      <div className={`ContainerWrapper fhc-container ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`} >
        {/* Header Block */}
        {!this.props.noHeader &&
          <Header
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
            handleReset={this.props.handleReset}
            topIcon={this.props.topIcon}
            handleTopIcon={this.handleTopIcon}
            hideBack={this.props.hideBack} />
        }

        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 60 }}>

          {/* Loader Block */}
          {this.renderPageLoader()}

          {
            (!show_loader && steps) && <div className="Step">
              {steps}
            </div>
          }

          {/* Banner Block */}
          {(!show_loader && this.props.banner) && <Banner text={this.props.bannerText} />}

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
        <PopUp
          openPopup={this.state.openPopup}
          popupText={this.state.popupText}
          handleClose={this.handleClose}
          handleNo={this.handleClose}
          handleYes={this.handleYes}
        >
        </PopUp>
      </div>
    );
  }
};

export default withRouter(Container);
