import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';

import Header from '../../common/components/Header';
import Footer from '../../common/components/footer';
// import loader_fisdom from 'assets/loader_gif_fisdom.gif';
// import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from 'utils/native_callback';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import '../../utils/native_listener';
import { getConfig, setHeights } from 'utils/functions';
// import {checkStringInString, storageService} from 'utils/validators';
import { isFunction } from '../../utils/validators';

import './Style.scss';
import UiSkelton from '../../common/ui/Skelton';
import IframeHeader from 'common/components/Iframe/Header';
import { isNewIframeDesktopLayout } from '../../utils/functions';
const Container = (props) => {
  const config = getConfig();
  const iframe = config.isIframe;
  const isMobileDevice = config.isMobileDevice;
  const newIframeDesktopLayout = isNewIframeDesktopLayout();
  const [openDialog, setOpenDialog] = useState(false);
  const x = React.useRef(true);
  // const loaderMain = getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom;
  const inPageTitle = true;

  const historyGoBack = (backData) => {
    // let fromHeader = backData ? backData.fromHeader : false;
    // let pathname = this.props.history.location.pathname;
    let { params } = props.location;

    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' });
      return;
    }

    if (isFunction(props.goBack)) {
      return props.goBack(params);
    }
    nativeCallback({ events: getEvents('back') });
    props.history.goBack();
  };
  useEffect(() => {
    setHeights({ header: true, container: false });
    if (x.current) {
      x.current = false;
    } else {
      window.callbackWeb.addEventListener({
        type: 'back_pressed',
        go_back: () => historyGoBack(),
      });
    }
  }, []);

  const getEvents = (user_action) => {
    if (!this || !props || !props.events) {
      return;
    }
    let events = props.events;
    events.properties.user_action = user_action;
    return events;
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>Check your connection and try again.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className='DialogButtonFullWidth' onClick={handleClose} color='default' autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // const renderPageLoader = () => {
  //   if (props.showLoader) {
  //     return (
  //       <div className={`Loader ${props.loaderData ? props.loaderData.loaderClass : ''}`}>
  //         <div className='LoaderOverlay'>
  //           <img src={loaderMain} alt='' />
  //           {props.loaderData && props.loaderData.loadingText && (
  //             <div className='LoaderOverlayText'>{props.loaderData.loadingText}</div>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  const headerGoBack = () => {
    historyGoBack({ fromHeader: true });
  };

  let steps = [];
  for (var i = 0; i < props.total; i++) {
    if (props.current > i) {
      steps.push(<span className='active' key={i}></span>);
    } else {
      steps.push(<span key={i}></span>);
    }
  }

  return (
    <div
      className={`${newIframeDesktopLayout ? 'iframeContainerWrapper' : (iframe && config.code === "bfdlmobile") ? 'bfdlContainerWrapper' : 'ContainerWrapper'}   ${props.classOverRide}  ${
        config.productName !== 'fisdom' ? 'blue' : ''
      }`}
    >
      {/* Header Block */}
      {!props.noHeader && !getConfig().hide_header && !newIframeDesktopLayout ?(
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
          new_header={true}
        />
      )
      :
      (
        <IframeHeader
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
      )
    }

      {/* Below Header Block */}
      {
        (!newIframeDesktopLayout)&&
        <div id='HeaderHeight' style={{ top: 56 }}>
        {/* Loader Block */}
        {/* {renderPageLoader()} */}
      </div>
      }

      {/*  */}

      {!props.hideInPageTitle && (
        <div
          id='header-title-page'
          style={Object.assign(props.styleHeader || {}, {
            padding: '0 20px',
          })}
          className={`header-title-page ${props.classHeader}`}
        >
          {inPageTitle && (
            <div
              className={`header-title-text-hni ${inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
              style={{ width: props.count ? '75%' : '' }}
            >
              {props.title}
            </div>
          )}

          {inPageTitle && props.count && (
            <span
              color='inherit'
              className={`${inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
              style={{ fontSize: 10 }}
            >
              <span style={{ fontWeight: 600 }}>{props.current}</span>/<span>{props.total}</span>
            </span>
          )}
        </div>
      )}

      {props.skelton &&
        <div className="Loader" style={!config.isMobileDevice ? {top: "120px"} : {top: "56px"}}>
          <UiSkelton type={props.skelton} />
        </div>
      }

      {/* Children Block */}
      {!props.skelton &&
        <div
          style={props.styleContainer}
          className={`
            ${iframe && !isMobileDevice ? 'IframeContainer' :'Container'} 
            ${props.classOverRideContainer}
            ${props.noPadding ? 'no-padding' : ''}
          `}
        >
          <div className= 'fadein-animation'>
            {props.children}
          </div>
        </div>
      }

      {/* Footer Block */}
      {!props.noFooter && !props.skelton && (
        <Footer
          noFooter={props.noFooter}
          fullWidthButton={props.fullWidthButton}
          buttonTitle={props.buttonTitle}
          handleClick={props.handleClick}
          handleClick2={props.handleClick2}
          onlyButton={props.onlyButton}
          disable={props.disable}
          buttonData={props.buttonData}
          twoButton={props.twoButton}
          buttonTitle2={props.buttonTitle2}
          showLoader={props.showLoader}
          dualbuttonwithouticon={props.dualbuttonwithouticon}
          buttonOneTitle={props.buttonOneTitle}
          buttonTwoTitle={props.buttonTwoTitle}
          handleClickOne={props.handleClickOne}
          handleClickTwo={props.handleClickTwo}
          {...props}
        />
      )}
      {/* No Internet */}
      {renderDialog()}
    </div>
  );
};

export default withRouter(Container);

//////////////   NEW CONTAINER      ////////////////////////

// import React, { Component, Fragment } from "react";
// import { withRouter } from "react-router";
// import {
//   didMount,
//   commonRender,
// } from "../../common/components/container_functions";
// import { nativeCallback } from "utils/native_callback";
// import "../../utils/native_listener";
// import "./Style.scss"
// import { isFunction } from "../../utils/validators";

// class Container extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       openDialog: false,
//       openPopup: false,
//       popupText: "",
//       callbackType: "",
//       inPageTitle: true,
//       force_hide_inpage_title: this.props.hidePageTitle,
//       new_header: true,
//       project: "fund-details", //to use in common functions
//     };
//     this.historyGoBack = this.historyGoBack.bind(this);
//     this.handleTopIcon = this.handleTopIcon.bind(this);

//     this.didMount = didMount.bind(this);
//     this.commonRender = commonRender.bind(this);
//   }


//   componentDidMount() {
//     this.didMount();
//   }

//   historyGoBack = (backData) => {
//     let fromHeader = backData ? backData.fromHeader : false;
//     let pathname = this.props.history.location.pathname;
//     let { params } = this.props.location;

//     if (params && params.disableBack) {
//       nativeCallback({ action: 'exit' });
//       return;
//     }

//     if (isFunction(this.props.goBack)) {
//       return this.props.goBack(params);
//     }
//     nativeCallback({ events: this.getEvents('back') });
//     this.props.history.goBack();
//   };

//   componentWillUnmount() {
//     this.unmount();
//   }

//   handleTopIcon = () => {
//     this.props.handleTopIcon();
//   };

//   componentDidUpdate(prevProps) {
//     this.didupdate();
//   }

//   render() {
//     let props_base = {
//       classOverRide: "loanMainContainer",
//     };
//     return <Fragment>{this.commonRender(props_base)}</Fragment>;
//   }
// }

// export default withRouter(Container);
