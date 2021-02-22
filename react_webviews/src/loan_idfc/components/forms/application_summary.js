import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { timeStampToDate, capitalize, capitalizeFirstLetter, formatAmountInr } from "utils/validators"

class ApplicationSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      accordianData: [],
      detail_clicked: [],
      isSelfEmployee: false,
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
    let vendor_info = lead.vendor_info || {};

    let isSelfEmployee = application_info.employment_type === "self_employed";

    let personal_data = {
      title: "Personal details",
      edit_state: "/loan/idfc/edit-basic-details",
      data: [
        {
          title: "Date of birth ",
          subtitle: timeStampToDate(personal_info.dob || ""),
          common_field: true,
        },
        {
          title: "PAN number",
          subtitle: personal_info.pan_no,
          common_field: true,
        },
        // {
        //   title: "Education qualification",
        //   subtitle: professional_info.educational_qualification,
        //   common_field: true,
        // },
        {
          title: "Employment type",
          subtitle: capitalizeFirstLetter(application_info.employment_type.split('_').join(' ') || ""),
          common_field: true,
        },
      ],
    };

    accordianData.push(personal_data);

    let professional_data = {
      title: "Work details",
      edit_state: "/loan/idfc/edit-professional-details",
      edit: true,
      data: [
        {
          title: "Company name",
          subtitle: professional_info.company_name,
          common_field: true,
        },
        {
          title: "Official email",
          subtitle: professional_info.office_email,
          common_field: false,
        },
        {
          title: "Net monthly salary",
          subtitle: formatAmountInr(application_info.net_monthly_salary || ""),
          common_field: false,
        },
        {
          title: "Salary receipt mode",
          subtitle: capitalize(professional_info.salary_mode || ""),
          common_field: false,
        },
        {
          title: "Organisation",
          subtitle: capitalize(professional_info.organisation || ""),
          common_field: true,
        },
        {
          title: "Industry",
          subtitle: capitalize(professional_info.industry || ""),
          common_field: false,
        },
      ],
    };

    accordianData.push(professional_data);

    this.setState(
      {
        accordianData: accordianData,
        idfc_loan_status: vendor_info.idfc_loan_status,
        isSelfEmployee: isSelfEmployee,
      },
      () => {
        this.handleAccordian(0);
      }
    );
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "summary",
        stage: "basic details uploaded",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    this.navigate("application-summary");
  };

  renderAccordiansubData = (props, index) => {
    return (
      <div key={index}>
        {props.subtitle && props.common_field && this.state.isSelfEmployee && (
          <div className="bctc-tile">
            <div className="title">{props.title}</div>
            <div className="subtitle">{props.subtitle}</div>
          </div>
        )}
        {props.subtitle && !this.state.isSelfEmployee && (
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
            {this.state.idfc_loan_status === "basic_details_uploaded" && props.edit &&  (
              <div
                onClick={() => {
                  this.sendEvents("edit");
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
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Basic detail Summary"
        buttonTitle="OKAY"
        skelton={this.state.skelton}
        handleClick={() => {
          this.sendEvents('next');
          this.navigate('journey')
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
