import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../../common/commonFunctions";
import SelectWithoutIcon from "common/ui/SelectWithoutIcon";
import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";

class uploadAddressProof extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      // proof_type: 'Aadhar Card'
      proof_type: "",
      address: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: "native_receiver_image",

        // show_loader: function (show_loader) {
        //   that.showLoaderNative();
        // },
      });
    }
  }

  onload = () => {
    let nps_additional_details = storageService().getObject(
      "nps_additional_details"
    );
    let { nps_details } = nps_additional_details;

    let { address } = nps_details;

    this.setState({
      address: address,
    });
  };

  handleChange = (event) => {
    let value = event.target || "";
    this.setState({
      proof_type: value,
    });
  };

  renderCamera = () => (
    <div className="image-prev-container">
      <div className="display-flex">
        <img
          className={this.state.uploaded ? "uploaded" : "upload-img"}
          src={
            this.state.uploaded ? this.state.img : require("assets/pickup.png")
          }
          alt="Document"
        />
        <div className="display-flex">
          {!getConfig().Web && (
            <div>
              <div className="image-upload-container">
                <div className="icon">
                  <img
                    src={require("assets/fa_camera.svg")}
                    alt="Document"
                    width="30"
                  />
                  <div className="text-center label">Camera</div>
                </div>
              </div>
              <div className="image-upload-container">
                <div className="icon">
                  <img
                    src={require("assets/fa_image.svg")}
                    alt="Document"
                    width="30"
                  />
                  <div className="text-center label">Gallery</div>
                </div>
              </div>
            </div>
          )}
          {getConfig().Web && (
            <div
              className="image-upload-container"
              onClick={() => this.startUpload("open_file", "bank_statement")}
            >
              <div className="icon">
                <img
                  src={require("assets/fa_image.svg")}
                  alt="Document"
                  width="30"
                />
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.getPhoto}
                />
                <span className="text-center label">Gallery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="Proceed"
        hideInPageTitle
        hidePageTitle
        title="Upload Address Proof"
        showLoader={this.state.show_loader}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please upload the <span className="bold">proof</span> for updated
            address: <br />
            <span>
              <b>Address:</b> {this.state.address.addressline}
            </span>
          </div>
        </div>

        <div className="nps-upload">
          <div className="InputField">
            <SelectWithoutIcon
              width="30"
              id="name"
              label="Address Proof Type"
              value={this.state.proof_type}
              options={[
                "Passport",
                "Driving License",
                "Utility Bill",
                "Bank Statement",
                "Aadhar Card",
                "Voter ID",
              ]}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default uploadAddressProof;
