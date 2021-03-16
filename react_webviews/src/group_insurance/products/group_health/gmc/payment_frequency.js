import React, { Component } from 'react'
import Api from 'utils/api';
// import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import { initialize, updateBottomPremium } from '../common_data';
import { nativeCallback } from 'utils/native_callback';
import ValueSelector from '../../../../common/ui/ValueSelector';
import Checkbox from '../../../../common/ui/Checkbox';
import { getConfig } from 'utils/functions';
import { inrFormatDecimal } from 'utils/validators';

var getFrequency = {
    'MONTHLY': 'month',
    'YEARLY': 'year'
}
class GroupHealthPlanSelectPaymentFrequency extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedIndex : 0,
            ctaWithProvider: true,
            checked: false,
            buttonDisabled: true,
            screen_name: 'plan_payment_frequency'            
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }
    componentWillMount(){
        this.initialize();
    }
    
    componentDidMount(){
        this.onload();   
    }

    onload = async() =>{
        this.setErrorData("onload");
        let error = "";
        let errorType = "";
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;
        
        this.setState({
            skelton: true
        });

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type', 'si'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }

        try {
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,body);
            
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                var optionsList = []
                for(var x of resultData.premium_details){
                var temp = {
                    'value': `${inrFormatDecimal(x.premium)}/${getFrequency[x.payment_frequency]}`,
                    'premium': x.premium,
                    'frequency':  getFrequency[x.payment_frequency]
                }
                optionsList.push(temp)
            }
            this.setState({
                optionsList: optionsList,
                premium_details: resultData.premium_details,
                skelton: false
            })
            

            } else {
                error = resultData.error || resultData.message || true;
            }
        } catch (err) {
            console.log(err)
            this.setState({
                skelton: false
            });
            error = true;
            errorType = "crash";
        }
        if (error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error,
                type: errorType
              },
              showError: "page",
            });
          }
          
          if(!error){
              
            var freqSelected = this.state.groupHealthPlanData.paymentFrequencySelected || 'YEARLY'; console.log(groupHealthPlanData)
            var payment_frequency = freqSelected;
             var checked = this.state.checked;
             var selectedIndex, buttonDisabled
             if(this.state.groupHealthPlanData.checkbox){
                selectedIndex  = this.state.groupHealthPlanData.sum_assured === 500000 ? 1 : 0;
                checked = this.state.groupHealthPlanData.sum_assured === 500000 ? true : false;
                buttonDisabled = this.state.groupHealthPlanData.sum_assured === 500000 ? false : true;
             }  else {
                selectedIndex = freqSelected === 'YEARLY' ? 1 : 0 ;
                buttonDisabled = freqSelected === 'MONTHLY' && !checked ? true : false
                checked = freqSelected === 'MONTHLY' ? true : false;
             }
            this.setState({
                selectedIndex: selectedIndex,
                payment_frequency : payment_frequency,
                buttonDisabled: buttonDisabled,
                postfix: freqSelected === 'YEARLY' ? 'year': 'month',
                checked
            }, () => {
                this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].premium, `/${this.state.postfix}`);
            })
          }
    }
    

    choosePlan = (index, props) => {
        var buttonDisabled = this.state.buttonDisabled;
        var checked = this.state.checked;
        buttonDisabled = props.frequency === 'month' && !checked ? true : false;
        var payment_frequency = this.state.premium_details[index].payment_frequency;
        
        this.setState({
            selectedIndex: index,
            buttonDisabled: buttonDisabled,
            checked: checked,
            payment_frequency: payment_frequency,
            postfix: payment_frequency === 'YEARLY' ? 'year' : 'month'
        }, () => {
            this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].premium, `/${this.state.postfix}`);
        });
    }
    
    handleCheckbox = () =>{
        var checked = this.state.checked; 
        var buttonDisabled = this.state.buttonDisabled;

        checked = !this.state.checked
        buttonDisabled = checked ? false : true 

        this.setState({
            checked : checked,
            buttonDisabled: buttonDisabled
        });
    }
    
    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = async () =>{
        if(this.state.buttonDisabled && !this.state.checked){
            return;
        }

        this.sendEvents('next');
        this.setErrorData("submit");
        let error = "";
        let errorType = "";
        
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type', 'si'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['payment_frequency'] = this.state.payment_frequency;
        this.setState({
            skelton: true
        });
        try {
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,body);
            
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                
            var premium_details = resultData.premium_details.premium;
            groupHealthPlanData.payment_frequency = this.state.payment_frequency.toLowerCase();
            var plan_selected_final = {}
            plan_selected_final['base_premium'] = premium_details.base_premium
            plan_selected_final['tenure'] = 1;
            plan_selected_final['payment_frequency'] = premium_details.payment_frequency; 
            plan_selected_final['total_amount'] =premium_details.total_amount;
            groupHealthPlanData['plan_selected_final'] = plan_selected_final;
            groupHealthPlanData.post_body['gst'] = premium_details.gst[1];
            groupHealthPlanData.post_body['base_premium'] = premium_details.base_premium
            groupHealthPlanData.post_body['total_si'] = premium_details.total_si;
            groupHealthPlanData.post_body['individual_si'] = premium_details.individual_si;
            groupHealthPlanData.post_body['tenure'] = 1;
            groupHealthPlanData.post_body['payment_frequency'] = premium_details.payment_frequency;
            groupHealthPlanData.post_body['floater_type'] = premium_details.floater_type;
            groupHealthPlanData.post_body['total_amount'] = premium_details.total_amount;
            groupHealthPlanData['gmc_cta_postfix'] = premium_details.payment_frequency === 'MONTHLY' ? 'month' : 'year';
            
            groupHealthPlanData.paymentFrequencySelected = premium_details.payment_frequency;
            groupHealthPlanData.goodhealthDecSelected = this.state.payment_frequency + 'For_goodhealthDec'
            groupHealthPlanData.checkbox = false;

            this.setLocalProviderData(groupHealthPlanData);
            this.navigate('plan-good-health-dec');
            this.setState({
                show_loader: false
            });


            } else {
                error = resultData.error || resultData.message || true;
            }
        } catch (err) {
            console.log(err)
            this.setState({
                skelton: false
            });
            error = true;
            errorType = "crash";
        }
        if (error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error,
                type: errorType
              },
              showError: "page",
            });
        }
    }
    sendEvents(user_action) {

        let eventObj  = {}
            eventObj = {
                "event_name": 'health_insurance',
                "properties": {
                    "user_action": user_action,
                    "product": 'care_plus',
                    "flow": this.state.insured_account_type, 
                    "screen_name": 'select payment frequency',
                    "frequency": this.state.payment_frequency? this.state.payment_frequency.toLowerCase() : ''
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
            events={this.sendEvents("just_set_events")}
            skelton={this.state.skelton}
            showError={this.state.showError}
            errorData={this.state.errorData}
            title="Select payment frequency"
            buttonTitle="CONTINUE"
            withProvider={true}
            buttonData={this.state.bottomButtonData}
            handleClick={() => this.handleClick()}
            buttonDisabled={this.state.buttonDisabled}
            provider={this.state.providerConfig.key}
          >
            <div className="common-top-page-subtitle flex-between-center">
            Premiums can be paid either monthly or yearly
            </div>
            <div className="group-health-plan-select-sum-assured">
              <div className="generic-choose-input">
                <ValueSelector optionsList={this.state.optionsList} selectedIndex={this.state.selectedIndex} handleSelect={this.choosePlan} />
              </div>

            { this.state.selectedIndex === 0 ? (
                <div className="disclaimer-checkbox">
                <div className="note-container">
                    <p>Note:</p>
                    <p>Monthly premiums can only be paid with a credit card</p>
                </div>
                <div className="check-box-container">
                <Checkbox
                      defaultChecked
                      checked={this.state.checked}
                      color="default"
                      value="checked"
                      name="checked"
                      handleChange={this.handleCheckbox}
                      className="Checkbox"
                  />
                  <p> I would like to set up auto-debit on my credit card for future premium payments</p>
                </div>
            </div>
            ) : null}
              
            </div>
          </Container>

        )
    }
}

export default GroupHealthPlanSelectPaymentFrequency;
