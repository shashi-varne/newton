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
  formatAmountInr,
} from "utils/validators";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
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
          title: "BT details",
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
      title: `Hang on, while IDFC calculates your eligible loan amount as per their proprietary algorithms based on the information you have provided`,
      subtitle: "This may take around 2 minutes!",
    };

    let bt_info = lead.bt_info;

    let loan_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "PersonalLoan") {
        loan_bt.push({ ...bt_info[item] });
      }
    }

    if (!bt_info.bt_personal_loan) {
      this.navigate('credit-bt')
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
        screen_name: "select_bt",
        no_of_loans_selected: form_checked.length,
        skipped_screen: form_checked.length !== 0 ? "no" : user_action === 'next' ? "yes" : "no",
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
    ]
      keysToCheck.forEach(item => {
        if (!form_data[index][item.key]) {
          form_data[index][`${item.key}_error`] = `Please enter ${item.name}`;
          submit_form = false;
        }
      })
    this.setState({
      form_data: form_data,
    });
    return submit_form
  }

  handleClick = () => {
    let { form_data, bt_info } = this.state;
    let form_checked = form_data.filter(
      (item) => item.is_selected === true
    );

    let submit_details = true;
    form_data.forEach((data, index) => {
      if(data.is_selected) {
        submit_details = this.validateFields(form_data,index);
        if (data.principalOutstanding && data['principalOutstanding'] > 500000) {
          form_data[index]["principalOutstanding_error"] = `amount cannot exceed ${formatAmountInr(500000)}`;
          submit_details = false;
        }
    }
    })

    if (!submit_details) {
      this.setState({ form_data: form_data })
      return
    }

    if (form_checked.length > 3) {
      toast("more than 3 loan bt are not allowed");
      return;
    }

    this.sendEvents('next');

    if (submit_details) {
      if (!bt_info.bt_credit_card) {
        this.submitApplication(
          {
            bt_selection: form_checked,
          },
          "one",
          true,
          "eligible-loan"
        );
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

  render() {
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Select for balance transfer"
        buttonTitle={
          form_checked.length === 0 ? "SKIP AND CONTINUE" : "CONTINUE"
        }
        handleClick={this.handleClick}
        loaderData={this.state.loaderData}
        loaderWithData={this.state.loaderWithData}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        current={!this.state.bt_info.bt_credit_card ? "" : 1}
        total={!this.state.bt_info.bt_credit_card ? "" : 2}
        count={!this.state.bt_info.bt_credit_card ? "" : 1}
      >
        <div className="loan-bt">
          <div className="subtitle">
            Maximum 3 personal loan can be selected fot BT
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
                  <div className="head">Loan type</div>
                  <div className="sub-head">Personal loan</div>
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
                          value={
                            this.state.form_data[index].financierName ||
                            ""
                          }
                          onChange={this.handleChange("financierName", index)}
                        />
                    </div>

                    <div className="InputField">
                      <Input
                        error={
                          !!this.state.form_data[index].principalOutstanding_error
                        }
                        helperText={
                          this.state.form_data[index].principalOutstanding_error ||
                          numDifferentiationInr(
                            this.state.form_data[index].principalOutstanding 
                          )
                        }
                        type="number"
                        width="40"
                        label="Amount outstanding"
                        id="principalOutstanding"
                        name="principalOutstanding"
                        value={
                          this.state.form_data[index].principalOutstanding ||
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
