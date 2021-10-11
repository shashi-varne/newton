import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { didMount, commonRender } from 'common/components/container_functions';
import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listener';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openDialog: false,
      openPopup: false,
      callbackType: '',
      inPageTitle: true,
      new_header: true,
      force_hide_inpage_title: false,
      project: 'account-statements',
    }

    this.didMount = didMount.bind(this)
    this.commonRender = commonRender.bind(this)
  }

  componentDidMount() {
    this.didMount()
  }

  componentWillUnmount() {
    this.unmount()
  }

  componentDidUpdate(prevProps) {
    this.didupdate()
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true })
  }

  historyGoBack = () => {
    if (this?.props?.headerData && this?.props?.headerData?.goBack) {
      this.props.headerData.goBack()
      return
    }

    let action = 'back'
    nativeCallback({ events: this.getEvents(action) })

    const goBackPath = this.props.location?.state?.goBack || "";

    if (goBackPath) {
      this.navigate(goBackPath);
      return;
    }

    this.props.history.goBack();
  }

  render() {
    return <Fragment>{this.commonRender()}</Fragment>
  }
}

export default withRouter(Container)
