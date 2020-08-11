// common for both mobile view and web view

import React, { Component } from "react";
import Button from "material-ui/Button";
import { getBase64 } from "utils/functions";
import $ from "jquery";
import ImageCrop from "common/ui/ImageCrop";
import { getImageFile } from "../common/commonFunctions";
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

  getImage = (url) => {
    this.setState({
      croppedImageUrl: url,
      cropped: true,
    });
  };

  openCameraWeb() {
    this.setState({
      fileUploaded: false,
      cropped: false,
    });
    $("input").trigger("click");
  }

  startUpload() {
    this.openCameraWeb();
  }

  getPhoto = (e) => {
    const image = getImageFile(e);
    let that = this;

    //will get the image url
    getBase64(image, function (img) {
      that.setState({
        imageBaseFileShow: img,
        fileUploaded: true,
      });
    });
  };

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
      <div className="wr-welcome" style={{ width: "300px" }}>
        <div style={{ textAlign: "center" }} onClick={() => this.startUpload()}>
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
            style={{ marginLeft: "-27px" }}
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

  // will use to crop the uploaded image
  renderImageCrop = () => (
    <ImageCrop image={this.state.imageBaseFileShow} getImage={this.getImage} />
  );

  render() {
    const user_account = (
      <img
        src={require(`assets/fisdom/ic-account.svg`)}
        alt=""
        style={{
          height: isMobileDevice() && "30px",
          width: isMobileDevice() && "30px",
        }}
        onClick={() => this.setState({ open: !this.state.open })}
      />
    );
    return (
      <React.Fragment>
        {!isMobileDevice() ? (
          // will show the tooltip if webview else Modal of user account
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
