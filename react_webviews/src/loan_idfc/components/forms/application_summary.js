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

    let personal_data = {
      title: "Personal details",
      edit_state: "/loan/idfc/edit-basic-details",
      data: [
        {
          title: "Date of birth ",
          subtitle: personal_info.dob,
        },
        {
          title: "PAN number",
          subtitle: personal_info.pan_no,
        },
        {
          title: "Education qualification",
          subtitle: professional_info.educational_qualification,
        },
        {
          title: "Employment type",
          subtitle: application_info.employment_type,
        },
      ],
    };

    accordianData.push(personal_data);

    let professional_data = {
      title: "Work details",
      edit_state: "/loan/idfc/edit-professional-details",
      data: [
        {
          title: "Company name",
          subtitle: professional_info.company_name,
        },
        {
          title: "Official email",
          subtitle: professional_info.office_email,
        },
        {
          title: "Net monthly salary",
          subtitle: application_info.net_monthly_salary,
        },
        {
          title: "Salary receipt mode",
          subtitle: professional_info.salary_mode,
        },
        {
          title: "Company constitution",
          subtitle: professional_info.constitution,
        },
        {
          title: "Organisation",
          subtitle: professional_info.organisation,
        },
        {
          title: "Department",
          subtitle: professional_info.department,
        },
        {
          title: "Industry",
          subtitle: professional_info.industry,
        },
      ],
    };

    accordianData.push(professional_data);

    this.setState(
      {
        accordianData: accordianData,
      },
      () => {
        this.handleAccordian(0);
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
