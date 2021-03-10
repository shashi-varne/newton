import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
// import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons//Close';
import restart from 'assets/restart_nav_icn.svg';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const Header = ({ classes, title, count, total, current, width,goBack, edit, type, resetpage, handleReset, smallTitle, disableBack, provider, topIcon, handleTopIcon, noBack }) => (
   <AppBar position="fixed" color="primary" style={{width: width,}} className={classes.topBar} >
    <Toolbar>
      <Typography variant="subheading" color="inherit" className={classes.flex}>
        {smallTitle && smallTitle !== undefined &&
          <div>
            <div style={{ fontWeight: 500 }}>{title}</div>
          </div>}
         {!smallTitle && 
      <div style={{display: 'flex', justifyContent: 'space-between' , direction: 'row'}}>  
       <div style={{marginLeft: '5px' }}>
      {!noBack &&   
      <IconButton 
      className={classes.menuButton} 
      color="inherit" aria-label="Menu" onClick={goBack}
      >
        {!disableBack && <NavigateBeforeIcon className={classes.NavigateBeforeIcon} style={{ fontSize: 35 }} />}
        {(disableBack === true || disableBack === 'summary') && <Close style={{ fontSize: 35}}  className={classes.NavigateBeforeIcon} />}
      </IconButton>}
      </div>
    <img src={ require(`assets/finity/moneycontrol_logo.svg`)} className={classes.img} style={{ marginTop: '20px', marginBottom: '20px'}} alt=""/> 
    {<img src={ require(`assets/finity/Finity_Logo.svg`)} style={{paddingRight: '40px', marginTop: '32px', marginBottom: '32px'}} alt=""/> } 
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


const styles = function() { 
  var windowWidth = window.innerWidth;

  if (windowWidth > 425){
    return {
      root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
      menuButton: {
        marginLeft: '-12px !important',
        marginRight: '17px !important',
        height: '80px',
      },
      topBar: {
        backgroundColor: "#3792FC",
        width: "100%",
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
       paddingLeft: '3%'
      },
      NavigateBeforeIcon: {
        color: 'white',
        paddingLeft:'1%',
        marginLeft: '-5px'
      }
    }
  }else return {
    root: {
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: '-25px !important',
      marginRight: '17px !important',
      height: '80px',
    },
    topBar: {
      backgroundColor: 'white',
      width: "100%",
      height: '60px',
      border: '1px solid white',
      paddingLeft: '3%'
    },
    NavigateBeforeIcon: {
      color : "#3792FC",
      paddingLeft:'1%',
      marginLeft: '-5px'
    },

    img: {
      display: 'none'
    }

  }

}

export default withStyles(styles)(Header);
