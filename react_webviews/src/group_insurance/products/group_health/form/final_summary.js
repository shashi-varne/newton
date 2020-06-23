import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data'
import BottomInfo from '../../../../common/ui/BottomInfo';
import {numDifferentiationInr } from 'utils/validators';

class GroupHealthPlanFinalSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            get_lead: true,
            common_data: {},
            lead: {
                member_base: []
            }
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }


    onload = () => {
        let lead = this.state.lead;
        console.log(lead);
    }

    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }



    handleClick = async () => {


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


    renderMembertop = (props, index) => {
        return (
            <div className="member-tile" key={index}>
                <div className="mt-left">
                    <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                </div>
                <div className="mt-right">
                    <div className="mtr-top">
                        Insured {index + 1} name
                                </div>
                    <div className="mtr-bottom">
                        {props.name} ({props.relation.toLowerCase()})
                    </div>
                </div>
            </div>
        );
    }

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Summary"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="MAKE PAYMENT OF ₹7,640"
                handleClick={() => this.handleClick()}
            >

                <div className="group-health-final-summary">
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <div className="tc-title">{this.state.common_data.base_plan_title}</div>
                            <div className="tc-subtitle">{this.state.lead.plan_title}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                        {this.state.lead.member_base.map(this.renderMembertop)}

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    SUM ASSURED
                                </div>
                                <div className="mtr-bottom">
                                    {numDifferentiationInr(this.state.lead.sum_assured)}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVER PERIOD
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.tenure}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    TOTAL PREMIUM
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.total_amount}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomInfo baseData={{ 'content': 'Get best health insurance benefits at this amount and have a secured future.' }} />

            </Container>
        );
    }
}

export default GroupHealthPlanFinalSummary;