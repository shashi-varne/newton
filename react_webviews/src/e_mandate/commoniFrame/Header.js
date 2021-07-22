import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';
import SVG from 'react-inlinesvg';
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
              paddingLeft: '23px',
              paddingRight: '10px',
              justifyContent: 'space-between',
              direction: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div onClick={goBack} style={{ cursor: 'pointer',marginLeft:"10px" }}>
              {disableBack || disableBack === 'summary' ? (
                <SVG
                  preProcessor={(code) => code.replace(/fill=".*?"/g, (s) => 'fill=white')}
                  src={close_icn}
                />
              ) : (
                <SVG
                  preProcessor={(code) => code.replace(/fill=".*?"/g, (s) => 'fill=white')}
                  src={back_arrow}
                />
              )}
            </div>

            <img
              src={require(`assets/moneycontrol_logo.svg`)}
              className={classes.img}
              style={{ marginTop: '20px', marginBottom: '20px' }}
              alt=''
            />
            {
              <img
                src={require(`assets/finity/finity_logo_white_moneycontrol.svg`)}
                style={{ paddingRight: '40px', marginTop: '32px', marginBottom: '32px' }}
                height="35"
                alt=''
              />
            }
          </div>
        </Toolbar>
      ) : (
        <div onClick={goBack}>
          {disableBack || disableBack === 'summary' ? (
            <SVG
              preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=#3792FC')}
              src={close_icn}
            />
          ) : (
            <SVG
              preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=#3792FC')}
              src={back_arrow}
            />
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
        backgroundColor: getConfig().primary,
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
        justifyContent: 'center',
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
