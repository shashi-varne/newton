import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { didMount, commonRender } from '../../common/components/container_functions';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
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

 render() {

    let props_base = {
      classOverRide : 'pr-main-container'
    }
    return(
      <Fragment>
      {this.commonRender(props_base)}
      </Fragment>
    )
  }

}

export default withRouter(Container);
