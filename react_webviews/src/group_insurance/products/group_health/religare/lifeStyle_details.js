import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";
import { isValidMonthYear } from "utils/validators";
import { formatMonthandYear, dobFormatTest, validateAlphabets, IsFutureMonthYear, IsPastMonthYearfromDob } from "utils/validators";
import toast from "../../../../common/ui/Toast";
import ConfirmDialog from './../plans/confirm_dialog';


class GroupHealthPlanLifestyleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      life_style_question: {},
      next_state: 'plan-medical-history'
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload() {


    let { member_base, account_type } = this.state.lead;


    if (member_base.length > 1) {
      member_base.push({
        key: 'none'
      })
    }
    let list = [];

    if (account_type === "self") {

      member_base[0].life_style_question_exists = member_base[0].life_style_question_exists ? 'Yes' : 'No';

      member_base[0].radio_options =  [
        {
          name: "Yes",
          value: "Yes",
        },
        {
          name: "No",
          value: "No",
        },
      ];
      list = [
        {
          label:
            "Do you smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.",
          key: "self",
          input_type: "radio",
          options: member_base
        },
      ];
    } else {
      list = [
        {
          label:
            "Does any of the insured members smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.",
          options: member_base,
          input_type: "checkbox",
        },
      ];
    }

    this.setState({
      account_type: account_type,
      list: list,
      member_base: member_base
    });

    this.setState({
      bottomButtonData: {
        ...this.state.bottomButtonData,
        handleClick: this.handleClick
      }
    })
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

  handleChangeRadio = (event, index) => {

    console.log(event);
    let { member_base } = this.state;
    member_base[index].life_style_question_exists =  member_base[index].radio_options[event].value;
    member_base[index].life_style_question_exists_error = '';

    this.setState({
      member_base: member_base,
    });
  };

  handleChange = (event, index) => {

    let { value, id } = event.target;
    let { member_base } = this.state;


    if (id === "answer_description") {
      member_base[index].life_style_question.answer_description = value;
      member_base[index].life_style_question.answer_description_error = '';
    } else {
      if (!dobFormatTest(value)) {
        return;
      }

      let input;

      input = document.getElementById(id);
      input.onkeyup = formatMonthandYear;

      member_base[index].life_style_question.start_date = event.target.value;
      member_base[index].life_style_question.start_date_error = '';
    }

    this.setState({
      member_base: member_base,
    });
  };

  handleCheckbox = (event, index) => {

    let { member_base, none_option_selected } = this.state;
    member_base[index].life_style_question_exists = event.target.checked;

    let isNone = member_base[index].key === 'none';

    if (isNone) {
      for (var key in member_base) {

        if (member_base[key].key !== 'none') {
          member_base[key].life_style_question_exists = false;  //setting other to un check other than none
        }

      }
    }

    if (isNone && event.target.checked) {
      none_option_selected = true;
    } else {
      none_option_selected = false;  //for all ther other clicks , including untick of none
      member_base[member_base.length - 1].life_style_question_exists = false //removing none
    }


    this.setState({
      member_base: member_base,
      none_option_selected: none_option_selected
    });
  };

  validateMonthYear = (date, dob) => {

    if (!isValidMonthYear(date)) {
      return "please enter valid month and year";
    } else if (IsFutureMonthYear(date)) {
      return "future month or year is not allowed";
    } else if (IsPastMonthYearfromDob(date, dob)) {
      return "month or year less than dob is not allowed"
    }
    
    return '';
  };

  validateDescription = (desc) => {
    if (!desc) {
      return "please enter the description";
    } else if (!validateAlphabets(desc)){
      return "please enter valid description";
    }
    return '';
  };

  handleClick = () => {
    this.sendEvents("next");
    let { member_base, none_option_selected } = this.state;

    let canProceed = true;

    let atlOneOption = none_option_selected || false;

    if (!none_option_selected) {
      for (let key in member_base) {

        let member_data = member_base[key];
        if ((member_data.life_style_question_exists  === 'Yes' ||
         member_data.life_style_question_exists === true) && member_data.key !== 'none') {
          member_data.life_style_question.answer_description_error = this.validateDescription(member_data.life_style_question.answer_description);
          member_data.life_style_question.start_date_error = this.validateMonthYear(member_data.life_style_question.start_date, member_data.dob);

          if (member_data.life_style_question.answer_description_error || member_data.life_style_question.start_date_error) {
            canProceed = false;
          }
          member_base[key] = member_data;
        }

        if (member_data.life_style_question_exists) {
          atlOneOption = true;
        }

      }

    }

    this.setState({
      member_base: member_base
    })


    if (!atlOneOption) {
      canProceed = false;
      toast("Select atleast one option");
    }


    let body = {};

    if (canProceed) {

      for (var i in member_base) {
        let member_data = member_base[i];

        if (member_data.key !== 'none') {
          let backend_key = member_data.backend_key;
          body[backend_key] = {};

          if ((member_data.life_style_question_exists  === 'Yes' ||
          member_data.life_style_question_exists === true) && !none_option_selected) {
            body[backend_key].life_style_question_exists = 'true';
            body[backend_key].life_style_question = {
              answer: 'true',
              answer_description: member_data.life_style_question.answer_description,
              start_date: member_data.life_style_question.start_date
            }
          } else {
            body[backend_key].life_style_question_exists = 'false';
            body[backend_key].life_style_question = {}
          }
        }

      }

      this.updateLead(body);
    }
  };

  handleClose = () => {
    this.setState({
      openConfirmDialog: false
    });

  }

  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true
    })
  }

  render() {
    let { account_type, list } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Lifestyle detail"
        buttonTitle="CONTINUE"
        withProvider={true}
        handleClick2={this.handleClick2}
        buttonData={this.state.bottomButtonData}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle">
          Please disclose correct details to make hassle-free claim later
        </div>
        {account_type && (
          <RadioAndCheckboxList
            parent={this}
            account_type={account_type}
            name="lifeStyle details"
            list={list}
            date_error={this.state.date_error}
            desc_error={this.state.desc_error}
            life_style_question={this.state.member_base}
            handleChange={this.handleChange}
            handleCheckbox={this.handleCheckbox}
            handleChangeRadio={this.handleChangeRadio} />
        )}

        <ConfirmDialog parent={this} />
      </Container>
    );
  }
}

export default GroupHealthPlanLifestyleDetail;
