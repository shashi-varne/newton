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

const Header = ({ classes, title, count, total, current, goBack, edit, type, resetpage, handleReset, smallTitle, disableBack, provider, filterPgae, handleFilter }) => (
  <AppBar position="fixed" color="primary" className={`Header ${classes.root} ${(type !== 'fisdom') ? 'blue' : ''}`}>
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow />}
        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>
      <Typography variant="subheading" color="inherit" className={classes.flex}>
        {smallTitle && smallTitle !== undefined &&
          <div>
            <div style={{ fontWeight: 500 }}>{title}</div>
            <div style={{
              fontSize: 12, marginTop: -5,
              textTransform: smallTitle === 'HDFC' || smallTitle === 'IPRU' ? 'uppercase' : ''
            }}>
              {smallTitle === 'HDFC' &&
                'HDFC Life Click 2 Protect 3D Plus'}
              {smallTitle === 'IPRU' &&
                'ICICI Pru iProtect Smart'}
              {smallTitle !== 'HDFC' && smallTitle !== 'IPRU' &&
                smallTitle
              }
            </div>
          </div>}
        {!smallTitle &&

          title
        }
      </Typography>
      {resetpage &&
        <img onClick={handleReset}
          alt=""
          width={20}
          src={restart}
        />
      }

      {filterPgae &&
        <img onClick={handleFilter}
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
