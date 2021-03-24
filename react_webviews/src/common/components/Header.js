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
import search from 'assets/search.png';
import '../theme/Style.scss';
import restart from 'assets/restart_nav_icn.svg';

const headerIconMapper = {
  back: back_arrow,
  close: close_icn,
  search: search,
  restart: restart
}

const Header = ({ classes, title, count, total, current, goBack, 
  edit, type, resetpage, handleReset, smallTitle, disableBack, provider, 
  inPageTitle, force_hide_inpage_title, topIcon, handleTopIcon, 
  className ,style, headerData={}, new_header}) => {
    const rightIcon = headerIconMapper[topIcon];
    return (
      <AppBar position="fixed" color="primary" 
      className={`Header transition ${classes.root} ${inPageTitle || new_header ? 'header-topbar-white' : ''} ${className || ''}`}
      style={style}
      >
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" 
          onClick={headerData.goBack ||
            goBack}>
            {!disableBack && !headerData.hide_icon &&
            <SVG
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + (new_header ? getConfig().primary : 'white'))}
              src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
            />
            }
            {(disableBack === true || disableBack === 'summary') && !headerData.hide_icon &&
            <Close />}
          </IconButton>

          <div>
            <div
            style={style}
              className={`${classes.flex},PageTitle ${new_header ? 'main-top-title-header' : 'main-top-title-header-old'} 
              ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
            >
              {title}
            </div>
          </div>
          {topIcon &&
            <SVG
            style={{marginLeft: 'auto', width:20}}
            onClick={handleTopIcon}
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + (new_header ? getConfig().primary : 'white'))}
            src={rightIcon}
          />
          }
        </Toolbar>
      </AppBar >
    )
  };

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    textAlign: '-webkit-center'
  },
  menuButton: {
    marginLeft: "-12px !important",
    // marginRight: 20,
  },
};

export default withStyles(styles)(Header);
