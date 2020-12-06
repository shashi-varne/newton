import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import Api from "utils/api";
import toast from "../../../common/ui/Toast";
import {
  numDifferentiationInr,
  formatAmount,
  inrFormatTest,
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

  handleChange = (name, index) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[index][name] = value;
    // form_data[index][name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    this.updateApplication({
      bt_selection: this.state.form_data.filter((data) => data.is_selected),
    });
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
                        // error={!!this.state.form_data.financierName_error}
                        // helperText={this.state.form_data.financierName_error}
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
                        // error={
                        //   !!this.state.form_data.principalOutstanding_error
                        // }
                        helperText={
                          this.state.form_data.principalOutstanding_error ||
                          numDifferentiationInr(
                            this.state.form_data[index].principalOutstanding
                          )
                        }
                        type="text"
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
