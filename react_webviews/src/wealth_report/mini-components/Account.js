import React, { Component } from "react";
import Button from "material-ui/Button";
import { getBase64 } from "utils/functions";
import $ from "jquery";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ["Abishmathew21@yahoo.co.in", "Abishmathew21@yahoo.co.in"],
      openPopup: false,
      fileUploaded: false,
      croppedImageUrl: "",
      cropped: false,
    };
  };

  getImage = (url) => {
    this.setState({
      croppedImageUrl: url,
      cropped:true
    })
    console.log(url)
  }

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload() {
    this.setState({
      fileUploaded: false
    })
    this.openCameraWeb();
  }

  getPhoto = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    if (acceptedType.indexOf(file.type) === -1) {
      console.log("please select image file only");
      return;
    }

    let that = this;
    file.doc_type = file.type;
    this.setState({
      imageBaseFile: file,
    });
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img,
        fileUploaded: true,
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="wr-welcome">
          <div
            style={{ textAlign: "center" }}
            onClick={() => this.startUpload()}
          >
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
  }
}

export default Account;
