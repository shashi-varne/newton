import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "../../../../utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";

class GroupHealthPlanMedicalHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      medical_questions: {}
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

    let list = [];

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

    if (account_type === 'self') {

      list = [
        {
          label:
            "Have you been diagnosed / hospitalized for any illness / injury during the last 48 months?",
          options: radio_options,
          key: "mand_1",
          input_type: "radio",
        },
        {
          label:
            "Have you ever filed a claim with your current / previous insurer?",
          options: radio_options,
          key: "mand_2",
          input_type: "radio",
        },
        {
          label:
            "Has your Health insurance been declined, cancelled or charged a higher premium?",
          options: radio_options,
          key: "mand_3",
          input_type: "radio",
        },
        {
          label:
            "Are you already covered under any other health insurance policy of Religare Health Insurance?",
          options: radio_options,
          key: "mand_4",
          input_type: "radio",
        },
      ];
    } else {
      list = [
        {
          label:
            "Have any of the person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?",
          options: radio_options,
          key: "mand_1",
          input_type: "radio",
        },
        {
          label:
            "Have any of the person(s) to be insured ever filed a claim with their current / previous insurer?",
          options: radio_options,
          key: "mand_2",
          input_type: "radio",
        },
        {
          label: "Who is the member?",
          options: member_base,
          key: "mand_3",
          input_type: "checkbox",
        },
        {
          label:
            "Has any proposal for Health insurance been declined, cancelled or charged a higher premium?",
          options: radio_options,
          key: "mand_4",
          input_type: "radio",
        },
        {
          label:
            "Is any of the person(s) to be insured, already covered under any other health insurance policy of Religare Health Insurance?",
          options: radio_options,
          key: "mand_5",
          input_type: "radio",
        },
      ];
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

  handleChangeRadio = (event, key, index) => {
    let { member_base, medical_questions, radio_options } = this.state;
 
    medical_questions = {
      ...medical_questions,
      [key]: {answer: radio_options[event].value === 'Yes' ? 'true' : 'false'},
      [key+'_error']: ''
    };

    this.setState({
      member_base: member_base,
      medical_questions: medical_questions
    });

  }

  handleCheckbox = (event, index) => {
    let { name } = event.target;
    let { member_base } = this.state;

    member_base[index].medical_questions = {
      ...member_base[index].medical_questions,
      [name]: event.target.checked,
    };

    this.setState({
      member_base: member_base,
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    let {member_base, medical_questions, list} = this.state;

    let canProceed = true;

    list.forEach(item => {
      if (!medical_questions[item.key] && item.input_type !== 'checkbox') {
        canProceed = false
        medical_questions[item.key+'_error'] = 'Please select one option'
      }
    })

    this.setState({
      member_base: member_base
    });

    let body = {};

    if (canProceed) {
      

      for (var i in member_base) {
        let member_data = member_base[i];

        let backend_key = member_data.backend_key;
        body[backend_key] = {};
        body[backend_key].mand_question_exists = ''

        list.forEach(item => {
          
          if (member_data.medical_questions[item.key].answer === 'true') {
            body[backend_key].mand_question_exists = 'true'

            body[backend_key].medical_questions = {
              ...body[backend_key].medical_questions,
              [item.key]: {...member_data.medical_questions[item.key]}
            }
          }

        }) 
          
        if (!body[backend_key].mand_question_exists) {
          body[backend_key].mand_question_exists = 'false'
        }
      }

      this.updateLead(body);
    }
  }


  render() {
    let { account_type, list, medical_questions } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        show_loader={this.state.show_loader}
        title="Medical History"
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
            name="medical history"
            list={list}
            medical_questions={medical_questions}
            handleCheckbox={this.handleCheckbox}
            handleChangeRadio={this.handleChangeRadio}
          />
        )}
      </Container>
    );
  }
}

export default GroupHealthPlanMedicalHistory;
