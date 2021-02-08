import React, { Component } from "react";
import Container from "fund_details/common/Container";
// import toast from "common/ui/Toast";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import RadioWithIcon from "../../../common/ui/RadioWithoutIcon";
import person from "../../../assets/person.png";

class NpsIdentity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
  }

  componentWillMount() {
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Additional Details"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please <span className="bold">confirm</span> your personal details.
          </div>
        </div>

        <div className="nps-identity">
          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Mother's name"
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <RadioWithIcon
              width="30"
              id="name"
              label="Marital Status"
              options={[{
                  name: "status", value: 'hvgh'
              },{
                name: "status", value: 'hvgh'
            }]}
              // onChange={handleChange("pan")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Spouse's name"
              // onChange={handleChange("pan")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsIdentity;
