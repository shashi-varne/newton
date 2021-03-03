import React, { Component } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { yesNoOptions } from '../constants'; 
import InputPrefix from '../../common/ui/InputPrefix';
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon';
import {formatAmount, containsNumbersAndComma, formatAmountToNumber} from 'utils/validators';
import { updateLead, getLead } from './common_data';
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
        this.getLead = getLead.bind(this);
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'insurance_advisory',
          "properties": {
            "user_action": user_action,
            "screen_name": 'liability details',
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
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

    async componentDidMount(){

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

        if((isResumePresent ||!isEmpty(advisory_data)) && !isEmpty(lead)){
            form_data.homeloan = lead.home_loan_liability && (lead.home_loan_liability_amount !== null || lead.home_loan_liability_amount !== 0) ? yesNoOptions[0].value : !lead.home_loan_liability && (lead.home_loan_liability_amount === 0)  ?  yesNoOptions[1].value : '';
            
            form_data.liability = lead.other_liability && (lead.other_liability_amount !== null || lead.other_liability_amount !== 0) ? yesNoOptions[0].value : !lead.other_liability && (lead.other_liability_amount === 0)  ?  yesNoOptions[1].value : '';

            form_data.loan_amount = formatAmount(lead.home_loan_liability_amount);
            form_data.total_amount = formatAmount(lead.other_liability_amount);

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
        form_data[name + '_error'] = '';
        form_data[name + '_value'] = formatAmountToNumber(value);  

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
        this.setErrorData('submit');

        this.sendEvents('next');

        var form_data = this.state.form_data;
        var canSubmitForm = true;
        if(form_data){
            if(!form_data.homeloan){
                form_data.homeloan_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }
            if(!form_data.liability){
                form_data.liability_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }

            if(form_data.homeloan === 'YES' && (!form_data.loan_amount)){
                form_data.loan_amount_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }else if(form_data.homeloan === 'YES' && (form_data.loan_amount_value === 0)){
                form_data.loan_amount_error = 'Please enter appropriate value';
                canSubmitForm = false;
            }

            if(form_data.liability === 'YES' && (!form_data.total_amount)){
                form_data.total_amount_error = 'We need some details to move forward!';
                canSubmitForm = false;
            }else if(form_data.liability === 'YES' && (form_data.total_amount_value === 0)){
                form_data.total_amount_error = 'Please enter appropriate value';
                canSubmitForm = false;
            }
        }

        this.setState({
            form_data: form_data
        })

        if(canSubmitForm){
            var post_body = {
                'home_loan_liability': form_data.homeloan === "YES" ? true : false,
                'other_liability': form_data.liability === "YES" ? true : false,
                'home_loan_liability_amount': form_data.homeloan === "YES" ?  formatAmountToNumber(form_data.loan_amount) : 0,
                'other_liability_amount' : form_data.liability === "YES" ? formatAmountToNumber(form_data.total_amount) : 0,
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
            events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            showError={this.state.showError}
            errorData={this.state.errorData}
            showLoader={this.state.show_loader}
            skelton={this.state.skelton}
            title="Tell us about your liabilities"
            buttonTitle="SAVE AND CONTINUE"
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-liability-details-container">
            
            <div className="advisory-title-container"  style={{marginBottom: '15px'}}>
                <p>Tell us about your liabilities</p>
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
               autoComplete="off"
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
                  autoComplete="off"
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