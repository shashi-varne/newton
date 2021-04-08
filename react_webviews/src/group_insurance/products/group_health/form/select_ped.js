import React, { Component } from 'react';
import Container from '../../../common/Container';
import toast from '../../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import CheckboxList from '../../../../common/ui/CheckboxList';
import {  capitalizeFirstLetter } from 'utils/validators';
import { childeNameMapper } from '../../../constants';

class GroupHealthPlanSelectPed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            ctaWithProvider: true,
            relationshipOptions: [],
            ui_ped_data: {},
            onlycheckbox: true,
            options: [],
            pedOther: '',
            otherInputData: {
                name: 'pedOther',
                value: '',
                label: 'Enter details',
                header_title: 'Please provide other pre-existing diseases details',
                cta_title: 'OK'
            },
            get_lead: true,
            skelton:true,
            selectedIndex: '',
            screen_name: 'select_ped_screen'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    onload = () => {

        this.setState({
            options: [],
            show_checkbox: false
        })
        let next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;
       
        let {lead, provider} = this.state;

        let member_base =this.state.member_base;
        let member_key = this.props.match.params.member_key;
        let member_info_index = member_base.findIndex(item => item.key === member_key);

        let mem_details = member_base[member_info_index]
        let deatils = this.state.lead.insured_people_details.find(element => element.insured_person.relation_key === mem_details.backend_key);
        let relation = this.state.member_base.find(mem => mem.backend_key === deatils.insured_person.relation_key)


        deatils.insured_person.relation = relation.key
        deatils.key = relation.key
       
         let member_info = {
        ...deatils.insured_person,
        ...deatils.answers,
        ...this.state.member_base[member_info_index], 
      }
        
        let backend_key = member_info.relation_key;
        let ped_diseases_name = deatils.answers.pre_existing_diseases; 
        // ped_diseases_name = (ped_diseases_name || '').split(',');

        let options = this.state.screenData.ped_list.map((item, index) => {
            item.checked = false;
            item.start_date = '';
            item.answer_description = '';
            item.description = index === this.state.screenData.ped_list.length - 1 ? '' : item.description;
            item.question_id = item.id
            return item;
        });

        if(this.state.provider === 'RELIGARE') {
                                                             
           
            let ped_data = member_info.pre_existing_diseases.length >= 1 ? member_info.pre_existing_diseases : [];

            ped_data.forEach(item => {
    
                options.forEach((opt, index) => {  

                    if(opt.key === item.front_end_question_id || opt.key === item.question_id ) {
                        let since_when = item.since_when.length > 4 ?  item.since_when.split('/') : ''
                        let ped_date =   since_when[2] ? `${since_when[1]}/${since_when[2]}` : `${since_when[0]}/${since_when[1]}`
                        options[index].checked = true;
                        options[index].start_date = ped_date || ''
                        options[index].description = item.description !== null ? item.description : options[index].description;
                    }
                })

            })
        }

        let other_diseases = '';

        if(provider === 'HDFCERGO') {
            for (let disease_name of ped_diseases_name) {
                // var matched;
                for (let opt of options) {
                    if (opt.question_id === disease_name.front_end_question_id || opt.question_id === disease_name.question_id) {
                        opt.checked = true;
                        // matched = true;
                    }
                }
             
                if(disease_name.front_end_question_id === 'hdfc_ergo_ped_other_diseases' || disease_name.question_id === 'hdfc_ergo_ped_other_diseases') {
             
                    other_diseases += disease_name.description;
                }
            }
    
            if(other_diseases) {
                options[options.length - 1].checked = true;
                options[options.length - 1].description = other_diseases;
            }
        }

        this.setState({
            member_key: member_key,
            lead: lead,
            backend_key: backend_key,
            options: options,
            otherInputData: {
                ...this.state.otherInputData,
                value: other_diseases
            },
            [this.state.otherInputData.name]: other_diseases,
            next_state: next_state,
            pedOther: other_diseases || options[options.length - 1].description,
            member_info_index: member_info_index
        }, ()=> {
            this.setState({
                show_checkbox: true,
                skelton:false,
            })
        })

        lead = this.state.lead;
        this.state.member_base.forEach((ele) => {if (ele.backend_key === backend_key){
        lead[backend_key] = {};
        lead[backend_key].dob = ele.dob.replace(/\//g, "-");}})
        this.setState({
            lead: lead
        })
    }


    
    componentDidUpdate(prevState) {
        if (this.state.member_key && this.state.member_key !== this.props.match.params.member_key) {
            this.onload();
        }
    }

    componentWillMount() {
        this.initialize();
    }

    updateParent = (key, value) => {

        let {options, dateModalIndex, provider} = this.state;
        if(key === 'startDateModal') {
            
            options[dateModalIndex].start_date = value;

            this.setState({
                options: options
            })
        } else if(key === 'openPopUpInputDate' && value === false) {

            if(provider === 'RELIGARE' && !options[dateModalIndex].start_date) {
                options[dateModalIndex].checked = false;
            }
            this.setState({
                [key]: value,
                options: options
            });

        } else {
            this.setState({
                [key]: value,
            });
        }
       
    }

    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });
    }

    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true,
        })
    }

    handleClick = async () => {
        this.sendEvents('next');

        let {options, provider ,lead, member_info_index} = this.state;       
       
       let memb =  this.state.member_base.filter(mem => mem.dob !== undefined)
       let member_base =  memb.map((element, index) => {
       let member = lead.insured_people_details.find((member) => member.insured_person.relation_key === element.backend_key)
        return {
            ...element,
            ...member.insured_person,
            ...member.answers
           }
        })

        let current_member = member_base[member_info_index];

        if(!isNaN(this.state.pedOther)){
            if(this.state.pedOther.length > 0) {
            toast('Invalid other pre-existing diseases details');
            return;
        }
    }

        if (options[options.length - 1].checked &&
            !this.state.pedOther) {
            toast('Enter details in other or uncheck it');
            return;
        } else {
  
            let next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;
            for (var i =0; i < member_base.length; i++) {
                if(member_base[i].key === this.state.member_key && i !== member_base.length -1) {
                    for (var k =i+1; k < member_base.length; k++) {
                        if(member_base[k].ped && member_base[k].key !== 'applicant') {
                            next_state = member_base[k].key; 
                            break; 
                        }
                    }
                }
            } 
            let body = {};
            let pre_existing_diseases = []
            if (provider === 'HDFCERGO') {
               
                for (var j in options) {

                    if (options[j].checked) {
                        let value = options[j].name

                        if (options[j].name === 'Other') {
                            value = this.state[this.state.otherInputData.name];
                        }
                        let obj = {
                            "yes_no": true,
                            "question_id": options[j].id,
                            'description' : value   
                        }
                        pre_existing_diseases.push(obj)
                    }
                }
                if(pre_existing_diseases.length <= 0) {
                    toast('Atleast select one or uncheck this member');
                    return;
                }

                body = {
                    
                    "answers": {
                        [this.state.backend_key]: {
                            pre_existing_diseases
                        }
                    }
                }


                current_member = {
                    "insured_person": current_member,
                    "answers": {
                        "pre_existing_diseases": pre_existing_diseases
                    }
                }                              
            
            }

            if(provider === 'RELIGARE') {
                let ped_diseases = {};
                let min_one_ped = false;
                for(var l in options) {
                    if(options[l].checked) {

                        min_one_ped = true;
                        let data = options[l], question_id = data.key

                        if(options[l].name === 'Other') {
                            var value = this.state[this.state.otherInputData.name];
                        }
                            let date =  data.start_date.split('/')
                            if(isNaN(date[1]) || date[1].length < 4){
                            toast('Enter Valid date');
                            return;
                            }
                        let obj = {
                            "yes_no": true,
                           "question_id": question_id,
                          "since_when":  data.start_date,
                          "description" : value || ""
                        }
                        pre_existing_diseases.push(obj)
                    } 
                }
                if(!min_one_ped) {
                    toast('Atleast select one or uncheck this member');
                    return;
                }
                let body_to_send = {
                    [this.state.backend_key]  : { "pre_existing_diseases":  pre_existing_diseases }
                }
                body = {
                    
                    "answers" : body_to_send
                }
                let data_to_store = [];
                for (var key in ped_diseases) {
                    let d = ped_diseases[key];
                    data_to_store.push({
                        key_mapper: key,
                        ...d
                    })
                }

                current_member = {
                    "insured_person": current_member,
                    "answers": {
                        "pre_existing_diseases": [
                            ...pre_existing_diseases,
                           
                        ]
                    }
                } //to store the member specific info, because we will not hit the api again
              }

      let appendValue = lead.insured_people_details.findIndex( member => member.insured_person.relation_key === member_base[member_info_index].backend_key)

            lead.insured_people_details[appendValue] = current_member; 

            this.setState({
                next_state: next_state || this.state.next_state,
                force_forward: !!next_state && this.props.edit,
                lead: lead
            })

            this.setState({
                form_data: body
            }, ()=>{
                this.updateLead(body);
            })
            
        }
    }

    getTotalDisease = () => {

        let total = 0;
        let options = this.state.options || [];

        for(var j in options) {
            if(options[j].checked) {
                total++;
            } 
        }

        return total;
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'pre-existing disease_list',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'disease' : this.getTotalDisease(),
                'member': this.state.member_key || ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }






    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                skelton={this.state.skelton}
                showLoader={this.state.show_loader}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={this.props.match.params.member_key === 'self' ? this.setEditTitle('Your pre-existing diseases') : this.setEditTitle(capitalizeFirstLetter(childeNameMapper(this.props.match.params.member_key)) + "'s pre-existing diseases")}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <div className="group-health-select-ped">
                    <FormControl fullWidth>
                        {this.state.options && this.state.show_checkbox &&
                            <CheckboxList 
                            provider={this.state.provider}
                            options={this.state.options} parent={this} />}
                    </FormControl>

                    <ConfirmDialog parent={this} />
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanSelectPed;  