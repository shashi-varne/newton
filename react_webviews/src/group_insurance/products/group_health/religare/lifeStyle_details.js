import React, { Component } from "react";
import Container from "../../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import { initialize, updateLead } from "../common_data";
import RadioAndCheckboxList from "./radioAndCheckboxList";
import { isValidMonthYear } from "utils/validators";
import { formatMonthandYear, dobFormatTest, validateAlphabets, IsFutureMonthYear, IsPastMonthYearfromDob, containsSpecialCharacters } from "utils/validators";
import toast from "../../../../common/ui/Toast";
import ConfirmDialog from './../plans/confirm_dialog';
import { compact } from 'lodash';

class GroupHealthPlanLifestyleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctaWithProvider: true,
      get_lead: true,
      life_style_question: {},
      next_state: 'plan-medical-history',
      screen_name: 'life_style_details'
    };

    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload() {

    let { insured_people_details, quotation_details } = this.state.lead;
 
    let account_type  =  quotation_details.insurance_type
    let member_base = [];

    let none_option_selected = true;
    for (var mem in insured_people_details) {
      if(insured_people_details[mem].answers.life_style_details.length >= 0) {
        none_option_selected = false;
        break;
      }
    };
    if(this.props.edit) {
      this.setState({
        next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
      })
    }
    this.setState({
      none_option_selected: none_option_selected, 
    })

    if (member_base.length > 1) {
      member_base.push({
        key: 'none',
        life_style_question_exists: none_option_selected
      })
    }

    insured_people_details.forEach((element, index) => {
      if (element.answers.life_style_details.length >= 1 && element.answers.life_style_details[0].yes_no) {
        element.insured_person.life_style_question = element.answers.life_style_details[0]
        element.insured_person.life_style_question.answer = element.insured_person.life_style_question.yes_no
        element.insured_person.life_style_question.answer_description = element.insured_person.life_style_question.description
        let since_when = element.insured_person.life_style_question.since_when.split('/');
        let since_when_lifestyle = `${since_when[1]}/${since_when[2]}`
        element.insured_person.life_style_question.start_date = since_when_lifestyle
        element.insured_person.life_style_question.medical_question = "PEDSmokeDetails"
        element.insured_person.life_style_question.key_mapper = "lifestylye_no_1"
        element.insured_person.life_style_question_exists = true
      } else {
        element.insured_person.life_style_question = {}
      }
      member_base.push(element.insured_person)
    });

    member_base.forEach(element => {
     let relation = this.state.member_base.find(mem => mem.backend_key === element.relation_key)
      element.key = relation.key
    });
    member_base.sort((a, b) => {return this.state.member_base.findIndex(p => p.backend_key === a.relation_key) - this.state.member_base.findIndex(p => p.backend_key === b.relation_key)})

    if(account_type !== "self") {
    member_base.push({
        key: 'none'
    })
  }

    let list = [];
   
   if (account_type === "self") {

    this.setState({
      member_base : member_base
    })


      member_base[0].life_style_question_exists = insured_people_details[0].answers.life_style_details.length > 0 && insured_people_details[0].answers.life_style_details[0].yes_no ? 'Yes' : 'No' 
    
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
      member_base: member_base,
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

  sendEvents(user_action, data={}) {
    
    const member_base = data.member_base || this.state.member_base || [];
    const selected_members = member_base.map(member => (member.life_style_question_exists && member.life_style_question_exists !== 'No') ? member.key : '');
    let eventObj = {
      event_name: "health_insurance",
      screen_name: "lifestyle_details",
      properties: {
        user_action: user_action,
        screen_name: "lifestyle_details",
        "product": this.state.providerConfig.provider_api,
        "flow": this.state.insured_account_type || '',
        member_smokes: !this.state.none_option_selected ? compact(selected_members).join(', ') : '',
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
    member_base[index].life_style_question_exists =  member_base[index].radio_options[event].value;
    member_base[index].life_style_question_exists_error = '';

    this.setState({
      member_base: member_base,
      none_option_selected: false
    });
  };

  handleChange = (event, index) => {

    let { value, id } = event.target;
    let { member_base } = this.state;

    if(containsSpecialCharacters(value)){
      return;
    }
    if (id === "answer_description") {
      member_base[index].life_style_question.answer_description = value;
      member_base[index].life_style_question.answer_description_error = '';
    } else {
      if (!dobFormatTest(value)) {
        return;  //
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

    if(!date){
      return 'please enter the valid date'
    }
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
    let { member_base, none_option_selected } = this.state;

    let canProceed = true;

    let atlOneOption = none_option_selected || false;

    if (!none_option_selected) {
      for (let key in member_base) {

        let member_data = member_base[key];

        if ((member_data.life_style_question_exists === 'Yes' ||
            member_data.life_style_question_exists === true) && member_data.key !== 'none') {
          member_data.life_style_question.answer_description_error = this.validateDescription(member_data.life_style_question.answer_description);
          member_data.life_style_question.start_date_error = this.validateMonthYear(member_data.life_style_question.start_date, member_data.dob.replace(/\//g, "-"))

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
    });


    if (!atlOneOption) {
      canProceed = false;
      toast("Select atleast one option");
    }
 

    let body = {
    }
    this.sendEvents("next", {member_base: member_base});
 
   if (canProceed) {
     body["answers"] = {}
     let insured_people_details = []
     for (var i in member_base) {
       let member_data = member_base[i];
       if (member_data.key !== 'none') {
         let backend_key = member_data.relation_key;

         if ((member_data.life_style_question_exists === 'Yes' ||
             member_data.life_style_question_exists === true) && !none_option_selected) {
              let date =  member_data.life_style_question.start_date.split('/');
              if(isNaN(date[1]) || date[1].length < 4){
              toast('Enter Valid date');
              return;
              }

           body["answers"][backend_key] = {};
           let obj = {
             "yes_no": true,
             "since_when": member_data.life_style_question.start_date,
             "description": member_data.life_style_question.answer_description,
             "question_id": "religare_lsd_smoke"
           }
           insured_people_details.push({"relation_key": backend_key, "life_style_details_flag" : true})

           body["answers"][backend_key] = {
            "life_style_details": [obj]
          };

        }else{
          insured_people_details.push({"relation_key": backend_key, "life_style_details_flag" : false})
          body["answers"][backend_key] = {
            "life_style_details": [{
              "yes_no": false,
              "question_id": "religare_lsd_smoke"
            }]
          }
        } 
      }
      body['insured_people_details'] = insured_people_details;
    }
    
    var current_state = {}
    for(var x in body.answers){
      var life_style_data = body.answers[x].life_style_details[0];
      if(life_style_data.yes_no){
        current_state[`${x}_yes_no`] = life_style_data.yes_no;
        current_state[`${x}_since_when`] = life_style_data.since_when;
        current_state[`${x}_desc`] = life_style_data.description;
      } 
    }
    this.updateLead(body, '', current_state);
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
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title={this.setEditTitle('Lifestyle details')}
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
