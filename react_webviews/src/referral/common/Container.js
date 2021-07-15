import React, { Component , Fragment } from 'react';
import { withRouter } from 'react-router';

import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';

import {didMount ,commonRender} from '../../common/components/container_functions';
import { handleNativeExit } from '../../utils/native_callback';


class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      productName: getConfig().productName
    }
    this.didMount = didMount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  historyGoBack = () => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/referral":
        handleNativeExit(this.props, {action: "native_back"});
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

  componentDidMount() {

    this.didMount();
    this.setState({
      mounted: true
    })
  }

  componentWillUnmount() {
  
    this.unmount();
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
