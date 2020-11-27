import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";

class EligibleLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "eligible_loan",
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
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        buttonTitle="VIEW FINAL OFFER"
      >
        <div className="eligible-loan">
          <div className="subtitle">
            Woo-hoo! IDFC is offering you a personal loan of ₹40 lacs
          </div>

          <div className="offer-checkbox">
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
                <div className="title">I want to proceed with this offer</div>
                <div className="content">
                  <div className="sub-content">
                    <div className="sub-head">Loan amount</div>
                    <div className="sub-title"> ₹40 lakhs</div>
                  </div>
                  <div className="sub-content">
                    <div className="sub-head">Tenure</div>
                    <div className="sub-title">40 months</div>
                  </div>
                </div>
                <div className="content">
                  <div className="sub-content">
                    <div className="sub-head">Loan amount</div>
                    <div className="sub-title"> ₹40 lakhs</div>
                  </div>
                  <div className="sub-content">
                    <div className="sub-head">Tenure</div>
                    <div className="sub-title">40 months</div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="offer-checkbox">
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
                <div className="title">I want to customise my loan offer</div>
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <div className="InputField">
                <Input
                  //   error={!!this.state.form_data.current_address1_error}
                  helperText={"Min ₹1 lakh to max 40 lakhs"}
                  type="text"
                  width="40"
                  label="Loan amount"
                  id="loan_amount"
                  name="loan_amount"
                  value={this.state.form_data.loan_amount || ""}
                  onChange={this.handleChange("loan_amount")}
                />
              </div>
              <div className="InputField">
                <Input
                  //   error={!!this.state.form_data.current_address1_error}
                  helperText={"Min 12 months to max 48 months"}
                  type="text"
                  width="40"
                  label="Tenure"
                  id="tenure"
                  name="tenure"
                  value={this.state.form_data.tenure || ""}
                  onChange={this.handleChange("tenure")}
                />
              </div>
            </FormControl>
            <div className="estimated-emi">
              <div className="title">Estimated EMI</div>
              <div className="emi">₹0/month</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default EligibleLoan;
