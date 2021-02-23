import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import {
  formatMonthandYear,
  dobFormatTest,
  isValidMonthYear,
  numDifferentiationInr,
  formatAmount,
  IsFutureMonthYear,
} from "utils/validators";
import toast from "../../../common/ui/Toast";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "credit_bt",
      skelton: 'g',
      form_data: [],
      credit_bt: [],
      bankOptions: [],
      form_checked: [],
      bt_info: {},
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: "income details and loan offer",
      steps: [
        {
          title: "Income details",
          status: "completed",
        },
        {
          title: "Balance transfer details",
          status: "init",
        },
        {
          title: "Loan offer",
          status: "pending",
        },
      ],
    };

    this.setState({
      progressHeaderData: progressHeaderData,
    });
  }

  onload = () => {
    let loaderData = {
      title: `Hang on while IDFC FIRST Bank calculates the eligible loan offer `,
      subtitle: "It usually takes around 2 minutes!",
    };

    let lead = this.state.lead || {};

    let bt_info = lead.bt_info;
    let vendor_info = lead.vendor_info || {};

    let credit_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "CreditCard") {
        credit_bt.push({ ...bt_info[item] });
      }
    }

    credit_bt.forEach((data) => {
      this.state.form_data.push({
        is_selected: data.is_selected,
        financierName: data.financierName,
        // principalOutstanding: data.principalOutstanding,
        principalOutstanding: `₹ ${formatAmount(data.principalOutstanding)}`,
        bt_data_id: data.bt_data_id,
        creditCardExpiryDate: data.creditCardExpiryDate,
        creditCardNumber: data.creditCardNumber,
        bt_info: bt_info,
      });
    });

    this.setState({
      credit_bt: credit_bt,
      loaderData: loaderData,
      bt_info: bt_info,
      vendor_info: vendor_info
    });
  };

  sendEvents(user_action) {
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "credit_card_details",
        no_of_cards_entered: form_checked.length,
        skipped_screen:
          form_checked.length !== 0
            ? "no"
            : user_action === "next"
            ? "yes"
            : "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (name, index) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === "principalOutstanding") {
      let amt = (value.match(/\d+/g) || "").toString();
      if (amt) {
        value = `₹ ${formatAmount(amt.replaceAll(",", ""))}`;
      } else {
        value = amt;
      }
    }

    if (name === "creditCardNumber") {
      if (value.length <= 4) form_data[index][name] = value;
    } else if (name === "creditCardExpiryDate") {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(`card-expiry-${index + 1}`);
      input.onkeyup = formatMonthandYear;

      form_data[index][name] = value;
    } else {
      form_data[index][name] = value;
    }

    form_data[index][name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  validateFields = (form_data, index) => {
    let submit_form = true;
    let keysToCheck = [
      { key: "financierName", name: "financier name" },
      { key: "creditCardNumber", name: "credit card number" },
      { key: "creditCardExpiryDate", name: "credit card expiry date" },
      { key: "principalOutstanding", name: "principal outstanding" },
    ];

    keysToCheck.forEach((item) => {
      if (!form_data[index][item.key]) {
        form_data[index][`${item.key}_error`] = `Please enter ${item.name}`;
        submit_form = false;
      }
    });

    this.setState({
      form_data: form_data,
    });
    return submit_form;
  };

  handleCheckbox = (checked, index, id) => {
    let { form_data } = this.state;

    form_data[index]["is_selected"] = checked;
    form_data[index]["bt_data_id"] = id;

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data, vendor_info } = this.state;
    let form_checked = form_data.filter((item) => item.is_selected === true);

    let submit_details = true;
    form_data.forEach((data, index) => {
      if (data.is_selected) {
        submit_details = this.validateFields(form_data, index);
        if (data.creditCardNumber && data.creditCardNumber.length < 4) {
          form_data[index]["creditCardNumber_error"] =
            "please enter last 4 digits of credit card number";
          submit_details = false;
        }

        if (
          !isValidMonthYear(data["creditCardExpiryDate"]) ||
          !IsFutureMonthYear(data["creditCardExpiryDate"])
        ) {
          form_data[index]["creditCardExpiryDate_error"] =
            "please enter valid credit card expiry date";
          submit_details = false;
        }

        if (data.principalOutstanding) {
          form_data[index][
            "principalOutstanding"
            // eslint-disable-next-line
          ] = parseInt((data["principalOutstanding"] || '').slice(1).replaceAll(',', ''))
        }
      }
    });

    if (!submit_details) {
      this.setState({ form_data: form_data });
      return;
    }

    if (form_checked.length > 2) {
      toast("more than 2 credit bt are not allowed");
      return;
    }

    this.sendEvents("next");

    if (submit_details) {
      if (vendor_info.idfc_07_state === "success") {
        this.get07State();
      } else {
        this.submitApplication(
          {
            bt_selection: form_checked,
          },
          "one",
          true,
          "eligible-loan"
        );
      }
    }
  };

  goBack = () => {
    this.sendEvents("back");

    let bt_personal_loan = this.state.bt_info.bt_personal_loan;
    if (!bt_personal_loan) {
      this.navigate("journey");
    } else {
      this.navigate("loan-bt");
    }
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
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        buttonTitle={
          form_checked.length === 0 ? "SKIP AND CONTINUE" : "CONTINUE"
        }
        handleClick={this.handleClick}
        hidePageTitle={true}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
          goBack: this.goBack,
        }}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="loan-bt">
          <div className="header-title-page" style={{ marginBottom: "0px" }}>
            <div>Credit card details</div>
            <div className="count">
              {!this.state.bt_info.bt_personal_loan ? "" : 2}
              <span className="total">
                /{!this.state.bt_info.bt_personal_loan ? "" : 2}
              </span>
            </div>
          </div>
          <div className="subtitle">Maximum 2 credit cards can be selected</div>

          {this.state.credit_bt.map((item, index) => (
            <div className="loan-bt-checkbox" key={index}>
              <Grid container spacing={16}>
                <Grid item xs={1}>
                  <Checkbox
                    checked={this.state.form_data[index].is_selected}
                    color="primary"
                    id="checkbox"
                    name="checkbox"
                    disableRipple
                    onClick={() =>
                      this.handleCheckbox(
                        !this.state.form_data[index].is_selected,
                        index,
                        item.bt_data_id
                      )
                    }
                    className="Checkbox"
                  />
                </Grid>

                <Grid item xs={11}>
                  <div className="head">Card with limit of ₹40 lakhs</div>
                  <FormControl fullWidth>
                    <div className="InputField">
                      <DropdownWithoutIcon
                        width="40"
                        options={this.state.screenData.bankOptions}
                        label="Financer name"
                        id="financierName"
                        name="financierName"
                        error={
                          !!this.state.form_data[index].financierName_error
                        }
                        helperText={
                          this.state.form_data[index].financierName_error
                        }
                        value={this.state.form_data[index].financierName || ""}
                        onChange={this.handleChange("financierName", index)}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={
                          !!this.state.form_data[index].creditCardNumber_error
                        }
                        helperText={
                          this.state.form_data[index].creditCardNumber_error
                        }
                        type="number"
                        width="40"
                        maxLength={4}
                        label="Card number (last four digit)"
                        id="creditCardNumber"
                        name="creditCardNumber"
                        value={
                          this.state.form_data[index].creditCardNumber || ""
                        }
                        onChange={this.handleChange("creditCardNumber", index)}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={
                          !!this.state.form_data[index]
                            .creditCardExpiryDate_error
                        }
                        helperText={
                          this.state.form_data[index].creditCardExpiryDate_error
                        }
                        type="text"
                        width="40"
                        maxLength={7}
                        label="Expiry date (MM/YYYY)"
                        id={`card-expiry-${index + 1}`}
                        name="creditCardExpiryDate"
                        value={
                          this.state.form_data[index].creditCardExpiryDate || ""
                        }
                        onChange={this.handleChange(
                          "creditCardExpiryDate",
                          index
                        )}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={
                          this.state.form_data[index].principalOutstanding_error
                        }
                        helperText={
                          this.state.form_data[index]
                            .principalOutstanding_error ||
                          numDifferentiationInr(
                            (
                              this.state.form_data[index]
                                .principalOutstanding || ""
                            )
                              .toString()
                              .slice(1)
                              .replaceAll(",", "")
                          )
                        }
                        // type="number"
                        width="40"
                        label="Amount outstanding"
                        id="principalOutstanding"
                        name="principalOutstanding"
                        value={
                          this.state.form_data[index].principalOutstanding || ""
                        }
                        onChange={this.handleChange(
                          "principalOutstanding",
                          index
                        )}
                      />
                    </div>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </Container>
    );
  }
}

export default LoanBtDetails;
