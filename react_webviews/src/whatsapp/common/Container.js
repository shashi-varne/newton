import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { didmount , commonRender } from '../../common/components/container_functions';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: 'whatsapp',
    };

    this.didmount = didmount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  componentDidMount() {
    this.didmount();

    if (getConfig().iOS) {
      nativeCallback({ action: 'hide_top_bar' });
    }
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    if (this.getEvents('back')) {
      nativeCallback({ events: this.getEvents('back') });
    }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }


  historyGoBack = (backData) => {
    if (this.getEvents('back')) {
      nativeCallback({ events: this.getEvents('back') });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;

    switch (pathname) {
      case '/whatsapp/mobile-verify':
        nativeCallback({ action: 'native_back' });
        break;
      case '/whatsapp/edit-number':
      case '/whatsapp/otp-success':
        nativeCallback({ action: 'exit_web' });
        break;
      default:
        this.props.history.goBack();
    }
  };

  render() {
    return(
      <Fragment>
      {this.commonRender()}
      </Fragment>
    )
  }
}

export default withRouter(Container);
