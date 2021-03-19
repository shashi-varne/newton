import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import restart from 'assets/restart_nav_icn.svg';
import back_arrow from 'assets/back_white.svg';
import close from 'assets/close_white.svg';
import close_blue from 'assets/close_blue.svg';
import back_blue from 'assets/back_blue.svg';
import { getConfig } from 'utils/functions';

const Header = ({ classes, width, goBack, resetpage, handleReset, disableBack }) => {
  const isMobile = getConfig().isMobileDevice;
  return (
    <AppBar position='fixed' color='primary' style={{ width: width }} className={classes.topBar}>
      {!isMobile ? (
        <Toolbar>
          <div
            style={{
              display: 'flex',
              paddingLeft: '26px',
              paddingRight: '10px',
              justifyContent: 'space-between',
              direction: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div onClick={goBack}>
              {!disableBack && <img src={back_arrow} alt='back' style={{ cursor: 'pointer' }} />}
              {(disableBack === true || disableBack === 'summary') && (
                <img src={close} alt='close' style={{ cursor: 'pointer' }} />
              )}
            </div>
            <img
              src={require(`assets/finity/moneycontrol_logo.svg`)}
              className={classes.img}
              style={{ marginTop: '20px', marginBottom: '20px' }}
              alt=''
            />
            {
              <img
                src={require(`assets/finity_white_logo_2.png`)}
                style={{ paddingRight: '40px', marginTop: '32px', marginBottom: '32px' }}
                alt=''
              />
            }
            {resetpage && <img onClick={handleReset} alt='' width={20} src={restart} />}
          </div>
        </Toolbar>
      ) : (
        <div onClick={goBack} style={{ marginLeft: '-7px' }}>
          {!disableBack && <img src={back_blue} alt='back' style={{ cursor: 'pointer' }} />}
          {(disableBack === true || disableBack === 'summary') && (
            <img src={close_blue} alt='close' style={{ cursor: 'pointer' }} />
          )}
        </div>
      )}
    </AppBar>
  );
};

const styles = function () {
  var windowWidth = window.innerWidth;

  if (windowWidth > 425) {
    return {
      root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
      menuButton: {
        marginLeft: '-12px !important',
        marginRight: '17px !important',
        height: '80px',
      },
      topBar: {
        backgroundColor: '#3792FC',
        width: '100%',
        height: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '3%',
      },
      NavigateBeforeIcon: {
        color: 'white',
        paddingLeft: '1%',
        marginLeft: '-5px',
      },
    };
  } else
    return {
      root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
      menuButton: {
        marginLeft: '-25px !important',
        marginRight: '17px !important',
        height: '80px',
      },
      topBar: {
        backgroundColor: 'white',
        width: '100%',
        height: '60px',
        border: '1px solid white',
        paddingLeft: '3%',
      },
      NavigateBeforeIcon: {
        color: '#3792FC',
        paddingLeft: '1%',
        marginLeft: '-5px',
      },

      img: {
        display: 'none',
      },
    };
};

export default withStyles(styles)(Header);
