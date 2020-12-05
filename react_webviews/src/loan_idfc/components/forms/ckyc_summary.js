import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { capitalizeFirstLetter, timeStampToDate } from "../../../utils/validators";

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
    let vendor_info = lead.vendor_info || {};
    let current_address_data = lead.current_address_data || {};
    let permanent_address_data = lead.permanent_address_data || {};

    let personal_data = {
      title: "Personal details",
      edit_state: "/loan/idfc/edit-personal-details",
      data: [
        {
          title: "First name",
          subtitle: capitalizeFirstLetter(personal_info.first_name),
        },
        {
          title: "Middle name",
          subtitle: personal_info.middle_name,
        },
        {
          title: "Last name",
          subtitle: capitalizeFirstLetter(personal_info.last_name),
        },
        {
          title: "Date of birth",
          subtitle: timeStampToDate(personal_info.dob),
        },
        {
          title: "Gender",
          subtitle: capitalizeFirstLetter(personal_info.gender),
        },
        {
          title: "Marital status",
          subtitle: capitalizeFirstLetter(personal_info.marital_status),
        },
        {
          title: "Father name",
          subtitle: capitalizeFirstLetter(personal_info.father_name),
        },
        {
          title: "Mother name",
          subtitle: capitalizeFirstLetter(personal_info.mother_name),
        },
        {
          title: "Religion",
          subtitle: capitalizeFirstLetter(personal_info.religion),
        },
        {
          title: "Email id",
          subtitle: personal_info.email_id,
        },
      ],
    };

    accordianData.push(personal_data);

    let address_data = {
      title: "Address details",
      edit_state: "/loan/idfc/edit-address-details",
      data: [
        {
          sub_header_title: "Current address"
        },
        {
          title: "Address 1",
          subtitle: current_address_data.address1,
        },
        {
          title: "Address 2",
          subtitle: current_address_data.address2,
        },
        {
          title: "Address 3",
          subtitle: current_address_data.address3,
        },
        {
          title: "Landmark",
          subtitle: current_address_data.landmark,
        },
        {
          title: "Pincode",
          subtitle: current_address_data.pincode,
        },
        {
          title: "City",
          subtitle: current_address_data.city,
        },
        {
          title: "State",
          subtitle: current_address_data.state,
        },
        {
          sub_header_title: "Permanent address"
        },
        {
          title: "Address 1",
          subtitle: permanent_address_data.address1,
        },
        {
          title: "Address 2",
          subtitle: permanent_address_data.address2,
        },
        {
          title: "Address 3",
          subtitle: permanent_address_data.address3,
        },
        {
          title: "Landmark",
          subtitle: permanent_address_data.landmark,
        },
        {
          title: "Pincode",
          subtitle: permanent_address_data.pincode,
        },
        {
          title: "City",
          subtitle: permanent_address_data.city,
        },
        {
          title: "State",
          subtitle: permanent_address_data.state,
        },
      ],
    };

    accordianData.push(address_data);

    this.setState(
      {
        accordianData: accordianData,
        idfc_loan_status: vendor_info.idfc_loan_status
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
        {props.sub_header_title && (
            <div className="sub-header-title">{props.sub_header_title}</div>
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
            {this.state.idfc_loan_status === "basic_details_uploaded" && (
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
        title="Loan application Summary"
        buttonTitle="OKAY"
        handleClick={() => this.navigate('journey')}
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
