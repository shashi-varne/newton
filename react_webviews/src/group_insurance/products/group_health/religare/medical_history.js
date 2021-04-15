import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "../../../../utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";
import ConfirmDialog from './../plans/confirm_dialog';
import { isEmpty } from 'utils/validators';
import { keyBy } from 'lodash';

class GroupHealthPlanMedicalHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      medical_questions: {},
      next_state: 'is-ped',
      screen_name: 'medical_history_details'
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload() {
    //let { member_base, account_type } = this.state.lead;
    let { insured_people_details, quotation_details } = this.state.lead;
    let account_type  =  quotation_details.insurance_type
    let member_base = []

    insured_people_details.forEach(element => {
      element.insured_person.answers = element.answers
      member_base.push(element.insured_person)
    });

    member_base.forEach(element => {
      let relation = this.state.member_base.find(mem => mem.backend_key === element.relation_key)
       element.relation = relation.key
     });

     if(this.props.edit) {
      this.setState({
        next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
      })
    }
     member_base.sort((a, b) => {return this.state.member_base.findIndex(p => p.backend_key === a.relation_key) - this.state.member_base.findIndex(p => p.backend_key === b.relation_key)})
    
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
        label: account_type === 'self' ? 
          "Have you been diagnosed / hospitalized for any illness / injury during the last 48 months?"
          : "Have any of the person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?",
        members: member_base,
        radio_options: radio_options,
        event_key: 'hospitalised_last_2_years',
        key: "mand_1",
        input_type: "radio",
        "question_id": "religare_mhd_file_claim"
      },
      {
        label: account_type === 'self' ? 
        "Have you ever filed a claim with your current / previous insurer?"
        : "Have any of the person(s) to be insured ever filed a claim with their current / previous insurer?",
        members: member_base,
        radio_options: radio_options,
        event_key: 'filed_claim_current_insurer',
        key: "mand_2",
        input_type: "radio",
        "question_id": "religare_mhd_prev_hosp"
      },
      {
        label: account_type === 'self' ? 
        "Has your Health insurance been declined, cancelled or charged a higher premium?"
        : "Has any proposal for Health insurance been declined, cancelled or charged a higher premium?",
        members: member_base,
        radio_options: radio_options,
        event_key: 'health_insurance_declined',
        key: "mand_3",
        input_type: "radio",
        "question_id": "religare_mhd_prev_proposal_decline"
      },
      {
        label: "Are you already covered under any other health insurance policy of Care Health Insurance (formerly Religare Health Insurance)?",
        members: member_base,
        radio_options: radio_options,
        event_key: 'already_covered_in_care',
        key: "mand_4",
        input_type: "radio",
        "question_id": "religare_mhd_exising_policy_in_religare"
      },
    ];

    for (var key in list) {
      list[key].question_value = 'No';
      let q_key = list[key]['question_id'];
      let inputs = {};
      for (var i in member_base) {
        let member_data = member_base[i];

        if (member_data.answers.medical_history_details.length >= 1) {
          
          let mem_q_data = member_data.answers.medical_history_details.filter(data => data.front_end_question_id === q_key);
          if (mem_q_data && mem_q_data.length !== 0 && mem_q_data[0].yes_no) {
            inputs[member_data.relation_key] = true;
            list[key].question_value = 'Yes';
          }
        }
        list[key].inputs = inputs;
      }
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
    const findSelectedMembersForKey = (eventKey) => {
      const listItem = keyedList[eventKey];
      if (isEmpty(listItem)) return '';
      const selectedInputs = Object.keys(listItem.inputs).filter(key => listItem.inputs[key]);
      return selectedInputs.map(input => keyedMemberRelations[input]).join(', ');
    };
    const keyedList = keyBy(this.state.list, 'event_key');
    const [firstListItem = {}] = (this.state.list || []);  //take first list item (any list item would be fine, just need the members prop from it)
    const keyedMemberRelations = (firstListItem.members || []).reduce((obj, currMem) => { 
      obj[currMem.relation_key] = currMem.relation;
      return obj;
    }, {});

    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        screen_name: "medical_history",
        "product": this.state.providerConfig.provider_api,
        "flow": this.state.insured_account_type || '',
        'hospitalised_last_2_years': findSelectedMembersForKey('hospitalised_last_2_years') || 'no',
        'filed_claim_current_insurer': findSelectedMembersForKey('filed_claim_current_insurer') || 'no',
        'health_insurance_declined': findSelectedMembersForKey('health_insurance_declined') || 'no',
        'already_covered_in_religare': findSelectedMembersForKey('already_covered_in_care') || 'no',
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
      data.inputs[data.members[0].relation_key] = radio_options[event].value === 'Yes' ? true : false;
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

    list[index].inputs[member.relation_key] = event.target.checked;  //relation_key
    list[index].question_value_error = '';

    this.setState({
      list: list,
    });
  };

  handleClick = () => {
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

    let body = { }

    if (canProceed) {
      body.answers = {}
      for (var i in member_base) {
        let member_data = member_base[i];
        let relation_key = member_data.relation_key;

        body.answers[relation_key] = {};
        body.answers[relation_key].medical_history_details = []

        for (var q in list) {
          let q_data = list[q];
          let inputs = q_data.inputs;
          let question_id = q_data.question_id
          let obj = {
            "yes_no": false,
            "question_id": question_id
          }
          for (var mem_key in inputs) {
            if (mem_key === relation_key && inputs[mem_key]) {
                obj = {
                  "yes_no": true,
                  "question_id": question_id
                }
            }
          }
          body.answers[relation_key].medical_history_details.push(obj)
        }
      }


      this.sendEvents("next");     
      console.log(body)
      var current_state = {}
      for(var x in body.answers){
        for(var y of body.answers[x].medical_history_details){
          if(y.yes_no) current_state[`${x}_${y.question_id}`] = y.yes_no;
        }
      }
      this.updateLead(body, '', current_state);

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
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title={this.setEditTitle('Medical history details')}
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
