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
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: "Income and loan offer",
      steps: [
        {
          title: "Income details",
          status: "completed",
        },
        {
          title: "BT transfer details",
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

    let bt_info = lead.bt_info;

    let loan_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "PersonalLoan") {
        loan_bt.push({ [item]: bt_info[item].typeOfLoan });
      }
    }

    loan_bt.forEach(() => {
      this.state.form_data.push({});
    });

    this.setState({
      loan_bt: loan_bt,
    });
  };

  sendEvents(user_action, data={}) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "select_bt",
        no_of_loans_selected: data.no_of_loans_selected,
        skipped_screen: data.no_of_loans_selected !==0 ? "no" : "yes",
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
    let { form_data } = this.state;
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

    this.sendEvents('next', { no_of_cards_entered: form_checked.length, });
    this.updateApplication({
      bt_selection: form_checked,
    });
  };

  handleCheckbox = (checked, index, id) => {
    let { form_data } = this.state;
    form_data[index]["is_selected"] = checked;
    form_data[index]["bt_data_id"] = id;
    if(checked)
      this.validateFields(form_data,index);
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
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
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
                    checked={item.checked}
                    color="primary"
                    id="checkbox"
                    name="checkbox"
                    disableRipple
                    onChange={(event) =>
                      this.handleCheckbox(
                        event.target.checked,
                        index,
                        Object.keys(item)[0]
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
                        options={this.state.bankOptions}
                        label="Financer name"
                        id="financierName"
                        name="financierName"
                        error={!!this.state.form_data[index].financierName_error}
                        helperText={this.state.form_data[index].financierName_error}
                        value={
                          this.state.form_data[index].financierName ||
                          item.financierName ||
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
                          item.principalOutstanding ||
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
