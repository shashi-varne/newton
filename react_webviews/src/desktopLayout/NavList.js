import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import register from 'assets/registration_menu_icon.png';
import notification from 'assets/notifications_icon.png';
import invest from 'assets/invest.png';
import report from 'assets/reports.png';
import loans from 'assets/ic_loan_sdk2.png';
import fhc from 'assets/fhc.png';
import myAccount from 'assets/myaccount.png';
import refer from 'assets/promo_code.png';
import WriteToUs from 'assets/refer_earn_menu_icon.png';
import withdraw from 'assets/withdraw.png';
import ListItemText from '@material-ui/core/ListItemText';
import logout from 'assets/logout_grey.png';
import { getConfig } from 'utils/functions';
import { withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from './commonFunctions';
import { isReadyToInvest } from '../kyc/services';
import { storageService } from 'utils/validators';

import './NavList.scss';
let data = [
  {
    id: 'register',
    name: 'Register',
    icon: register,
    path: '/register',
  },
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
  {
    id: 'loans',
    name: 'Loans',
    icon: loans,
    path: '/loan/home',
  },
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
  const [active, setActive] = useState('');
  const productName = getConfig().productName;
  const mobile = getConfig().isMobileDevice;
  const navigate = navigateFunc.bind(props);
  const user = storageService().getObject('user');
  const userKyc = storageService().getObject('kyc');
  const partnerLoan = getConfig()?.invest_screen_cards?.loan;
  const showReferral = !getConfig()?.referralConfig?.shareRefferal;

  useEffect(() => {
    filterNavList();
  }, []);
  const handleModal = () => {
    alert('open modal');
  };
  const handleClick = ({path, id}) => () => {
    if (path) {
      setActive(id);
      navigate(path);
    } else {
      handleModal();
    }
  };
  const filterNavList = (id) => {
    if (id === 'logout' && !mobile) {
      return null;
    }
    if (id === 'register' && isReadyToInvestBase) {
      return null;
    }
    // if(name === 'loans' && !partnerLoan) {
    //   return  null;
    // }
    if (id === 'fhc' && productName === 'finity') {
      return null;
    }
    if (id === 'myAccount' && (!isReadyToInvestBase || userKyc?.bank?.doc_status !== 'rejected')) {
      return null;
    }
    if (id === 'refer' && !showReferral) {
      return null;
    }
    return id;
  };
  const isReadyToInvestBase = isReadyToInvest();
  return (
    <div className='navlink-container'>
      {mobile && (
        <div className='user-mobile-details'>
          <div className='user-name'>{user?.name}</div>
          <div className='user-contact'>{user?.email || user?.mobile}</div>
        </div>
      )}
      <List className='navlink-lists'>
        {data.map((el, idx) => {
          const hideNavItem = !filterNavList(el.id);
          if (hideNavItem) {
            return null;
          }
          return (
            <ListItem
              key={idx}
              button
              onClick={handleClick(el)}
              className={`nav-link-listItem` && (active === el?.id && 'active') }
            >
              <ListItemIcon>
                <img className='nav-link-icons' src={el.icon} alt={el.name} />
              </ListItemIcon>
              <ListItemText className='nav-link-text' primary={el.name} />
            </ListItem>
          );
        })}
      </List>
      <div>
        <div className='navlink-footer-list'>
          {productName === 'fisdom' && (
            <div className='navlink-footer-item'>
              <a
                rel='noopener noreferrer'
                target='_blank'
                href={`https://www.${productName}.com/faqs/`}
              >
                FAQ
              </a>
            </div>
          )}
          <div className='navlink-footer-item'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={`https://www.${productName}.com/privacy/`}
            >
              Privacy Policy
            </a>
          </div>
          <div className='navlink-footer-item'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={`https://www.${productName}.com/terms/`}
            >
              Terms
            </a>
          </div>
          <div className='navlink-footer-item'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={`https://www.${productName}.com/disclaimer/`}
            >
              Disclaimer
            </a>
          </div>
          <div className='navlink-footer-item'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={`https://www.${productName}.com/refund/`}
            >
              Refund
            </a>
          </div>
          <div className='navlink-footer-item'>
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={`https://www.${productName}.com/scheme-offer-documents/`}
            >
              Scheme Offer Documents
            </a>
          </div>
        </div>
        <div className='navlink-footer-abt'>
          Finwizard Technology Pvt Ltd.
          <br />
          All rights reserved
        </div>
      </div>
    </div>
  );
};
export default withRouter(NavList);
