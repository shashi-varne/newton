import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import toast from "../../../common/ui/Toast";
import {
  numDifferentiationInr,
  formatAmount,
} from "utils/validators";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "loan_bt",
      form_data: [],
      loan_bt: [],
      bankOptions: [],
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

  onload = async () => {
    let lead = this.state.lead || {};
    let loaderData = {
      title: `Hang on while IDFC FIRST Bank calculates the eligible loan offer `,
      subtitle: "It usually takes around 2 minutes!",
    };

    let bt_info = lead.bt_info;
    let vendor_info = lead.vendor_info || {};

    let loan_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "PersonalLoan") {
        loan_bt.push({ ...bt_info[item] });
      }
    }

    if (!bt_info.bt_personal_loan) {
      this.navigate("credit-bt");
    }

    loan_bt.forEach((data) => {
      this.state.form_data.push({
        is_selected: data.is_selected,
        financierName: data.financierName,
        principalOutstanding: data.principalOutstanding,
        bt_data_id: data.bt_data_id,
      });
    });

    this.setState({
      loan_bt: loan_bt,
      bt_info: bt_info,
      loaderData: loaderData,
      vendor_info: vendor_info
    });
  };

  sendEvents(user_action) {
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_select_bt",
      properties: {
        user_action: user_action,
        no_of_loans_selected: form_checked.length,
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
      value = amt.split(',').join('');
    }

    form_data[index][name] = value;
    form_data[index][name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  validateFields(form_data, index) {
    let submit_form = true;
    let keysToCheck = [
      { key: "financierName", name: "financier name" },
      { key: "principalOutstanding", name: "amount" },
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
  }

  handleClick = () => {
    let { form_data, bt_info, vendor_info } = this.state;
    let form_checked = form_data.filter((item) => item.is_selected === true);

    let submit_details = true;
    form_data.forEach((data, index) => {
      if (data.is_selected) {
        submit_details = this.validateFields(form_data, index);
        
        // if (data.principalOutstanding) {
        //   form_data[index][
        //     "principalOutstanding"
        //     // eslint-disable-next-line
        //   ] = parseInt((data["principalOutstanding"] || '').replaceAll(',', ''))
        // }
      }
    });

    if (!submit_details) {
      this.setState({ form_data: form_data, loaderWithData: false });
      return;
    }

    if (form_checked.length > 3) {
      toast("more than 3 loan bt are not allowed");
      return;
    }

    this.sendEvents("next");

    if (submit_details) {
      if (!bt_info.bt_credit_card) {
        this.setState({
          loaderWithData: true
        })
        if (vendor_info.idfc_07_state !== "success" && vendor_info.perfios_state !== 'bypass') {
          this.get07State({
            bt_selection: form_checked,
          });
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
      } else {
        this.updateApplication({
          bt_selection: form_checked,
        });
      }
    }
  };

  handleCheckbox = (checked, index, id) => {
    let { form_data } = this.state;
    form_data[index]["is_selected"] = checked;
    form_data[index]["bt_data_id"] = id;

    this.setState({
      form_data: form_data,
    });
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
        hidePageTitle={true}
        handleClick={this.handleClick}
        loaderData={this.state.loaderData}
        loaderWithData={this.state.loaderWithData}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="loan-bt">
          <div className="header-title-page">
            <div>Select existing loans for balance transfer</div>
            <div className="count">
              {!this.state.bt_info.bt_credit_card ? "" : 1}
              <span className="total">
                /{!this.state.bt_info.bt_credit_card ? "" : 2}
              </span>
            </div>
          </div>
          <div className="subtitle">
            Maximum 3 personal loans can be selected
          </div>

          {this.state.loan_bt.map((item, index) => (
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
                  <div className="head">Personal loan {index+1}</div>
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
                          !!this.state.form_data[index]
                            .principalOutstanding_error
                        }
                        helperText={
                          this.state.form_data[index]
                            .principalOutstanding_error ||
                            numDifferentiationInr(this.state.form_data[index]
                              .principalOutstanding || 0)
                          // numDifferentiationInr(
                          //   (
                          //     this.state.form_data[index]
                          //       .principalOutstanding || ""
                          //   )
                          //     .toString()
                          //     .replaceAll(",", "")
                          // )
                        }
                        // type="number"
                        inputMode="numeric"
                        width="40"
                        label="Amount outstanding"
                        id="principalOutstanding"
                        name="principalOutstanding"
                        // `₹ ${formatAmount(data["principalOutstanding"])}`
                        value={
                          this.state.form_data[index].principalOutstanding ? `₹ ${formatAmount(this.state.form_data[index].principalOutstanding)}` :
                          // item.principalOutstanding ||
                          ""
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
