import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import { numDifferentiationInr } from "utils/validators";

class EligibleLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "eligible_loan",
      form_data: {},
      checked: "default_tenor",
      vendor_info: {}
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let progressHeaderData = {
      title: 'Income and loan offer',
      steps: [
        {
          'title': 'Income details',
          'status': 'completed'
        },
        {
          'title': 'BT transfer details',
          'status': 'completed'
        },
        {
          'title': 'Loan offer',
          'status': 'init'
        }
      ]
    }

    this.setState({
      progressHeaderData: progressHeaderData
    })
  }

  onload = () => { 
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      vendor_info: vendor_info
    })
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        "screen_name": 'eligible_loan',
        offer_selected: this.state.checked=== 'default_tenor' ? 'default' : 'customised',
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data.amount_required = value;
    form_data.amount_required_error = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    this.sendEvents('next');
    let { form_data } = this.state;

    if (this.state.checked === "default_tenor") {
      form_data.amount_required = "4000000";
      form_data.amount_required_error = "";
    }

    let keys_to_check = ["amount_required"]

    this.formCheckUpdate(keys_to_check, form_data, 'one_point_one', true);
  }

  handleCheckbox = (name) => {
    this.setState({
      checked: name,
    });
  };

  render() {
    let { vendor_info } = this.state;
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        buttonTitle="VIEW FINAL OFFER"
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData
        }}
      >
        <div className="eligible-loan">
          <div className="subtitle">
            Woo-hoo! IDFC is offering you a personal loan of ₹40 lacs
          </div>

          <div
            className="offer-checkbox"
            style={{
              background:
                this.state.checked === "default_tenor"
                  ? "var(--highlight)"
                  : "#ffffff",
            }}
          >
            <Grid container spacing={16}>
              <Grid item xs={1}>
                <Checkbox
                  checked={this.state.checked === "default_tenor"}
                  color="primary"
                  id="default_tenor"
                  name="default_tenor"
                  disableRipple
                  onChange={() => this.handleCheckbox("default_tenor")}
                  className="Checkbox"
                />
              </Grid>

              <Grid item xs={11}>
                <div className="title">I want to proceed with this offer</div>
                <div className="content">
                  <div className="sub-content-left">
                    <div className="sub-head">Loan amount</div>
                    <div className="sub-title">₹{vendor_info.displayOffer}</div>
                  </div>
                  <div className="sub-content-right">
                    <div className="sub-head">Tenure</div>
                    <div className="sub-title">40 months</div>
                  </div>
                </div>
                <div className="content">
                  <div className="sub-content-left">
                    <div className="sub-head">EMI amount</div>
                    <div className="sub-title">₹33,000/month</div>
                  </div>
                  <div className="sub-content-right">
                    <div className="sub-head">Rate of interest</div>
                    <div className="sub-title">24%</div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          <div
            className="offer-checkbox"
            style={{
              background:
                this.state.checked === "custom_tenor"
                  ? "var(--highlight)"
                  : "#ffffff",
            }}
          >
            <Grid container spacing={16}>
              <Grid item xs={1}>
                <Checkbox
                  checked={this.state.checked === "custom_tenor"}
                  color="primary"
                  id="custom_tenor"
                  name="custom_tenor"
                  disableRipple
                  onChange={() => this.handleCheckbox("custom_tenor")}
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
                  error={!!this.state.form_data.amount_required_error}
                  helperText={
                    this.state.form_data.amount_required_error ||
                    numDifferentiationInr(
                      this.state.form_data.amount_required
                    ) ||
                    "Min ₹1 lakh to max 40 lakhs"
                  }
                  type="number"
                  width="40"
                  label="Loan amount"
                  id="amount_required"
                  name="amount_required"
                  value={this.state.form_data.amount_required || ""}
                  onChange={this.handleChange("amount_required")}
                  disabled={this.state.checked !== "custom_tenor"}
                />
              </div>
              <div className="InputField">
                <Input
                  helperText={"Min 12 months to max 48 months"}
                  type="text"
                  width="40"
                  label="Tenure"
                  id="tenure"
                  name="tenure"
                  value={this.state.form_data.tenure || ""}
                  onChange={this.handleChange("tenure")}
                  disabled={true}
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
