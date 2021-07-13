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
const logo = getConfig().logo;
const partnerCode = getConfig().partner_code;
const partnerPrimaryColor = getConfig().styles.primaryColor;
const isMobileDevice = getConfig().isMobileDevice;
const Header = ({ classes, goBack, disableBack, headerData = {} }) => {
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
            <img style={{verticalAlign: "middle"}} src={require(`assets/finity_white_logo.png`)} height="35" alt='' />
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
