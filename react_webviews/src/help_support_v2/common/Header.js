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
import 'common/theme/Style.scss';

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
    <Toolbar>
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

      <div>
        <div
        style={style}
          className={`${classes.flex},PageTitle main-top-title-header ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
        >
          {title}
        </div>
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
