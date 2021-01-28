import React, { Component } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import DropdownWithoutIcon from '../../common/ui/SelectWithoutIcon';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {advisoryConstants} from './constants';
import InputPrefix from '../../common/ui/InputPrefix';
import {formatAmount, containsNumbersAndComma, formatAmountToNumber} from 'utils/validators';

class AdvisoryIncomeDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            incomeGrowthOptions: advisoryConstants.incomeGrowthOptions,
            retireOptions: advisoryConstants.retireOptions,
            form_data: {},
            showPrefix: {income: false, expense: false}

        }
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'Group Insurance',
          "properties": {
            "user_action": user_action,
            "screen_name": 'insurance',
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    navigate = (pathname, search) => {
      this.props.history.push({
        pathname: pathname,
        search: search ? search : getConfig().searchParams,
      });
    }

    handleChange = name => event => {

        let form_data = this.state.form_data;

        if (!name) {
          name = event.target.name;
        }

        var value = event.target ? event.target.value : event;
        
        if( (name ==='income' || name === 'expense') && (!containsNumbersAndComma(value))){
            return;
        }

        if(name === 'retire' || name === 'income_growth'){
            var value = event
            form_data[name] = event;
            form_data[name + '_error'] = ''
            form_data[name + '_index'] = event;
        }else{
            form_data[name] = formatAmount(value);
            form_data[name + '_error'] = ''
        }

        this.setState({
            form_data: form_data
        })

    
    }
    
    showPrefix = (name) =>{
        var showPrefix = this.state.showPrefix;
        showPrefix[name] = true;
        this.setState({
          showPrefix: showPrefix
        })
    }

    hidePrefix = (name) =>{
        var form_data = this.state.form_data;
        var showPrefix = this.state.showPrefix;
        if(form_data){
            if(form_data[name] && form_data[name].length !== 0){
                return;
            }else{
                showPrefix[name] = false;
                this.setState({
                    showPrefix: showPrefix
                })
            }   
        }
        
    }
    handleClick = () =>{
        var form_data = this.state.form_data;
        var canSubmitForm = true;
        
        if(form_data){
            if(!form_data.expense || formatAmountToNumber(form_data.expense) === 0){
                form_data.expense_error = "We need some details to move forward!";
                canSubmitForm = false
            }
            if(!form_data.income || formatAmountToNumber(form_data.income) < 100000){
                form_data.income_error = "Annual income needs to be more than Rs 1 lac for this analysis!";
                canSubmitForm = false;
            }
            if(!form_data.income_growth){
                form_data.income_growth_error = "We need some details to move forward!";
                canSubmitForm = false;
            }
            if(!form_data.retire){
                form_data.retire_error = "Please select appropriate retirement age!";
                canSubmitForm = false;
            }
        }
        this.setState({
            form_data: form_data
        })
        if(canSubmitForm){
            this.navigate('/group-insurance/advisory/liability-details')
        }
    }

    render() {
        return(
            <Container
            // events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            title="Let's know your income &amp; expenses"
            buttonTitle="SAVE AND CONTINUE"
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-income-details-container">
            
            <div className="advisory-title-container"  style={{marginBottom: '15px'}}>
                <p>Let's know your income &amp; expenses</p>
                <span>2/4</span>
            </div>

            <div className="InputField">
             <InputPrefix prefix="₹" showPrefix={this.state.showPrefix['income']}>
             <Input
               type="text"
               width="40"
               label="What is your annual take-home income?"
               class="income"
               id="income"
               name="income"
               onFocus={()=>this.showPrefix('income')}
               onBlur={()=>this.hidePrefix('income')}
               error={this.state.form_data.income_error ? true : false}
               helperText={this.state.form_data.income_error}
               value={this.state.form_data.income || ""}
               onChange={this.handleChange()}
             />
             </InputPrefix>
             </div>

             <div className="InputField">
             <InputPrefix prefix="₹" showPrefix={this.state.showPrefix['expense']}>
             <Input
               type="text"
               width="40"
               label="What is your annual personal expense?"
               class="expense"
               id="expense"
               name="expense"
               onFocus={()=>this.showPrefix('expense')}
               onBlur={()=>this.hidePrefix('expense')}
               error={this.state.form_data.expense_error ? true : false}
               helperText={this.state.form_data.expense_error}
               value={this.state.form_data.expense || ""}
               onChange={this.handleChange()}
             />
             </InputPrefix>
             </div>

            <div className="InputField">
             <DropdownWithoutIcon
              parent={this}
              selectedIndex = {this.state.form_data.income_growth_index || 0}
              width="140"
              dataType="AOB"
              options={this.state.incomeGrowthOptions}
              id="income-growth"
              label="What is your expected annual income growth?"
              error={this.state.form_data.income_growth_error ? true : false}
              helperText={this.state.form_data.income_growth_error}
              name="age"
              value={this.state.form_data.income_growth || ''}
              onChange={this.handleChange("income_growth")}
            />
            </div>

            <div className="InputField" style={{marginTop: '-30px'}}>
            <DropdownWithoutIcon
              parent={this}
              selectedIndex = {this.state.form_data.retire_index || 0}
              width="140"
              dataType="AOB"
              options={this.state.retireOptions}
              id="retire-options"
              label="When do you wish to retire?"
              error={this.state.form_data.retire_error ? true : false}
              helperText={this.state.form_data.retire_error}
              name="age"
              value={this.state.form_data.retire || ''}
              onChange={this.handleChange("retire")}
            />
            </div>
            </div>
            </Container>
        )
    }
}

export default AdvisoryIncomeDetails;