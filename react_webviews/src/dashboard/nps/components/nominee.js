import React, { Component } from "react";
import Container from "fund_details/common/Container";
// import toast from "common/ui/Toast";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import person from "../../../assets/person.png";
import nominee from "../../../assets/nominee.png";
import calendar from "../../../assets/calendar2.png";
import relationship from "../../../assets/relationship.png";
import Select from "../../../common/ui/Select";
import{ updateMeta } from "../common/api";

const relationshipOptions = ["Wife", "Husband", "Mother", "Father", "Other"];

class NpsNominee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {}
    };
    this.updateMeta = updateMeta.bind(this);
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data
    })
  };

  handleClick = () => {
    let { form_data } = this.state;

    let data = {
      nomination: {
        dob: form_data.dob,
        name: form_data.name,
        relationship: form_data.relationship
      }
    }

    this.updateMeta(data);
  }

  render() {
    let { form_data } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="SAVE AND CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="Nominee Details"
        showLoader={this.state.show_loader}
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
              value={form_data.relationship || ''}
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
