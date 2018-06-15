import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';
import loader from 'assets/loader_gif.gif';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    }
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/referral":
        nativeCallback({ action: 'native_back' });
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
            <img src={loader} alt=""/>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="ReferralContainerWrapper">
        {/* Header Block */}
        <Header
          title={this.props.title}
          goBack={this.historyGoBack}
          isPrime={this.props.isPrime} />

        {/* Below Header Block */}
        <div style={{height: 56}}></div>

        {/* Loader Block */}
        {this.renderPageLoader()}

        {/* Children Block */}
        <div className={`ReferralContainer ${this.props.background}`}>
          { this.props.children }
        </div>

        {/* No Internet */}
        {this.renderDialog()}
      </div>
    );
  }
};

export default withRouter(Container);
