import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
// import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
// import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import {getConfig} from 'utils/functions';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';


const headerIconMapper = {
  back: back_arrow,
  close: close_icn
}

const Header = ({ classes, title, count, total, current, goBack, 
  edit, type, resetpage, handleReset, smallTitle, disableBack, provider, 
  inPageTitle, force_hide_inpage_title, className ,style, headerData}) => (
  <AppBar position="fixed" color="primary" 
  className={`Header transition ${classes.root} ${inPageTitle ? 'header-topbar-white' : 'header-topbar-white'} ${className}`}
  style={style}
  >
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && 
        // <Arrow color={inPageTitle ? "secondary" : "secondary"} />
        <SVG
          preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
          src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
        />
        }
        {(disableBack === true) && <Close />}
      </IconButton>


      {/* {!force_hide_inpage_title &&  */}
      <div>
        <div
        style={style}
          className={`${classes.flex},PageTitle main-top-title-header ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
        >

          {title}
        </div>
        {/* {!inPageTitle && count &&
          <span color="inherit">
            <span style={{ fontWeight: 600 }}>{current}</span>/<span>{total}</span>
          </span>} */}
      </div>
      {/* } */}
    </Toolbar>

    
   {/* {!force_hide_inpage_title &&
     <div id="header-title-page"
     style={style} 
     className={`header-title-page ${inPageTitle ? 'slide-fade-show' : 'slide-fade'} ${className}`}>
      <div className="header-title-page-text" style={{width: count ? '75%': ''}}>
        {title}
      </div>
      {inPageTitle && count &&
        <span color="inherit" style={{ fontSize: 10 }}>
          <span style={{ fontWeight: 600 }}>{current}</span>/<span>{total}</span>
        </span>}
      </div>
    } */}


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
