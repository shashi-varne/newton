import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "loan_bt",
      form_data: [],
      credit_bt: [],
      bankOptions: []
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
          'status': 'init'
        },
        {
          'title': 'Loan offer',
          'status': 'pending'
        }
      ]
    }

    this.setState({
      progressHeaderData: progressHeaderData
    })

  }

  onload = () => {
    let lead = this.state.lead || {};

    let bt_info = lead.bt_info;

    let credit_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "CreditCard") {
        credit_bt.push({ [item]: bt_info[item].typeOfLoan });
      }
    }

    this.setState({
      credit_bt: credit_bt,
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

  handleChange = (name, id) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleCheckbox = (id) => {
    let checked = this.state.checked;

    this.setState({
      checked: !checked,
    });
  };

  handleClick = () => {
    
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Credit card details"
        buttonTitle="Skip and continue"
        hanndleClick={this.hanndleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData
        }}
      >
        <div className="loan-bt">
          <div className="subtitle">
            Maximum 2 credit cards can be selected for BT
          </div>

          {this.state.credit_bt.map((item, index) => (
            <div className="loan-bt-checkbox" key={index}>
              <Grid container spacing={16}>
                <Grid item xs={1}>
                  <Checkbox
                    checked={item.checked}
                    color="primary"
                    id="checkbox"
                    name="checkbox"
                    disableRipple
                    onChange={(event) => this.handleCheckbox(item)}
                    className="Checkbox"
                  />
                </Grid>

                <Grid item xs={11}>
                  <div className="head">Card limit</div>
                  <div className="sub-head">₹40 lacs</div>
                  <FormControl fullWidth>
                    <div className="InputField">
                      <DropdownWithoutIcon
                        width="40"
                        options={this.state.bankOptions}
                        label="Financer name"
                        id="financierName"
                        name="financierName"
                        error={!!this.state.form_data.financierName_error}
                        helperText={this.state.form_data.financierName_error}
                        value={
                          this.state.form_data.financierName ||
                          item.financierName ||
                          ""
                        }
                        onChange={this.handleChange("financierName", item.id)}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={!!this.state.form_data.creditCardNumber_error}
                        helperText={
                          this.state.form_data.creditCardNumber_error
                        }
                        type="number"
                        width="40"
                        maxLength={4}
                        label="Card number (last four digit)"
                        id="creditCardNumber"
                        name="creditCardNumber"
                        value={this.state.form_data.creditCardNumber || ""}
                        onChange={this.handleChange("creditCardNumber")}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={!!this.state.form_data.creditCardExpiryDate_error}
                        helperText={
                          this.state.form_data.creditCardExpiryDate_error
                        }
                        type="text"
                        width="40"
                        maxLength={7}
                        label="Expiry date"
                        id="creditCardExpiryDate"
                        name="creditCardExpiryDate"
                        value={this.state.form_data.creditCardExpiryDate || ""}
                        onChange={this.handleChange("creditCardExpiryDate")}
                      />
                    </div>

                    <div className="InputField">
                      <Input
                        error={
                          !!this.state.form_data.principalOutstanding_error
                        }
                        helperText={
                          this.state.form_data.principalOutstanding_error
                        }
                        type="text"
                        width="40"
                        label="Amount outstanding"
                        id="principalOutstanding"
                        name="principalOutstanding"
                        value={
                          this.state.form_data.principalOutstanding ||
                          item.principalOutstanding ||
                          ""
                        }
                        onChange={this.handleChange(
                          "principalOutstanding",
                          item.id
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
