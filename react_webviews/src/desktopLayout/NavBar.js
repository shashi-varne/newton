import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {getConfig} from 'utils/functions';
import {navigate as navigateFunc} from './commonFunctions'
import {withRouter} from 'react-router-dom';
import './NavBar.scss';
import { storageService } from "../utils/validators";
const NavBar = (props) => {
  const {partner,logo} = getConfig();
  const navigate = navigateFunc.bind(props);
  const handleLogout =() => {
    navigate('/logout');
  }
  const user = storageService().getObject('user');

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar className='navbar-container'>
        <div className='header-partner-logo'>
          <img src={require(`assets/${logo}`)} alt={partner} />
        </div>
        <div className='navbar-right-container'>
            <div className='user-profile-data'>
              <div className='user-name'>{user?.name}</div>
              <div className='user-contact'>{user?.email || user?.mobile}</div>
            </div>
            <div className='navbar-logout-section' onClick={handleLogout}>
                <img src={require('assets/logout.png')} alt="logout" />
                <div className='navbar-logout'>Logout</div>
            </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default withRouter(NavBar);