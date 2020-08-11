import React, { Component } from "react";
import Button from "material-ui/Button";
import { getBase64 } from "utils/functions";
import $ from "jquery";
import ImageCrop from "common/ui/ImageCrop";
import { getImageFile } from "../common/commonFunctions";
import Dialog from "common/ui/Dialog";
import Tooltip from "common/ui/Tooltip";
import { isMobileDevice } from "utils/functions";

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

  renderd1 = () => (
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

  renderd2 = () => (
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
          <Tooltip
            content={
              this.state.fileUploaded
                ? this.state.cropped
                  ? this.renderd1()
                  : this.renderd2()
                : this.renderd1()
            }
            isOpen={this.state.open}
            direction="down"
            forceDirection
          >
            {user_account}
          </Tooltip>
        ) : (
          <React.Fragment>
            {user_account}
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              classes={{ paper: "wr-dialog-paper" }}
            >
              {this.state.fileUploaded
                ? this.state.cropped
                  ? this.renderd1()
                  : this.renderd2()
                : this.renderd1()}
            </Dialog>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default UserAccountMobile;
