import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';

const Header = ({ classes, title, count, total, current, goBack, edit, type, rightIcon, resetpage, handleReset, disableBack }) => (
  <AppBar position="fixed" color="primary" className={`Header ${classes.root} ${(type !== 'fisdom') ? 'blue' : ''}`}>
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow />}
        {disableBack == true && <Close />}
      </IconButton>
      <Typography variant="subheading" color="inherit" className={classes.flex}>
        {title}
      </Typography>
      {rightIcon == 'close' && <Close />}
      {resetpage &&
        // <img onClick={handleReset}
        //   alt=""
        //   width={20}
        //   src={restart}
        // />
        <Delete onClick={handleReset} />
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
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default withStyles(styles)(Header);
