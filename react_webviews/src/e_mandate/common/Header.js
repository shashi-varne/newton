import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import restart from 'assets/restart_nav_icn.svg';

const Header = ({ classes, title, count, total, current, goBack, edit, type, resetpage, handleReset, smallTitle, disableBack, provider, topIcon, handleTopIcon, noBack }) => (
  <AppBar position="fixed" color="primary" className={`Header ${classes.root}`}>
    <Toolbar>
      {!noBack && 
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow />}
        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>
      }
      <Typography variant="subheading" color="inherit" className={classes.flex}>
        {title}
      </Typography>
      {resetpage &&
        <img onClick={handleReset}
          alt=""
          width={20}
          src={restart}
        />
      }
      {topIcon === 'close' && <Close onClick={handleTopIcon} />}
      
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
    marginLeft: '-12px !important',
    marginRight: '7px !important',
  },
};

export default withStyles(styles)(Header);
