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

class LoanBtDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "loan_bt",
      form_data: [],
      checked: false,
      total_bt: [1, 2],
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

  onload = async () => {
    try {
      this.setState({
        show_loader: true,
      });

      const res = await Api.get("relay/api/loan/idfc/perfios/institutionlist");

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        let banklist = result.data;

        let bankOptions = banklist.map((item) => item.institution_name);

        this.setState({
          bankOptions: bankOptions,
        });
      } else {
        toast(result.error || result.message || "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }

    this.setState({
      show_loader: false,
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

  handleChange = () => {};

  handleClick = () => {};

  handleCheckbox = (index) => {
    let checked = this.state.checked;
    // let form_data = {
    //   index: index,
    //   isSelected: true,
    // };

    this.setState({
      checked: !checked,
    });
  };

  render() {
    return (
      <Container
        title="Select for balance transfer"
        buttonTitle="Skip and continue"
        hanndleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData
        }}
      >
        <div className="loan-bt">
          <div className="subtitle">
            Maximum 3 personal loan can be selected fot BT
          </div>

          {this.state.total_bt.map((item, index) => (
            <div className="loan-bt-checkbox">
              <Grid container spacing={16}>
                <Grid item xs={1}>
                  <Checkbox
                    checked={this.state.checked}
                    color="primary"
                    id="checkbox"
                    name="checkbox"
                    disableRipple
                    onChange={(event) => this.handleCheckbox(index)}
                    className="Checkbox"
                  />
                </Grid>

                <Grid item xs={11}>
                  <div className="head">Loan type</div>
                  <div className="sub-head">Personal loan</div>
                  <FormControl fullWidth>
                    <div className="InputField">
                      <Input
                        error={!!this.state.form_data.financierName_error}
                        helperText={this.state.form_data.financierName_error}
                        type="text"
                        width="40"
                        label="Financer name"
                        id="financierName"
                        name="financierName"
                        value={this.state.form_data.financierName || ""}
                        onChange={this.handleChange("financierName")}
                      />
                    </div>
                    <div className="InputField">
                      <Input
                        error={!!this.state.form_data.current_address1_error}
                        helperText={this.state.form_data.current_address1_error}
                        type="text"
                        width="40"
                        label="Amount outstanding"
                        id="amount"
                        name="amount"
                        value={this.state.form_data.amount || ""}
                        onChange={this.handleChange("amount")}
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
