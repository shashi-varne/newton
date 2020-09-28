import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "../religare/radioAndCheckboxList";
import {  validateAlphabets } from "utils/validators";
import toast from "../../../../common/ui/Toast";
import ConfirmDialog from './../plans/confirm_dialog';


class GroupHealthStarPlanSelectPed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      life_style_question: {},
      next_state: 'final-summary'
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload() {

    let { member_base, account_type } = this.state.lead;

    member_base.push({
        key: 'none'
    })

    let list = [
        {
          label:
            "Does any of the insured member have any health problems?",
          options: member_base,
          input_type: "checkbox",
        },
    ];

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
        "product": 'star',
        flow: this.state.insured_account_type || '',
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChangeRadio = (event, index) => {

    let { member_base } = this.state;
    member_base[index].ped_exists =  member_base[index].radio_options[event].value;
    member_base[index].ped_exists_error = '';

    this.setState({
      member_base: member_base,
    });
  };

  handleChange = (event, index) => {

    let { value} = event.target;
    let { member_base } = this.state;

    member_base[index].ped_diseases_name = value;
    member_base[index].ped_diseases_name_error = '';

    this.setState({
      member_base: member_base,
    });
  };

  handleCheckbox = (event, index) => {

    let { member_base, none_option_selected } = this.state;
    member_base[index].ped_exists = event.target.checked;

    let isNone = member_base[index].key === 'none';

    if (isNone) {
      for (var key in member_base) {

        if (member_base[key].key !== 'none') {
          member_base[key].ped_exists = false;  //setting other to un check other than none
        }

      }
    }

    if (isNone && event.target.checked) {
      none_option_selected = true;
    } else {
      none_option_selected = false;  //for all ther other clicks , including untick of none
      member_base[member_base.length - 1].ped_exists = false //removing none
    }


    this.setState({
      member_base: member_base,
      none_option_selected: none_option_selected
    });
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
        if ((member_data.ped_exists  === 'Yes' ||
         member_data.ped_exists === true) && member_data.key !== 'none') {
          member_data.ped_diseases_name_error = this.validateDescription(member_data.ped_diseases_name);

          if (member_data.ped_diseases_name_error) {
            canProceed = false;
          }
          member_base[key] = member_data;
        }

        if (member_data.ped_exists) {
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

          if ((member_data.ped_exists  === 'Yes' ||
          member_data.ped_exists === true) && !none_option_selected) {
            body[backend_key].ped_exists = 'true';
            body[backend_key].ped_diseases_name = member_data.ped_diseases_name;
          } else {
            body[backend_key].ped_exists = 'false';
            body[backend_key].ped_diseases_name = '';
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
        title="Pre-existing conditions"
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
            name="star_select_ped"
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

export default GroupHealthStarPlanSelectPed;
