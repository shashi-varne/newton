import React, { Component } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { yesNoOptions } from '../constants'; 
import InputPrefix from '../../common/ui/InputPrefix';
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon';
import {formatAmount, containsNumbersAndComma, formatAmountToNumber} from 'utils/validators';
import { updateLead } from './common_data';
import {storageService, isEmpty} from "utils/validators";

class AdvisoryLiabilityDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            showPrefix: {loan_amount: false, total_amount: false}
        }
        this.updateLead = updateLead.bind(this);
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

    componentDidMount(){

        var advisory_data = storageService().getObject('advisory_data') || {};
        console.log(advisory_data)
        if(!isEmpty(advisory_data)){
            var form_data = {};
            form_data.homeloan = advisory_data.home_loan_liability === "True" ? yesNoOptions[0].value : yesNoOptions[1].value;
            form_data.liability = advisory_data.other_liability === "True" ? yesNoOptions[0].value : yesNoOptions[1].value;
            form_data.loan_amount = formatAmount(advisory_data.home_loan_liability_amount);
            form_data.total_amount = formatAmount(advisory_data.other_liability_amount);

            this.setState({form_data: form_data})
            let showPrefix = this.state.showPrefix;
            if(form_data.loan_amount){
                showPrefix['loan_amount'] = true;
                this.setState({
                    showPrefix: showPrefix
                })
            }
            if(form_data.total_amount){
                showPrefix['total_amount'] = true;
                this.setState({
                    showPrefix: showPrefix
                })
            }
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
        
        if( (name ==='loan_amount' || name === 'total_amount') && (!containsNumbersAndComma(value))){
            return;
        }

        form_data[name] = formatAmount(value);
        // form_data[name + '_value'] = formatAmountToNumber(value);   
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    
    }
    
    handleChangeRadio = name => event => {
        var form_data = this.state.form_data || {};
    
        let options = yesNoOptions;

        form_data[name] = options[event].value;
        form_data[name + '_error'] = '';
        
        if(form_data[name] === 'NO'){
            
            if(name === 'homeloan'){
                form_data.loan_amount_error = '';
                form_data.homeloan_error = ''
            }else if(name === 'liability'){
                form_data.total_amount_error = '';
                form_data.liability_error = ''
            }
        }
        this.setState({
          form_data: form_data
        })
    
    };

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
        console.log('form_data', form_data)
        if(form_data){
            if(!form_data.homeloan){
                form_data.homeloan_error = 'Please enter appropriate value';
                canSubmitForm = false;
            }
            if(!form_data.liability){
                form_data.liability_error = 'Please enter appropriate value';
                canSubmitForm = false;
            }

            if(form_data.homeloan === 'YES' && (!form_data.loan_amount || form_data.loan_amount_value === 0)){
                form_data.loan_amount_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }
            if(form_data.liability === 'YES' && (!form_data.total_amount || form_data.total_amount_value === 0)){
                form_data.total_amount_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }
        }

        this.setState({
            form_data: form_data
        })

        if(canSubmitForm){
            var post_body = {
                'home_loan_liability': form_data.homeloan === "YES" ? 'True' : 'False',
                'other_liability': form_data.liability === "YES" ? 'True' : 'False',
                'home_loan_liability_amount': formatAmountToNumber(form_data.loan_amount),
                'other_liability_amount' : formatAmountToNumber(form_data.total_amount),
            }
            var advisory_data = storageService().getObject('advisory_data');
            for(var x in post_body){
                advisory_data[x] = post_body[x]
            }
            storageService().setObject('advisory_data', advisory_data);
            this.updateLead(post_body,'asset-details')
        }
    }



    render() {
        return(
            <Container
            // events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            showLoader={this.state.show_loader}
            title="Tell us your liabilities"
            buttonTitle="SAVE AND CONTINUE"
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-liability-details-container">
            
            <div className="advisory-title-container"  style={{marginBottom: '15px'}}>
                <p>Tell us your liabilities</p>
                <span>3/4</span>
            </div>

            <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Do you have any home loans?"
                  class="homeloan"
                  options={yesNoOptions}
                  id="homeloan"
                  name="homeloan"
                  error={this.state.form_data.homeloan_error ? true : false}
                  helperText={this.state.form_data.homeloan_error}
                  value={this.state.form_data.homeloan || ""}
                  onChange={this.handleChangeRadio("homeloan")}
                />
            </div>
            {this.state.form_data.homeloan === 'YES' && (
                <div className="InputField">
             <InputPrefix prefix="₹" showPrefix={this.state.showPrefix['loan_amount']}>
             <Input
               type="text"
               width="40"
               label="Loan amount"
               class="loan_amount"
               id="loan_amount"
               name="loan_amount"
               onFocus={()=>this.showPrefix('loan_amount')}
               onBlur={()=>this.hidePrefix('loan_amount')}
               error={this.state.form_data.loan_amount_error ? true : false}
               helperText={this.state.form_data.loan_amount_error}
               value={this.state.form_data.loan_amount || ""}
               onChange={this.handleChange()}
             />
             </InputPrefix>
             </div>
            )}
            
            <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Any other loans/liabilities?"
                  class="liability"
                  options={yesNoOptions}
                  id="liability"
                  name="liability"
                  error={this.state.form_data.liability_error ? true : false}
                  helperText={this.state.form_data.liability_error}
                  value={this.state.form_data.liability || ""}
                  onChange={this.handleChangeRadio("liability")}
                />
            </div>
            {this.state.form_data.liability === 'YES' && (
                <div className="InputField">
                <InputPrefix prefix="₹" showPrefix={this.state.showPrefix['total_amount']}>
                <Input
                  type="text"
                  width="40"
                  label="Total amount"
                  class="total_amount"
                  id="total_amount"
                  name="total_amount"
                  onFocus={()=>this.showPrefix('total_amount')}
                  onBlur={()=>this.hidePrefix('total_amount')}
                  error={this.state.form_data.total_amount_error ? true : false}
                  helperText={this.state.form_data.total_amount_error}
                  value={this.state.form_data.total_amount || ""}
                  onChange={this.handleChange()}
                />
                </InputPrefix>
                </div>
            )}
           

            </div>
            </Container>
        )
    }
}

export default AdvisoryLiabilityDetails;