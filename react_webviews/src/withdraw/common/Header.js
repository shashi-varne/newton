import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Arrow from '@material-ui/icons/ArrowBack'
import Close from '@material-ui/icons/Close'
import restart from 'assets/restart_nav_icn.svg'

const Header = ({
  classes,
  title,
  count,
  total,
  current,
  goBack,
  edit,
  type,
  resetpage,
  handleReset,
  smallTitle,
  disableBack,
  provider,
  topIcon,
  handleTopIcon,
}) => (
  <AppBar position="fixed" color="primary" className={`Header ${classes.root}`}>
    <Toolbar>
      <IconButton
        className={classes.menuButton}
        color="inherit"
        aria-label="Menu"
        onClick={goBack}
      >
        {!disableBack && <Arrow />}
        {(disableBack === true || disableBack === 'summary') && <Close />}
        {/* <Arrow /> */}
      </IconButton>
      <Typography
        variant="display1"
        style={{ fontSize: '18px', fontWeight: 500 }}
        color="inherit"
        className={classes.flex}
      >
        {smallTitle && smallTitle !== undefined && (
          <div>
            <div style={{ fontWeight: 500 }}>{title}</div>
            <div
              style={{
                fontSize: 11,
                marginTop: -5,
                textTransform: 'uppercase',
              }}
            >
              {smallTitle === 'HDFC' && 'HDFC Life Click 2 Protect 3D Plus'}
              {smallTitle === 'IPRU' && 'ICICI Pru iProtect Smart'}
              {smallTitle !== 'HDFC' && smallTitle !== 'IPRU' && smallTitle}
            </div>
          </div>
        )}
        {!smallTitle && title}
      </Typography>
      {resetpage && (
        <img onClick={handleReset} alt="" width={20} src={restart} />
      )}
      {topIcon === 'close' && <Close onClick={handleTopIcon} />}
      {!edit && count && (
        <span color="inherit">
          {current}/{total}
        </span>
      )}
    </Toolbar>
  </AppBar>
)

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
}

export default withStyles(styles)(Header)
