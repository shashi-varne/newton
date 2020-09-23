import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "../../../../utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";
import ConfirmDialog from './../plans/confirm_dialog';
import { isEmpty } from 'utils/validators';

class GroupHealthPlanMedicalHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      medical_questions: {},
      next_state: 'is-ped'
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload() {

    let { member_base, account_type } = this.state.lead;
    console.log(member_base)


    let radio_options = [
      {
        name: 'Yes',
        value: 'Yes'
      },
      {
        name: 'No',
        value: 'No'
      }
    ];


    let list = [
      {
        label:
          "Have any of the person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?",
        members: member_base,
        radio_options: radio_options,
        key: "mand_1",
        input_type: "radio",
      },
      {
        label:
          "Have any of the person(s) to be insured ever filed a claim with their current / previous insurer?",
        members: member_base,
        radio_options: radio_options,
        key: "mand_2",
        input_type: "radio",
      },
      {
        label:
          "Has any proposal for Health insurance been declined, cancelled or charged a higher premium?",
        members: member_base,
        radio_options: radio_options,
        key: "mand_3",
        input_type: "radio",
      },
      {
        label:
          "Are you already covered under any other health insurance policy of Care Health Insurance (formerly Religare Health Insurance)?",
        members: member_base,
        radio_options: radio_options,
        key: "mand_4",
        input_type: "radio",
      },
    ];

    for (var key in list) {
      list[key].question_value = 'No';
      let q_key = list[key].key;
      let inputs = {};
      for (var i in member_base) {
        let member_data = member_base[i];

        if (member_data.medical_questions) {
          let mem_q_data = member_data.medical_questions.filter(data => data.key_mapper === q_key);

          if (mem_q_data && mem_q_data.length !== 0 && mem_q_data[0].answer) {
            inputs[member_data.backend_key] = true;
            list[key].question_value = 'Yes';
          }
        }
      }

      list[key].inputs = inputs;
    }

    this.setState({
      account_type: account_type,
      list: list,
      member_base: member_base,
      radio_options: radio_options
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
      search: getConfig().searchParams
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        screen_name: "medical_history",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChangeRadio = (event, index) => {
    let { list, radio_options } = this.state;

    let data = list[index];
    data.question_value = radio_options[event].value;
    data.question_value_error = '';

    if (this.state.account_type === 'self') {
      data.inputs[data.members[0].backend_key] = radio_options[event].value === 'Yes' ? true : false;
    }

    if(radio_options[event].value === 'No') {
      data.inputs = {};
    }
   

    list[index] = data;

    this.setState({
      list: list
    });

  }

  handleCheckbox = (event, index, member) => {
    let { list } = this.state;

    list[index].inputs[member.backend_key] = event.target.checked;
    list[index].question_value_error = '';

    this.setState({
      list: list,
    }, () => console.log(list));
  };

  handleClick = () => {
    this.sendEvents("next");
    let { member_base, list } = this.state;

    let canProceed = true;

    list.forEach(item => {
      if (!item.question_value) {
        canProceed = false;
        item.question_value_error = 'Please select one option'
      }
      if (item.question_value === 'Yes' && isEmpty(item.inputs)) {
        canProceed = false;
        item.question_value_error = 'Please select one member or change answer';
      }
    })

    this.setState({
      list: list
    });

    let body = {};

    if (canProceed) {

      for (var i in member_base) {
        let member_data = member_base[i];
        let backend_key = member_data.backend_key;

        body[backend_key] = {};
        member_data.medical_questions = {};
        body[backend_key].mand_question_exists = 'false';

        for (var q in list) {
          let q_data = list[q];
          let q_key = q_data.key;
          let inputs = q_data.inputs;

          member_data.medical_questions[q_key] = {};
          member_data.mand_question_exists = 'false';
          member_data.medical_questions[q_key].answer = 'false';
          for (var mem_key in inputs) {
            if (mem_key === backend_key && inputs[mem_key]) {
              body[backend_key].mand_question_exists = 'true'
              member_data.medical_questions[q_key].answer = 'true';
            }
          }
        }

        member_base[i] = member_data;


        body[backend_key].medical_questions = member_data.medical_questions || {};

      }

      this.updateLead(body);
    }
  }

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
    let { account_type, member_base, radio_options, list, medical_questions } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Medical History Details"
        buttonTitle="CONTINUE"
        withProvider={true}
        handleClick2={this.handleClick2}
        buttonData={this.state.bottomButtonData}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle">
          This is important to avoid claims rejection later
        </div>
        {account_type && (
          <RadioAndCheckboxList
            account_type={account_type}
            name="medical history"
            list={list}
            medical_questions={medical_questions}
            radio_options={radio_options}
            member_data={member_base}
            handleCheckbox={this.handleCheckbox}
            handleChangeRadio={this.handleChangeRadio}
          />
        )}
        <ConfirmDialog parent={this} />
      </Container>
    );
  }
}

export default GroupHealthPlanMedicalHistory;
