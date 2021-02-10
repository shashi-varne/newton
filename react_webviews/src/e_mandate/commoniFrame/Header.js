import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons//Close';
import restart from 'assets/restart_nav_icn.svg';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import Active from 'material-ui-customizable-icons/Active';

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
        {!disableBack && <ChevronLeftIcon />}

            {/* {!disableBack && <Active className={classes.menuButton} style={style} transform={transform} pallet={pallet}
              style={{
                width: '48px',
                height: '48px'
              }}
              transform='scale(2)'
              className='ChevronLeft'
              pallet={{
                circle: 'rgba(169, 169, 169, 1)',
                tick: 'rgba(255, 255, 255, 1)',
              }}
            />} */}

        {(disableBack === true || disableBack === 'summary') && <Close />}
      </IconButton>
      }
     <img src={ require(`assets/finity/moneycontrol_logo.svg`)} style={{ marginTop: '20px', marginBottom: '20px'}} alt=""/>
     <img src={ require(`assets/finity/Finity_Logo.svg`)} style={{paddingRight: '40px', marginTop: '32px', marginBottom: '32px'}} alt=""/>
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


const className = 'ChevronLeft';
const viewBox = '0 0 48 48';
const transform = 'scale(2)';
const style = {
  width: '48px',
  height: '48px',
};
const pallet = {
  circle: 'rgba(169, 169, 169, 1)',
  tick: 'rgba(255, 255, 255, 1)',
};





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
