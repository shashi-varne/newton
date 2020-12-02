import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class ApplicationSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      accordianData: [],
      detail_clicked: [],
      selectedIndex: 0
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let accordianData = [];
    let personal_info = lead.personal_info || {};
    let professional_info = lead.professional_info || {};
    let application_info = lead.application_info || {};
    let current_address_data = lead.current_address_data || {};
    let permanent_address_data = lead.permanent_address_data || {};

    let personal_data = {
      title: "Personal details",
      edit_state: "/loan/idfc/edit-basic-details",
      data: [
        {
          title: "First name",
          subtitle: personal_info.dob,
        },
        {
          title: "Middle name",
          subtitle: personal_info.pan_no,
        },
        {
          title: "Last name",
          subtitle: professional_info.educational_qualification,
        },
        {
          title: "Date of birth",
          subtitle: application_info.employment_type,
        },
        {
          title: "Gender",
          subtitle: application_info.employment_type,
        },
        {
          title: "Marital status",
          subtitle: application_info.employment_type,
        },
        {
          title: "Father name",
          subtitle: application_info.employment_type,
        },
        {
          title: "Mother name",
          subtitle: application_info.employment_type,
        },
        {
          title: "Religion",
          subtitle: application_info.employment_type,
        },
        {
          title: "Email id",
          subtitle: application_info.employment_type,
        },
      ],
    };

    accordianData.push(personal_data);

    let professional_data = {
      title: "Address details",
      edit_state: "/loan/idfc/edit-professional-details",
      data: [
        {
          title: "Current address 1",
          subtitle: current_address_data.address1,
        },
        {
          title: "Current address 2",
          subtitle: current_address_data.address2,
        },
        {
          title: "Current address 3",
          subtitle: current_address_data.address3,
        },
        {
          title: "Current landmark",
          subtitle: current_address_data.landmark,
        },
        {
          title: "Current pincode",
          subtitle: current_address_data.pincode,
        },
        {
          title: "Current city",
          subtitle: current_address_data.city,
        },
        {
          title: "Current state",
          subtitle: current_address_data.state,
        },
        {
          title: "Permanent address 1",
          subtitle: permanent_address_data.address1,
        },
        {
          title: "Permanent address 2",
          subtitle: permanent_address_data.address2,
        },
        {
          title: "Permanent address 3",
          subtitle: permanent_address_data.address3,
        },
        {
          title: "Permanent landmark",
          subtitle: permanent_address_data.landmark,
        },
        {
          title: "Permanent pincode",
          subtitle: permanent_address_data.pincode,
        },
        {
          title: "Permanent city",
          subtitle: permanent_address_data.city,
        },
        {
          title: "Permanent state",
          subtitle: permanent_address_data.state,
        },
      ],
    };

    accordianData.push(professional_data);

    this.setState(
      {
        accordianData: accordianData,
      },
      () => {
        // if (!this.state.form_submitted) {
          this.handleAccordian(0);
        // }
      }
    );
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "application form",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.navigate("application-summary");
  };

  renderAccordiansubData = (props, index) => {
    return (
      <div key={index}>
        {props.subtitle && (
          <div className="bctc-tile">
            <div className="title">{props.title}</div>
            <div className="subtitle">{props.subtitle}</div>
          </div>
        )}
      </div>
    );
  };

  renderAccordian = (props, index) => {
    return (
      <div
        key={index}
        onClick={() => this.handleAccordian(index)}
        className="bc-tile"
      >
        <div className="bct-top">
          <div className="bct-top-title">{props.title}</div>
          <div className="bct-icon">
            <img
              src={require(`assets/${
                props.open ? "minus_icon" : "plus_icon"
              }.svg`)}
              alt=""
            />
          </div>
        </div>

        {props.open && (
          <div className="bct-content">
            {props.data.map(this.renderAccordiansubData)}
            {!this.state.form_submitted && (
              <div
                onClick={() => {
                  this.sendEvents("next", {
                    edit_clicked: props.title.split(" ")[0],
                  });
                  this.openEdit(props.edit_state);
                }}
                className="generic-page-button-small"
              >
                EDIT
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  handleAccordian = (index) => {
    let accordianData = this.state.accordianData;
    let selectedIndex = this.state.selectedIndex;

    if (index === this.state.selectedIndex) {
      accordianData[index].open = false;
      selectedIndex = -1;
    } else {
      if (selectedIndex >= 0) {
        accordianData[selectedIndex].open = false;
      }

      accordianData[index].open = true;
      selectedIndex = index;
    }

    this.setState({
      accordianData: accordianData,
      selectedIndex: selectedIndex,
      detail_clicked: [
        ...this.state.detail_clicked,
        selectedIndex !== -1 &&
          accordianData[selectedIndex].title.split(" ")[0],
      ],
    });
  };

  openEdit = (state) => {
    this.navigate(state);
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Basic detail Summary"
        buttonTitle="OKAY"
        handleClick={() => this.handleClick()}
        headerData={{
          icon: "close",
        }}
      >
        <div className="loan-form-summary">
          <div className="bottom-content">
            <div className="generic-hr"></div>
            {this.state.accordianData.map(this.renderAccordian)}
          </div>
        </div>
      </Container>
    );
  }
}

export default ApplicationSummary;
