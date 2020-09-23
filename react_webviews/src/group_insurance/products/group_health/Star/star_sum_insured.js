import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize, updateBottomPremium } from '../common_data';
import { numDifferentiation, formatAmountInr } from 'utils/validators';
import Api from 'utils/api';
import DotDotLoader from 'common/ui/DotDotLoader';
import { getConfig } from 'utils/functions';
import { isEmpty } from '../../../../utils/validators';
import toast from '../../../../common/ui/Toast';

class GroupHealthPlanStarSumInsured extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            next_screen: '',
            sum_assured: ["300000", "400000", "500000", "1000000", "1500000", "2000000", "2500000"],
            // selectedIndex: 1,
            loadingPremium: true
        };

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    updatePremium = async () => {
        let { post_body, dob_data, selectedIndex } = this.state;
        

        let body = {
            "pincode": post_body.pincode,
            "sum_assured": this.state.sum_assured[selectedIndex],
            "cover_plan": post_body.cover_plan,
            "account_type": post_body.account_type,
            "mem_info": post_body.mem_info,
            ...dob_data
        }

        try {
            this.setState({ loadingPremium: true });
            const res = await Api.post('api/ins_service/api/insurance/star/premium', body);

            if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
                // eslint-disable-next-line
                throw 'Something went wrong! Please try again.';
            }

            let resultData = res.pfwresponse.result;

            const [premiumData] = resultData.premium.WF;

            this.setState({
                loadingPremium: false,
                premiumData,
                premiumAmt: formatAmountInr(premiumData.net_premium),
            });

            // this.updatePremium(premium)
            

        } catch (err) {
            console.log(err);
            toast(err);
            this.setState({
                premiumAmt: '--',
                loadingPremium: false,
            });
        }
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;
        let sum_assured = post_body.sum_assured;
        
        let selectedIndex = this.state.sum_assured.indexOf(sum_assured);

        let dob_data = {};
        groupHealthPlanData.final_dob_data.forEach(item => {
            dob_data[item.backend_key] = {
                dob: item.value
            }
        });

        this.setState({
            selectedIndex: selectedIndex,
            post_body: post_body,
            dob_data: dob_data
        }, () => this.updatePremium())

        
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };

    navigate = (pathname) => {
        console.log(pathname)
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

    renderPlans = (sum_amount, index) => {
        return (
            <div onClick={() => this.choosePlan(index)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="name">
                        {numDifferentiation(sum_amount)}
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>
                </div>
            </div>
        )
    }

    handleClick = () => {
        const { groupHealthPlanData, premiumData } = this.state;
        
        if (this.state.loadingPremium || isEmpty(premiumData)) return;
        this.sendEvents('next');
        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        groupHealthPlanData.sum_assured = this.state.sum_assured[this.state.selectedIndex];
        groupHealthPlanData.post_body.sum_assured = this.state.sum_assured[this.state.selectedIndex];
        groupHealthPlanData.plan_selected_final = premiumData;

        const { plan_selected_final } = groupHealthPlanData;
        Object.assign(groupHealthPlanData.post_body, {
            tenure: plan_selected_final.tenure,
            tax_amount: plan_selected_final.gst_tax,
            base_premium: plan_selected_final.base_premium,
            premium: plan_selected_final.net_premium,
            total_amount: plan_selected_final.total_amount,
            discount_amount: plan_selected_final.total_discount,
            insured_pattern: plan_selected_final.insured_pattern,
            plan_code: groupHealthPlanData.plan_selected_final.plan_code,
        });

        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen || 'plan-premium-summary');
    }
    
    render() {
        let bottomButtonData = {
            leftTitle: 'Star Health',
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
                buttonDisabled={this.state.loadingPremium}
                withProvider={true}
                buttonData={bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle flex-between-center">
                    Claim can be made upto the selected amount
                <img 
                    className="tooltip-icon"
                    data-tip="In the last 10 years, the average cost per hospitalization for urban patients (in India) has increased by about 176%. Hence, we recommend to have adequate coverage to manage health expenses."
                    src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                </div>
                <div className="group-health-plan-select-sum-assured">
                    <div className="generic-choose-input">
                        {this.state.sum_assured.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanStarSumInsured;