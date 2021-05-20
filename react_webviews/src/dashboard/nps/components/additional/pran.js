import React, { Component } from "react";
import Container from "../../../common/Container";
import InputWithIcon from "common/ui/InputWithIcon";
import { initialize } from "../../common/commonFunctions";
import card from "assets/card.png";

class NpsPran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      pran: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.setState({
      skelton: false
    })
  };

  handleChange = (name) => (event) => {
    let value = event.target.value;
    if(value.length > 12) {
      return
    }
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
        data-aid='nps-pran-details-screen'
        buttonTitle="CONTINUE"
        title="PRAN Details"
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        skelton={this.state.skelton}
        handleClick={this.handleClick}
      >
        <div className="pran-details" data-aid='nps-pran-details'>
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
          <div className="tnc" data-aid='nps-tnc'>
            PRAN is unique account number allotted to every NPS account
            subscriber, check for it on your PAN card
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPran;
