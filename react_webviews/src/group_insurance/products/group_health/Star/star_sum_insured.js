import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize, updateBottomPremium } from '../common_data';
import { numDifferentiation, formatAmountInr } from 'utils/validators';
import Api from 'utils/api';
import DotDotLoader from 'common/ui/DotDotLoader';
import { getConfig } from 'utils/functions';

class GroupHealthPlanStarSumInsured extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            next_screen: '',
            sum_assured: ["300000", "400000", "500000", "1000000", "1500000", "2000000", "2500000"],
            // selectedIndex: 1,
            showDotLoader: true
        }

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
            const res = await Api.post('api/ins_service/api/insurance/star/premium', body);

            var resultData = res.pfwresponse.result;

            let premium = resultData.premium.WF[0].net_premium;

            this.setState({
                showDotLoader: false,
                premium: formatAmountInr(premium)
            })

            // this.updatePremium(premium)
            

        } catch (err) {
            console.log(err)
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
console.log(this.state)
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
            showDotLoader: true
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
            </div >
        )
    }

    handleClick = () => {
        this.sendEvents('next');

        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        groupHealthPlanData.sum_assured = this.state.sum_assured[this.state.selectedIndex];
        groupHealthPlanData.post_body.sum_assured = this.state.sum_assured[this.state.selectedIndex];


        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen);
    }
    
    render() {
        let bottomButtonData = {
            leftTitle: 'Star Health',
            leftSubtitle: this.state.showDotLoader ? <DotDotLoader /> : this.state.premium,
            provider: this.state.providerConfig.key,
            logo: this.state.providerConfig.logo_cta
        }

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Select sum assured"
                buttonTitle="CONTINUE"
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