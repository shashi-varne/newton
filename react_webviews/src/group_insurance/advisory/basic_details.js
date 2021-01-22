import React, { Component } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon'
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
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
            form_data: {}
        }
    }

    handleChange = name => event => {

        let form_data = this.state.form_data;

        if (!name) {
          name = event.target.name;
        }
        var value = event.target ? event.target.value : event;
        console.log('name', name)
        console.log('event', event.target.value)

        form_data[name] = value;
        form_data[name + '_error'] = ''

        this.setState({
            form_data: form_data
        })

    
    }

    handleClick = () =>{
        var form_data = this.state.form_data;
        var canSubmitForm = true;

        if (form_data && (form_data.name || '').split(" ").filter(e => e).length < 2) {
            form_data.name_error = 'Enter valid full name';
            canSubmitForm = false;
        }
        if(form_data && !form_data.city){
            form_data.city_error = 'Please enter city name'
        }
        this.setState({
            form_data: form_data
        })
    }

    handleChangeRadio = name => event => {
        var form_data = this.state.form_data || {};
    
        let optionsMapper = {
          'gender': genderOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';
    
        this.setState({
          form_data: form_data
        })
    
      };

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
            //   header_title="What you're interested in"
            //   selectedIndex = {this.state.form_data.index || 0}
              width="140"
              dataType="AOB"
              options={this.state.ageOptions}
              id="insurance"
              label="What is your age?"
            //   error={this.state.form_data.insuranceType_error ? true : false}
            //   helperText={this.state.form_data.insuranceType_error}
              name="insuranceType"
              value={''}
            //   onChange={this.handleChange("insuranceType")}
            />
            </div>
             <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Are you married?"
                  class="Gender:"
                  options={yesNoOptions}
                  id="gender"
                  name="gender"
                //   error={this.state.form_data.gender_error ? true : false}
                //   helperText={this.state.form_data.gender_error}
                //   value={this.state.form_data.gender || ""}
                //   onChange={this.handleChangeRadio("gender")}
                />
            </div>

            <p style={{color: '#767E86', marginBottom: '15px', fontSize: '12.8px'}}>Do you have any dependents?</p>
            <div className="InputField">
            <DropdownWithoutIcon
              parent={this}
            //   header_title="What you're interested in"
            //   selectedIndex = {this.state.form_data.index || 0}
              width="140"
              dataType="AOB"
              options={this.state.metroCityOptions}
              id="insurance"
              label="Where do you live?"
            //   error={this.state.form_data.insuranceType_error ? true : false}
            //   helperText={this.state.form_data.insuranceType_error}
              name="city"
              value={''}
            //   onChange={this.handleChange("insuranceType")}
            />
            </div>
            <div style={{ marginBottom: '10px'}}>
            <div className="checkbox-container">
            <Checkbox
                //   checked={this.state.tncChecked}
                  color="default"
                  value="checked"
                  name="checked"
                //   onChange={this.handleTermsAndConditions}
                  className="Checkbox"
            />
            <p className="checkbox-option">Spouse</p>
            </div>
            <PlusMinusInput name="Kids" parent={this} />
            <PlusMinusInput name="Parents" parent={this} />

            <div className="checkbox-container">
            <Checkbox
                //   checked={this.state.tncChecked}
                  color="default"
                  value="checked"
                  name="checked"
                //   onChange={this.handleTermsAndConditions}
                  className="Checkbox"
            />
            <p className="checkbox-option">None</p>
            </div>
            </div>

            <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Any family history of critical illness?"
                  class="Gender:"
                  options={yesNoOptions}
                  id="gender"
                  name="gender"
                //   error={this.state.form_data.gender_error ? true : false}
                //   helperText={this.state.form_data.gender_error}
                //   value={this.state.form_data.gender || ""}
                //   onChange={this.handleChangeRadio("gender")}
                />
            </div>

            </div>

            </Container>
        )
    }
}

export default AdvisoryBasicDetails