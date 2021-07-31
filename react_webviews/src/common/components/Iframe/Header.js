import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
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
const Header = ({ classes, goBack, disableBack, headerData = {}, showIframePartnerLogo }) => {
  const config = getConfig();
  const logo = config.logo;
  const partnerCode = config.code;
  const partnerPrimaryColor = config.styles.primaryColor;
  const isMobileDevice = config.isMobileDevice;
  const isWeb = config.Web;
  const isSdk = config.isSdk;

  if(disableBack) {
    headerData.icon = "close"
  }

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
          {!headerData.hide_icon && (
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
              src={require(`assets/moneycontrol_logo.svg`)}
              alt='partnerLogo'
              height={20}
              style={{marginLeft: '15px'}}
            />
          )}
        </div>
        {!isMobileDevice && (
          <div>
            <img
              style={{verticalAlign: "middle"}}
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
    height: getConfig().isMobileDevice ? '56px' : '80px',
    boxShadow: 'none',
    backgroundColor: getConfig().isMobileDevice ? 'white' : `${getConfig().styles.primaryColor} !important`,
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
    paddingLeft: getConfig().isMobileDevice ? '0px' : '80px !important',
    paddingRight: getConfig().isMobileDevice ? '0px' : '80px !important',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
};

export default withStyles(styles)(Header);
