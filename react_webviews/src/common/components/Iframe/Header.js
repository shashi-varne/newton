import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import back_arrow from 'assets/iframe_back.svg';
import close_icn from 'assets/iframe_close.svg';
import '../../theme/Style.scss';
import './Header.scss';
import { getConfig } from 'utils/functions';
const headerIconMapper = {
  back: back_arrow,
  close: close_icn,
};

const config = getConfig();
const logo = config.logo;
const partnerCode = config.partner_code;
const partnerPrimaryColor = config.styles.primaryColor;
const isMobileDevice = config.isMobileDevice;
const isWeb = config.Web;
const isSdk = config.isSdk;
const Header = ({ classes, goBack, disableBack, headerData = {}, showIframePartnerLogo }) => {
  return (
    <AppBar
      position='fixed'
      color='primary'
      classes={{ root: classes.root }}
      className='IframeHeader'
    >
      <Toolbar classes={{ root: classes.toolbarRoot }}>
        <div
          className='iframe-top-action-button'
          color='inherit'
          aria-label='Menu'
          onClick={headerData.goBack || goBack}
        >
          {!disableBack && !headerData.hide_icon && (
            <SVG
              preProcessor={(code) =>
                code.replace(
                  /stroke=".*?"/g,
                  isMobileDevice ? `stroke=${partnerPrimaryColor}` : 'stroke=white'
                )
              }
              src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
            />
          )}
          {(disableBack === true || disableBack === 'summary') && !headerData.hide_icon && (
            <Close color={isMobileDevice ? 'primary': 'default'}/>
          )}
          {showIframePartnerLogo && isWeb && isMobileDevice && (
            <img
              src={require(`assets/finity/finity_navlogo.svg`)}
              alt='partnerLogo'
              height={25}
              style={{marginLeft: '15px'}}
            />
          )}
          {showIframePartnerLogo && isSdk && isMobileDevice && partnerCode === 'moneycontrol' &&(
            <img
              src={require(`assets/moneycontrol_sdk_logo.svg`)}
              alt='partnerLogo'
              height={16}
              style={{marginLeft: '15px'}}
            />
          )}
        </div>
        {!isMobileDevice && (
          <div>
            <img
              src={require(`assets/${logo}`)}
              className={classes.img}
              alt='partnerLogo'
              height={50}
            />
          </div>
        )}
        {partnerCode === 'moneycontrol' && !isMobileDevice ? (
          <div>
            <img style={{verticalAlign: "middle"}} src={require(`assets/finity_white_logo.svg`)} height="35" alt='' />
          </div>
        ) : (
          <div />
        )}
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  root: {
    flexGrow: 1,
    height: isMobileDevice ? '56px' : '80px',
    boxShadow: 'none',
    backgroundColor: isMobileDevice ? 'white' : `${partnerPrimaryColor} !important`,
  },
  flex: {
    flex: 1,
    textAlign: '-webkit-center',
  },
  menuButton: {
    marginLeft: '-12px !important',
    // marginRight: 20,
  },
  toolbarRoot: {
    display: 'flex',
    paddingLeft: isMobileDevice ? '0px' : '80px !important',
    paddingRight: isMobileDevice ? '0px' : '80px !important',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
};

export default withStyles(styles)(Header);
