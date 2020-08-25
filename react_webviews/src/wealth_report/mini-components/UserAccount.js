// common for both mobile view and web view

import React, { Component, Fragment } from "react";
import { Button } from "material-ui";
import ImageCrop from "common/ui/ImageCrop";
import Dialog from "common/ui/Dialog";
import Tooltip from "common/ui/Tooltip";
import { isMobileDevice } from "utils/functions";
import { toast } from "react-toastify";
import { logout } from "../common/ApiCalls";
import { navigate } from '../common/commonFunctions';
import { CircularProgress } from "material-ui";

class UserAccountMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      fileUploaded: false,
      croppedImageUrl: "",
      cropped: false,
      loggingOut: false,
    };
  }

  // getImage = (url) => {
  //   this.setState({
  //     croppedImageUrl: url,
  //     cropped: true,
  //   });
  // };

  // openCameraWeb() {
  //   this.setState({
  //     fileUploaded: false,
  //     cropped: false,
  //   });
  //   $("input").trigger("click");
  // }

  // startUpload() {
  //   this.openCameraWeb();
  // }

  // getPhoto = (e) => {
  //   const image = getImageFile(e);
  //   let that = this;

  //   //will get the image url
  //   getBase64(image, function (img) {
  //     that.setState({
  //       imageBaseFileShow: img,
  //       fileUploaded: true,
  //     });
  //   });
  // };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleTooltipClose = (event) => {
    console.log(event);
    // If click event is triggered from within tooltip, skip it
    const clickInsideTooltip = event.path.find((element) =>
      element.nodeName === 'DIV' && element.classList.contains("wr-user")
    );
    if (clickInsideTooltip) return;
    this.setState({
      open: false,
    });
  };

  logoutUser = async() => {
    try {
      this.setState({ loggingOut: true });
      await logout();
      navigate(this.props.parentProps, '/w-report/login');
    } catch(err) {
      console.log(err);
      toast(err);
    }
    this.setState({ loggingOut: false });
  };

  // will render user account profile info
  renderUserAccount = () => (
    <React.Fragment>
      {/* visibility will be modified based on the condition in media queries */}
      <div className="wr-welcome">
        <div className="wr-profile-img" onClick={() => {}}>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={this.getPhoto}
            id="myFile"
          />

          {!this.state.fileUploaded && (
            <img
              src={require(`assets/fisdom/ic-profile-avatar.svg`)}
              alt="avatar"
            />
          )}

          {this.state.fileUploaded && (
            <img
              className="wr-profile"
              src={this.state.croppedImageUrl}
              alt="profile"
            />
          )}
        </div>
        <div className="wr-head">Welcome</div>
        <div className="wr-number">+91 92374 82739</div>
      </div>

      <div className="wr-logout">
        <Button fullWidth={true} className="wr-logout-btn" onClick={this.logoutUser}>
          {this.state.loggingOut ?
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

  // use to crop the uploaded image
  renderImageCrop = () => (
    <ImageCrop image={this.state.imageBaseFileShow} getImage={this.getImage} />
  );

  render() {
    const user_account = (
      <img
        src={require(`assets/fisdom/ic-account.svg`)}
        alt=""
        id="wr-account-img"
        onClick={() => this.setState({ open: !this.state.open })}
      />
    );
    return (
      <React.Fragment>
        {!isMobileDevice() ? (
          // will show the tooltip for desktop view else dialog box for mobile view
          <Tooltip
            onClickAway={this.handleTooltipClose}
            content={
              this.state.fileUploaded
                ? this.state.cropped
                  ? this.renderUserAccount()
                  : this.renderImageCrop()
                : this.renderUserAccount()
            }
            isOpen={this.state.open}
            direction="down"
            forceDirection
            className="wr-user"
          >
            {user_account}
          </Tooltip>
        ) : (
          // mobile view 
          <React.Fragment>
            {user_account}
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              classes={{ paper: "wr-dialog-paper" }}
            >
              {this.state.fileUploaded
                ? this.state.cropped
                  ? this.renderUserAccount()
                  : this.renderImageCrop()
                : this.renderUserAccount()}
            </Dialog>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default UserAccountMobile;
