import React, { useState } from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import SVG from 'react-inlinesvg';
import { getConfig } from 'utils/functions';
import back_arrow from 'assets/back_arrow.svg';
import close_icn from 'assets/close_icn.svg';
import search from 'assets/icon_search.svg';
import notificationLogo from 'assets/ic_notification.svg';
import notificationBadgeLogo from 'assets/ic_notification_badge.svg';
import isEmpty from 'lodash/isEmpty';
import { storageService } from "utils/validators";
import '../theme/Style.scss';
import restart from 'assets/restart_nav_icn.svg';
import Drawer from '../../desktopLayout/Drawer';
import MenuIcon from "@material-ui/icons/Menu";
import ReferDialog from '../../desktopLayout/ReferralDialog';

const headerIconMapper = {
  back: back_arrow,
  close: close_icn,
  search: search,
  restart: restart
}
const Header = ({ classes, title, count, total, current, goBack, 
  edit, type, resetpage, handleReset, smallTitle, disableBack, provider, 
  inPageTitle, hideHamburger, force_hide_inpage_title, topIcon, handleTopIcon, canSkip, onSkipClick,
  className ,style, headerData={}, new_header, notification, handleNotification, noBackIcon, customBackButtonColor}) => {
    const rightIcon = headerIconMapper[topIcon];
    const [referDialog, setReferDialog] = useState(false);
    const [mobileViewDrawer, setMobileViewDrawer] = useState(false);
    const campaign = storageService().getObject("campaign");
    const config = getConfig();
    const isMobileDevice = config.isMobileDevice;
    const partnerLogo = config.logo;
    const isWeb = config.Web;
    const backgroundColor = !isWeb ? config.uiElements?.header?.backgroundColor : '';
    const backButtonColor = (!isWeb || config.isIframe) ? config.styles?.backButtonColor : '';
    const notificationsColor = !isWeb || config.isSdk ? config?.styles.notificationsColor : '';
    const moneycontrolHeader = isMobileDevice && config.code === 'moneycontrol';

    const handleMobileViewDrawer = () => {
      setMobileViewDrawer(!mobileViewDrawer);
    };
    const handleReferModal = () => {
      if(!referDialog){
        setMobileViewDrawer(!mobileViewDrawer);
      }
      setReferDialog(!referDialog);
    };
    return (
      <AppBar position="fixed" color="primary" data-aid='app-bar'
      className={`Header transition ${classes.root} ${(!headerData.partnerLogo || moneycontrolHeader) ? 'header-topbar-white' : 'header-topbar-primary'} ${className || ''}`}
      style={style}
      >
        <Toolbar>
          {
            !noBackIcon &&
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
              onClick={headerData.goBack ||
              goBack}
              data-aid='tool-bar-icon-btn'
            >
              {!disableBack && !headerData.hide_icon &&
              <SVG
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + (customBackButtonColor ? customBackButtonColor : backButtonColor ?  backButtonColor : !headerData.partnerLogo ? getConfig().styles.primaryColor : 'white'))}
              src={headerData ? headerIconMapper[headerData.icon || 'back'] : back_arrow}
              />
              }
              {(disableBack === true || disableBack === 'summary') && !headerData.hide_icon &&
              <Close color="primary"/>}
            </IconButton>
          }
          {
            headerData.partnerLogo && config.isMobileDevice && !(moneycontrolHeader && isWeb) &&
             <div className='sdk-header-partner-logo'>
                <img src={require(`assets/${partnerLogo}`)} alt="partner logo" /> 
            </div>
          }

          {
            headerData.partnerLogo && moneycontrolHeader && isWeb &&
             <div className='sdk-header-partner-logo'>
                <img src={require(`assets/finity/finity_navlogo.svg`)} alt="partner logo" height={20}/> 
            </div>
          }

          {headerData.progressHeaderData && 
            <div className="toolbar-title">
           <div className="progress-bar">
            <div className="head">
              {headerData.progressHeaderData.title}
            </div>
            <div style={{ display: 'flex', flexFlow: 1 }}>

              {headerData.progressHeaderData.steps.map((step, index) => (
                <div className="journey-header-progress" key={index}>
                  <div className="indicator">
                    <div className  = {index === 0 ? 'tiny-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'large-hr' : 'hr'} >
                      <div className={`${index === 0 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index - 1].status}`
                      }`} ></div></div>
                    <span className={`dot ${step.status}`}></span>
                    <div className={index === 0 ? 'large-hr' : index === headerData.progressHeaderData.steps.length - 1 ? 'tiny-hr' : 'hr'} 
                      
                      ><div className={`${index === headerData.progressHeaderData.steps.length - 1 ? 'invisible-line' :
                      `line line-${headerData.progressHeaderData.steps[index].status}`
                      }`}  ></div></div>
                  </div>
                  <div
                  style = {{
                    marginLeft : index === 0 ? '-50%' : index === headerData.progressHeaderData.steps.length - 1 ? '50%' : '0',
                    color: `${step.status === 'init' ? '#0A1D32' : '#C4C4C4'}`
                  }}
                  >{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }

        {!headerData.progressHeaderData && 
          <>
            <div>
            {
              !headerData.partnerLogo && 
              <div
                style={style}
                className={`${classes.flex},PageTitle ${new_header ? 'main-top-title-header' : 'main-top-title-header-old'} 
                ${inPageTitle ? 'slide-fade' : 'slide-fade-show'} ${className}`}
                >
                {title}
              </div>
            }
            </div>
            {
              !(moneycontrolHeader && headerData.partnerLogo) &&
              <div className='header-right-nav-components'>
                {resetpage &&
                  <SVG
                  style={{marginLeft: 'auto', width:20}}
                  onClick={handleReset}
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + (new_header && backgroundColor ?  getConfig().styles.secondaryColor : getConfig().styles.primaryColor))}
                  src={restart}
                />
                }
                {canSkip &&
                <span className="header-skip-text" onClick={onSkipClick}>SKIP</span>
                }
                {topIcon &&
                  <SVG
                  style={{marginLeft: '20px', width:25, cursor:'pointer'}}
                  onClick={handleTopIcon}
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + (new_header && backgroundColor ?  getConfig().styles.secondaryColor : getConfig().styles.primaryColor))}
                  src={rightIcon}
                />
                }
                {notification &&
                  <SVG
                  style={{marginLeft: '20px', width:25, cursor:'pointer'}}
                  onClick={handleNotification}
                  preProcessor={code => code.replace(/fill="#FFF"/, 'fill=' + notificationsColor)}
                  src={isEmpty(campaign) ? notificationLogo : notificationBadgeLogo}
                />
                }
                {isMobileDevice && isWeb && !hideHamburger && !config.isIframe &&
                  <div className='mobile-navbar-menu'>
                    <IconButton onClick={handleMobileViewDrawer}>
                      <MenuIcon style={{color: new_header && backgroundColor ?  getConfig().styles.secondaryColor : headerData.partnerLogo ? 'white' : getConfig().styles.primaryColor}}/>
                    </IconButton>
                    <Drawer mobileViewDrawer={mobileViewDrawer} handleMobileViewDrawer={handleMobileViewDrawer} handleReferModal={handleReferModal} />
                  </div>
                }
              </div>
          }
          
          </>
        }

        </Toolbar>
        {
          isMobileDevice &&
          <ReferDialog isOpen={referDialog} close={handleReferModal} />
        }
      </AppBar>
    )
  };

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    textAlign: '-webkit-center'
  },
  menuButton: {
    marginLeft: "-12px !important",
    // marginRight: 20,
  },
  headerWithData: {
    height: '80px',
    display: 'flex',
    alignItems: 'flex-start'
  }
};

export default withStyles(styles)(Header);