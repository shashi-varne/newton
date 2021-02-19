import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import { getConfig } from 'utils/functions';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';
import '../theme/Style.scss';

const headerIconMapper = {
  back: back_arrow,
  close: close_icn
}

const Header = ({ classes, title, count, total, current, goBack,
  edit, type, resetpage, handleReset, smallTitle, disableBack, provider,
  inPageTitle, force_hide_inpage_title, className, style, headerData = {} }) => (
    <AppBar position="fixed" color="primary"
      className={`Header transition ${classes.root} ${inPageTitle ? 'header-topbar-white' : 'header-topbar-white'} ${className}`}
      style={style}
    >
      <Toolbar
        className={headerData.progressHeaderData && classes.headerWithData}
      >
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={headerData.goBack ||
          goBack}>
          {!disableBack && !headerData.hide_icon &&
            <SVG
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
              src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
            />
          }
          {(disableBack === true) && !headerData.hide_icon &&
            <Close />}
        </IconButton>

        <div className="toolbar-title">
          {headerData.progressHeaderData && <div className="progress-bar">
            <div className="head">
              {headerData.progressHeaderData.title}
            </div>
            <div style={{ display: 'flex', flexFlow: 1 }}>

              {headerData.progressHeaderData.steps.map((step, index) => (
                <div className="journey-header-progress" key={index}>
                  <div className="indicator">
                    {/* <div className  = {index === 0 ? 'tiny-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'large-hr' : 'hr'} >
                      <hr className={`${index === 0 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index - 1].status}`
                      }`} /></div>
                    <span className={`dot ${step.status}`}></span>
                    <div className={index === 0 ? 'large-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'tiny-hr' : 'hr'} 
                      
                      ><hr className={`${index === headerData.progressHeaderData.steps.length - 1 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index].status}`
                      }`}  /></div> */}
                    <div className  = {index === 0 ? 'tiny-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'large-hr' : 'hr'} >
                      <div className={`${index === 0 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index - 1].status}`
                      }`} ></div></div>
                    <span className={`dot ${step.status}`}></span>
                    <div className={index === 0 ? 'large-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'tiny-hr' : 'hr'} 
                      
                      ><div className={`${index === headerData.progressHeaderData.steps.length - 1 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index].status}`
                      }`}  ></div></div>
                  </div>
                  <div
                  style = {{
                    marginLeft : index === 0 ? '-40%' : index === headerData.progressHeaderData.steps.length - 1 ? '50%' : '0',
                    color: `${step.status === 'init' ? '#0A1D32' : '#C4C4C4'}`
                  }}
                  >{step.title}</div>
                </div>
              ))}
            </div>
          </div>}


          {!headerData.progressHeaderData && <div
            style={style}
            className={`${classes.flex},PageTitle main-top-title-header ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
          >
            {title}
          </div>}
        </div>
      </Toolbar>
    </AppBar >
  );

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    textAlign: '-webkit-center'
  },
  menuButton: {
    marginLeft: -12,
    // marginRight: 20,
  },
  headerWithData: {
    height: '80px',
    display: 'flex',
    alignItems: 'flex-start'
  }
};

export default withStyles(styles)(Header);
