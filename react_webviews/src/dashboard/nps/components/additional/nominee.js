import React, { Component } from "react";
import Container from "../../../common/Container";
import Input from "common/ui/Input";
import nominee from "assets/nominee.png";
import calendar from "assets/calendar2.png";
import SelectWithoutIcon from "common/ui/SelectWithoutIcon";
import { initialize } from "../../common/commonFunctions";
import { storageService, capitalize } from "utils/validators";
import { formatDate } from "utils/validators";

const relationshipOptions = ["Wife", "Husband", "Mother", "Father", "Other"];

class NpsNominee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      nps_details: {},
      screen_name: "nps_nominee",
      skelton: "g",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let nps_additional_details = storageService().getObject(
      "nps_additional_details"
    );
    if (!nps_additional_details) {
      await this.getNPSInvestmentStatus();
      storageService().set("nps_additional_details_required", true);
    }
    nps_additional_details = storageService().getObject(
      "nps_additional_details"
    );

    let { nps_details } = nps_additional_details;

    let { form_data } = this.state;
    let { nomination } = nps_details;

    if (nomination) {
      form_data.nominee_name = nomination.name || "";
      form_data.nominee_dob = nomination.dob || "";
      form_data.relationship = capitalize(nomination.relationship || "");
    }

    this.setState({
      nps_details: nps_details,
      form_data: form_data,
      skelton: false,
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === "nominee_dob") {
      var input = document.getElementById("nominee_dob");
      input.onkeyup = formatDate;
    }

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = async () => {
    let { form_data } = this.state;

    let keys_to_check = ["nominee_name", "nominee_dob", "relationship"];

    let canSubmit = this.formCheckUpdate(keys_to_check, form_data);

    if (canSubmit) {
      let data = {
        nomination: {
          dob: form_data.nominee_dob,
          name: form_data.nominee_name,
          relationship: form_data.relationship,
        },
      };

      await this.updateMeta(data, "/nps/delivery");
    }
  };

  bannerText = () => {
    return (
      <span>
        Please <b>confirm</b> the nominee details.
      </span>
    );
  };

  render() {
    let { form_data } = this.state;
    return (
      <Container
        title="Nominee Details"
        buttonTitle="SAVE AND CONTINUE"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        banner={true}
        bannerText={this.bannerText()}
      >
        <div className="nps-nominee">
          <div className="InputField">
            <Input
              icon={nominee}
              width="30"
              id="nominee_name"
              name="nominee_name"
              label="Nominee Name"
              error={form_data.nominee_name_error ? true : false}
              helperText={form_data.nominee_name_error}
              value={form_data.nominee_name || ""}
              onChange={this.handleChange("nominee_name")}
            />
          </div>

          <div className="InputField">
            <Input
              icon={calendar}
              width="30"
              id="nominee_dob"
              name="nominee_dob"
              label="Nominee DOB (DD/MM/YYYY)"
              error={form_data.nominee_dob_error ? true : false}
              helperText={form_data.nominee_dob_error}
              value={form_data.nominee_dob || ""}
              onChange={this.handleChange("nominee_dob")}
            />
          </div>

          <div className="InputField">
            <SelectWithoutIcon
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
