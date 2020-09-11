import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import { initialize, updateBottomPremium, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";
import { isValidMonthYear } from "utils/validators";
import { formatMonthandYear, dobFormatTest } from "utils/validators";
import toast from "../../../../common/ui/Toast";

class GroupHealthPlanLifestyleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      life_style_question: {},
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
    this.updateBottomPremium = updateBottomPremium.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  async componentDidMount() {
    let { account_type, ui_members } = this.state.groupHealthPlanData;
    let mem_options = [];

    for (var key in ui_members) {
      if (key !== "" && ui_members[key] === true) {
        mem_options.push(key);
      }
    }
    mem_options.push("None");

    let list = [];

    if (account_type === "self") {
      list = [
        {
          label:
            "Do you smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.",
          options: [
            {
              name: "Yes",
              value: "Yes",
            },
            {
              name: "No",
              value: "No",
            },
          ],
          key: "self",
          input_type: "radio",
        },
      ];
    } else {
      list = [
        {
          label:
            "Does any of the insured members smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.",
          options: mem_options,
          input_type: "checkbox",
        },
      ];
    }

    this.setState({
      account_type: this.state.groupHealthPlanData.account_type,
      list: list,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        screen_name: "lifestyle_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChangeRadio = (key, event) => {
    let { life_style_question } = this.state;

    life_style_question = {
      answer: event === 0 ? true : false,
    };

    this.setState({
      life_style_question: life_style_question,
    });
  };

  handleChange = (event) => {
    let { name, value, id } = event.target;
    let { life_style_question } = this.state;

    if (id === "description") {
      if (!name) {
        life_style_question = {
          ...life_style_question,
          answer_description: value,
        };
      } else {
        life_style_question[name] = {
          ...life_style_question[name],
          answer_description: value,
          desc_error: "",
        };
      }
    } else {
      if (!dobFormatTest(value)) {
        return;
      }

      let input;
      if (!name) {
        input = document.getElementById("date");
        input.onkeyup = formatMonthandYear;

        life_style_question = {
          ...life_style_question,
          start_date: value,
        };
      } else {
        input = document.getElementById(name + "_date");
        input.onkeyup = formatMonthandYear;

        life_style_question[name] = {
          ...life_style_question[name],
          start_date: value,
          date_error: "",
        };
      }
    }

    this.setState({
      life_style_question: life_style_question,
    });
  };

  handleCheckbox = (event) => {
    let name = event.target.name;
    let { life_style_question } = this.state;

    if (name === "None") {
      life_style_question = {};
    } else {
      life_style_question["None"] = {
        ...life_style_question[name],
        checked: false,
      };
    }

    life_style_question[name] = {
      ...life_style_question[name],
      checked: event.target.checked,
    };

    this.setState({
      life_style_question: life_style_question,
    });
  };

  validateMonthYear = (date) => {
    if (!isValidMonthYear(date)) {
      return "please enter valid month or year";
    }
  };

  validateDescription = (desc) => {
    if (!desc) {
      return "please enter the description";
    }
  };

  handleClick = () => {
    this.sendEvents("next");
    let { account_type, life_style_question } = this.state;
    let array = [];
    let date_error = "";
    let desc_error = "";

    if (account_type === "self") {
      let date = life_style_question.start_date;
      let description = life_style_question.answer_description;

      date_error = this.validateMonthYear(date);
      desc_error = this.validateDescription(description);

      this.setState({
        desc_error: desc_error,
        date_error: date_error,
      });
    } else {
      for (var key in life_style_question) {
        if (key !== "None" && life_style_question[key].checked === true) {
          let date = life_style_question[key].start_date;
          let description = life_style_question[key].answer_description;
          let checked = life_style_question[key].checked;

          if (checked) {
            array.push(checked);
          }

          date_error = this.validateMonthYear(date);
          desc_error = this.validateDescription(description);

          life_style_question[key] = {
            ...life_style_question[key],
            date_error: date_error,
            desc_error: desc_error,
          };
        }
      }
    }

    if (!Object.keys(life_style_question).length || !array.length) {
      toast("Select atleast one option");
    }

    this.setState({
      life_style_question: life_style_question,
    });
  };

  render() {
    let { account_type, list, life_style_question } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        show_loader={this.state.show_loader}
        title="Lifestyle detail"
        buttonTitle="CONTINUE"
        withProvider={true}
        buttonData={this.state.bottomButtonData}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle">
          This is important to avoid claims rejection later
        </div>
        {account_type && (
          <RadioAndCheckboxList
            account_type={account_type}
            name="lifeStyle details"
            list={list}
            date_error={this.state.date_error}
            desc_error={this.state.desc_error}
            life_style_question={life_style_question}
            handleChange={this.handleChange}
            handleCheckbox={this.handleCheckbox}
            handleChangeRadio={this.handleChangeRadio}
          />
        )}
      </Container>
    );
  }
}

export default GroupHealthPlanLifestyleDetail;
