import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';

const Header = ({ classes, title, count, total, current, goBack }) => (
  <div className={classes.root}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
          <Arrow />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          { title }
        </Typography>
        { count && <span color="inherit">{current}/{total}</span> }
      </Toolbar>
    </AppBar>
  </div>
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
