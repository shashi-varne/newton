import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getConfig } from 'utils/functions';

import Header from './Header';
import Footer from './footer';
import Banner from '../../common/ui/Banner';
import loader from 'assets/loader_gif.gif';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner';


class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: ''
    }

  }

  componentDidMount() {
    let next_generation = new URLSearchParams(getConfig().searchParams).get('next_generation');
    let that = this;
    if (next_generation === "true") {
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          console.log("goback from callbackWeb");
          that.historyGoBack();
        }
      });
    } else {
      window.PlutusSdk.add_listener({
        type: 'back_pressed',
        go_back: function () {
          console.log("goback from plutussdk");
          that.historyGoBack();
        }
      });
    }
  }

  componentWillUnmount() {
    let next_generation = new URLSearchParams(getConfig().searchParams).get('next_generation');
    if (next_generation === "true") {
      window.callbackWeb.remove_listener({});
    } else {
      window.PlutusSdk.remove_listener({});
    }
  }

  historyGoBack = () => {
    let { params } = this.props.location;
    let insurance_v2 = getConfig().insurance_v2;

    if (this.props.isJourney) {
      if (!insurance_v2) {
        nativeCallback({ action: 'native_back' });
      } else {
        let eventObj = {
          "event_name": 'make_payment_clicked',
          "properties": {
            "user_action": 'close',
            "source": 'summary'
          }
        };
        nativeCallback({ events: eventObj });
        this.setState({
          callbackType: 'show_quotes',
          openPopup: true,
          popupText: 'Are you sure you want to explore more options? We will save your information securely.'
        })
      }

      return;
    }

    if (params && params.disableBack) {
      if (!insurance_v2) {
        nativeCallback({ action: 'native_back' });
      } else {
        this.setState({
          callbackType: 'exit',
          openPopup: true,
          popupText: 'Are you sure you want to exit the application process? You can resume it later.'
        })
      }
      return;
    }

    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/insurance":
      case "/insurance/resume":
      case "/insurance/journey":
        if (!insurance_v2) {
          nativeCallback({ action: 'native_back' });
        } else {
          this.setState({
            callbackType: 'exit',
            openPopup: true,
            popupText: 'Are you sure you want to exit the application process? You can resume it later.'
          })
        }
        break;
      default:
        if (navigator.onLine) {
          this.props.history.goBack();
        } else {
          this.setState({
            openDialog: true
          });
        }
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });

    if (this.state.callbackType === 'show_quotes') {
      let eventObj = {
        "event_name": 'exit_from_payment',
        "properties": {
          "user_action": 'no',
          "source": 'summary'
        }
      };
      nativeCallback({ events: eventObj });
    }
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

  renderPageLoader = () => {
    if (this.props.showLoader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={loader} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    let body = document.getElementsByTagName('body')[0].offsetHeight;
    // let client = document.getElementsByClassName('ContainerWrapper')[0].offsetHeight;
    let head = document.getElementsByClassName('Header')[0].offsetHeight;
    let foot = document.getElementsByClassName('Footer')[0] ? document.getElementsByClassName('Footer')[0].offsetHeight : 0;
    let banner = document.getElementsByClassName('Banner')[0];
    let bannerHeight = (banner) ? banner.offsetHeight : 0;

    // if (client > body) {
    //   document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40 + 'px';
    // } else {
    //   document.getElementsByClassName('Container')[0].style.height = document.getElementsByClassName('Container')[0].offsetHeight ;
    // }
    document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40 + 'px';
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
      <div className={`ContainerWrapper ${(this.props.type !== 'fisdom') ? 'blue' : ''}`} >
        {/* Header Block */}
        <Header
          disableBack={this.props.disableBack}
          title={this.props.title}
          smallTitle={this.props.smallTitle}
          provider={this.props.provider}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          type={this.props.type}
          resetpage={this.props.resetpage}
          handleReset={this.props.handleReset} />

        {/* Below Header Block */}
        <div style={{ height: 56 }}></div>

        {/* Loader Block */}
        {this.renderPageLoader()}

        <div className={`Step ${(this.props.type !== 'fisdom') ? 'blue' : ''}`}>
          {steps}
        </div>

        {/* Banner Block */}
        {this.props.banner && <Banner text={this.props.bannerText} />}

        {/* Children Block */}
        <div className='Container'>
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
            noFooter={this.props.noFooter} />
        }
        {/* No Internet */}
        {this.renderDialog()}
        {this.renderPopup()}
      </div>
    );
  }
};

export default withRouter(Container);
