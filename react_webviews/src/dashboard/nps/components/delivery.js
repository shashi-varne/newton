import React, { Component } from "react";
import Container from "fund_details/common/Container";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import person from "../../../assets/person.png";

class NpsDelivery extends Component {
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
        buttonTitle="CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="Confirm Delivery Details"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            You will get the <span className="bold">PRAN</span> card delivered to
            this address
          </div>
        </div>

        <div className="nps-delivery-details">
          <div className="title">PRAN delivery address</div>

          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Pincode"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="name"
              label="Permanent address (house, building, street)"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="name"
              label="City"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="name"
              label="State"
              // onChange={handleChange("pan")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsDelivery;
