import React, { Component } from "react";
import Container from "fund_details/common/Container";
import toast from "common/ui/Toast";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import person from "../../../assets/person.png";
import "../style.scss";

class NpsNominee extends Component {
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
        buttonTitle="SAVE AND CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="Nominee Details"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please <span className="bold">confirm</span> the nominee details.
          </div>
        </div>

        <div className="nps-nominee">
          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Nominee Name"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Nominee DOB (DD/MM/YYYY)"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Relationship"
              // onChange={handleChange("pan")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsNominee;
