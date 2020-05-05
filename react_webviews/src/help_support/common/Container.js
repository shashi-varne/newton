import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';
import Footer from './footer';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import 'utils/native_listner_otm';
import { setHeights } from 'utils/functions';
import { getConfig } from '../../utils/functions';

let start_time = '';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
  }

  componentDidMount() {
    setHeights({ 'header': true, 'container': false });
    start_time = new Date();

    let that = this;
    window.callbackWeb.add_listener({
      type: 'back_pressed',
      go_back: function () {
        that.historyGoBack();
      }
    });
  }

  componentWillUnmount() {
    window.callbackWeb.remove_listener({});
  }

  componentDidUpdate(prevProps) {
    setHeights({ 'header': true, 'container': false });
  }

  calcReadtime = (endtime) => {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
  }

  getEvents() {
    if (!this || !this.props || !this.props.events) {
      return;
    }

    let events = this.props.events;
    events.properties.time_spent = this.calcReadtime(new Date());
    return events;
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;

    switch (pathname) {
      case "/help":
        nativeCallback({ action: 'exit', events: this.getEvents() });
        break;
      default:
        if (navigator.onLine) {
          nativeCallback({ events: this.getEvents() });
          this.props.history.goBack();
        } else {
          this.setState({
            openDialog: true
          });
        }
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
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="default" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderPageLoader = () => {
    if (this.props.showLoader) {
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

  render() {
    return (
      <div className="ContainerWrapper">
        {/* Header Block */}
        {!this.props.hideheader &&
          <Header
            title={this.props.title}
            goBack={this.historyGoBack}
            type={getConfig().productName} />
        }

        {/* Below Header Block */}
        {<div id="HeaderHeight" style={{ top: 56 }}>
        </div>}

        {/* Loader Block */}
        {this.renderPageLoader()}

        {/* Children Block */}
        <div className={`Container HelpContainer ${this.props.background}`}>
          {this.props.children}
        </div>

        {/* Footer Block */}
        {!this.props.noFooter &&
          <Footer
            fullWidthButton={this.props.fullWidthButton}
            buttonTitle={this.props.buttonTitle}
            handleClick={this.props.handleClick}
            noFooter={this.props.noFooter}
            isDisabled={this.props.isDisabled} />
        }

        {/* No Internet */}
        {this.renderDialog()}
      </div>
    );
  }
};

export default withRouter(Container);
