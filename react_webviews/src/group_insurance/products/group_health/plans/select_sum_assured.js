import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import { storageService, numDifferentiation } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';


class GroupHealthPlanSelectSumAssured extends Component {

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

        this.setState({
            selectedIndex: this.state.groupHealthPlanData.selectedIndexSumAssured || 0
        }, () => {
            this.updateBottomPremium();
        })


    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
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
        groupHealthPlanData.post_body.sum_assured = this.state.premium_data[this.state.selectedIndex].sum_assured;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        if(groupHealthPlanData.account_type === 'self') {
            this.navigate('plan-select-cover-period');
        } else {
            this.navigate('plan-select-floater');
        }
        
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
                title="Select sum assured"
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle flex-between-center">
                    This is the amount you will receive for your claim
                 <img src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
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

export default GroupHealthPlanSelectSumAssured;