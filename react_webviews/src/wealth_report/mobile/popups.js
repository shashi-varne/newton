import React, { Component } from "react";
import Container from "./container";
import "./Style.scss";
import Button from "material-ui/Button";
import { getBase64 } from "utils/functions";
import $ from "jquery";

class Popups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ['Abishmathew21@yahoo.co.in', 'Abishmathew21@yahoo.co.in'],
      openPopup: false,
      fileUploaded: false
    };
  }

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload() {
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
    const dialog = (
      <div className="wr-accounts">
        <Button fullWidth={true} className="wr-button">
          <img
            src={require(`assets/fisdom/ic-mob-add-email.svg`)}
            alt=""
            style={{ marginRight: "9px" }}
          />
          Add new email
        </Button>
        <div style={{ margin: "28px 10px 0 10px" }}>
          <div className="wr-all-mails">All emails</div>
          {this.state.accounts.map((account) => (
            <div className="wr-mails">
              <div>
                <div className="wr-account">Abishmathew21@yahoo.co.in</div>
                <div className="wr-sync">Synced on Jun 23, 09:45am</div>
              </div>
              <img src={require(`assets/fisdom/ic-email-sync.svg`)} alt="" />
            </div>
          ))}
        </div>
      </div>
    );

    const dialog2 = (
      <div className="wr-email-added">
        <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
        <div className="wr-content">Email has been added successfully!</div>
        <div className="wr-continue">Continue</div>
      </div>
    );

    const dialog3 = (
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
                src={this.state.imageBaseFileShow || this.state.document_url}
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

    const dialog4 = (
      <div className="wr-estd-tax">
        <div className="head">Estimated Tax</div>
        <div className="content">
          Disclaimer: Calculation is solely based on the statement provided by
          you.
        </div>
      </div>
    );

    return (
      <Container
        dialogContent={dialog3}
        openPopup={true}
      >
        <Button onClick={this.handlePopup}>Logout</Button>
      </Container>
    );
  }
}

export default Popups;
