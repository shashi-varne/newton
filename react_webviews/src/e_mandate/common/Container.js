import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { didmount, commonRender } from '../../common/components/container_functions';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner_otm';
import { getConfig } from 'utils/functions';


class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      productName: getConfig().productName,
      project: 'e-mandate',
      inPageTitle: false,
      new_header:false,
      force_hide_inpage_title: true,
    }
    this.handleTopIcon = this.handleTopIcon.bind(this);

    this.didmount = didmount.bind(this);
    this.commonRender = commonRender.bind(this);
  }


  componentDidMount() {

    this.didmount();

    if (getConfig().generic_callback) {
      if (getConfig().iOS) {
        nativeCallback({ action: 'hide_top_bar' });
      }
    }
  }

  componentWillUnmount() {
   this.unmount();
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

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    nativeCallback({ action: this.state.callbackType });

  }

  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: 'Are you sure you want to exit ?'
    })
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
