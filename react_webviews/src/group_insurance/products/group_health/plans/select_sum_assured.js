import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import { numDifferentiationInr, isEmpty, compareObjects } from 'utils/validators';
import { initialize, updateBottomPremium, getAddOnsData } from '../common_data';
import GenericTooltip from '../../../../common/ui/GenericTooltip';
import ValueSelector from '../../../../common/ui/ValueSelector';

class GroupHealthPlanSelectSumAssured extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data: [],
            screen_name: 'sum_assured_screen'
        };

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
        this.getAddOnsData = getAddOnsData.bind(this);
    }

    async componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        this.onload();
    }

    onload = async() =>{
        
        var groupHealthPlanData = this.state.groupHealthPlanData;
        var resultData = groupHealthPlanData.sum_assured_screen;
        
        var optionsList = []
            for(var x of resultData.premium_details){
                var temp = {
                    'value': numDifferentiationInr(x.sum_insured),
                    'premium': x.premium 
                }
                optionsList.push(temp)
        } 


        this.setState({
            selectedIndex: this.state.groupHealthPlanData.selectedIndexSumAssured || 0,
            optionsList,
            premium_data: resultData.premium_details
        }, () => {
            var postfix = ''
            if(this.state.provider === 'GMC'){
                postfix = '/year';
            }
            this.updateBottomPremium(this.state.premium_data[this.state.selectedIndex].premium, postfix);
        })
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action) {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let selectedIndex = this.state.selectedIndex || 0;
        let eventObj  = {}
            eventObj = {
                "event_name": 'health_insurance',
                "properties": {
                    "user_action": user_action,
                    "product": this.state.providerConfig.provider_api,
                    "flow": this.state.insured_account_type || '',
                    "screen_name": 'select sum insured',
                    'sum_assured' : groupHealthPlanData.plan_selected.premium_data.length > 0 && this.state.selectedIndex ? groupHealthPlanData.plan_selected.premium_data[selectedIndex].sum_insured : ''
                }
            };
            
        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        this.sendEvents('next');
        let selectedPlan = this.state.premium_data[this.state.selectedIndex];
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.sum_assured = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.sum_assured = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.si = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.premium = selectedPlan.premium;

        if(this.state.provider === 'RELIGARE') {
            groupHealthPlanData.post_body.sum_assured = (groupHealthPlanData.post_body.sum_assured)/100000
        }

        let total_member = groupHealthPlanData.post_body.adults + groupHealthPlanData.post_body.children;

        if(total_member === 1) {
            groupHealthPlanData.type_of_plan = 'WF';
            groupHealthPlanData.post_body.type_of_plan = 'WF';
        }
        groupHealthPlanData.add_ons_data = [];
        groupHealthPlanData.post_body.add_ons_json = {};
        
        let post_body = groupHealthPlanData.post_body;
        var previousIndex = groupHealthPlanData.selectedIndexSumAssured;
        
        console.log(this.state.selectedIndex)
        console.log(previousIndex)
        if(this.state.selectedIndex !== previousIndex){

            this.setErrorData('submit')
            let error = "";
            let errorType = "";

            let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id', 'insurance_type', 'si'];
            
            this.setState({
                show_loader: "button"
            });

            var account_type = groupHealthPlanData.account_type;
            var {provider} = this.state;
            var next_state = ''
            let body = {};

            if(provider === 'HDFCERGO' && account_type === 'self'){
                
                next_state = 'plan-select-cover-period'
                allowed_post_body_keys.push('city')
                body['floater_type'] = 'non_floater'
            }else if(provider === 'RELIGARE' && account_type === 'self'){
                groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
                this.setLocalProviderData(groupHealthPlanData)
                next_state = 'plan-select-add-ons'
                var current_state = {}
                var keys_to_check = ['account_type', 'si', 'plan_id'];
                for(var x of keys_to_check){
                    current_state[x] = post_body[x]
                }
                this.setState({
                    current_state
                }, ()=>{
                    var sameData = compareObjects(Object.keys(current_state), current_state, groupHealthPlanData.add_ons_previous_data);
                    if(!sameData || isEmpty(groupHealthPlanData['plan-select-add-ons'])){
                        this.getAddOnsData();
                    }else{
                        this.navigate('plan-select-add-ons')
                    }
                })
                return;    
            }else if((provider === 'HDFCERGO' || provider === 'RELIGARE') && account_type !== 'self'){
                next_state = 'plan-select-floater'
                allowed_post_body_keys.push('city')
            }else if(provider === 'GMC'){
                next_state = 'plan-payment-frequency'
            }
            
            for(let key of allowed_post_body_keys){
                body[key] = post_body[key];
            }
            try {
                const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,body);
                
                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    
                    groupHealthPlanData[next_state] = resultData;
                    groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
                    if(groupHealthPlanData.account_type !== 'self'){
                        groupHealthPlanData.selectedIndexFloater = 0;
                        groupHealthPlanData.type_of_plan = ''
                    }
                    if(provider === 'GMC'){
                        groupHealthPlanData.paymentFrequencySelected = '';
                    }

                    this.setLocalProviderData(groupHealthPlanData);
                    if(groupHealthPlanData.account_type === 'self' || total_member === 1) {
                        groupHealthPlanData.post_body.floater_type = 'non_floater';
                        this.setLocalProviderData(groupHealthPlanData);
                        this.navigate(this.state.next_screen.not_floater || 'plan-select-cover-period');
                    } else {
                        this.navigate(this.state.next_screen.floater || 'plan-select-floater');
                    }
    
                    this.setState({
                        show_loader: false
                    })
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
                });
              }       
        }else{
            this.setLocalProviderData(groupHealthPlanData);
            if(groupHealthPlanData.account_type === 'self' || total_member === 1) {
                groupHealthPlanData.post_body.floater_type = 'non_floater';
                this.setLocalProviderData(groupHealthPlanData);
                this.navigate(this.state.next_screen.not_floater || 'plan-select-cover-period');
                
            } else {
                this.navigate(this.state.next_screen.floater || 'plan-select-floater');
            }
        }

        
    }

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index
        }, () => {
            var postfix = ''
            if(this.state.provider === 'GMC'){
                postfix = '/year';
            }
            this.updateBottomPremium(this.state.premium_data[this.state.selectedIndex].premium, postfix);
        });
    }

    render() {
        return (
          <Container
            events={this.sendEvents("just_set_events")}
            skelton={this.state.skelton}
            showError={this.state.showError}
            showLoader={this.state.show_loader}
            errorData={this.state.errorData}
            title="Select sum insured"
            buttonTitle="CONTINUE"
            withProvider={true}
            buttonData={this.state.bottomButtonData}
            handleClick={() => this.handleClick()}
          >
            <div className="common-top-page-subtitle flex-between-center">
              Claim can be made upto the selected amount
              <GenericTooltip
                productName={getConfig().productName}
                content="In the last 10 years, the average cost per hospitalisation for urban patients has increased by about 176%. Hence, we recommend to have adequate coverage to manage health expenses"
              />
            </div>
            <div className="group-health-plan-select-sum-assured">
              <div className="generic-choose-input">
                <ValueSelector optionsList={this.state.optionsList} selectedIndex={this.state.selectedIndex} handleSelect={this.choosePlan} />
              </div>
            </div>
          </Container>
        );
    }
}

export default GroupHealthPlanSelectSumAssured;