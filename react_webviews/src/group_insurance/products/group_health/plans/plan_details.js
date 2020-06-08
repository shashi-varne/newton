import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { storageService, inrFormatDecimal, numDifferentiation } from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import {initialize} from '../common_data';

class GroupHealthPlanDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
            // show_loader: true,   
            premium_data: {
                WF: []
            },
            common_data: {},
            plan_selected: {},
            extra_data: {
                benefits: {
                    main: []
                },
                special_benfits: [],
                waiting_period: []
            },
            show_loader: true,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {

        this.initialize();
    }

    async componentDidMount() {
        try {

            let body = {
                "city": "MUMBAI",
                "account_type": "selfandfamily",
                "mem_info": {
                    "adult": "2",
                    "child": "1"
                },
                "self_account_key": { "dob": "05/09/1995" },
                "spouse_account_key": { "dob": "05/09/1996" },
                "child_account1_key": { "dob": "05/09/2014" },
                'plan': this.state.groupHealthPlanData.plan_selected.plan_type
            }
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/premium', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            console.log(resultData);
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    common_data: resultData.common,
                    premium_data: resultData.premium[0],
                    extra_data: resultData.premium[1]
                })


            } else {
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
        groupHealthPlanData.plan_selected.common_data = this.state.common_data;
        groupHealthPlanData.plan_selected.extra_data = this.state.extra_data;
        groupHealthPlanData.plan_selected.premium_data = this.state.premium_data;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);
        this.navigate('plan-select-sum-assured');
    }


    renderPremiums = (props, index) => {

        return (
            <div className="sum-assured-info" key={index}>
                <div className="sai-left">
                    {numDifferentiation(props.sum_assured)}
                </div>
                <div className="sai-left">
                    {inrFormatDecimal(props.net_premium)}/year
                        </div>
            </div>
        );
    }

    renderSteps = (option, index) => {
        return (
            <div key={index} className="tile">
                <img className="icon"
                    src={option.img} alt="Gold" />
                <div className="content">
                    <div className="content">
                        <div className="content-title">{option.content}</div>
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
                title="Plan details"
                fullWidthButton={true}
                buttonTitle="SELECT SUM ASSURED"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >
                <div className="group-health-plan-details">
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <div className="tc-title">{this.state.common_data.base_plan_title}</div>
                            <div className="tc-subtitle">{this.state.plan_selected.plan_title}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className="settlement-info">Claim settlement: 98.88%</div>

                    <div className="recomm-info">Affordable</div>

                    <div className="copay-info">
                        <div className="ci-left">
                            0% copay, assured 100% cashless treatment
                        </div>
                        <div className="ci-right">
                            <img src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                        </div>
                    </div>

                    <div className="sum-assured-info" style={{ fontWeight: 600 }}>
                        <div className="sai-left">
                            Sum assured
                        </div>
                        <div className="sai-left">
                            Premium
                        </div>
                    </div>

                    {this.state.premium_data.WF.map(this.renderPremiums)}

                    <div className="common-how-steps" style={{ border: 'none' }}>
                        <div className="top-tile">
                            <div className="top-title">
                                Benefits under this plan
                            </div>
                        </div>


                        <div className="special-benefit"
                            style={{ backgroundImage: `url(${this.state.ic_hs_special_benefits})` }}>
                            <img className="special-benefit-img" src={require(`assets/ic_hs_special.svg`)}
                                alt="" />
                            <span className="special-benefit-text">Special benefits</span>
                        </div>
                        <div className='common-steps-images'>
                            {this.state.extra_data.benefits.main.map(this.renderSteps)}
                        </div>

                        <div className="special-benefit"
                            style={{ backgroundImage: `url(${this.state.ic_hs_main_benefits})` }}>
                            <img className="special-benefit-img" src={require(`assets/ic_hs_main.svg`)}
                                alt="" />
                            <span className="special-benefit-text">Main benefits</span>
                        </div>
                        <div className='common-steps-images'>
                            {this.state.extra_data.special_benfits.map(this.renderSteps)}
                        </div>
                    </div>

                    <div className="common-how-steps" style={{ border: 'none' }}>
                        <div className="top-tile">
                            <div className="top-title">
                                Waiting period
                            </div>
                        </div>
                        <div className='common-steps-images'>
                            {this.state.extra_data.waiting_period.map(this.renderSteps)}
                        </div>

                    </div>

                    <div className="bototm-design">
                        <div className="bd-tile">
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What's included?</div>
                        </div>
                        <div className="bd-tile">
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_not_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What's not included?</div>
                        </div>
                        <div className="bd-tile">
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_how_to_claim.svg`)}
                                alt="" />
                            <div className="bd-content">How to claim?</div>
                        </div>
                        <div className="generic-hr"></div>
                    </div>

                    <div className="accident-plan-read" style={{ padding: 0 }}
                        onClick={() => this.openInBrowser(this.state.quoteData.read_document, 'read_document')}>
                        <img className="accident-plan-read-icon"
                            src={require(`assets/${this.state.productName}/ic_read.svg`)} alt="" />
                        <div className="accident-plan-read-text" style={{ color: getConfig().primary }}>Read Detailed Document</div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanDetails;