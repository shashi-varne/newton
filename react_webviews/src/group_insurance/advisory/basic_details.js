import React, { Component } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon'
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {containsSpecialCharactersAndNumbers} from 'utils/validators';
import PlusMinusInput from '../../common/ui/PlusMinusInput';
import { genderOptions, yesNoOptions } from '../../group_insurance/constants' 
import {advisoryConstants} from './constants';
import DropdownWithoutIcon from '../../common/ui/SelectWithoutIcon';
import { updateLead, getLead } from './common_data';
import {storageService, isEmpty} from "utils/validators";


class AdvisoryBasicDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            ageOptions: advisoryConstants.ageOptions,
            metroCityOptions: advisoryConstants.metroCityOptions,
            dependents_data: advisoryConstants.dependents_data,
            form_data: {}, 
            Spouse_checked: false,
            Spouse_onlycheckbox: true,
            None_checked: false,
            None_onlycheckbox: true,
            showDependentsError: false
        }
        this.updateLead = updateLead.bind(this);
        this.getLead = getLead.bind(this);
    }

    async componentDidMount(){
        storageService().remove('from_advisory')
        var dependents_data = this.state.dependents_data;
        this.setState({
            Kids_max: dependents_data.kids_max,
            Kids_total: 0,
            Parents_max: dependents_data.parents_max,
            Parents_total: 0,
            // None_checked: false, 
        })
        var advisory_data = storageService().getObject('advisory_data') || {};
        var isResumePresent  = storageService().getObject('advisory_resume_present');
        
        var lead = {};
        var form_data = {};

        if(isResumePresent){
            await this.getLead();
            lead = this.state.resume_data;
        }else if(!isEmpty(advisory_data)){
            lead = advisory_data
        }

        if((isResumePresent ||!isEmpty(advisory_data)) && !isEmpty(lead)) {
            form_data.name = lead.name;
            form_data.age = lead.age;
            form_data.city = lead.city ? lead.city.toLowerCase() : '';
            form_data.gender = lead.gender === "MALE" ? genderOptions[0].value : lead.gender === "FEMALE"?  genderOptions[1].value : '';
            form_data.married = lead.marital_status === "MARRIED" ? yesNoOptions[0].value : lead.marital_status === "UNMARRIED" ?  yesNoOptions[1].value : '';
            form_data.illness = lead.ci_present === true ? yesNoOptions[0].value : lead.ci_present === false ?  yesNoOptions[1].value : '';

            if(!isEmpty(lead.dependent_json)){
                let Spouse_checked = lead.dependent_json.spouse ? true : false;
                let Kids_checked = lead.dependent_json.kids ? true : false;
                let Kids_total = lead.dependent_json.kids;
                let Parents_checked = lead.dependent_json.parents ? true : false;
                let Parents_total = lead.dependent_json.parents;
                let None_checked = lead.dependent_json.parents + lead.dependent_json.kids + lead.dependent_json.spouse === 0 ? true : false;
                this.setState({
                    Spouse_checked: Spouse_checked,
                    Kids_checked: Kids_checked,
                    Parents_checked: Parents_checked,
                    Kids_total: Kids_total,
                    Parents_total: Parents_total,
                    None_checked: None_checked
                })
            }
            this.setState({
                form_data: form_data,
            })
        }
        
    }

    setErrorData = (type) => {

        this.setState({
          showError: false
        });
        if(type) {
          let mapper = {
            'onload':  {
              handleClick1: this.getLead,
              button_text1: 'Fetch again',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleClick,
              button_text1: 'Retry',
              handleClick2: () => {
                this.setState({
                  showError: false
                })
              },
              button_text2: 'Edit'
            }
          };
      
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
    }

    handleChange = name => event => {

        let form_data = this.state.form_data;

        if (!name) {
          name = event.target.name;
        }

        var value = event.target ? event.target.value : event;
    
        if(containsSpecialCharactersAndNumbers(value) && name === 'name'){
            return;
        }
        
        if(name === 'city' || name === 'age'){
            value = event
            form_data[name] = event;
            form_data[name + '_index'] = value;
            form_data[name + '_error'] = ''
        }else{
            form_data[name] = value;
            form_data[name + '_error'] = ''
        }
        

        this.setState({
            form_data: form_data
        })

    
    }

    handleChangeRadio = name => event => {
        var form_data = this.state.form_data || {};
    
        let options = yesNoOptions;

        if(name === 'gender'){
            options = genderOptions
        }
        form_data[name] = options[event].value;
        form_data[name + '_error'] = '';
    
        this.setState({
          form_data: form_data
        })
    
      };

    navigate = (pathname, search) => {
      this.props.history.push({
        pathname: pathname,
        search: search ? search : getConfig().searchParams,
      });
    }

    setMinMax = () => {

        if (this.state.kids_total === 4) {
            this.setState({
                kids_ismax: true,
            });
        } else if (this.state.parents_total === 2){
            this.setState({
                parents_ismax: true,
            });
        }
    };

    updateParent = (key, value) => {
        console.log(key[0] ,value)
        let None_checked = this.state.None_checked
        let Kids_checked = this.state.Kids_checked
        let Spouse_checked = this.state.Spouse_checked
        let Parents_checked = this.state.Parents_checked
        
        if(key[0].includes('_checked')){
            if((key[0] === 'Spouse_checked' || key[0] === 'Kids_checked' || key[0] === 'Parents_checked')  && value){
                None_checked = false
            }else if(key[0] === 'None_checked' && value){
                None_checked = true
                Spouse_checked = false
                Kids_checked = false
                Parents_checked = false
            }
            this.setState({
                None_checked: None_checked,
                Spouse_checked: Spouse_checked,
                Kids_checked: Kids_checked,
                Parents_checked: Parents_checked
            })
        }
        
        this.setState({
            [key]: value,
            showDependentsError: false,
        }, () => {
            this.setMinMax();
            console.log(this.state)
        });
    };

    handleRegularCheckbox = (name) =>{
        var None_checked = this.state.None_checked;
        var Spouse_checked = this.state.Spouse_checked;
        console.log('name', name)

        if(name === 'spouse'){
            this.setState({
                Spouse_checked: !Spouse_checked,
                None_checked: !None_checked,
                showDependentsError: false
            })
        }else if(name === 'none'){
            None_checked = !None_checked;
            
            if(None_checked){
                this.setState({
                    Kids_checked: false, 
                    Kids_total: 0,
                    Parents_checked: false,
                    Parents_total: 0,
                    Spouse_checked: false,
                    showDependentsError: false
                })
            }
            this.setState({
                None_checked: None_checked
            })
        }
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'insurance_advisory',
          "properties": {
            "user_action": user_action,
            "screen_name": 'basic details',
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    handleClick = () =>{
        this.setErrorData('submit');

        this.sendEvents('next');

        var form_data = this.state.form_data;
        var canSubmitForm = true;
        
        if(form_data){
            if(!form_data.name){
                form_data.name_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }else if ((form_data.name || '').split(" ").filter(e => e).length < 2) {
                form_data.name_error = 'Please enter full name';
                canSubmitForm = false;
            }

            if(!form_data.gender){
                form_data.gender_error = 'We need some details to move forward!'
                canSubmitForm = false;
            }
            if(!form_data.age){
                form_data.age_error = 'We need some details to move forward!'
                canSubmitForm = false;
            }

            if(!form_data.illness){
                form_data.illness_error = 'We need some details to move forward!'
                canSubmitForm = false;
            }
            if(!form_data.married){
                form_data.married_error = 'We need some details to move forward!'
                canSubmitForm = false;
            }
            
            if(!form_data.city){
                form_data.city_error = 'We need some details to move forward!'
                canSubmitForm = false;
            }
            if(!this.state.None_checked && !this.state.Spouse_checked && !this.state.Kids_checked && !this.state.Parents_total){
                this.setState({
                    showDependentsError: true,
                })    
                canSubmitForm = false;
            }
        }
        
        this.setState({
            form_data: form_data
        })

        if(canSubmitForm){
            var None_checked = this.state.None_checked;
            var Parents_total = this.state.Parents_total;
            var Kids_total = this.state.Kids_total;

            if(None_checked){
                Parents_total = 0;
                Kids_total = 0;
            }

            var post_body = {
                'name': form_data.name,
                'gender': form_data.gender,
                'marital_status': form_data.married === 'YES' ? "MARRIED" : "UNMARRIED",
                'age': form_data.age,
                'ci_present': form_data.illness === 'YES' ? true : false,
                'dependent_json': {"parents": Parents_total || 0, "kids": Kids_total || 0 , "spouse": this.state.Spouse_checked ? 1 : 0},
                'dependent_present': Parents_total || Kids_total ||  this.state.Spouse_checked ? true : false,
                'city': form_data.city.toUpperCase(),
            }
            var advisory_data = storageService().getObject('advisory_data') || {};
            
            for(var x in post_body){
                advisory_data[x] = post_body[x]
            }
            
            storageService().setObject('advisory_data', advisory_data);
            this.updateLead(post_body, 'income-details')
        }
    }

    render() {
        return(
            <Container
            events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            title="Tell us about yourself"
            buttonTitle="SAVE AND CONTINUE"
            showError={this.state.showError}
            errorData={this.state.errorData}
            showLoader={this.state.show_loader}
            skelton={this.state.skelton}
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-basic-details-container">
                
            <div className="advisory-title-container">
                <p>Tell us about yourself</p>
                <span>1/4</span>
            </div>

            <div className="InputField">
             <Input
               type="text"
               width="40"
               label="What is your name?"
               class="Name"
               id="name"
               name="name"
               error={this.state.form_data.name_error ? true : false}
               helperText={this.state.form_data.name_error}
               value={this.state.form_data.name || ""}
               onChange={this.handleChange()}
             />
             </div>
             <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="You are a"
                  class="Gender:"
                  options={genderOptions}
                  id="gender"
                  name="gender"
                  error={this.state.form_data.gender_error ? true : false}
                  helperText={this.state.form_data.gender_error}
                  value={this.state.form_data.gender || ""}
                  onChange={this.handleChangeRadio("gender")}
                />
            </div>

            <div className="InputField adv-drop-down">
            <DropdownWithoutIcon
              parent={this}
              header_title="What you're interested in"
              selectedIndex = {this.state.form_data.age_index || 0}
              width="140"
              dataType="AOB"
              options={this.state.ageOptions}
              id="age"
              label="What is your age?"
              error={this.state.form_data.age_error ? true : false}
              helperText={this.state.form_data.age_error}
              name="age"
              value={this.state.form_data.age || ''}
              onChange={this.handleChange("age")}
            />
            </div>
             <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Are you married?"
                  class="married"
                  options={yesNoOptions}
                  id="married"
                  name="married"
                  error={this.state.form_data.married_error ? true : false}
                  helperText={this.state.form_data.married_error}
                  value={this.state.form_data.married || ""}
                  onChange={this.handleChangeRadio("married")}
                />
            </div>

            <div className="InputField adv-drop-down">
            <DropdownWithoutIcon
              parent={this}
              selectedIndex = {this.state.form_data.city_index || 0}
              width="140"
              dataType="AOB"
              options={this.state.metroCityOptions}
              id="city"
              label="Where do you live?"
              error={this.state.form_data.city_error ? true : false}
              helperText={this.state.form_data.city_error}
              name="city"
              value={this.state.form_data.city || ''}
              onChange={this.handleChange("city")}
            />
            </div>
            
            <p style={{color: '#767E86', marginBottom: '18px', fontSize: '12.8px'}}>Do you have any dependents?</p>
            
            <div className="advisory-basic-dependents" style={{ marginBottom: '13px'}}>
                <PlusMinusInput name="Spouse" parent={this} />
                <PlusMinusInput name="Kids" parent={this} />
                <PlusMinusInput name="Parents" parent={this} />
                <PlusMinusInput name="None" parent={this} />
                {this.state.showDependentsError && <p style={{color: '#f44336', fontSize: '0.75rem', textAlign: 'left', margin: '-2px 0 25px 0'}}>We need some details to move forward!</p>}
            </div>

            <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Any family history of critical illness?"
                  class="illness:"
                  options={yesNoOptions}
                  id="illness"
                  name="illness"
                  error={this.state.form_data.illness_error ? true : false}
                  helperText={this.state.form_data.illness_error}
                  value={this.state.form_data.illness || ""}
                  onChange={this.handleChangeRadio("illness")}
                />
            </div>

            </div>

            </Container>
        )
    }
}

export default AdvisoryBasicDetails