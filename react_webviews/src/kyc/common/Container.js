import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'

import Header from './Header'
import Footer from './footer'
import loader_fisdom from 'assets/loader_gif_fisdom.gif'
import loader_myway from 'assets/loader_gif_myway.gif'
import { nativeCallback } from 'utils/native_callback'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core'
import '../../utils/native_listner'
import { getConfig, setHeights } from 'utils/functions'
import { isFunction } from '../../utils/validators'

const Container = (props) => {
  const [openDialog, setOpenDialog] = useState(props?.showDialog || false)
  const x = React.useRef(true)
  const loaderMain =
    getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
  const inPageTitle = true

  const historyGoBack = (backData) => {
    let { params } = props.location

    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' })
      return
    }

    if (isFunction(props.goBack)) {
      return props.goBack(params)
    }
    nativeCallback({ events: getEvents('back') })
    props.history.goBack()
  }
  useEffect(() => {
    setHeights({ header: true, container: false })
    if (x.current) {
      x.current = false
    } else {
      if (getConfig().generic_callback) {
        window.callbackWeb.addEventListener({
          type: 'back_pressed',
          go_back: () => historyGoBack(),
        })
      } else {
        window.PlutusSdk.addEventListener({
          type: 'back_pressed',
          go_back: () => historyGoBack(),
        })
      }
    }
  }, [])

  const getEvents = (user_action) => {
    if (!this || !props || !props.events) {
      return
    }
    let events = props.events
    events.properties.user_action = user_action
    return events
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            onClick={handleClose}
            color="default"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const renderPageLoader = () => {
    if (props.showLoader) {
      return (
        <div
          className={`Loader ${
            props.loaderData ? props.loaderData.loaderClass : ''
          }`}
        >
          <div className="LoaderOverlay">
            <img src={loaderMain} alt="" />
            {props.loaderData && props.loaderData.loadingText && (
              <div className="LoaderOverlayText">
                {props.loaderData.loadingText}
              </div>
            )}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  const headerGoBack = () => {
    historyGoBack({ fromHeader: true })
  }

  let steps = []
  for (var i = 0; i < props.total; i++) {
    if (props.current > i) {
      steps.push(<span className="active" key={i}></span>)
    } else {
      steps.push(<span key={i}></span>)
    }
  }

  return (
    <div
      className={`ContainerWrapper   ${props.classOverRide}  ${
        getConfig().productName !== 'fisdom' ? 'blue' : ''
      }`}
    >
      {/* Header Block */}
      {!props.noHeader && !getConfig().hide_header && (
        <Header
          disableBack={props.disableBack}
          title={props.title}
          smallTitle={props.smallTitle}
          provider={props.provider}
          count={props.count}
          total={props.total}
          current={props.current}
          goBack={headerGoBack}
          edit={props.edit}
          type={getConfig().productName}
          rightIcon={props.rightIcon}
          handleRightIconClick={props.handleRightIconClick}
          inPageTitle={inPageTitle}
          force_hide_inpage_title={props.hideInPageTitle}
          style={props.styleHeader}
          className={props.classHeader}
          headerData={props.headerData}
        />
      )}

      {/* Below Header Block */}
      <div id="HeaderHeight" style={{ top: 56 }}>
        {/* Loader Block */}
        {renderPageLoader()}
      </div>

      {/*  */}

      {!props.hideInPageTitle && (
        <div
          id="header-title-page"
          style={Object.assign(props.styleHeader || {}, {
            padding: '0 20px',
          })}
          className={`header-title-page ${props.classHeader}`}
        >
          {inPageTitle && (
            <div
              className={`header-title-text-hni ${
                inPageTitle ? 'slide-fade-show' : 'slide-fade'
              }`}
              style={{ width: props.count ? '75%' : '' }}
            >
              {props.title}
            </div>
          )}

          {inPageTitle && props.count && (
            <span
              color="inherit"
              className={`${inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
              style={{ fontSize: 10 }}
            >
              <span style={{ fontWeight: 600 }}>{props.current}</span>/
              <span>{props.total}</span>
            </span>
          )}
        </div>
      )}

      {/* Children Block */}
      <div
        style={props.styleContainer}
        className={`
            Container 
            ${props.classOverRideContainer}
            ${props.noPadding ? 'no-padding' : ''}
          `}
      >
        {props.children}
      </div>

      {/* Footer Block */}
      {!props.noFooter && (
        <Footer
          noFooter={props.noFooter}
          fullWidthButton={props.fullWidthButton}
          buttonTitle={props.buttonTitle}
          buttonTitle2={props.buttonTitle2}
          handleClick={props.handleClick}
          handleClick2={props.handleClick2}
          onlyButton={props.onlyButton}
          disable={props.disable}
          buttonData={props.buttonData}
          isApiRunning={props.isApiRunning}
          twoButton={props.twoButton}
          buttonClassName={props.buttonClassName}
          buttonClassName2={props.buttonClassName2}
        />
      )}
      {/* No Internet */}
      {renderDialog()}
    </div>
  )
}

export default withRouter(Container)
