import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import { numDifferentiationInr } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';
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
    }

    async componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        this.onload();
    }

    onload = async() =>{
        this.setErrorData("onload");
        this.setState({ skelton: true });
        let error = "";
        let errorType = "";
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;
        
        let keys_to_remove = ['si', 'base_premium', 'premium']
        for(let key in keys_to_remove){
            delete groupHealthPlanData.post_body[keys_to_remove[key]];
        }
        this.setLocalProviderData(groupHealthPlanData);

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        
        try {
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,body);
            
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                
            groupHealthPlanData.plan_selected.premium_data = resultData.premium_details;
            this.setLocalProviderData(groupHealthPlanData);
                
            var optionsList = []
            for(var x of resultData.premium_details){
                var temp = {
                    'value': numDifferentiationInr(x.sum_insured),
                    'premium': x.premium 
                }
                optionsList.push(temp)
            }

            this.setState({
              premium_data: resultData.premium_details,
              optionsList: optionsList,
              skelton: false
            })

            } else {
                error = resultData.error || resultData.message
                    || true;
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
        this.setState({
            selectedIndex: this.state.groupHealthPlanData.selectedIndexSumAssured || 0
        }, () => {
            var postfix = ''
            if(this.state.provider === 'GMC'){
                postfix = '/year';
            }
            this.updateBottomPremium(this.state.premium_data[this.state.selectedIndex].premium, postfix);
        })
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action) {
        let groupHealthPlanData = this.state.groupHealthPlanData;

        let eventObj  = {}
            eventObj = {
                "event_name": 'health_insurance',
                "properties": {
                    "user_action": user_action,
                    "product": this.state.providerConfig.provider_api,
                    "flow": this.state.insured_account_type || '',
                    "screen_name": 'select sum insured',
                    'sum_assured' : groupHealthPlanData.plan_selected.premium_data.length > 0 ? groupHealthPlanData.plan_selected.premium_data[this.state.selectedIndex || 0].sum_insured : ''
                }
            };
            
        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        this.sendEvents('next');
        let selectedPlan = this.state.premium_data[this.state.selectedIndex];
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        groupHealthPlanData.sum_assured = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.sum_assured = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.si = selectedPlan.sum_insured;
        groupHealthPlanData.post_body.base_premium = selectedPlan.sum_insured;
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
        groupHealthPlanData.checkbox = true;
        this.setLocalProviderData(groupHealthPlanData);

        if(groupHealthPlanData.account_type === 'self' || total_member === 1) {
            
            groupHealthPlanData.post_body.floater_type = 'non_floater';
            this.setLocalProviderData(groupHealthPlanData);

            this.navigate(this.state.next_screen.not_floater || 'plan-select-cover-period');
        } else {
            this.navigate(this.state.next_screen.floater || 'plan-select-floater');
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