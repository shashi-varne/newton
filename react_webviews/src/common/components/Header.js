import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import {getConfig} from 'utils/functions';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';
import '../theme/Style.scss';

const headerIconMapper = {
  back: back_arrow,
  close: close_icn
}

const Header = ({ classes, title, count, total, current, goBack, 
  edit, type, resetpage, handleReset, smallTitle, disableBack, provider, 
  inPageTitle, force_hide_inpage_title, className ,style, headerData={}}) => (
  <AppBar position="fixed" color="primary" 
  className={`Header transition ${classes.root} ${inPageTitle ? 'header-topbar-white' : 'header-topbar-white'} ${className}`}
  style={style}
  >
    <Toolbar style={{height:'80px', display:'flex', alignItems:'flex-start'}}>
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
        <div className="progress-bar">
          <div className="head">
            {headerData.progressHeaderData.title}
          </div>
          <div style={{display:'flex', flexFlow:1}}>
            {headerData.progressHeaderData.steps.map((option,index) => (
              <div className="journey-progress" key={index}>
                <div className="indicator">
                  <hr className={`${index === 0 ? 'hr1' : 'hr2'}`} />
                  <span className="dot"></span>
                  <hr className={`${index === headerData.progressHeaderData.steps.length - 1 ? 'hr1' : 'hr2'}`} />
                </div>

                <div>{option.title}</div>
              </div>
            ))}
          </div>
        </div>


        {/* <div
        style={style}
          className={`${classes.flex},PageTitle main-top-title-header ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
        >
          {title}
        </div> */}
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
};

export default withStyles(styles)(Header);
