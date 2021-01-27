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
import Checkbox from "material-ui/Checkbox";

class AdvisoryBasicDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            ageOptions: advisoryConstants.ageOptions,
            metroCityOptions: advisoryConstants.metroCityOptions,
            dependents_data: advisoryConstants.dependents_data,
            form_data: {}, 
            spouse_checked: false,
            none_checked: false,
            showDependentsError: false
        }
    }

    componentDidMount(){
        var dependents_data = this.state.dependents_data;
        this.setState({
            Kids_max: dependents_data.kids_max,
            Kids_total: 0,
            // kids_checked: false,
            Parents_max: dependents_data.parents_max,
            Parents_total: 0,
            // parents_checked: false,
            none_checked: false, 
            // spouse_checked: false
        })
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
            var value = event
            form_data[name] = event;
            form_data[name + '_index'] = event;
            form_data[name = '_error'] = ''
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
        this.setState({
            [key]: value,
            none_checked: false,
            showDependentsError: false
        }, () => {
            this.setMinMax();
        });
    };

    handleRegularCheckbox = (name) =>{
        var none_checked = this.state.none_checked;
        var spouse_checked = this.state.spouse_checked;

        if(name === 'spouse'){
            this.setState({
                spouse_checked: !spouse_checked,
                none_checked: false,
                showDependentsError: false
            }, ()=>{
                console.log('sp', this.state.spouse_checked)
            })
        }else if(name === 'none'){
            none_checked = !none_checked;
            
            if(none_checked){
                this.setState({
                    Kids_checked: false, 
                    Kids_total: 0,
                    Parents_checked: false,
                    Parents_total: 0,
                    spouse_checked: false,
                    showDependentsError: false
                })
            }
            this.setState({
                none_checked: none_checked
            })
        }
        
    }

    handleClick = () =>{
        var form_data = this.state.form_data;
        var canSubmitForm = true;

        let spouse_count = 0;
        if(this.state.spouse_checked){
            spouse_count = 1;
        }
        console.log('kids:', this.state.Kids_total, 'parents:',this.state.Parents_total, 'spouse:', spouse_count)
        if (form_data && (form_data.name || '').split(" ").filter(e => e).length < 2) {
            form_data.name_error = 'Please enter full name';
            canSubmitForm = false;
        }
        if(form_data && !form_data.gender){
            form_data.gender_error = 'We need some details to move forward!'
            canSubmitForm = false;
        }
        if(form_data && !form_data.illness){
            form_data.illness_error = 'We need some details to move forward!'
            canSubmitForm = false;
        }
        if(form_data && !form_data.married){
            form_data.married_error = 'We need some details to move forward!'
            canSubmitForm = false;
        }
        if(form_data && !form_data.age){
            form_data.age_error = 'We need some details to move forward!'
            canSubmitForm = false;
        }
        if(form_data && !form_data.city){
            form_data.city_error = 'We need some details to move forward!'
            canSubmitForm = false;
        }
        if(!this.state.none_checked && !this.state.spouse_checked && !this.state.Kids_checked && !this.state.Parents_total){
            this.setState({
                showDependentsError: true,
            })    
        }
        this.setState({
            form_data: form_data
        })


        if(canSubmitForm){
            this.navigate('/group-insurance/advisory/income-details')
        }
    }

    render() {
        return(
            <Container
            // events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            title="Tell us about yourself"
            buttonTitle="SAVE AND CONTINUE"
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

            <div className="InputField">
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

            <div className="InputField">
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
            
            <p style={{color: '#767E86', marginBottom: '15px', fontSize: '12.8px'}}>Do you have any dependents?</p>
            
            <div className="advisory-basic-dependents" style={{ marginBottom: '10px'}}>
            <div className="checkbox-container" id="spouse-checkbox">
            <Checkbox
                  checked={this.state.spouse_checked}
                  color="default"
                  value="checked"
                  name="spouse"
                  id="spouse-checkbox"
                  onChange={()=>this.handleRegularCheckbox('spouse')}
                  className="basic-checkbox"
            />
            <p className="checkbox-option">Spouse</p>
            </div>
            <PlusMinusInput name="Kids" parent={this} />
            <PlusMinusInput name="Parents" parent={this} />

            <div className="checkbox-container" id="none-checkbox">
            <Checkbox
                  checked={this.state.none_checked}
                  color="default"
                  value="checked"
                  name="none"
                  onChange={()=>this.handleRegularCheckbox('none')}
                  className="basic-checkbox"
            />
            <p className="checkbox-option">None</p>
            </div>
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