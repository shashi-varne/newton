import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from '../../common/components/Header';
import { didmount } from '../../common/components/container_functions';
import Typography from '@material-ui/core/Typography';
import Footer from './footer';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  // DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';
import { isFunction } from '../../utils/validators';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: 'portfolio-rebalancing', //to use in common functions
    };

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    let { params } = this.props.location;

    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' });
      return;
    }

    if (isFunction(this.props.goBack)) {
      return this.props.goBack(params);
    }
    nativeCallback({ events: this.getEvents('back') });
    this.props.history.goBack();
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
  };

  handleClose = () => {
    this.setState({
      openPopup: false,
    });
  };

  handlePopup = () => {
    this.setState({
      openPopup: false,
    });
    nativeCallback({ action: 'native_back', events: this.getEvents('back') });
  };

  renderPopup = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openPopup}
        onClose={this.handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogContent>
          <DialogContentText>{this.state.popupText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handlePopup} color='default' autoFocus>
            Yes
          </Button>
          <Button onClick={this.handleClose} color='default'>
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active' key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    if (this.state.mounted) {
      return (
        <div
          className={`ContainerWrapper pr-main-container ${this.props.classOverRide}  ${
            getConfig().productName !== 'fisdom' ? 'blue' : ''
          }`}
        >
          {/* Header Block */}
          {!this.props.noHeader && !getConfig().hide_header && !this.props.showLoader && (
            <Header
              disableBack={this.props.disableBack}
              title={this.props.title}
              smallTitle={this.props.smallTitle}
              provider={this.props.provider}
              count={this.props.count}
              total={this.props.total}
              current={this.props.current}
              goBack={this.headerGoBack}
              edit={this.props.edit}
              type={getConfig().productName}
              resetpage={this.props.resetpage}
              handleReset={this.props.handleReset}
              inPageTitle={this.state.inPageTitle}
              force_hide_inpage_title={this.state.force_hide_inpage_title}
              style={this.props.styleHeader}
              className={this.props.classHeader}
              headerData={this.props.headerData}
            />
          )}

          {/* Below Header Block */}
          <div id='HeaderHeight' style={{ top: 56 }}>
            {/* Loader Block */}
            {this.renderPageLoader()}
          </div>

          {/*  */}

          {!this.state.force_hide_inpage_title &&
            !this.props.noHeader &&
            !this.props.hidePageTitle &&
            this.new_header_scroll()}

          {/* Children Block */}
          <div
            style={this.props.styleContainer}
            className={`Container ${this.props.classOverRideContainer} ${
              this.props.noPadding ? 'no-padding' : ''
            }`}
          >
            {this.props.children}
          </div>
          {this.props.helpContact && (
            <section className='help-container '>
              <Typography className='help-text'>For any help, reach us at</Typography>
              <div className='help-contact-email flex-item'>
                <Typography className='help-contact'>+80-30-408363</Typography>
                <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
                <Typography className='help-email'>{'ask@fisdom.com'.toUpperCase()}</Typography>
              </div>
            </section>
          )}

          {/* Footer Block */}
          {!this.props.noFooter && (
            <Footer
              noFooter={this.props.noFooter}
              fullWidthButton={this.props.fullWidthButton}
              logo={this.props.logo}
              buttonTitle={this.props.buttonTitle}
              provider={this.props.provider}
              premium={this.props.premium}
              paymentFrequency={this.props.paymentFrequency}
              edit={this.props.edit}
              resetpage={this.props.resetpage}
              handleClick={this.props.handleClick}
              handleClick2={this.props.handleClick2}
              handleReset={this.props.handleReset}
              onlyButton={this.props.onlyButton}
              disable={this.props.disable}
              withProvider={this.props.withProvider}
              buttonData={this.props.buttonData}
            />
          )}
          {/* No Internet */}
          {this.renderDialog()}
          {this.renderPopup()}
        </div>
      );
    }

    return null;
  }
}

export default withRouter(Container);
