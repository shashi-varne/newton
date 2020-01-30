import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
// import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';

const Header = ({ classes, title, count, total, current, goBack, edit, type, resetpage, handleReset, smallTitle, disableBack, provider,inPageTitle }) => (
  <AppBar position="fixed" color="primary" className={`Header transition ${classes.root} ${inPageTitle ? 'header-topbar-white': 'header-topbar-white'}`}>
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={goBack}>
        {!disableBack && <Arrow color={inPageTitle ? "secondary" : "secondary"} />}
        {(disableBack === true) && <Close />}
      </IconButton>
     
     
      <div 
      className={`${classes.flex},PageTitle main-top-title-new2 ${inPageTitle ? 'slide-fade': 'slide-fade-show'}`}
      >

        {title}
      </div>
      
    </Toolbar>
    <div id="header-title-page" className={`header-title-page ${inPageTitle ? 'slide-fade-show': 'slide-fade'}`}>
    {title}
    </div>
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
