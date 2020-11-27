import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "loan_bt",
      form_data: {},
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "address",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = () => {};

  hanndleClick = () => {};

  render() {
    return (
      <Container
        title="Credit card details"
        buttonTitle="Skip and continue"
        hanndleClick={this.hanndleClick}
      >
        <div className="loan-bt">
          <div className="subtitle">
            Maximum 2 credit cards can be selected for BT
          </div>

          <div className="loan-bt-checkbox">
            <Grid container spacing={16}>
              <Grid item xs={1}>
                <Checkbox
                  checked={true}
                  color="primary"
                  // value={member}
                  //   id={member.backend_key}
                  //   name={member.backend_key}
                  disableRipple
                  //   onChange={(event) =>
                  //     this.props.handleCheckbox(event, index, member)
                  //   }
                  className="Checkbox"
                />
              </Grid>
              
              <Grid item xs={11}>
                <div className="head">Card limit</div>
                <div className="sub-head">₹40 lacs</div>
                <FormControl fullWidth>
                  <div className="InputField">
                    <Input
                      //   error={!!this.state.form_data.current_address1_error}
                      //   helperText={"Min ₹1 lakh to max 40 lakhs"}
                      type="text"
                      width="40"
                      label="Financer name"
                      id="financer_name"
                      name="financer_name"
                      value={this.state.form_data.financer_name || ""}
                      onChange={this.handleChange("financer_name")}
                    />
                  </div>
                  <div className="InputField">
                    <Input
                      //   error={!!this.state.form_data.current_address1_error}
                      //   helperText={"Min 12 months to max 48 months"}
                      type="text"
                      width="40"
                      label="Card number (last four digit)"
                      id="amount"
                      name="amount"
                      value={this.state.form_data.amount || ""}
                      onChange={this.handleChange("amount")}
                    />
                  </div>
                  <div className="InputField">
                    <Input
                      //   error={!!this.state.form_data.current_address1_error}
                      //   helperText={"Min 12 months to max 48 months"}
                      type="text"
                      width="40"
                      label="Expiry date"
                      id="amount"
                      name="amount"
                      value={this.state.form_data.amount || ""}
                      onChange={this.handleChange("amount")}
                    />
                  </div>
                  <div className="InputField">
                    <Input
                      //   error={!!this.state.form_data.current_address1_error}
                      //   helperText={"Min 12 months to max 48 months"}
                      type="text"
                      width="40"
                      label="Amount outstanding"
                      id="amount"
                      name="amount"
                      value={this.state.form_data.amount || ""}
                      onChange={this.handleChange("amount")}
                    />
                  </div>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    );
  }
}

export default LoanBtDetails;
