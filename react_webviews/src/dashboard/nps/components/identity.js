import React, { Component } from "react";
import Container from "fund_details/common/Container";
// import toast from "common/ui/Toast";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import RadioOptions from "../../../common/ui/RadioOptions";
import person from "../../../assets/person.png";
import { initialize } from "../common/commonFunctions";

const marital_status_options = [
  {
    name: "Single",
    value: "single",
  },
  {
    name: "Married",
    value: "married",
  },
];

class NpsIdentity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {}

  handleChange = (name) => (event) => {
    let value = event.target.value;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = async () => {
    let { form_data } = this.state;
    let queryParams = `is_married=${
      form_data.marital_status === "married"
    }&mother_name=${form_data.mother_name}${
      form_data.marital_status === "married"
        ? "&spouse_name=" + form_data.spouse_name
        : ""
    }`;

    this.nps_register(queryParams, 'nominee');
  };

  render() {
    let { form_data } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Additional Details"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please <span className="bold">confirm</span> your personal details.
          </div>
        </div>

        <div className="nps-identity">
          <div className="InputField">
            <InputWithIcon
              icon={person}
              width="30"
              id="name"
              label="Mother's name"
              error={form_data.mother_name_error ? true : false}
              helperText={form_data.mother_name_error}
              value={form_data.mother_name || ""}
              onChange={this.handleChange("mother_name")}
            />
          </div>

          <div className="InputField">
            <RadioOptions
              icon_type="blue_icon"
              width="40"
              id="name"
              label="Marital Status"
              error={form_data.marital_status_error ? true : false}
              helperText={form_data.marital_status_error}
              value={form_data.marital_status || ""}
              options={marital_status_options}
              class="MaritalStatus"
              onChange={this.handleChange("marital_status")}
            />
          </div>

          {form_data.marital_status === "married" && (
            <div className="InputField">
              <InputWithIcon
                icon={person}
                width="30"
                id="name"
                label="Spouse's name"
                error={form_data.spouse_name_error ? true : false}
                helperText={form_data.spouse_name_error}
                value={form_data.spouse_name || ""}
                onChange={this.handleChange("spouse_name")}
              />
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default NpsIdentity;
