import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {getConfig} from 'utils/functions';
import {navigate as navigateFunc} from 'utils/functions'
import {withRouter} from 'react-router-dom';
import './NavBar.scss';
import { storageService } from "../utils/validators";

const NavBar = (props) => {
  const {code,logo} = getConfig();
  const navigate = navigateFunc.bind(props);
  const user = storageService().getObject('user');
  const isGuestUser = storageService().getBoolean('guestUser');
  const handleLogout =() => {
    navigate('/logout');
  }

  return (
    <AppBar position="sticky" className="navbar NavBar" data-aid='navbar'>
      <Toolbar className='navbar-container'>
        <div className='header-partner-logo'>
          <img src={require(`assets/${logo}`)} alt={code} />
        </div>
        <div className='navbar-right-container'>
            <div className='user-profile-data' data-aid='user-profile-data'>
              <div className='user-name' data-aid='user-name'>{user?.name}</div>
              <div className='user-contact' data-aid='user-contact'>{user?.email || user?.mobile}</div>
            </div>
            {
              !isGuestUser ? 
              <div className='navbar-logout-section' onClick={handleLogout}>
                <img src={require('assets/logout.png')} alt="logout" />
                <div className='navbar-logout' data-aid='navbar-logout'>Logout</div>
              </div> : null
            }
            
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default withRouter(NavBar);