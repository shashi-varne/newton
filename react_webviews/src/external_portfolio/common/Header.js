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


const headerIconMapper = {
  back: back_arrow,
  close: close_icn
}

const colorReplace = (code, headerData) => {
  let color = getConfig().styles.primaryColor;
  if (headerData && headerData.leftIconColor) {
    color = headerData.leftIconColor;
  }
  return (code.replace(/fill=".*?"/g, 'fill=' + color));
};

const Header = ({ classes, title, count, total, current, goBack, 
  edit, type, rightIcon, handleRightIconClick, smallTitle, disableBack, provider, 
  inPageTitle, force_hide_inpage_title, className ,style, headerData}) => (
  <AppBar
    position="fixed"
    color="primary" 
    className={`
      Header
      transition${classes.root} 
      ${inPageTitle ? 'header-topbar-white' : 'header-topbar-white'} 
      ${className}
    `}
    style={style}
  >
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && 
        <SVG
          preProcessor={(code) => colorReplace(code, headerData)}
          src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
        />
        }
        {(disableBack === true) && <Close />}
      </IconButton>

      <div>
        <div
          style={style}
          className={`
            ${classes.flex},PageTitle 
            main-top-title-header 
            ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} 
            ${className}
          `}
        >
          {title}
        </div>
      </div>
      {rightIcon &&
        <IconButton
          classes={{
            root: 'header-right-btn'
          }}
          color="inherit"
          aria-label="Menu"
          onClick={handleRightIconClick}
        >
          <SVG src={rightIcon}/>
        </IconButton>
      }
    </Toolbar>
  </AppBar>
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
