import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import { storageService, numDifferentiation } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';
import Tooltip from '../../../../common/ui/Tooltip';


class GroupHealthPlanSelectCoverPeriod extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data: []
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let premium_data = this.state.groupHealthPlanData.plan_selected.premium_data.WF;

        let selectedIndex = this.state.groupHealthPlanData.selectedIndexSumAssured || 0;

        console.log("selectedIndex :" + selectedIndex);
        this.setState({
            premium_data: premium_data,
            selectedIndex: selectedIndex
        }, () => {
            this.updateBottomPremium();
        })

        console.log(premium_data[0]);

    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_suraksha',
            "properties": {
                "user_action": user_action,
                "screen_name": 'insurance'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        this.navigate('plan-list');
    }

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index
        }, () => {
            this.updateBottomPremium();
        });

    }

    renderPlans = (props, index) => {
        return (

            <div onClick={() => this.choosePlan(index, props)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="name">
                        {numDifferentiation(props.sum_assured)}
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>


                </div>
            </div >
        )
    }



    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Select cover period"
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                
                <Tooltip />
                <div className="common-top-page-subtitle flex-between-center">
                    The period for which health expenses will be covered
                 <img 
                 data-tip="As premium increases by insurer age, policy with longer cover period reduces the overall premium. 70% of our user has taken cover for 3 year period."
                 src={require(`assets/${this.state.productName}/info_icon.svg`)}
                  alt="" />
                </div>
                <div className="group-health-plan-select-sum-assured">

                    <div className="generic-choose-input">
                        {this.state.premium_data.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanSelectCoverPeriod;