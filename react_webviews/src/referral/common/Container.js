import React, { Component , Fragment } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';

import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
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
  }

  componentWillUnmount() {
  
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {
    return (
      <div className="ReferralContainerWrapper">
        {/* Header Block */}
        <Header
          title={this.props.title}
          goBack={this.historyGoBack}
          type={getConfig().productName} />

        {/* Below Header Block */}
        <div style={{ height: 56 }}></div>

        {/* Loader Block */}
        {/* {this.renderPageLoader()} */}

        {/* Children Block */}
        <div className={`ReferralContainer ${this.props.classOverRideContainer}`}>
          {this.props.children}
        </div>

        {/* No Internet */}
        {/* {this.renderDialog()} */}
      </div>
    );
  }


  // render() {

  //   return(
  //     <Fragment>
  //     {this.commonRender()}
  //     </Fragment>
  //   )
  // }

};

export default withRouter(Container);
