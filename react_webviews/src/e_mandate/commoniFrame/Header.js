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
  <AppBar position="fixed" color="primary" className={`${classes.topBar}`}>
    <Toolbar>
      <Typography variant="subheading" color="inherit" className={classes.flex}>
        {smallTitle && smallTitle !== undefined &&
          <div>
            <div style={{ fontWeight: 500 }}>{title}</div>
          </div>}
         {!smallTitle && 
      <div style={{display: 'flex', justifyContent: 'space-between' , direction: 'row'}}>  
      {!noBack && 
      <IconButton 
      className={classes.menuButton} 
      color="inherit" aria-label="Menu" onClick={goBack}
      >
        {!disableBack && <Arrow />}
        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>
      }
      <span style={{marginTop: '32px', marginBottom: '32px',}}> {title} </span>
      <span style={{marginTop: '32px', marginBottom: '32px',}}>finity</span>
        </div>}
      </Typography>
      {resetpage &&
        <img onClick={handleReset}
          alt=""
          width={20}
          src={restart}
        />
      }
      {topIcon === 'close' && <Close onClick={handleTopIcon} />}
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
  },
  menuButton: {
    marginLeft: '-12px !important',
    marginRight: '7px !important',
    height: '80px'
  },

  topBar: {
    backgroundColor: "#3792FC", 
    // width: "100%",
    height: '80px',
    display: 'flex', 
    justifyContent: 'space-between'
  }

};

export default withStyles(styles)(Header);
