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
            show_loader: true,
            selectedIndex: '',
            screen_name: 'select_ped_screen'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    onload = () => {
                              console.log("927992799279")
        this.setState({
            options: [],
            show_checkbox: false
        })
        let next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;

        let {lead, provider} = this.state;
        let member_base = lead.member_base; console.log(member_base,"hello")
        let member_key = this.props.match.params.member_key;
           console.log(member_key,lead)
        let member_info_index  = member_base.findIndex(data => data.key === member_key);
        let member_info = member_base[member_info_index];
        let backend_key = member_info.backend_key;
        let ped_diseases_name = member_info.ped_diseases_name;console.log(member_info,member_base,member_key)

        ped_diseases_name = (ped_diseases_name || '').split(',');
          console.log(this.state.screenData.ped_list)
        let options = this.state.screenData.ped_list.map((item, index) => {
            item.checked = false;
            item.start_date = '';
            item.answer_description = '';
            item.description = index === this.state.screenData.ped_list.length - 1 ? '' : item.description;

            return item;
        });
        console.log(options)
        if(this.state.provider === 'RELIGARE') {
            let ped_data = member_info.ped_diseases || [];

            ped_data.forEach(item => {

                options.forEach((opt, index) => {

                    if(opt.id === item.key_mapper) {
                        options[index].checked = true;
                        options[index].start_date = item.start_date || '';
                        options[index].description = item.answer_description !== null ? item.answer_description : options[index].description;
                    }
                })

            })
        }

        let other_diseases = '';

        if(provider === 'HDFCERGO') {
            for (let disease_name of ped_diseases_name) {
                  console.log(ped_diseases_name)
                let matched;
    
                for (let opt of options) {
                    if (opt.name === disease_name) {
                        opt.checked = true;
                        matched = true;
                    }
                }
    
                if(!matched) {
                    other_diseases += disease_name;
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
                show_loader: false,
            })
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
        let member_base = lead.member_base;
        let current_member = member_base[member_info_index];
        if (options[options.length - 1].checked &&
            !this.state.pedOther) {
            toast('Enter details in other or uncheck it');
            return;
        } else {

            let next_state = '';
            for (var i =0; i < member_base.length; i++) {
                if(member_base[i].key === this.state.member_key && i !== member_base.length -1) {
                    for (var k =i+1; k < member_base.length; k++) {
                        if(member_base[k].ped_exists && member_base[k].key !== 'applicant') {
                            next_state = member_base[k].key;
                            break;
                        }
                    }
                }
            }


            let body = {};

            if(provider === 'HDFCERGO') {
                let ped_diseases_name = '';

                for(var j in options) {
                    console.log(options,j)
                    if(options[j].checked) {
    
                        let value = options[j].name;
    
                        if(options[j].name === 'Other') {
                            value = this.state[this.state.otherInputData.name];
                        }
    
    
                        if(!ped_diseases_name) {
                            ped_diseases_name = value;
                        } else {
                            ped_diseases_name += ',' + value;
                        }
                    } 
                }
    
                if(!ped_diseases_name) {
                    toast('Atleast select one or uncheck this member');
                    return;
                }

                let body_to_send =  {
                    ped_diseases_name: ped_diseases_name,
                    ped_exists: "true"
                }
    
                body = {
                    [this.state.backend_key] :body_to_send
                }



//  let bbody = {
//      "application_id": "26084492-1b41-4488-9352-4581ff5b4da9",
//      "answers": {
//          "spouse_account_key": [{
//              "question_id": "hdfc_ergo_ped_renal_kidneystone_urinary",
//              "yes_no": true
//          }]
//      }
//  }
                current_member = {
                    ...current_member,
                    ...body_to_send
                } //to store the member specific info, because we will not hit the api again
            }
            

            if(provider === 'RELIGARE') {
                let ped_diseases = {};
                
                let min_one_ped = false;
                for(var l in options) {
                    if(options[l].checked) {
                        min_one_ped = true;
                        let data = options[l];

                        ped_diseases[data.id] = {
                            start_date: data.start_date
                        }

                        if(options[l].name === 'Other') {
                            ped_diseases[data.id] = {
                                start_date: data.start_date,
                                answer_description: this.state[this.state.otherInputData.name] // other input value
                            }
                        }
                    } 
                }
    
    
                if(!min_one_ped) {
                    toast('Atleast select one or uncheck this member');
                    return;
                }

                let body_to_send = {
                    ped_exists: "true",
                    ped_diseases: ped_diseases
                }
    
                body = {
                    [this.state.backend_key] : body_to_send
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
                    ...current_member,
                    ped_diseases: data_to_store,
                    ped_exists: "true"
                } //to store the member specific info, because we will not hit the api again
            }

            lead.member_base[member_info_index] = current_member;

            this.setState({
                next_state: next_state || this.state.next_state,
                force_forward: !!next_state && this.props.edit,
                lead: lead
            })



            let bbody = {
                "application_id": "26084492-1b41-4488-9352-4581ff5b4da9",
                "answers": {
                    "spouse_account_key": [{
                        "question_id": "hdfc_ergo_ped_renal_kidneystone_urinary",
                        "yes_no": true
                    }]
                }
            }

            let boody = {
                "self_account_key": {
                    "ped_diseases_name": "Asthma,Cholecystectomy/Gall bladder surgery/removal",
                    "ped_exists": "true"
                }
            }

              console.log(body)
            // this.updateLead(body);
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
                showLoader={this.state.show_loader}
                title={this.state.member_key === 'self' ? this.setEditTitle('Your pre-existing diseases') : this.setEditTitle(capitalizeFirstLetter(childeNameMapper(this.state.member_key)) + "'s pre-existing diseases")}
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