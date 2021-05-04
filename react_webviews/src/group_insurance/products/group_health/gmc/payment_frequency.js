import React, { Component } from 'react'
import Api from 'utils/api';
// import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import { initialize, updateBottomPremium } from '../common_data';
import { nativeCallback } from 'utils/native_callback';
import ValueSelector from '../../../../common/ui/ValueSelector';
import Checkbox from '../../../../common/ui/Checkbox';
import { getConfig } from 'utils/functions';
import toast from "../../../../common/ui/Toast";
import { inrFormatDecimal, storageService } from 'utils/validators';

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
        let groupHealthPlanData = this.state.groupHealthPlanData;
        var resultData = groupHealthPlanData[this.state.screen_name]; 
        var optionsList = []
        for(var x of resultData.premium_details){
            var temp = {
                'value': `${inrFormatDecimal(x.premium)}/${getFrequency[x.payment_frequency]}`,
                'premium': x.premium,
                'frequency':  getFrequency[x.payment_frequency]
            }
            optionsList.push(temp)
        }

          
        //   if(!error){
              
            var freqSelected = this.state.groupHealthPlanData.paymentFrequencySelected || 'YEARLY'; 
            var payment_frequency = freqSelected;
             var selectedIndex = freqSelected === 'YEARLY' ? 1 : 0;
            var checked = this.state.checked;
            checked = freqSelected === 'MONTHLY' ? true : false;
             
            this.setState({
                selectedIndex: selectedIndex,
                payment_frequency : payment_frequency,
                postfix: freqSelected === 'YEARLY' ? 'year': 'month',
                checked,
                optionsList,
                premium_details: resultData.premium_details
            }, () => {
                this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].premium, `/${this.state.postfix}`);
            })
        //   }
    }
    

    choosePlan = (index, props) => {
        var checked = this.state.checked;
        var payment_frequency = this.state.premium_details[index].payment_frequency;
        this.setState({
            selectedIndex: index,
            checked: checked,
            payment_frequency: payment_frequency,
            postfix: payment_frequency === 'YEARLY' ? 'year' : 'month'
        }, () => {
            this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].premium, `/${this.state.postfix}`);
        });
    }
    
    handleCheckbox = () =>{
        var checked = this.state.checked; 

        checked = !this.state.checked

        this.setState({
            checked : checked,
        });
    }
    
    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = async () =>{
        if(this.state.payment_frequency === 'MONTHLY' && !this.state.checked){
            toast('Please agree to the auto-debit statement')
            return;
        }

        this.sendEvents('next');
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        if(groupHealthPlanData.paymentFrequencySelected !==  this.state.payment_frequency){
            this.setErrorData("submit");
            let error = "";
            let errorType = "";

            let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type', 'si'];
            let body = {};
            for(let key of allowed_post_body_keys){
                body[key] = post_body[key];
            }
        
            body['payment_frequency'] = this.state.payment_frequency;
            this.setState({
                show_loader: "button"
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
                if(storageService().getObject('applicationPhaseReached')){
                    delete groupHealthPlanData.post_body['quotation_id'];
                }
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
                    show_loader: false
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
                  show_loader:false,
                });
            }
        }else{
            this.setLocalProviderData(groupHealthPlanData);
            this.navigate('plan-good-health-dec');
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
            showLoader={this.state.show_loader}
            buttonTitle="CONTINUE"
            withProvider={true}
            buttonData={this.state.bottomButtonData}
            handleClick={() => this.handleClick()}
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
