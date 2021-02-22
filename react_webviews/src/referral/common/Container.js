import React, { Component , Fragment } from 'react';
import { withRouter } from 'react-router';

import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';

import {didmount ,commonRender} from '../../common/components/container_functions';


class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      productName: getConfig().productName
    }
    this.didmount = didmount.bind(this);
    this.commonRender =  commonRender.bind(this);
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

  componentDidMount() {

    this.didmount();
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
