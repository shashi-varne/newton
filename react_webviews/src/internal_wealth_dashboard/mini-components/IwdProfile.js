import { Button, CircularProgress, ClickAwayListener } from "material-ui";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { navigate as navigateFunc } from "../common/commonFunctions";
import { logout } from "../common/ApiCalls";
import toast from "../../common/ui/Toast";
import { storageService } from "../../utils/validators";
import { nativeCallback } from "../../utils/native_callback";
import { get } from "lodash";
import Api from "../../utils/api";
import { CSSTransition } from "react-transition-group";

const IwdProfile = (props) => {
  const navigate = navigateFunc.bind(props);
  const [userDetail, setUserDetail] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initialiseUserData = async () => {
    let pan = storageService().get("iwd-user-pan") || "";
    let mobile = storageService().get("iwd-user-mobile") || "";
    mobile = mobile ? `+91-${mobile}` : "";
    const user = {
      name: storageService().get("iwd-user-name") || "",
      email: storageService().get("iwd-user-email") || "",
      mobile,
    };

    setUserDetail(user);

    if (!pan) {
      try {
        const kycDetail = await Api.post(`api/user/account/summary`, {
          kyc: ["kyc"],
          user: ["user"],
        });
        pan = get(
          kycDetail,
          "pfwresponse.result.data.kyc.kyc.data.pan.meta_data.pan_number",
          ""
        );
        storageService().set("iwd-user-pan", pan);
      } catch (err) {
        console.log(err);
      }
    }
    setUserDetail({ ...user, pan });
  };

  useEffect(() => {
    // Time delay for following fix https://fisdom.atlassian.net/browse/QA-2497
    setTimeout(initialiseUserData, 500);
  }, []);

  const sendEvents = (user_action, props) => {
    let eventObj = {
      event_name: "internal dashboard hni",
      properties: {
        screen_name: "landing page",
        user_action: user_action,
        ...props,
      },
    };
    nativeCallback({ events: eventObj });
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const logoutUser = async () => {
    try {
      setLoggingOut(true);
      await logout();
      sendEvents("logout");
      navigate("login");
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setLoggingOut(false);
  };

  const profileIcon = (
    <div id="iwd-profile-icon" onClick={!expanded ? toggleExpanded : undefined}>
      {(userDetail.name || "").charAt(0)}
    </div>
  );
  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={800}
        classNames="boxEffect"
      >
        <ClickAwayListener onClickAway={toggleExpanded}>
          <div id="iwd-profile">
            <div className="iwd-profile-content">
              {profileIcon}
              <div className="iwd-profile-username">{userDetail.name}</div>
              <div className="iwd-profile-detail" id="pan">
                <b>PAN: </b>
                {userDetail.pan || "--"}
              </div>
              <div className="iwd-profile-detail">
                <b>Email: </b>
                {userDetail.email}
              </div>
              <div className="iwd-profile-detail">
                <b>Mob.:</b>
                {"  "}
                {userDetail.mobile || "--"}
              </div>
              <div id="iwd-profile-divider"></div>
              <Button
                fullWidth={true}
                onClick={logoutUser}
                classes={{
                  root: "iwd-profile-logout",
                  label: "iwd-profile-logout-text",
                }}
              >
                {loggingOut ? <CircularProgress size={25} /> : "Logout"}
              </Button>
            </div>
          </div>
        </ClickAwayListener>
      </CSSTransition>
      <div id="iwd-profile-short">
        <div
          style={{
            marginRight: "10px",
          }}
        >
          <div id="iwd-ps-name">{userDetail.name || "--"}</div>
          <div id="iwd-ps-contact">
            {userDetail.mobile || userDetail.email || "--"}
          </div>
        </div>
        {profileIcon}
      </div>
    </>
  );
};

export default withRouter(IwdProfile);
