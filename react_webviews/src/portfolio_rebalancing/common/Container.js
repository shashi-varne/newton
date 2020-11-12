import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router';

import Header from './Header';

import Footer from './footer';

import loader_fisdom from 'assets/loader_gif_fisdom.gif';

import loader_myway from 'assets/loader_gif_myway.gif';

import { nativeCallback } from 'utils/native_callback';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import '../../utils/native_listner';

import { getConfig, setHeights } from 'utils/functions';

// import {checkStringInString, storageService} from 'utils/validators';

import { isFunction } from '../../utils/validators';

import './Style.scss';

const Container = (props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);

  const [popupText, setPopupText] = useState('');

  const [loaderMain, setLoaderMain] = useState(
    getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
  );

  const [inPageTitle, setInPageTitle] = useState(true);

  const x = React.useRef(true);

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
      if (getConfig().generic_callback) {
        window.callbackWeb.addEventListener({
          type: 'back_pressed',

          go_back: () => historyGoBack(),
        });
      } else {
        window.PlutusSdk.addEventListener({
          type: 'back_pressed',

          go_back: () => historyGoBack(),
        });
      }
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

    setOpenPopup(false);
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

  const handlePopup = () => {
    setOpenPopup(false);

    nativeCallback({ action: 'native_back', events: getEvents('back') });
  };

  const renderPopup = () => {
    return (
      <Dialog
        fullScreen={false}
        open={openPopup}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        {/* <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle> */}

        <DialogContent>
          <DialogContentText>{popupText}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='default'>
            No
          </Button>

          <Button onClick={handlePopup} color='default' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderPageLoader = () => {
    if (props.showLoader) {
      return (
        <div className={`Loader ${props.loaderData ? props.loaderData.loaderClass : ''}`}>
          <div className='LoaderOverlay'>
            <img src={loaderMain} alt='' />

            {props.loaderData && props.loaderData.loadingText && (
              <div className='LoaderOverlayText'>{props.loaderData.loadingText}</div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const headerGoBack = () => {
    historyGoBack({ fromHeader: true });
  };
  const navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search,
    });
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
      className={`ContainerWrapper ${props.classOverRide}  ${
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
          goBack={props.goBack || headerGoBack}
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

      <div id='HeaderHeight' style={{ top: 56 }}>
        {/* Loader Block */}

        {renderPageLoader()}
      </div>

      {/*  */}

      {/* {!props.hideInPageTitle && (
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
      )} */}

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
      {props.helpContact && (
        <section className='help-container '>
          <Typography className='help-text'>For any help, reach us at</Typography>
          <div className='help-contact-email flex'>
            <Typography className='help-contact'>+80-30-408363</Typography>
            <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
            <Typography className='help-email'>{'ask@fisdom.com'.toUpperCase()}</Typography>
          </div>
        </section>
      )}
      {!props.noFooter && (
        <Footer
          noFooter={props.noFooter}
          fullWidthButton={props.fullWidthButton}
          logo={props.logo}
          buttonTitle={props.buttonTitle}
          provider={props.provider}
          premium={props.premium}
          paymentFrequency={props.paymentFrequency}
          edit={props.edit}
          resetpage={props.resetpage}
          handleClick={props.handleClick}
          handleClick2={props.handleClick2}
          handleReset={props.handleReset}
          onlyButton={props.onlyButton}
          disable={props.disable}
          withProvider={props.withProvider}
          buttonData={props.buttonData}
          FixedBottomFooter={props.FixedBottomFooter}
        />
      )}

      {/* No Internet */}

      {renderDialog()}

      {renderPopup()}
    </div>
  );
};

export default withRouter(Container);
