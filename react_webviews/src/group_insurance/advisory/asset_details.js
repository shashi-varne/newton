import React, { Component, Fragment } from 'react'
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { yesNoOptions } from '../constants'; 
import InputPrefix from '../../common/ui/InputPrefix';
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon';
import {formatAmount, containsNumbersAndComma, formatAmountToNumber} from 'utils/validators';
import {advisoryConstants} from './constants';
import Checkbox from "material-ui/Checkbox";
import { updateLead } from './common_data';
import {storageService} from "utils/validators";

class AdvisoryAssetDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            showPrefix: {asset_amount: false},
            insuranceList: advisoryConstants.insuranceList,
            ins_checkbox:{
                corona_cover_amount: false,
                critical_cover_amount: false,
                health_cover_amount: false,
                none: false,
                term_cover_amount: false,
                showCoverAmountError: false
            }
        }
        this.updateLead = updateLead.bind(this);
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'insurance_advisory',
          "properties": {
            "user_action": user_action,
            "screen_name": 'assets details',
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
        
        if( (name === 'asset_amount' || name === 'term_cover_amount' || name === 'health_cover_amount' || name === 'critical_cover_amount' || name === 'corona_cover_amount') && (!containsNumbersAndComma(value))){
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
            form_data.asset_amount_error = ''
        }
        this.setState({
          form_data: form_data
        })
    
    };

    showPrefix = (name) =>{
        if(name === 'none'){
            return;
        }
        var showPrefix = this.state.showPrefix;
        showPrefix[name] = true;
        this.setState({
          showPrefix: showPrefix
        })
    }

    hidePrefix = (name) =>{
        if(name === 'none'){
            return;
        }
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

    handleCheckBoxChange = (name) =>{
        var ins_checkbox = this.state.ins_checkbox;
        var form_data = this.state.form_data;
        var showPrefix = this.state.showPrefix;

        ins_checkbox[name] = !ins_checkbox[name]
        showPrefix[name] = false;

        if(!ins_checkbox[name]){
            form_data[name + '_error'] = ''   
        }
        if(name === 'none'){
            var cover_amount_list = ['term_cover_amount','health_cover_amount','critical_cover_amount','corona_cover_amount']
            for(var amount of cover_amount_list){
                form_data[amount] = 0;
                ins_checkbox[amount] = false;
            }

            this.setState({
                ins_checkbox: ins_checkbox
            })
        }else{
            ins_checkbox['none'] = false

            if(!ins_checkbox[name]){
                form_data[name] = 0
            }
        }

        this.setState({
            ins_checkbox: ins_checkbox,
            form_data: form_data,
            showPrefix: showPrefix,
            showCoverAmountError: false
        })
    }

    renderInsuranceList = (props, index) => {
        var ins_checkbox = this.state.ins_checkbox;
        return (
            <div key={index}>
                <Fragment>
                <Checkbox
                  checked={ins_checkbox[props.name]}
                  color="default"
                  value={props.name}
                  name="checked"
                  onChange={()=>this.handleCheckBoxChange(props.name)}
                  className="Checkbox"
                />
                <span style={{marginLeft: '-18px'}}>{props.value}</span>
                </Fragment>
                
                {this.state.ins_checkbox[props.name] && props.name !== 'none' && (
                    <div className="InputField">
                        <InputPrefix prefix="₹" showPrefix={this.state.showPrefix[props.name]}>
                        <Input
                          type="text"
                          width="40"
                          label="Cover amount"
                          class={props.name}
                          id={props.name}
                          name={props.name}
                          onFocus={()=>this.showPrefix(props.name)}
                          onBlur={()=>this.hidePrefix(props.name)}
                          error={this.state.form_data[props.name + '_error'] ? true : false}
                          helperText={this.state.form_data[props.name + '_error']}
                          value={this.state.form_data[props.name] || ""}
                          onChange={this.handleChange()}
                        />
                        </InputPrefix>
                    </div>
                )}
            </div>
        )
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

    handleClick = () =>{
        this.setErrorData('submit');

        this.sendEvents('next');

        var form_data = this.state.form_data;
        var canSubmitForm = true;
        var showCoverAmountError = false;
        var ins_checkbox = this.state.ins_checkbox;
        if(form_data){
            if(!form_data.assets){
                form_data.assets_error = 'Please enter appropriate value'
                canSubmitForm = false;
            } 
            if(form_data.assets === 'YES' && (!form_data.asset_amount || formatAmountToNumber(form_data.asset_amount) === 0)){
                form_data.asset_amount_error = 'We need some details to move forward!'
                canSubmitForm = false;
            } 
            
            var check_box_list = ['term_cover_amount','health_cover_amount','critical_cover_amount','corona_cover_amount']
            for(var amount of check_box_list){
                if(ins_checkbox[amount] && (!form_data[amount] || formatAmountToNumber(form_data[amount])=== 0 )){
                    form_data[amount +'_error'] = 'We need some details to move forward!';
                    canSubmitForm = false;
                }
            }
            
            if(!Object.values(ins_checkbox).includes(true) || Object.values(ins_checkbox).length === 0){
                showCoverAmountError = true;
                canSubmitForm = false
            }
        }

        this.setState({
            form_data: form_data,
            showCoverAmountError: showCoverAmountError
        })
        if(canSubmitForm){
            
            var post_body = {
                'assets': form_data.assets === 'YES' ? true : false,
                'assets_amount': form_data.assets === 'YES' ? formatAmountToNumber(form_data.asset_amount) : 0,
                'term_insurance_present': ins_checkbox.term_cover_amount ? true : false,
                'term_insurance_sum_assured': ins_checkbox.term_cover_amount ? formatAmountToNumber(form_data.term_cover_amount) : 0,
                'health_insurance_present': ins_checkbox.health_cover_amount ? true : false,
                'health_insurance_sum_assured' : ins_checkbox.health_cover_amount ? formatAmountToNumber(form_data.health_cover_amount) : 0,
                'corona_insurance_present': ins_checkbox.corona_cover_amount ? true : false,
                'corona_insurance_sum_assured' : ins_checkbox.corona_cover_amount ? formatAmountToNumber(form_data.corona_cover_amount) : 0,
                'critical_illness_insurance_present': ins_checkbox.critical_cover_amount ? true : false,
                'critical_illness_insurance_sum_assured': ins_checkbox.critical_cover_amount ? formatAmountToNumber(form_data.critical_cover_amount) : 0,
            }

            var advisory_data = storageService().getObject('advisory_data');
            for(var x in post_body){
                advisory_data[x] = post_body[x]
            }
            storageService().setObject('advisory_data', advisory_data);
            this.updateLead(post_body, 'recommendations', true);
        }
    }



    render() {
        return(
            <Container
            // events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            onlyButton={true}
            force_hide_inpage_title={true}
            title="Let's note down your assets"
            showError={this.state.showError}
            errorData={this.state.errorData}
            showLoader={this.state.show_loader}
            skelton={this.state.skelton}
            buttonTitle="SAVE AND CONTINUE"
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-asset-details-container">
            
            <div className="advisory-title-container"  style={{marginBottom: '15px'}}>
                <p>Let's note down your assets</p>
                <span>4/4</span>
            </div>

            <div className="InputField" id="asset-question">
                <RadioWithoutIcon
                  width="40"
                  label="Do you have any assets (Equity/MF/Property/FD,etc.)?"
                  class="assets"
                  options={yesNoOptions}
                  id="assets"
                  name="assets"
                  error={this.state.form_data.assets_error ? true : false}
                  helperText={this.state.form_data.assets_error}
                  value={this.state.form_data.assets || ""}
                  onChange={this.handleChangeRadio("assets")}
                />
            </div>
            {this.state.form_data.assets === 'YES' && (
            <div className="InputField">
             <InputPrefix prefix="₹" showPrefix={this.state.showPrefix['asset_amount']}>
             <Input
               type="text"
               width="40"
               label="Asset amount"
               class="asset_amount"
               id="asset_amount"
               name="asset_amount"
               onFocus={()=>this.showPrefix('asset_amount')}
               onBlur={()=>this.hidePrefix('asset_amount')}
               error={this.state.form_data.asset_amount_error ? true : false}
               helperText={this.state.form_data.asset_amount_error}
               value={this.state.form_data.asset_amount || ""}
               onChange={this.handleChange()}
               autoComplete="off"
             />
             </InputPrefix>
             </div>
            )}
            <div style={{marginBottom: '50px'}}>
                <p style={{color: '#767E86', marginBottom: '2px', fontSize: '12.8px'}}>Any existing insurance?</p>
                {this.state.insuranceList.map(this.renderInsuranceList)}
            </div>
            {this.state.showCoverAmountError && <p style={{color: '#f44336', fontSize: '0.75rem', textAlign: 'left', margin: '-55px 0 25px 0'}}>We need some details to move forward!</p>}   
            </div>
            </Container>
        )
    }
}

export default AdvisoryAssetDetails;