import React, { Component } from "react";
import Container from "fund_details/common/Container";
import Input from "../../../common/ui/Input";

class NpsPran extends Component {
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
          <div className="InputField">
            <Input
              width="30"
              id="name"
              label="Pran"
              // onChange={handleChange("pan")}
            />
          </div>
      </Container>
    );
  }
}

export default NpsPran;
