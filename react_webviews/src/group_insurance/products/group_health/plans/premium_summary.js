import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { ghGetMember } from '../../../constants';
import { storageService, inrFormatDecimal, numDifferentiationInr } from 'utils/validators';
import { initialize } from '../common_data';
import BottomInfo from '../../../../common/ui/BottomInfo';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanPremiumSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: [],
            plan_selected_final: {},
            final_dob_data: [],
            show_loader: true,
            plan_selected: {}
        }

        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let groupHealthPlanData = this.state.groupHealthPlanData || {};
        let group_health_landing = '/group-insurance/group-health/landing';

        if (!groupHealthPlanData.post_body) {
            this.navigate(group_health_landing);
            return;
        } else {
            this.setState({
                show_loader: false
            })
        }


        let post_body = groupHealthPlanData.post_body;

        this.setState({
            plan_selected_final: groupHealthPlanData.plan_selected_final,
            total_member: post_body.mem_info.adult + post_body.mem_info.child,
            type_of_plan: groupHealthPlanData.type_of_plan,
            final_dob_data: groupHealthPlanData.final_dob_data
        })

    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'insurance'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        try {

            this.setState({
                show_loader: true
            });

            let body = this.state.groupHealthPlanData.post_body;
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/quote', body);

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                let lead = resultData.lead;
                lead.member_base = ghGetMember(lead);
                storageService().remove('groupHealthPlanData');
                storageService().set('ghs_ergo_quote_id', lead.id);
                this.navigate('personal-details/' + lead.member_base[0].key);
            } else {
                this.setState({
                    show_loader: false
                });
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    renderIndPremium = (props, index) => {
        return (
            <div key={index} className="nf-info flex-between" style={{ margin: '0 0 6px 0' }}>
                <div>{props.key}</div>
                <div>{inrFormatDecimal(this.state.plan_selected_final[props.backend_key])}</div>
            </div>
        )
    }

    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Premium summary"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE AND PROVIDE DETAILS"
                handleClick={() => this.handleClick()}
            >

                <div className="group-health-plan-premium-summary">
                    <div className="group-health-top-content-plan-logo">
                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                        <div className="left">
                            <div className="tc-title">{this.state.groupHealthPlanData.base_plan_title}</div>
                            <div className="tc-subtitle">{this.state.plan_selected.plan_title}</div>
                        </div>
                    </div>

                    <div className="premium-info">
                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">Sum assured</div>
                            <div className="pi-tile-right">{numDifferentiationInr(this.state.plan_selected_final.sum_assured)}</div>
                        </div>
                        {this.state.type_of_plan === 'NF' &&
                            <div className="nf-info">
                                {(`${inrFormatDecimal(this.state.plan_selected_final.sum_assured)} x ${this.state.total_member}`)}
                            </div>}

                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">Cover period</div>
                            <div className="pi-tile-right">{this.state.plan_selected_final.tenure} year</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="page-title">
                            Premium details
                        </div>

                        {this.state.type_of_plan === 'NF' &&
                            <div>
                                <div className="flex-between pi-tile">
                                    <div className="pi-tile-left">Individual premium</div>
                                </div>
                                {this.state.final_dob_data.map(this.renderIndPremium)}
                                <div className="generic-hr"></div>
                            </div>
                        }
                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">Base premium</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.plan_selected_final.base_premium)}</div>
                        </div>


                        {this.state.plan_selected_final.total_discount > 0 &&
                            <div className="flex-between pi-tile">
                                <div className="pi-tile-left">{this.state.plan_selected_final.tenure_discount_percentage}% discount</div>
                                <div className="pi-tile-right">-{inrFormatDecimal(this.state.plan_selected_final.total_discount)}</div>
                            </div>
                        }

                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">GST & other taxes</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.plan_selected_final.gst_tax)}</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="flex-between pi-tile" style={{ fontWeight: 600 }}>
                            <div className="pi-tile-left">Total payable</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.plan_selected_final.total_amount)}</div>
                        </div>

                        <div className="generic-hr"></div>
                    </div>

                    <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical treatments at affordable cost' }} />

                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanPremiumSummary;