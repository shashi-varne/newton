import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import back_arrow from 'assets/iframe_back.svg';
import close_icn from 'assets/iframe_close.svg';
import '../../theme/Style.scss';
import './style.scss';
import { getConfig } from 'utils/functions';
const headerIconMapper = {
  back: back_arrow,
  close: close_icn,
};
const logo = getConfig().logo;
const partnerCode = getConfig().partner_code;
const partnerPrimaryColor = getConfig().styles.primaryColor;

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

  return (
    <AppBar position='fixed' color='primary' classes={{ root: classes.root }}>
      <Toolbar classes={{ root: classes.toolbarRoot }}>
        <div
          className='iframe-top-action-button'
          color='inherit'
          aria-label='Menu'
          onClick={headerData.goBack || goBack}
        >
          {!disableBack && !headerData.hide_icon && (
            <SVG
              preProcessor={(code) => code.replace(/stroke=".*?"/g, 'stroke=white')}
              src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
            />
          )}
          {(disableBack === true || disableBack === 'summary') && !headerData.hide_icon && (
            <Close />
          )}
        </div>

        <div>
          <img src={require(`assets/${logo}`)} className={classes.img} alt='moneycontrol' />
        </div>
        {
          partnerCode === 'moneycontrol' ?
          <div>
          <img src={require(`assets/finity_white_logo_2.png`)} alt='' />
        </div>
        :
        <div/>
        }
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  root: {
    flexGrow: 1,
    height: '80px',
    boxShadow: 'none',
    backgroundColor: `${partnerPrimaryColor} !important`
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
