import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from './Header';
import loader from 'assets/loader_gif.gif';
import { nativeCallback } from 'utils/native_callback';

class Container extends Component {
  constructor(props) {
    super();
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/referral":
        nativeCallback({ action: 'native_back' });
        break;
      default:
        this.props.history.goBack();
    }
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
          goBack={this.historyGoBack} />

        {/* Below Header Block */}
        <div style={{height: 56}}></div>

        {/* Loader Block */}
        {this.renderPageLoader()}

        {/* Children Block */}
        <div className={`ReferralContainer ${this.props.background}`}>
          { this.props.children }
        </div>
      </div>
    );
  }
};

export default withRouter(Container);
