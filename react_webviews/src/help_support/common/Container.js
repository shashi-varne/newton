import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { didMount, commonRender } from '../../common/components/container_functions';

import { nativeCallback } from 'utils/native_callback';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      project: 'help',
      inPageTitle: false,
      new_header: false
    }
    this.historyGoBack = this.historyGoBack.bind(this);
    this.didMount = didMount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
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

  render() {

    let  props_base = {
      classOverRideContainer: 'HelpContainer'
    }
    return(
      <Fragment>
      {this.commonRender(props_base)} 
      </Fragment>
    )
  }
};

export default withRouter(Container);
