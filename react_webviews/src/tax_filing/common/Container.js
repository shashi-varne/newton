import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'

import { didMount, commonRender } from 'common/components/container_functions'
import { nativeCallback } from 'utils/native_callback'
import '../../utils/native_listner'
import { trackBackButtonPress, untrackBackButtonPress } from './functions'

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
      project: 'tax-filing',
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
    let pathname = this.props.history.location.pathname

    if (this?.props?.headerData && this?.props?.headerData?.goBack) {
      switch (pathname) {
        case '/tax-filing':
          untrackBackButtonPress()
          nativeCallback({ action: 'exit', events: this.getEvents('exit') })
          break
        case '/tax-filing/steps':
          trackBackButtonPress(pathname)
          this.props.headerData.goBack()
          break
        case '/tax-filing/my-itr':
          trackBackButtonPress(pathname)
          this.props.headerData.goBack()
          break
        case '/tax-filing/faqs':
          trackBackButtonPress(pathname)
          this.props.headerData.goBack()
          break
        default:
          this.props.headerData.goBack()
          break
      }
    }

    let action = 'back'
    nativeCallback({ events: this.getEvents(action) })

    switch (pathname) {
      case '/tax-filing':
        untrackBackButtonPress()
        nativeCallback({ action: 'exit', events: this.getEvents('exit') })
        break
      case '/tax-filing/steps':
        trackBackButtonPress(pathname)
        this.props.history.goBack()
        break
      case '/tax-filing/my-itr':
        trackBackButtonPress(pathname)
        this.props.history.goBack()
        break
      case '/tax-filing/faqs':
        trackBackButtonPress(pathname)
        this.props.history.goBack()
        break
      default:
        this.props.history.goBack()
        break
    }
  }

  render() {
    return <Fragment>{this.commonRender()}</Fragment>
  }
}

export default withRouter(Container)
