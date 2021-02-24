import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import scrollIntoView from "scroll-into-view-if-needed";
import {
  changeNumberFormat,
  formatAmountInr,
  inrFormatDecimal,
  numDifferentiationInr,
  formatAmount
} from "utils/validators";

class EligibleLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "eligible_loan",
      form_data: {},
      checked: "default_tenor",
      vendor_info: {},
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    let progressHeaderData = {
      title: "income details and loan offer",
      steps: [
        {
          title: "Income details",
          status: "completed",
        },
        {
          title: "Loan offer",
          status: "init",
        },
      ],
    };

    if (vendor_info.bt_eligible) {
      progressHeaderData.steps.splice(1, 0, {
        title: "Balance transfer details",
        status: "completed",
      });
    }

    let loaderData = {
      title: `Hang on while IDFC FIRST Bank calculates final loan offer`,
      subtitle: "It usually takes around 2 minutes!",
    };

    this.setState({
      vendor_info: vendor_info,
      loaderData: loaderData,
      progressHeaderData: progressHeaderData,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_loan_offer",
      properties: {
        user_action: user_action,
        offer_selected:
          this.state.checked === "default_tenor" ? "default" : "customised",
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
    let { form_data, vendor_info } = this.state;

    if (name === "amount_required") {
      let amt = (value.match(/\d+/g) || "").toString();
      if (amt) {
        value = `₹ ${formatAmount(amt.replaceAll(",", ""))}`;
      } else {
        value = amt;
      }
    }

    let emi_amount = value.slice(2).replaceAll(',', '')

    form_data.amount_required = value;
    form_data.amount_required_error = "";

    let P = emi_amount;
    let r = vendor_info.ROI / 1200;
    let n = vendor_info.netTenor;

    form_data.emi_amount =
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    let { form_data, vendor_info } = this.state;

    if (this.state.checked === "default_tenor") {
      form_data.amount_required = vendor_info.display_loan_amount;
      form_data.amount_required_error = "";
    } else {
      form_data.amount_required = (form_data.amount_required || '').slice(2).replaceAll(',', '');
      form_data.maxAmount = vendor_info.displayOffer;
    }

    let keys_to_check = ["amount_required"];

    this.formCheckUpdate(keys_to_check, form_data, "one_point_one", true);
  };

  handleCheckbox = (name) => {
    if (name === "custom_tenor") {
      this.handleScroll("emi");
    } else {
      this.handleScroll("max-amount");
    }
    this.setState({
      checked: name,
    });
  };

  handleScroll = (id) => {
    let that = this;

    setTimeout(function () {
      let element = document.getElementById(id);
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: that.state.checked === "default_tenor" ? "end" : "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "EDIT",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    let { vendor_info } = this.state;
    let ROI = (vendor_info.initial_offer_roi / 100) * 100;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        buttonTitle="VIEW FINAL OFFER"
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="eligible-loan" id="max-amount">
          <div className="max-amount">
            <img
              src={require(`assets/${this.state.productName}/congrats.svg`)}
              alt=""
            />
            <div className="head">
              <b>Congrats!</b> You’re eligible for a loan up to
            </div>
            <div className="max-loan-amt">
              {formatAmountInr(vendor_info.displayOffer || "0")}
            </div>
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
                    <div className="sub-title">
                      ₹
                      {changeNumberFormat(
                        vendor_info.display_loan_amount || "0"
                      )}
                    </div>
                  </div>
                  <div className="sub-content-right">
                    <div className="sub-head">Tenure</div>
                    <div className="sub-title">{`${vendor_info.initial_offer_tenor} months`}</div>
                  </div>
                </div>
                <div className="content">
                  <div className="sub-content-left">
                    <div className="sub-head">EMI amount</div>
                    <div className="sub-title">
                      {formatAmountInr(vendor_info.initial_offer_emi)}
                    </div>
                  </div>
                  <div className="sub-content-right">
                    <div className="sub-head">Rate of interest</div>
                    <div className="sub-title">{ROI}% p.a.</div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          <div className={`offer-checkbox ${this.state.checked}`}>
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
                {this.state.checked === "custom_tenor" && (
                  <>
                    <FormControl fullWidth>
                      <div className="InputField" id="amount">
                        <Input
                          error={!!this.state.form_data.amount_required_error}
                          helperText={
                            this.state.form_data.amount_required_error ||
                            (this.state.form_data.amount_required &&
                              numDifferentiationInr(
                                (this.state.form_data.amount_required || "")
                                  .toString()
                                  .slice(1)
                                  .replaceAll(",", "")
                              )) ||
                            `Min ₹1 lakh to max ₹${changeNumberFormat(
                              vendor_info.displayOffer || "0"
                            )}`
                          }
                          // type="number"
                          inputMode="numeric"
                          width="40"
                          label="Loan amount"
                          id="amount_required"
                          name="amount_required"
                          value={this.state.form_data.amount_required || ""}
                          onChange={this.handleChange("amount_required")}
                          disabled={this.state.checked !== "custom_tenor"}
                        />
                      </div>
                    </FormControl>
                    <div className="estimated-emi" id="emi">
                      <div className="title">Estimated EMI</div>
                      <div className="emi">
                        {inrFormatDecimal(
                          this.state.form_data.emi_amount || "0"
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    );
  }
}

export default EligibleLoan;
