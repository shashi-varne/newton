import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Checkbox from "material-ui/Checkbox";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { formatMonthandYear, dobFormatTest } from "utils/validators";
import toast from "../../../common/ui/Toast";

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "credit_bt",
      form_data: [],
      credit_bt: [],
      bankOptions: [],
      form_checked: [],
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

  onload = () => {
    let lead = this.state.lead || {};

    let bt_info = lead.bt_info;

    let credit_bt = [];

    for (var item in bt_info) {
      if (bt_info[item].typeOfLoan === "CreditCard") {
        credit_bt.push({ [item]: bt_info[item].typeOfLoan });
      }
    }

    credit_bt.forEach(() => {
      this.state.form_data.push({});
    });

    this.setState({
      credit_bt: credit_bt,
    });
  };

  sendEvents(user_action, data={}) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "credit_card_details", 
        no_of_cards_entered: data.no_of_cards_entered,
        skipped_screen: data.no_of_cards_entered !==0 ? "no" : "yes",
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

    if (
      name === "creditCardNumber" &&
      (form_data[index][name] || "").length >= 4
    ) {
      return;
    }

    if (name === "creditCardExpiryDate") {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(`card-expiry-${index + 1}`);
      input.onkeyup = formatMonthandYear;

      form_data[index][name] = value;
    } else {
      form_data[index][name] = value;
    }

    // form_data[index][name + "_error"] = "";

    this.setState({
      form_data: form_data,
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

  handleClick = () => {
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );

    if (form_checked.length > 3) {
      toast("more than 3 bt are not allowed");
      return;
    }

    this.sendEvents('next', {no_of_cards_entered: form_checked.length, });
    this.submitApplication(
      {
        bt_selection: form_checked,
      },
      "one",
      true,
      "eligible-loan"
    );
  };

  render() {
    let form_checked = this.state.form_data.filter(
      (item) => item.is_selected === true
    );

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Credit card details"
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
                        // error={!!this.state.form_data[index].financierName_error}
                        // helperText={this.state.form_data[index].financierName_error}
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
                        // error={!!this.state.form_data[index].creditCardNumber_error}
                        // helperText={
                        //   this.state.form_data[index].creditCardNumber_error
                        // }
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
                        // error={!!this.state.form_data[index].creditCardExpiryDate_error}
                        // helperText={
                        //   this.state.form_data[index].creditCardExpiryDate_error
                        // }
                        type="text"
                        width="40"
                        maxLength={7}
                        label="Expiry date"
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
                        // error={
                        //   !!this.state.form_data[index].principalOutstanding_error
                        // }
                        // helperText={
                        //   this.state.form_data[index].principalOutstanding_error
                        // }
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
