// common for both mobile view and web view

import React, { Fragment, useEffect, useState } from "react";
import { Button } from "material-ui";
import { toast } from "react-toastify";
import { logout } from "../common/ApiCalls";
import { navigate } from '../common/commonFunctions';
import { CircularProgress } from "material-ui";
import WrTooltip from "../common/WrTooltip";
import { storageService } from "../../utils/validators";

export default function UserAccountMobile(props) {
  const username = storageService().get('wr-username');
  const [loggingOut, setLoggingOut] = useState(false);
  const [userAccModal, toggleUserAccModal] = useState(false);

  useEffect(() => {
    toggleUserAccModal(false);
  }, [props.refresh]);

  function handleTooltipClose(event, toggleFunction) {
    var path = event.path || (event.composedPath && event.composedPath());
    if (!event || !path) return;
    // If click event is triggered from within tooltip, skip it
    const clickInsideTooltip = path.find((element) =>
      element.nodeName === 'DIV' && element.classList.contains("wr-user")
    );
    if (clickInsideTooltip) return;
    toggleFunction(false);
    toggleUserAccModal(false);
  }

  const logoutUser = async() => {
    try {
      setLoggingOut(true);
      await logout();
      navigate(props.parentProps, 'login');
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setLoggingOut(false);
  };

  // will render user account profile info
  const renderUserAccount = () => (
    <React.Fragment>
      {/* visibility will be modified based on the condition in media queries */}
      <div className="wr-welcome">
        <div className="wr-profile-img">
          <img
            src={require(`assets/fisdom/ic-profile-avatar.svg`)}
            alt="avatar"
          />
        </div>
        <div className="wr-head">Welcome</div>
        <div className="wr-number">{username}</div>
      </div>

      <div className="wr-logout">
        <Button fullWidth={true} className="wr-logout-btn" onClick={logoutUser}>
          {loggingOut ?
            <CircularProgress size={25} /> : 
            (
              <Fragment>
                <img src={require(`assets/fisdom/ic-mob-logout.svg`)} alt="out" />
                Logout
              </Fragment>
            )
          }
        </Button>
      </div>
    </React.Fragment>
  );

  const user_account = (
    <img
      src={require(`assets/fisdom/ic-account.svg`)}
      alt=""
      id="wr-account-img"
      onClick={() => toggleUserAccModal(!userAccModal)}
    />
  );

  return (
    <React.Fragment>
      <WrTooltip 
        trigger={user_account}
        tipContent={renderUserAccount()}
        onClickAway={handleTooltipClose}
        forceDirection={true}
        forceState={userAccModal}
        openOnClick={true}
        tooltipClass="wr-user"
        />
    </React.Fragment>
  );
}