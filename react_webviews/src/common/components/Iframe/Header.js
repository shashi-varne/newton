import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';
import '../../theme/Style.scss';
import './style.scss';
import { storageService } from '../../../utils/validators';
import { getConfig } from '../../../utils/functions';
const headerIconMapper = {
  back: back_arrow,
  close: close_icn,
};

const Header = ({
  classes,
  title,
  count,
  total,
  current,
  goBack,
  edit,
  type,
  resetpage,
  handleReset,
  smallTitle,
  disableBack,
  provider,
  inPageTitle,
  force_hide_inpage_title,
  topIcon,
  handleTopIcon,
  className,
  style,
  headerData = {},
  new_header,
}) => {
  return <AppBar position='fixed' color='primary' classes={{ root: classes.root }}>
    <Toolbar classes={{ root: classes.toolbarRoot }}>
      <div
        className='iframe-top-action-button'
        color='inherit'
        aria-label='Menu'
        onClick={headerData.goBack || goBack}
      >
        {!disableBack && !headerData.hide_icon && (
          <SVG
            preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=white')}
            src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
          />
        )}
        {(disableBack === true || disableBack === 'summary') && !headerData.hide_icon && <Close />}
      </div>

      <div>
        <img
          src={require(`assets/finity/moneycontrol_logo.svg`)}
          className={classes.img}
          alt='moneycontrol'
        />
      </div>

      <div>
        <img
          src={require(`assets/finity_white_logo_2.png`)}
          alt=''
        />
      </div>
    </Toolbar>
  </AppBar>
};

const styles = {
  root: {
    flexGrow: 1,
    height: '80px',
    boxShadow: 'none',
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
    paddingLeft: '80px !important',
    paddingRight: '80px !important',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
};

export default withStyles(styles)(Header);
