import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
// import { FormControl } from "material-ui/Form";
// import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
// import Checkbox from "material-ui/Checkbox";
// import Input from "../../../common/ui/Input";
// import Grid from "material-ui/Grid";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "basic_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (name) => (event) => {};

  handleClick = (event) => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select for balance transfer"
        buttonTitle="SKIP AND CONTINUE"
        handleClick={this.handleClick}
        total={2}
        count={1}
        current={1}
      >
        <div className="loan-bt-details">
          <div className="sub-head">
            Maximum 3 personal loan can be selected fot BT
          </div>
        </div>
      </Container>
    );
  }
}

export default LoanBtDetails;
