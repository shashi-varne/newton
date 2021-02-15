import React, { Component } from "react";
import Container from "../../common/Container";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import nominee from "../../../assets/nominee.png";
import calendar from "../../../assets/calendar2.png";
import relationship from "../../../assets/relationship.png";
import Select from "../../../common/ui/Select";
import { initialize } from "../common/commonFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import { storageService, capitalize } from "utils/validators";

const relationshipOptions = ["Wife", "Husband", "Mother", "Father", "Other"];

class NpsNominee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      nps_details: {},
      screen_name: "nps_nominee"
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let nps_additional_details = storageService().getObject("nps_additional_details");
    let { nps_details } = nps_additional_details;

    let { form_data } = this.state;
    let { nomination } = nps_details;
    
    form_data.name = nomination.name || '';
    form_data.dob = nomination.dob || '';
    form_data.relationship = capitalize(nomination.relationship || '');

    this.setState({
      nps_details: nps_details,
      form_data: form_data
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = async () => {
    let { form_data } = this.state;

    let data = {
      nomination: {
        dob: form_data.dob,
        name: form_data.name,
        relationship: form_data.relationship,
      },
    };

    this.updateMeta(data, "delivery");
  };

  render() {
    let { form_data } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        title="Nominee Details"
        buttonTitle={this.state.show_loader ? <CircularProgress size={22} thickness={4} /> : 'SAVE AND CONTINUE'}
        disable={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please <span className="bold">confirm</span> the nominee details.
          </div>
        </div>

        <div className="nps-nominee">
          <div className="InputField">
            <InputWithIcon
              icon={nominee}
              width="30"
              id="name"
              name="name"
              label="Nominee Name"
              error={form_data.name_error ? true : false}
              helperText={form_data.name_error}
              value={form_data.name || ""}
              onChange={this.handleChange("name")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              icon={calendar}
              width="30"
              id="dob"
              name="dob"
              label="Nominee DOB (DD/MM/YYYY)"
              error={form_data.dob_error ? true : false}
              helperText={form_data.dob_error}
              value={form_data.dob || ""}
              onChange={this.handleChange("dob")}
            />
          </div>

          <div className="InputField">
            <Select
              icon={relationship}
              width="30"
              id="relationship"
              label="Relationship"
              name="relationship"
              error={form_data.relationship_error ? true : false}
              helperText={form_data.relationship_error}
              value={form_data.relationship || ""}
              options={relationshipOptions}
              onChange={this.handleChange("relationship")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsNominee;
