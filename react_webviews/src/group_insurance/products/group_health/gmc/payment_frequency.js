import React, { Component } from 'react'
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import { initialize, updateBottomPremium } from '../common_data';
import ValueSelector from '../../../../common/ui/ValueSelector';
import Checkbox from '../../../../common/ui/Checkbox';
import { getConfig } from 'utils/functions';
import { numDifferentiationInr } from 'utils/validators';

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
            buttonDisabled: true            
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }
    componentWillMount(){
        this.initialize();
    }

    async componentDidMount(){
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        this.setState({
            show_loader: true
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
                
                this.setState({
                    show_loader: false
                });

                var optionsList = []
                for(var x of resultData.premium_details){
                var temp = {
                    'value': `${numDifferentiationInr(x.premium)}/${getFrequency[x.payment_frequency]}`,
                    'total_amount': x.total_amount 
                }
                optionsList.push(temp)
            }
            console.log(optionsList)
            this.setState({
                optionsList: optionsList,
                premium_details: resultData.premium_details,
            })
            

            } else {
                toast(resultData.error || resultData.message || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
        var freqIndex = this.state.groupHealthPlanData.paymentFrequencySelectedIndex || 0;
        var payment_frequency = freqIndex ? "YEARLY" : "MONTHLY"
        var buttonDisabled = freqIndex ? false : true;

        console.log({freqIndex, payment_frequency})
        this.setState({
            selectedIndex: freqIndex,
            payment_frequency : payment_frequency,
            buttonDisabled: buttonDisabled
        }, () => {
            this.updateBottomPremium(this.state.premium_data[this.state.selectedIndex].total_amount);
        })
    }

    choosePlan = (index, props) => {
        
        var buttonDisabled = this.state.buttonDisabled;
        buttonDisabled = !index ? true : false;
        var checked = this.state.checked;

        if(index){
            checked = false    
        }
        var payment_frequency = this.state.premium_details[index].payment_frequency;
        this.setState({
            selectedIndex: index,
            buttonDisabled: buttonDisabled,
            checked: checked,
            payment_frequency: payment_frequency
        }, () => {
            this.updateBottomPremium(this.state.optionsList[this.state.selectedIndex].total_amount);
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
        
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type', 'si'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['payment_frequency'] = this.state.payment_frequency;
        console.log(this.state.payment_frequency)
        this.setState({
            show_loader: true
        });
        try {
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,body);
            
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                
            var premium_details = resultData.premium_details.premium;
            console.log(premium_details)
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
            groupHealthPlanData.paymentFrequencySelectedIndex = this.state.selectedIndex;
            this.setLocalProviderData(groupHealthPlanData);
            this.navigate('plan-good-health-dec');
            this.setState({
                show_loader: false
            });


            } else {
                toast(resultData.error || resultData.message || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }

    }

    render() {
        return (
            <Container
            // events={this.sendEvents("just_set_events")}
            showLoader={this.state.show_loader}
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
