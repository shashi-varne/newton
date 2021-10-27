import React, { useEffect, useMemo, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import register from 'assets/registration_menu_icon.png';
import notification from 'assets/notifications_icon.png';
import invest from 'assets/invest.png';
import report from 'assets/reports.png';
// import loans from 'assets/ic_loan_sdk2.png';
import fhc from 'assets/fhc.png';
import myAccount from 'assets/myaccount.png';
import refer from 'assets/promo_code.png';
import WriteToUs from 'assets/refer_earn_menu_icon.png';
import withdraw from 'assets/withdraw.png';
import ListItemText from '@material-ui/core/ListItemText';
import logout from 'assets/logout_grey.png';
import { getConfig } from 'utils/functions';
import { withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from 'utils/functions';
import { getKycAppStatus, isMfApplicationSubmitted, isReadyToInvest } from '../kyc/services';
import ReferDialog from './ReferralDialog';

import './NavList.scss';
import { isEmpty, storageService } from '../utils/validators';
import { isEquityApplSubmittedOrComplete, isEquityCompleted } from '../kyc/common/functions';
import { isTradingEnabled } from '../utils/functions';
let data = [
  // {
  //   id: 'register',
  //   name: 'Register',
  //   icon: register,
  //   path: '/kyc',
  // },
  {
    id: 'notification',
    name: 'Notification',
    icon: notification,
    path: '/notification',
  },
  {
    id: 'invest',
    name: 'Invest',
    icon: invest,
    path: '/invest',
  },
  // {
  //   id: 'loans',
  //   name: 'Loans',
  //   icon: loans,
  //   path: '/loan/home',
  // },
  {
    id: 'reports',
    name: 'Reports',
    icon: report,
    path: '/reports',
  },
  {
    id: 'withdraw',
    name: 'Withdraw',
    icon: withdraw,
    path: '/withdraw/reason',
  },
  {
    id: 'fhc',
    name: 'Financial Health Check',
    icon: fhc,
    path: '/fhc',
  },
  {
    id: 'myAccount',
    name: 'My Account',
    icon: myAccount,
    path: '/my-account',
  },
  {
    id: 'refer',
    name: 'Refer & Earn',
    icon: refer,
  },
  {
    id: 'writeToUs',
    name: 'Write to us',
    icon: WriteToUs,
    path: '/feedback',
  },
  {
    id: 'logout',
    name: 'Logout',
    icon: logout,
    path: '/logout',
  },
];

const NavList = (props) => {
  const config = getConfig();
  const productName = config.productName;
  const isMobileDevice = config.isMobileDevice;
  const partnerLoan = config?.features?.loan;
  const showReferral = !config?.referralConfig?.shareRefferal;
  const navigate = navigateFunc.bind(props);
  const [referDialog, setReferDialog] = useState(false);
  const [activePath, setActivePath] = useState('');
  const [kycStatus, setKycStatus] = useState("");
  const kyc = storageService().getObject("kyc") || {};
  const user = storageService().getObject("user") || {};
  const isReadyToInvestBase = isReadyToInvest();
  const TRADING_ENABLED = useMemo(() => {
    return isTradingEnabled(kyc);
  }, [kyc])

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize()
    }
  }, [kyc]);

  const initialize = () => {
    let kycJourneyStatus = getKycAppStatus(kyc)?.status;
    setKycStatus(kycJourneyStatus);

    filterNavList();
  }
  const handleRefferalModal = () => {
    setReferDialog(!referDialog);
  };
  const handleClick = ({ path, id }) => () => {
    setActivePath(id);
    if(id === 'register'){
      if (user.kyc_registration_v2 === "init") {
        path = "/kyc/home";
      } else if (user.kyc_registration_v2 !== "complete") {
        path = "/kyc/journey";
      } else if (user.active_investment) {
        path = "/reports";
      } else {
        path = "/invest";
      }
    }
    if (path) {
      navigate(path);
    } else {
      if (isMobileDevice) {
        props.handleModal();
      } else {
        handleRefferalModal();
      }
    }
  };
  const filterNavList = (id) => {
    if (id === 'logout' && !isMobileDevice) {
      return null;
    }
    const kycStatusesToNotShow = ["rejected", "fno_rejected", "esign_pending", "verifying_trading_account"];
    const conditionToNotShowRegister = (!TRADING_ENABLED && isReadyToInvestBase) || (TRADING_ENABLED && isEquityCompleted()) ||
      kycStatusesToNotShow.includes(kycStatus) || (!TRADING_ENABLED && isMfApplicationSubmitted(kyc)) ||
      (TRADING_ENABLED && isEquityApplSubmittedOrComplete(kyc));
    if (id === 'register' && conditionToNotShowRegister) {
      return null;
    }
    if(id === 'loans' && !partnerLoan) {
      return  null;
    }
    if (id === 'fhc' && productName === 'finity') {
      return null;
    }
    if (id === 'refer' && !showReferral) {
      return null;
    }
    return id;
  };
  
  return (
    <div className='navlink-container' data-aid='navlink-container'>
      <div>
        {isMobileDevice && (
          <div className='user-mobile-details' data-aid='user-mobile-details'>
            <div className='user-name' data-aid='user-name'>{user?.name}</div>
            <div className='user-contact' data-aid='user-contact'>{user?.email || user?.mobile}</div>
          </div>
        )}
        <List className='navlink-lists' data-aid='navlink-lists'>
          {data.map((el, idx) => {
            const hideNavItem = !filterNavList(el.id);
            if (hideNavItem) {
              return null;
            }
            return (
              <ListItem key={idx} onClick={handleClick(el)} className={`nav-link-listItem ${activePath === el.id ? 'navlink-active': ''}`} data-aid={`${el.id}-btn`}>
                <ListItemIcon>
                  <img className='nav-link-icons' src={el.icon} alt={el.name} />
                </ListItemIcon>
                <ListItemText className='nav-link-text' primary={el.name} />
              </ListItem>
            );
          })}
        </List>
      </div>

      <div>
        <div className='navlink-footer-list' data-aid='navlink-footer-list'>
          <div className='navlink-footer-item' data-aid='navlink-privacy-policy'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={config.privacyLink}
            >
              Privacy Policy
            </a>
          </div>
          <div className='navlink-footer-item' data-aid='navlink-terms'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={config.termsLink}
            >
              Terms
            </a>
          </div>
          <div className='navlink-footer-item' data-aid='navlink-disclaimer'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={config.disclaimerLink}
            >
              Disclaimer
            </a>
          </div>
          <div className='navlink-footer-item' data-aid='navlink-refund'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={config.refundLink}
            >
              Refund
            </a>
          </div>
          <div className='navlink-footer-item' data-aid='scheme-offer-documents'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={config.schemeLink}
            >
              Scheme Offer Documents
            </a>
          </div>
        </div>
        <div className='navlink-footer-abt' data-aid='navlink-footer-abt'>
          Finwizard Technology Pvt Ltd.
          <br />
          All rights reserved
        </div>
      </div>
      
      {
        !isMobileDevice &&
        <ReferDialog isOpen={referDialog} close={handleRefferalModal} />
      }
    </div>
  );
};
export default withRouter(NavList);
