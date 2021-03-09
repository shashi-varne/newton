import React, { Component } from "react";
import Container from "fund_details/common/Container";
import InputWithIcon from "common/ui/InputWithIcon";
import { initialize } from "../../common/commonFunctions";
import card from "assets/card.png";

class NpsPran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      pran: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = (name) => (event) => {
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleClick = () => {
    let data = {
      pran: this.state.pran,
    };
    this.submitPran(data);
  };

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="PRAN Details"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="pran-details">
          <div className="InputField">
            <InputWithIcon
              icon={card}
              width="30"
              type="number"
              id="pran"
              label="PRAN number"
              maxLength={12}
              value={this.state.pran}
              onChange={this.handleChange("pran")}
            />
          </div>
          <div class="tnc">
            PRAN is unique account number allotted to every NPS account
            subscriber, check for it on your PAN card
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPran;
