import React, { Component, Fragment } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {  genderOptions, childeNameMapper } from '../../../constants';

import PlusMinusInput from '../../../../common/ui/PlusMinusInput';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import toast from '../../../../common/ui/Toast';
import { initialize } from '../common_data';
import ReactTooltip from "react-tooltip";
import GenericTooltip from '../../../../common/ui/GenericTooltip'
import Checkbox from 'common/ui/Checkbox';

const other_adult_member_options = [
    {
        'name': 'Husband',
        'value': 'husband'
    },
    {
        'name': 'Wife',
        'value': 'wife'
    }
];

const parents_category_options = [
    {
        'name': 'Parents',
        'value': 'parents'
    },
    {
        'name': 'Parents in-law',
        'value': 'parents_in_law'
    }
];

const self_options = [
    {
        'name': 'Self',
        'value': 'Self'
    }
];

class GroupHealthPlanAddMembers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_title: 'Your date of birth',
            final_dob_data: [],
            self_member: 'Self',
            plus_minus_keys: ['son', 'daughter'],
            father_onlycheckbox: true,
            mother_onlycheckbox: true,
            'father_in_law_onlycheckbox': true,
            'mother_in_law_onlycheckbox': true,
            parents_onlycheckbox: true,
            parents_in_law_onlycheckbox: true,
            ui_members: {},
            screen_name: 'add_members_screen'
        };

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let screenData = this.state.screenData;

        this.setState({
            son_max: screenData.son_max,
            daughter_max: screenData.daughter_max,
            total_plus_minus_max: screenData.total_plus_minus_max,
            account_type: this.state.groupHealthPlanData.account_type,
            header_title: this.state.groupHealthPlanData.account_type === 'parents' ? 'Add parents to be insured' :
                'Add members to be insured'
        });

        let ui_members = this.state.groupHealthPlanData.ui_members || {};
        this.setState({
            son_total: ui_members.son_total || 0,
            son_checked: ui_members.son_total ? true : false,
            daughter_total: ui_members.daughter_total || 0,
            daughter_checked: ui_members.daughter_total ? true : false,
            father_checked: ui_members.father || screenData.preselect_father || false,
            'father_in_law_checked': ui_members.father_in_law || screenData.preselect_father_in_law || false,
            father_disabled: screenData.disable_father || false,
            'father_in_law_disabled': screenData.disable_father_in_law || false,
            mother_checked: ui_members.mother || screenData.preselect_mother || false,
            'mother_in_law_checked': ui_members.mother_in_law || screenData.preselect_mother_in_law || false,
            mother_disabled: screenData.disable_mother || false,
            'mother_in_law_disabled': screenData.disable_mother_in_law || false,
            other_adult_member: ui_members.other_adult_member || '',
            parents_option: ui_members.parents_option || '',
            ui_members: ui_members,
            self_gender: ui_members.self_gender || ''
        }, () => {
            this.setMinMax();
            ReactTooltip.rebuild();
        });

        if(this.state.provider === 'STAR' && (this.state.groupHealthPlanData.account_type === 'self_family' || this.state.groupHealthPlanData.account_type === 'family')){
            console.log(ui_members)
            this.setState({
                father_checked: ui_members.father || false,
                father_in_law_checked: ui_members.father_in_law || false,
                mother_checked: ui_members.mother || false,
                mother_in_law_checked: ui_members.mother_in_law || false,
                parents_checked: ui_members.father || ui_members.mother || false,
                parents_in_law_checked: ui_members.father_in_law || ui_members.mother_in_law || false
            }, () => {
                this.setMinMax();
                ReactTooltip.rebuild();
            })
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
        });
    }

    handleClick = () => {

        let canProceed = true;
        let {ui_members, provider} = this.state;

        if (this.state.account_type === 'family') {
            if (!this.state.other_adult_member && !this.state.son_total &&
                !this.state.daughter_total) {
                toast('Atleast select one member');
                return;
            }
        }

        if (this.state.account_type === 'parents_in_law') {
            if (!this.state.parents_option) {
                this.setState({
                    parents_option_error: 'Please select this option'
                });
                return;
            }
        }

        if (this.state.account_type === 'parents') {
            if (!this.state.father_checked && !this.state.mother_checked) {
                toast('Atleast select one member');
                return;
            }
        }

        if (['self_family', 'family'].includes(this.state.account_type) && !this.state.other_adult_member) {
            if(this.state.account_type==='family'){
            this.setState({
                other_adult_member_error: 'Please select this option'
            });
            canProceed = false;
        }else{
            canProceed = true;
        }
        }

        let keys_to_reset = ['self', 'wife', 'husband', 'father', 'mother', 'father_in_law', 
        'mother_in_law', 'son', 'son1', 'son2','son3', 'son4',
            'daughter', 'daughter1', 'daughter2', 'daughter3', 'daughter4'];


        for (var kr in keys_to_reset) {
            ui_members[keys_to_reset[kr]] = false;
        }

        //reset
        var groupHealthPlanData = this.state.groupHealthPlanData;
            let keys_to_empty = ['selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
            for(var x of keys_to_empty){
                groupHealthPlanData[x] = ""
            }
        ui_members.son_total = 0;
        ui_members.daughter_total = 0;

        if (this.state.account_type === 'parents') {
            if (this.state.father_checked) {
                ui_members.father = true;
            }

            if (this.state.mother_checked) {
                ui_members.mother = true;
            }
        }

        if (this.state.account_type === 'parents_in_law') {
            ui_members.parents_option = this.state.parents_option;
            let keysToCheck = [];
            if (this.state.parents_option === 'parents') {
                keysToCheck = ['father', 'mother'];
            } else {
                keysToCheck = ['father_in_law', 'mother_in_law'];
            }
            // eslint-disable-next-line
            keysToCheck.map(key => {
                if (this.state[`${key}_checked`]) {
                    ui_members[key] = true;
                }
            });
        }

        if(this.state.provider === 'STAR' && ['self_family', 'family'].includes(this.state.account_type)){
            var {father_in_law_checked, mother_in_law_checked, father_checked, mother_checked} = this.state;
            if (father_checked) {
                ui_members.father = true;
            }

            if (mother_checked) {
                ui_members.mother = true;
            }
            if (father_in_law_checked) {
                ui_members.father_in_law = true;
            }

            if (mother_in_law_checked) {
                ui_members.mother_in_law = true;
            }
        }

        if (['self_family', 'family'].includes(this.state.account_type)) {
            ui_members.other_adult_member = this.state.other_adult_member;


            if (this.state.account_type === 'self_family') {
                ui_members.self = true;
            }

            ui_members[this.state.other_adult_member] = true;


            if (this.state.son_total === 1) {
                ui_members.son = true;
            }

            if (this.state.son_total > 1) {
                for (let i = 1; i <= this.state.son_total; i++) {
                    ui_members[`son${i}`] = true;
                }
            }


            if (this.state.daughter_total === 1) {
                ui_members.daughter = true;
            }
            
            if (this.state.daughter_total > 1) {
                for (let i = 1; i <= this.state.daughter_total; i++) {
                    ui_members[`daughter${i}`] = true;
                }
            }

           

            ui_members.son_total = this.state.son_total || 0;
            ui_members.daughter_total = this.state.daughter_total || 0;

        }


        let adult_keys = ['husband', 'wife', 'father', 'mother', 'self', 'mother_in_law', 'father_in_law'];
        let adult_total = 0;

        let child_total = (ui_members.son_total || 0) + (ui_members.daughter_total || 0);

        for (var key in adult_keys) {
            if (ui_members[adult_keys[key]]) {
                adult_total++;
            }
        }
        let total_insured = adult_total + child_total;

        let post_body = this.state.groupHealthPlanData.post_body || {};
         
        if(post_body && post_body.quotation_id){
            delete post_body['quotation_id'];
        }
        
        post_body.adults = adult_total;
        post_body.children = child_total;

        if(this.state.account_type === 'self_family') {

            if(!this.state.self_gender) {
                this.setState({
                    self_gender_error: 'Please select gender'
                })
                canProceed = false;
            }

            if((child_total + adult_total) <= 1) {
                toast('Please select atleast one family member');
                canProceed = false;
            }

            if(this.state.self_gender) {
                if(this.state.self_gender === 'MALE' && this.state.other_adult_member === 'husband') {
                    this.setState({
                        other_adult_member_error :'Invalid choice'
                    })
                    canProceed = false;
                }

                if(this.state.self_gender === 'FEMALE' && this.state.other_adult_member === 'wife') {
                    this.setState({
                        other_adult_member_error :'Invalid choice'
                    })
                    canProceed = false;
                }
            }

            ui_members.self_gender = this.state.self_gender || '';
            
        } else {
            ui_members.self_gender = '';
        }

        if(provider === 'STAR' && total_insured < 2 && this.state.account_type !== 'self_family') {
            toast('Please select atleast one more member');
            canProceed = false;
        }

        if(canProceed) {
            let groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.post_body = post_body;
            groupHealthPlanData.eldest_member = ''; //reset
            groupHealthPlanData.eldest_dob = ''; //reset
            this.setLocalProviderData(groupHealthPlanData);
            this.sendEvents('next', ui_members);
            this.navigate(this.state.next_screen || 'plan-dob');
        }
        
    }


    sendEvents(user_action, ui_members) {
        ui_members = ui_members || this.state.ui_members;
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.provider === 'STAR' && (this.state.insured_account_type || '').indexOf('parents') >=0 ? 
                  this.state.parents_option : this.state.insured_account_type || '',
                "screen_name": 'add members',
                'son': ui_members.son_total || '',
                'daughter': ui_members.daughter_total || '',
                'self': ['self_family', 'self'].includes(this.state.insured_account_type) ? 'yes' : 'no',
                'parent' : `${(ui_members.father ? 'father, ' : '')} ${(ui_members.mother ? 'mother' : '') }`,
                'parents_in_law': `${(ui_members['father_in_law'] ? 'father_in_law, ' : '')} ${(ui_members['mother_in_law'] ? 'mother_in_law' : '') }`,
                'adult_member': ['self_family', 'family'].includes(this.state.account_type) ? this.state.other_adult_member : ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    setMinMax = () => {
        let son_disabled = false;
        let daughter_disabled = false;
        if ((this.state.son_total + this.state.daughter_total) === this.state.total_plus_minus_max) {
            this.setState({
                son_ismax: true,
                daughter_ismax: true,
            });
        } else {
            this.setState({
                son_ismax: false,
                daughter_ismax: false,
            });
        }


        if (!this.state.daughter_total && this.state.son_total === this.state.total_plus_minus_max) {
            daughter_disabled = true;
        }

        if (!this.state.son_total && this.state.daughter_total === this.state.total_plus_minus_max) {
            son_disabled = true;
        }

        this.setState({
            son_disabled: son_disabled,
            daughter_disabled: daughter_disabled,
        });
    };

    updateParent = (key, value) => {
        
        if(this.state.provider === 'STAR' && (this.state.account_type === 'family' || this.state.account_type === 'self_family')){
            var {father_in_law_checked, mother_in_law_checked, father_checked, mother_checked} = this.state;
            if(key[0] === 'parents_total' && !value){
                father_checked = false; 
                mother_checked = false;
            }else if(key[0] === 'parents_total' && value){
                father_checked = true; 
                mother_checked = true;
            }
    
            if(key[0] === 'parents_in_law_total' && !value){
                father_in_law_checked = false; 
                mother_in_law_checked = false;
            }else if(key[0] === 'parents_in_law_total' && value){
                father_in_law_checked = true; 
                mother_in_law_checked = true;
            }

            this.setState({
                [key]: value,
                father_checked, 
                mother_checked, 
                father_in_law_checked, 
                mother_in_law_checked
            }, () => {
                this.setMinMax();
            });
        }else{
            this.setState({
                [key]: value
            }, () => {
                this.setMinMax();
            });
        }
    };

    handleChangeRadio = name => event => {

        let options = other_adult_member_options;
        if(name === 'self_gender') {
            options = genderOptions;
        }
        if (name === 'parents_option') {
            options = parents_category_options;

            let groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.account_type = options[event].value || ''
            groupHealthPlanData.account_type_name = options[event].value || ''
            groupHealthPlanData.post_body.insurance_type = options[event].value  || ''
            groupHealthPlanData.post_body.account_type = options[event].value || ''
            

            this.setState({
                parents_option: options[event] ? options[event].value : '',
            });
        }
        this.setState({
            [name]: options[event] ? options[event].value : '',
            [name + '_error']: ''
        }, () => {
            ReactTooltip.rebuild();
        });

    };

    handleSubCheckbox = (name) =>{
        var {father_checked, mother_checked, father_in_law_checked, mother_in_law_checked, parents_checked, parents_in_law_checked} = this.state;
        
        if((name === 'father' || name === 'mother') && !father_checked && !mother_checked){
                parents_checked = false
        }
        if((name === 'father_in_law' || name === 'mother_in_law') && !father_in_law_checked && !mother_in_law_checked){
                parents_in_law_checked = false
        }
        this.setState({
            parents_checked, 
            parents_in_law_checked
        })
    }

    
    handleCheckbox = (name) =>{
        this.setState({
            [name + '_checked'] : !this.state[name + '_checked'],
        }, ()=>{
            this.handleSubCheckbox(name);
        });
    }
    render() {

        return (
          <Container
            events={this.sendEvents("just_set_events")}
            showLoader={this.state.show_loader}
            title={this.state.header_title}
            fullWidthButton={true}
            buttonTitle="CONTINUE"
            onlyButton={true}
            handleClick={() => this.handleClick()}
          >
            {["self_family"].indexOf(this.state.account_type) !== -1 && (
              <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Policy already includes"
                  class="Gender:"
                  options={self_options}
                  id="self_member"
                  name="self_member"
                  disabledWithValue={true}
                  error={this.state.self_member_error ? true : false}
                  helperText={this.state.self_member_error}
                  value={this.state.self_member || ""}
                  onChange={() => {}}
                />
              </div>
            )}

            {["self_family"].indexOf(this.state.account_type) !== -1 && (
              <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Your gender"
                  class="Gender:"
                  options={genderOptions}
                  id="self_gender"
                  name="self_gender"
                  error={this.state.self_gender_error ? true : false}
                  helperText={this.state.self_gender_error}
                  value={this.state.self_gender || ""}
                  onChange={this.handleChangeRadio("self_gender")}
                />
              </div>
            )}

            {["self_family", "family"].indexOf(this.state.account_type) !==
              -1 && (
              <div>
                <div className="InputField">
                  <RadioWithoutIcon
                    width="40"
                    label={
                      this.state.account_type === "self_family"
                        ? "Other adult member"
                        : "Adult member"
                    }
                    class="Gender:"
                    options={other_adult_member_options}
                    id="other_adult_member"
                    name="other_adult_member"
                    error={this.state.other_adult_member_error ? true : false}
                    helperText={this.state.other_adult_member_error}
                    value={this.state.other_adult_member || ""}
                    onChange={this.handleChangeRadio("other_adult_member")}
                    canUnSelect={true}
                  />
                </div>

                <div className="plus-minus-input-label">
                  Children (up to {this.state.total_plus_minus_max})
                </div>
                <div className="generic-hr"></div>
                <PlusMinusInput name="daughter" parent={this} />
                <div className="generic-hr"></div>
                <PlusMinusInput name="son" parent={this} />
                <div className="generic-hr"></div>
                {
                    this.state.provider === 'STAR' && (
                        <div>
                            <p style={{marginTop: '25px'}}>Select parent type</p>
                            <div className="generic-hr"></div>
                            <PlusMinusInput name="parents" parent={this} />
                            {
                                this.state.parents_checked && (
                                <div className="horizontal-checkbox-layout">
                                    <div className="add-member-generic-checkbox">
                                        <Checkbox 
                                            value="Father" 
                                            handleChange={()=>this.handleCheckbox('father')}
                                            checked={this.state.father_checked}
                                        />
                                        <p>Father</p>
                                    </div>
                                    <div className="add-member-generic-checkbox">
                                        <Checkbox 
                                            value="Father" 
                                            handleChange={()=>this.handleCheckbox('mother')}
                                            checked={this.state.mother_checked}
                                        />
                                        <p>Mother</p>
                                    </div>
                                </div>
                                )
                            }
                                
                            <div className="generic-hr"></div>
                            <PlusMinusInput label="Parents-in-law" name="parents_in_law" parent={this} />
                            {
                                this.state.parents_in_law_checked && (
                                <div className="horizontal-checkbox-layout">
                                    <div className="add-member-generic-checkbox">
                                        <Checkbox 
                                            value="Father" 
                                            handleChange={()=>this.handleCheckbox('father_in_law')}
                                            checked={this.state.father_in_law_checked}
                                        />
                                        <p>Father-in-law</p>
                                    </div>
                                    <div className="add-member-generic-checkbox">
                                        <Checkbox 
                                            value="Father" 
                                            handleChange={()=>this.handleCheckbox('mother_in_law')}
                                            checked={this.state.mother_in_law_checked}
                                        />
                                        <p>Mother-in-law</p>
                                    </div>
                                </div>
                                )
                            }
                            
                            <div className="generic-hr" style={{marginBottom: '30px'}}></div>
                        </div> 
                    )
                }
                

              </div>
            )}

            {["parents"].indexOf(this.state.account_type) !== -1 && (
              <div>
                <div className="plus-minus-input-label">Parents</div>
                <div className="generic-hr"></div>
                <PlusMinusInput name="father" parent={this} />
                <div className="generic-hr"></div>
                <PlusMinusInput name="mother" parent={this} />
                <div className="generic-hr"></div>
              </div>
            )}

            {["parents_in_law"].includes(this.state.account_type) && (
              <div>
                <div className="InputField">
                  <RadioWithoutIcon
                    width="40"
                    label={"Select"}
                    options={parents_category_options}
                    id="other_adult_member"
                    name="other_adult_member"
                    error={this.state.parents_option_error ? true : false}
                    helperText={this.state.parents_option_error}
                    value={this.state.parents_option || ""}
                    onChange={this.handleChangeRadio("parents_option")}
                    canUnSelect={true}
                  />
                </div>
                {this.state.parents_option && (
                  <Fragment>
                    <div className="plus-minus-input-label flex-between-center">
                      Policy includes both the parents
                      <GenericTooltip
                        productName={getConfig().productName}
                        content={
                          <div>
                            This plan requires both the {this.state.parents_option === "parents_in_law" ? "parents in-law" : "parents"} to be covered together.
                          </div>
                        }
                      />
                    </div>
                    <div className="generic-hr"></div>
                    <PlusMinusInput
                      label={childeNameMapper(
                        this.state.parents_option === "parents_in_law"
                          ? "father_in_law"
                          : "father"
                      )}
                      name={
                        this.state.parents_option === "parents_in_law"
                          ? "father_in_law"
                          : "father"
                      }
                      parent={this}
                    />
                    <div className="generic-hr"></div>
                    <PlusMinusInput
                      label={childeNameMapper(
                        this.state.parents_option === "parents_in_law"
                          ? "mother_in_law"
                          : "mother"
                      )}
                      name={
                        this.state.parents_option === "parents_in_law"
                          ? "mother_in_law"
                          : "mother"
                      }
                      parent={this}
                    />
                    <div className="generic-hr"></div>
                  </Fragment>
                )}
              </div>
            )}
          </Container>
        );
    }
}

export default GroupHealthPlanAddMembers;