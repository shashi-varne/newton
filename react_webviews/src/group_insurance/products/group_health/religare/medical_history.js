import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "../../../../utils/functions";
import { initialize, updateBottomPremium, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";

class GroupHealthPlanMedicalHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      medical_questions: {},
    };

    this.initialize = initialize.bind(this);
    this.updateBottomPremium = updateBottomPremium.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  async componentDidMount() {
    let {account_type, medical_questions_data} = this.state.groupHealthPlanData;

    let list = [];

    let radioOptions = [
      {
        name: "yes",
        value: "Yes",
      },
      {
        name: "No",
        value: "No",
      },
    ];

    if (account_type === "self") {
      list = [
        {
          label:
            "Have you been diagnosed / hospitalized for any illness / injury during the last 48 months?",
          options: radioOptions,
          key: "mand_1",
          input_type: "radio",
        },
        {
          label:
            "Have you ever filed a claim with your current / previous insurer?",
          options: radioOptions,
          key: "mand_2",
          input_type: "radio",
        },
        {
          label:
            "Has your Health insurance been declined, cancelled or charged a higher premium?",
          options: radioOptions,
          key: "mand_3",
          input_type: "radio",
        },
        {
          label:
            "Are you already covered under any other health insurance policy of Religare Health Insurance?",
          options: radioOptions,
          key: "mand_4",
          input_type: "radio",
        },
      ];
    } else {
      list = [
        {
          label:
            "Have any of the person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?",
          options: radioOptions,
          key: "mand_1",
          input_type: "radio",
        },
        {
          label:
            "Have any of the person(s) to be insured ever filed a claim with their current / previous insurer?",
          options: radioOptions,
          key: "mand_2",
          input_type: "radio",
        },
        {
          label: "Who is the member?",
          options: {
            family: ["Wife", "Son"],
            selfandfamily: ["Self", "Wife", "Son"],
            parents: ["Father", "Mother"],
          },
          key: "mand_3",
          input_type: "checkbox",
        },
        {
          label:
            "Has any proposal for Health insurance been declined, cancelled or charged a higher premium?",
          options: radioOptions,
          key: "mand_4",
          input_type: "radio",
        },
        {
          label:
            "Is any of the person(s) to be insured, already covered under any other health insurance policy of Religare Health Insurance?",
          options: radioOptions,
          key: "mand_5",
          input_type: "radio",
        },
      ];
    }

    this.setState({
      account_type: account_type,
      medical_questions: medical_questions_data || {},
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
        screen_name: "medical_history",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleCheckbox = (event) => {
    let { name, value } = event.target;
    let { medical_questions } = this.state;
    medical_questions[name] = {
      ...medical_questions[name],
      [value.toLowerCase()]: event.target.checked,
    };

    this.setState({
      medical_questions: medical_questions,
    });
  };

  handleChangeRadio = (key, event) => {
    let { medical_questions } = this.state;

    medical_questions[key] = {
      answer: event === 0 ? true : false,
    };

    medical_questions[key+'_error'] = ''

    this.setState({
      medical_questions: medical_questions,
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    let { medical_questions, list, groupHealthPlanData } = this.state;
    let canProceed = true;

    list.forEach(item => {
      if (!medical_questions[item.key]) {
        canProceed = false
        medical_questions[item.key+'_error'] = 'Please select one option'
      }
    })

    this.setState({
      medical_questions: medical_questions
    })

    let member_base = this.state.lead.member_base;
    let body = {};

    if (canProceed) {

      list.forEach(item => {
        groupHealthPlanData.medical_questions_data = {
          ...groupHealthPlanData.medical_questions_data,
          [item.key]: medical_questions[item.key].answer ? 'Yes' : 'No'
        }
      })

      this.setLocalProviderData(groupHealthPlanData);

      for (var i in member_base) {
        let key = member_base[i].key;
        let backend_key = member_base[i].backend_key;
        body[backend_key] = {};

        if (medical_questions[key].answer) {
          body[backend_key].mand_question_exists = 'true';

          list.forEach(item => {
            body[backend_key].medical_questions = {
              ...body[backend_key].medical_questions,
              [item.key]: {...medical_questions[item.key]}
            }
          }) 
          
        } else {
          body[backend_key].mand_question_exists = 'false';
        }
      }

      this.updateLead(body);
    }
  };

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
