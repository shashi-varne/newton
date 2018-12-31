import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';
import Footer from './footer';
import Banner from '../ui/Banner';
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
    let { params } = this.props.location
    if (params && params.disableBack) {
      nativeCallback({ action: 'native_back' });
      return;
    }
    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/mandate":
      case "/mandate/success":
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

  handleClose = () => {
    this.setState({
      openDialog: false
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
    let client = document.getElementsByClassName('ContainerWrapper')[0].offsetHeight;
    let head = document.getElementsByClassName('Header')[0].offsetHeight;
    let foot = document.getElementsByClassName('Footer')[0].offsetHeight;
    let banner = document.getElementsByClassName('Banner')[0];
    let bannerHeight = (banner) ? banner.offsetHeight : 0;

    if (client > body) {
      document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40 + 'px';
    } else {
      document.getElementsByClassName('Container')[0].style.height = document.getElementsByClassName('Container')[0].offsetHeight;
    }
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active' key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    return (
      <div className={`ContainerWrapper ${(this.props.type !== 'fisdom') ? 'blue' : ''}`} >
        {/* Header Block */}
        <Header
          title={this.props.title}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          type={this.props.type}
          resetpage={this.props.resetpage}
          disableBack={this.props.disableBack}
          handleReset={this.props.handleReset}
          rightIcon={this.props.rightIcon} />

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
          isDisabled={this.props.isDisabled} />

        {/* No Internet */}
        {this.renderDialog()}
      </div>
    );
  }
};

export default withRouter(Container);
