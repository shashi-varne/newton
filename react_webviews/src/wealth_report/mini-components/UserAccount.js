// common for both mobile view and web view

import React, { Component } from "react";
import Button from "material-ui/Button";
import { getBase64 } from "utils/functions";
import $ from "jquery";
import ImageCrop from "common/ui/ImageCrop";
// import { getImageFile } from "../common/commonFunctions";
import Dialog from "common/ui/Dialog";
import Tooltip from "common/ui/Tooltip";
import { isMobileDevice } from "utils/functions";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

class UserAccountMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      fileUploaded: false,
      croppedImageUrl: "",
      cropped: false,
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

  handleTooltipClose = () => {
    this.setState({
      open: false
    })
  }

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

          <img
            src={require(`assets/fisdom/ic-mob-add-pic.svg`)}
            alt="camera"
            style={{ margin: "-35px 0 100px 50px" }}
          />
        </div>
        <div className="wr-head">Welcome</div>
        <div className="wr-number">+91 92374 82739</div>
      </div>

      <div className="wr-logout">
        <Button fullWidth={true} className="wr-logout-btn">
          <img src={require(`assets/fisdom/ic-mob-logout.svg`)} alt="" />
          Logout
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
          <ClickAwayListener onClickAway={this.handleTooltipClose}>
            <Tooltip
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
          </ClickAwayListener>
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
