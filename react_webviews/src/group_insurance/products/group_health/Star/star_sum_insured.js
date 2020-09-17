import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize, updateBottomPremium } from '../common_data';
import { numDifferentiation, formatAmountInr } from 'utils/validators';
import Api from 'utils/api';
import DotDotLoader from 'common/ui/DotDotLoader';

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

    updatePremium = async (index) => {
        let body = {
            "pincode": "500007",
            "sum_assured": this.state.sum_assured[index],
            "cover_plan": "FHONEW",
            "account_type": "selfandfamily",
            "mem_info": {
              "adult": "2",
              "child": 0
            },
            "self_account_key": {
              "dob": "05/09/1995"
            },
            "spouse_account_key": {
              "dob": "05/09/1995"
            }
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
        
        let selectedIndex = groupHealthPlanData.selectedIndexSumAssured || 0;

        this.setState({
            selectedIndex: selectedIndex
        })

        this.updatePremium(selectedIndex)
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
    }

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index,
            showDotLoader: true
        }, () => {
            this.updatePremium(index);
            // this.updateBottomPremium();
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