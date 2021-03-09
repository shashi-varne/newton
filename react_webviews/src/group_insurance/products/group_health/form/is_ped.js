import React, { Component } from 'react';
import Container from '../../../common/Container';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import { yesNoOptions } from '../../../constants';
import PlusMinusInput from '../../../../common/ui/PlusMinusInput';
import { childeNameMapper } from '../../../constants';
class GroupHealthPlanIsPed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            relationshipOptions: [],
            onlycheckbox: true,
            get_lead: true,
            screen_name: 'is_ped'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }


    onload = () => {
        let lead = this.state.lead;

        let next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;
        this.setState({
            next_state: next_state
        })
            
        let account_type = lead.quotation_details.insurance_type;

        let radio_title = 'Do you have any pre-existing diseases?';
        if (account_type !== 'self') {
            radio_title = 'Does any of the members have any pre-existing disease?';
        }

        let is_ped = 'NO';

        let body = {}
        let pedcase = false;
        body["insured_people_details"] = [];
 
        this.state.lead.insured_people_details.forEach((memberData) => {
           let relation_key  = memberData.insured_person.relation_key
           if(memberData.answers.pre_existing_diseases.length === 0 && memberData.insured_person.ped === true){
              pedcase = true
              body.pedcase = true
              memberData.insured_person.ped = false
               body["insured_people_details"].push( { 'ped': false, "relation_key" : relation_key} )
           }else if(memberData.answers.pre_existing_diseases.length === 0 ){
            memberData.insured_person.ped = false
         body["insured_people_details"].push( { 'ped': false, "relation_key" : relation_key} )
     } else  if(memberData.answers.pre_existing_diseases.length > 0 ){
      body["insured_people_details"].push( { 'ped': true, "relation_key" : relation_key} )
     }
     })

       if (pedcase) { this.updateLead(body)}

        let member_base = this.state.member_base.map((element, index) => {
            let member = lead.insured_people_details.find(member => member.insured_person.relation_key === element.backend_key)
            return {
                ...element,
                ...member   
            }
        })        

       let form_data = {};

       for (var mem in member_base) {
           let mem_info = member_base[mem];
           if (mem_info.insured_person !== undefined  && mem_info.insured_person.ped) {
               is_ped = 'YES';
               form_data[mem_info.key + '_checked'] = true;
           }
       }

       form_data.is_ped = is_ped;

       for (var key in form_data) {
           this.setState({
               [key]: form_data[key]
           });
       }

       this.setState({
        form_data: form_data,
        lead: lead,
        radio_title: radio_title,
        account_type: account_type,
        member_base: member_base
    });

    this.setState({
        bottomButtonData: {
            ...this.state.bottomButtonData,
            handleClick: this.handleClick
        }
    });
    }

    updateParent = (key, value) => {
        let form_data = this.state.form_data;
        form_data[key] = value;
        this.setState({
            form_data: form_data,
            [key]: value
        });
    }


    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
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
        let form_data = this.state.form_data;
        let canSubmitForm = true;
        if (!form_data.is_ped) {
            form_data.is_ped_error = 'Please select this';
            canSubmitForm = false;
        }

        this.setState({
            form_data: form_data
        })

        let member_base =   this.state.member_base
        
        let body = {};
        let next_state = '';
        body['self_account_key'] = {
            ped_exists: 'false'
        };


        let insured_people_details = []
        let answers = {}

        for (var i in member_base) {
            if(member_base[i].insured_person !== undefined) {
            let backend_key = member_base[i].insured_person.relation_key;
            let key = member_base[i].key;
            body[backend_key] = {};
            
                if ( (form_data[key + '_checked'] && this.state.form_data.is_ped === 'YES') ||  (backend_key === 'self_account_key' && this.state.form_data.is_ped === 'YES' && this.state.insured_account_type === 'self' ) ) {
                    let obj = {
                        "relation_key": backend_key,
                        'ped': true
                    }
                    insured_people_details.push(obj)
                    if (!next_state) {
                        next_state = key;
                    }
                } else{
                    let obj = {
                        "relation_key": backend_key,
                        'ped': false 
                    }
                    answers[backend_key]  =  {
                        'pre_existing_diseases' : []
                    }
                    insured_people_details.push(obj)
                }
           }
        }
 
        if (this.state.lead.quotation_details.insurance_type !== 'self' && form_data.is_ped === 'YES' && !next_state) {
            canSubmitForm = false;
            toast('Please select atleast one');
        }

        if (this.state.lead.quotation_details.insurance_type === 'self' && form_data.is_ped === 'YES') {
            next_state = 'self';
            body['self_account_key'].ped_exists = 'true';
        }

        if(form_data.is_ped === 'YES' && this.props.edit) {
            this.setState({
                force_forward: true
            })
        }

        if (canSubmitForm) {
            this.setState({
                next_state: next_state ? `${this.props.edit ? 'edit-' : ''}select-ped/` + next_state : this.state.next_state
            })

         
            let body = {
                insured_people_details,
                'answers' : answers
            }
            this.updateLead(body);
        }

    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'pre-existing_disease',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'pre-existing_disease': this.state.form_data.is_ped === 'YES' ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleChangeRadio = name => event => {


        var form_data = this.state.form_data || {};
        let member_base = this.state.member_base;

        let optionsMapper = {
            'is_ped': yesNoOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';


        if (form_data.is_ped !== 'YES') {
            for (var i in member_base) {
                let key = member_base[i].key;
                form_data[key + '_checked'] = false;
                this.setState({
                    [key + '_checked']: false
                })
            }
        }

        this.setState({
            form_data: form_data
        })

    };

    renderMembers = (props, index) => {

        if (props.key === 'applicant') {
            return;
        }
        return (
            <div key={index}>
                <PlusMinusInput
                    name={props.key}
                    label={childeNameMapper(props.key)}
                    parent={this}
                />
                <div className="generic-hr"></div>
            </div>
        )
    }

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={this.props.edit ? 'Edit diseases' : "One last step"}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <div className="common-top-page-subtitle" style={{fontSize: '13px'}}>
                    Please disclose correct details to make hassle-free claim later
                </div>

                <FormControl fullWidth>

                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label={this.state.radio_title}
                            class="Gender:"
                            options={yesNoOptions}
                            id="is_ped"
                            name="is_ped"
                            error={(this.state.form_data.is_ped_error) ? true : false}
                            helperText={this.state.form_data.is_ped_error}
                            value={this.state.form_data.is_ped || ''}
                            onChange={this.handleChangeRadio('is_ped')} />
                    </div>

                    {this.state.account_type !== 'self' &&
                        this.state.form_data.is_ped === 'YES' &&
                        <div style={{marginBottom: this.state.member_base.length >= 5 ? '50px': ''}}>
                            <div className="plus-minus-input-label" style={{fontSize: '13px'}}>
                                Who has pre-existing disease?
                            </div>
                            <div className="generic-hr"></div>
                            {this.state.member_base.map(this.renderMembers)}
                        </div>
                    }

                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanIsPed;