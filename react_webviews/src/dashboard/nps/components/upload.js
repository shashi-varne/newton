import React, { Component } from "react";
import Container from "fund_details/common/Container";
// import Input from "../../../common/ui/Input";
import SelectWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class uploadAddressProof extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
  }

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
            <span className="bold">Address:</span>
          </div>
        </div>

        <div className="nps-upload">
          <div className="InputField">
            <SelectWithoutIcon
              width="30"
              id="name"
              label="Address Proof Type"
              value={2}
              options={[
                "Passport",
                "Driving License",
                "Utility Bill",
                "Bank Statement",
                "Aadhar Card",
                "Voter ID"
              ]}
              // onChange={handleChange("pan")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default uploadAddressProof;
