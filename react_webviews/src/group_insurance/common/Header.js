import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import restart from 'assets/restart_nav_icn.svg';
import filterIcon from 'assets/filter_nav_icon.png';

import {getConfig} from 'utils/functions';
import back_arrow from 'assets/back_arrow.svg';
import SVG from 'react-inlinesvg';
import close_icn from 'assets/close_icn.svg';

const headerIconMapper = {
  back: back_arrow,
  close: close_icn
}

const Header = ({ classes, title, count, total, current, goBack, edit, type, 
  resetpage, handleReset, smallTitle, disableBack, 
  provider, filterPgae, handleFilter, new_header, headerData,style, inPageTitle,className }) => (
  <AppBar position="fixed" color="primary" 
  className={`Header ${new_header ? 'transition' : ''} ${classes.root}  
  ${(type !== 'fisdom' && !new_header) ? 'blue' : ''}
  ${new_header ? 'header-topbar-white' : ''} ${className}`}
  style={style}>
    <Toolbar>
     {!new_header && <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow />}
        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>}
      {new_header && 
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && 
           <SVG
           preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
           src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
         />
        }
        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>
      }
     {!new_header &&
        <Typography variant="subheading" color="inherit" className={classes.flex}>
          {smallTitle && smallTitle !== undefined &&
            <div>
              <div style={{ fontWeight: 500 }}>{title}</div>
              <div style={{
                fontSize: 12, marginTop: -5,
                textTransform: smallTitle === 'HDFC' || smallTitle === 'Maxlife' || smallTitle === 'IPRU' ? 'uppercase' : ''
              }}>
                {smallTitle === 'HDFC' &&
                  'HDFC Life Click 2 Protect 3D Plus'}
                {smallTitle === 'IPRU' &&
                  'ICICI Pru iProtect Smart'}
                {smallTitle === 'Maxlife' &&
                  'Maxlife Online Term Plan Plus'}
                {smallTitle !== 'HDFC' && smallTitle !== 'IPRU' && smallTitle !== 'Maxlife' &&
                  smallTitle
                }
              </div>
            </div>}
          {!smallTitle &&

            title
          }
        </Typography>
      }

      {new_header && 
        <div>
          <div
          style={style}
            className={`${classes.flex},PageTitle main-top-title-header ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
          >
            {smallTitle && smallTitle !== undefined &&
            <div>
              <div style={{ fontWeight: 500 }}>{title}</div>
              <div style={{
                fontSize: 12, marginTop: -5,
                textTransform: smallTitle === 'HDFC' || smallTitle === 'Maxlife' || smallTitle === 'IPRU' ? 'uppercase' : ''
              }}>
                {smallTitle === 'HDFC' &&
                  'HDFC Life Click 2 Protect 3D Plus'}
                {smallTitle === 'IPRU' &&
                  'ICICI Pru iProtect Smart'}
                {smallTitle === 'Maxlife' &&
                  'Maxlife Online Term Plan Plus'}
                {smallTitle !== 'HDFC' && smallTitle !== 'IPRU' && smallTitle !== 'Maxlife' &&
                  smallTitle
                }
              </div>
            </div>}
            {!smallTitle &&

              title
            }
          </div>
        </div>
      }
      {resetpage &&
        <img className="pointer" onClick={handleReset}
          alt=""
          width={20}
          src={restart}
        />
      }

      {filterPgae &&
        <img className="pointer" onClick={handleFilter}
          alt=""
          width={20}
          src={filterIcon}
        />
      }
      {!edit && count &&
        <span color="inherit">
          <span style={{ fontWeight: 600 }}>{current}</span>/<span>{total}</span>
        </span>}
    </Toolbar>
  </AppBar>
);

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default withStyles(styles)(Header);
