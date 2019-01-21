import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';

const Header = ({ classes, title, count, total, current, goBack, edit, type, resetpage, handleReset, smallTitle, disableBack, provider }) => (
  <AppBar position="fixed" color="primary" className={`Header ${classes.root} ${(type !== 'fisdom') ? 'blue' : ''}`}>
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow />}
        {(disableBack === true) && <Close />}
      </IconButton>
      <Typography variant="subheading" color="inherit" className={classes.flex, 'PageTitle'}>
        {smallTitle && smallTitle !== undefined &&
          smallTitle
        }
        {!smallTitle &&
          title
        }
      </Typography>
      {resetpage &&
        <img onClick={handleReset}
          alt=""
          width={20}
        />
      }
      {!edit && count && <span color="inherit">{current}/{total}</span>}
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
