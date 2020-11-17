import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize, updateBottomPremium } from '../common_data';
import { numDifferentiationInr } from 'utils/validators';
import Api from 'utils/api';
import DotDotLoader from 'common/ui/DotDotLoader';
import { getConfig } from 'utils/functions';
import { isEmpty } from '../../../../utils/validators';
import toast from '../../../../common/ui/Toast';
import GenericTooltip from '../../../../common/ui/GenericTooltip'

class GroupHealthPlanStarSumInsured extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            next_screen: '',
            premiumAmt: null,
            selectedIndex: 0,
            loadingPremium: true
        };

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    updatePremium = async () => {
        this.setState({
            premiumAmt: this.state.premium_data[this.state.selectedIndex].premium
        })
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id', 'postal_code'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        this.setState({
            show_loader: true
        });

        try {
            this.setState({ loadingPremium: true, apiError :false });
            const res = await Api.post('api/insurancev2/api/insurance/health/quotation/get_premium/star', body);

            this.setState({ loadingPremium: false, premiumData: [] });
            let resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200 && resultData.premium_details) {
    
                this.setState({
                    premium_data: resultData.premium_details
                });

            } else {
                this.setState({
                    premiumAmt: '--',
                    apiError :true
                })
                toast(resultData.error || 'Something went wrong! Please try again.');
            }
           this.setState({
                show_loader: false
            });

        } catch (err) {
            console.log(err);
            toast('Something went wrong');
            this.setState({
                premiumAmt: '--',
                loadingPremium: false,
                apiError :true
            });
        }

        let dob_data = {};
        groupHealthPlanData.final_dob_data.forEach(item => {
            dob_data[item.backend_key] = {
                dob: item.value
            }
        });

        this.updatePremium();
        
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'star',
                "flow": this.state.insured_account_type || '',
                sum_assured:  this.state.premium_data ? this.state.premium_data[this.state.selectedIndex].sum_insured : 0,
                screen_name: 'select sum Insured',
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    };

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index,
        }, () => {
            this.updatePremium();
        });
    }

    renderPlans = (item, index) => {
        return (
            <div onClick={() => this.choosePlan(index)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="name">
                        {numDifferentiationInr(item.sum_insured)}
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>
                </div>
            </div>
        )
    }

    handleClick = async () => {
        const { groupHealthPlanData, premium_data } = this.state;
        this.sendEvents('next');
        let post_body = groupHealthPlanData.post_body;
        let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id', 'postal_code'];
        let body = {};
        
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['si'] = this.state.premium_data[this.state.selectedIndex].sum_insured;
                
        this.setState({
            show_loader: true
        })
        try{
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/star`, body);

            var resultData = res.pfwresponse.result;

            var plan_selected_final = resultData.premium_details;
            
            if (this.state.loadingPremium || isEmpty(premium_data)) return;
            
            groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
            groupHealthPlanData.sum_assured = this.state.premium_data[this.state.selectedIndex].sum_insured;
            groupHealthPlanData.post_body.sum_assured = this.state.premium_data[this.state.selectedIndex].sum_insured;
            groupHealthPlanData.post_body.individual_si = this.state.premium_data[this.state.selectedIndex].sum_insured;
            groupHealthPlanData.plan_selected_final = plan_selected_final;

            
        
        Object.assign(groupHealthPlanData.post_body, {
            tenure: plan_selected_final.tenure,
            tax_amount: plan_selected_final.gst[1],
            base_premium: plan_selected_final.base_premium,
            premium: plan_selected_final.premium,
            total_amount: plan_selected_final.total_amount || 0,
            discount_amount: plan_selected_final.total_discount,
            insured_pattern: plan_selected_final.insured_pattern,
            plan_code: plan_selected_final.plan_code,
            postal_code: body.postal_code,
            total_si: body.si,
            sum_assured: this.state.premium_data[this.state.selectedIndex].sum_insured,
            gst: plan_selected_final.gst[1],
        });
        
        }catch(err){
            toast('Something went wrong');
            this.setState({
                premiumAmt: '--',
                loadingPremium: false,
                apiError :true,
                show_loader: false
            });
        }        

        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen || 'plan-premium-summary');
    }
    
    render() {
        let bottomButtonData = {
            leftTitle: this.state.groupHealthPlanData.plan_selected.plan_title,
            leftSubtitle: this.state.loadingPremium ? <DotDotLoader /> : this.state.premiumAmt,
            provider: this.state.providerConfig.key,
            logo: this.state.providerConfig.logo_cta
        }

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Select sum insured"
                buttonTitle="CONTINUE"
                buttonDisabled={this.state.loadingPremium || this.state.apiError}
                withProvider={true}
                buttonData={bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle flex-between-center">
                    Claim can be made upto the selected amount
                <GenericTooltip productName = {
                    getConfig().productName
                }
                content = "In the last 10 years, the average cost per hospitalisation for urban patients has increased by about 176%. Also, this amount will be shared amongst all the insured members; hence, we recommend to have adequate coverage to manage health expenses."/>
                </div>
                <div className="group-health-plan-select-sum-assured">
                    <div className="generic-choose-input">
                        {this.state.premium_data && this.state.premium_data.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanStarSumInsured;