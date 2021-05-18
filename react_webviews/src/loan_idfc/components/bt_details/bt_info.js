import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";
import ReactHtmlParser from "react-html-parser";
import { idfc_config } from "../../constants";
import { getConfig } from "utils/functions";

const yesOrNo_options = [
  {
    name: "Yes",
    value: "Yes",
  },
  {
    name: "No",
    value: "No",
  },
];

class BtInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "bt_info_screen",
      loaderWithData: false,
      // skelton: 'g',
      loaderData: {},
      isBtOpted: "",
      accordianData: [],
      detail_clicked: [],
      productName: getConfig().productName,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let screenData = idfc_config[this.state.screen_name];
    let loaderData = {
      title: `Hang on while IDFC FIRST Bank calculates the eligible loan offer`,
      subtitle: "It usually takes around 2 minutes!",
    };

    let options = [
      {
        title: `Benefits`,
        subtitle: `${screenData.benefits.options.map(
          (el) =>
            `<div class="bt-faq">
              <img
                src=${require(`assets/${this.state.productName}/${el.icon}.svg`)}
                alt=""
              />
              <div>${el.subtitle}</div>
            </div>`
        )}`.replaceAll(",", ""),
      },
      {
        title: `What information do I need to provide?`,
        subtitle: `${screenData.required_info.options.map(
          (el) =>
            `<div class="bt-faq bt">
              <img
                src=${require(`assets/${this.state.productName}/${el.icon}.svg`)}
                alt=""
              />
              <div class="reqd_info">${el.subtitle}</div>
            </div>`
        )}`.replaceAll(",", ""),
      },
    ];

    this.setState(
      {
        loaderData: loaderData,
        accordianData: options,
      },
      () => {
        this.handleAccordian(0);
      }
    );
  };

  handleClickTwo = () => {
    this.sendEvents("next");
    let body = {
      idfc_loan_status: "bt_processing",
      bt_selected: "True",
    };
    this.updateApplication(body, "loan-bt");
  };

  handleClickOne = () => {
    this.sendEvents("next");
    this.setState({
      loaderWithData: true,
    });
    let body = {
      idfc_loan_status: "bt_bypass",
      bt_selected: "False",
    };

    this.updateApplication(body);
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_bt_transfer_details",
      properties: {
        user_action: user_action,
        opted_for_bt: this.state.isBtOpted
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChangeRadio = (event) => {
    let isBtOpted = yesOrNo_options[event].value;

    this.setState({
      isBtOpted: isBtOpted,
      isBtOpted_error: ''
    });
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
          <div className="bct-content">{ReactHtmlParser(props.subtitle)}</div>
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

  handleClick = () => {
    let { isBtOpted } = this.state;

    this.setState({
      loaderWithData: this.state.isBtOpted === "No"
    })

    if (!isBtOpted) {
      this.setState({
        isBtOpted_error: "please select any one option"
      })
      return
    }
    
    if (isBtOpted === 'Yes') {
      this.handleClickTwo()
    } else {
      this.handleClickOne()
    }
  }

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="What is balance transfer?"
        buttonTitle="NEXT"
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="bt-info">
          <div className="sub-head">
            A 'balance transfer' is a unique feature through which you can
            transfer the outstanding principal amount of your existing personal
            loans or credit cards (taken from other lenders) to IDFC FIRST Bank
            (if any).
          </div>

          <div className="bottom-content">
            <div className="generic-hr"></div>
            {this.state.accordianData.map(this.renderAccordian)}
          </div>

          <div className="InputField">
            <RadioWithoutIcon
              width="40"
              label="Do you want to opt for balance transfer?"
              options={yesOrNo_options}
              id="isBtOpted"
              name="isBtOpted"
              error={this.state.isBtOpted_error ? true : false}
              helperText={this.state.isBtOpted_error}
              value={this.state.isBtOpted || ""}
              onChange={this.handleChangeRadio}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default BtInformation;
