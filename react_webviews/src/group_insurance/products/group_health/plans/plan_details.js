import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { inrFormatDecimal, numDifferentiation } from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import {initialize} from '../common_data';

class GroupHealthPlanDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            ic_hs_main_benefits: ic_hs_main_benefits,
            screen_name: 'plan_details_screen'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        this.initialize();
    }

    async componentDidMount() {

        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let keys_to_empty = ['tenure', 'sum_assured', 'tenure', 'tax_amount', 'base_premium',
                            'total_amount', 'discount_amount', 'insured_pattern', 'type_of_plan',
                        'selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
        let not_req_keys_for_backend = ['selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
       

        for (var i in keys_to_empty) {

            if(not_req_keys_for_backend.includes(keys_to_empty[i])) {
                post_body[keys_to_empty[i]] = '';
            }
            
            groupHealthPlanData[keys_to_empty[i]] = '';
        }

        groupHealthPlanData.post_body = post_body;

        this.setState({
            groupHealthPlanData: groupHealthPlanData
        })

        this.setLocalProviderData(groupHealthPlanData);
        try {
            const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/premium`,
             post_body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    common_data: resultData.common,
                    premium_data: resultData.premium,
                    extra_data: resultData.quote_info
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

    navigateBenefits = (type) => {
       
        this.sendEvents('next', {more_info: type});
        let data_mapper = {
            'whats_included': {
                'header_title': "What's included?",
                'header_subtitle': 'These are some of the benefits that are covered under this policy',
                'steps': this.state.extra_data.whats_included,
                'pathname': '/gold/common/render-benefits'
            },
            'whats_not_included': {
                'header_title': "What's not included?",
                'header_subtitle' : 'These are some of the incidences that are not covered under this policy',
                'steps': this.state.extra_data.whats_not_included,
                'pathname': '/gold/common/render-benefits'
            },
            'how_to_claim': {
                'header_title': "How to claim",
                'pathname': 'how-to-claim'
            }
        }


        let mapper_data = data_mapper[type];

        let renderData = {
            'header_title': mapper_data.header_title,
            'header_subtitle': mapper_data.header_subtitle || `${this.state.common_data.base_plan_title} ${this.state.plan_selected.plan_title}`,
            'steps': {
                'options': mapper_data.steps
            },
            'cta_title': 'BACK TO PLAN'
        }

        if(type === 'how_to_claim') {
            renderData.page_title = 'HDFC ERGO provides cashless as well as reimbursement claim facility';
            renderData.contact_email = 'healthclaims@hdfcergo.com';
            renderData.steps = [
                {
                    'title': 'Cashless claims:',
                    'subtitle': 'In this type of health insurance claim, the insurer company settles all the hospitalization bills with the hospital directly. However, an insured needs to be hospitalized only at a network hospital and have to show the health card (issued after policy generation)  and valid photo ID'
                },
                {
                    'title': 'Reimbusment claims :',
                    'subtitle': 'In this type of claim process, the policyholder pays for the hospitalization expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case. In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then makes a payment to the insured.'
                }
            ]

        }

        this.props.history.push({
            pathname: mapper_data.pathname,
            search: getConfig().searchParams,
            params: {
                renderData: renderData
            }
        });
    }




    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action, data={}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'plan details',
                'more_info' : data.more_info || ''
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
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.plan_selected.common_data = this.state.common_data;
        groupHealthPlanData.plan_selected.extra_data = this.state.extra_data;
        groupHealthPlanData.plan_selected.premium_data = this.state.premium_data;

        groupHealthPlanData.post_body.base_premium = groupHealthPlanData.plan_selected.base_premium;
        groupHealthPlanData.post_body.premium = groupHealthPlanData.plan_selected.net_premium;
        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen || 'plan-select-sum-assured');
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
                    <div className="group-health-top-content-plan-logo">
                        <div className="left">
                            <div className="tc-title">{this.state.common_data.base_plan_title}</div>
                            <div className="tc-subtitle">{this.state.plan_selected.plan_title}</div>
                        </div>

                        <div className="tc-right">
                            <img
                                src={require(`assets/${this.state.providerData.logo_card}`)}
                                alt=""
                                style={{ maxWidth: '140px' }}
                            />
                        </div>
                    </div>

                    <div className="settlement-info">Claim settlement: 98.88%</div>

                    <div className="recomm-info group-health-recommendation" 
                    style={{backgroundColor: this.state.plan_selected.recommendation_tag === 'Recommended' ? '#E86364' : ''}}>
                    {this.state.plan_selected.recommendation_tag}
                    </div>
                    <div className="copay-info">
                        <div className="ci-left">
                            0% copay, assured 100% cashless treatment
                        </div>
                        <div className="ci-right">
                            <img 
                            className="tooltip-icon"
                            data-tip={this.state.plan_selected.copay}
                            src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
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

                    <div className="common-how-steps" style={{ border: 'none',marginTop:0 ,marginBottom:0 }}>
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
                            {this.state.extra_data.special_benfits.map(this.renderSteps)}
                        </div>

                        <div className="special-benefit"
                            style={{ backgroundImage: `url(${this.state.ic_hs_main_benefits})` }}>
                            <img className="special-benefit-img" src={require(`assets/ic_hs_main.svg`)}
                                alt="" />
                            <span className="special-benefit-text">Main benefits</span>
                        </div>
                        <div className='common-steps-images'>
                            {this.state.extra_data.benefits.main.map(this.renderSteps)}
                        </div>
                    </div>

                    <div className="common-how-steps" style={{ border: 'none',marginTop:-30 ,marginBottom:0 }}>
                        <div className="top-tile">
                            <div className="top-title">
                                Waiting period
                            </div>
                        </div>
                        <div className='common-steps-images' style={{marginTop:0}}>
                            {this.state.extra_data.waiting_period.map(this.renderSteps)}
                        </div>
                    </div>

                    <div className="accident-plan-read" style={{ padding: 0 }}>
                        <div className="accident-plan-read-text">
                            *For detailed list of all terms and conditions, please refer
                            <span
                                style={{ color: getConfig().primary }}
                                onClick = {() => this.openInBrowser(this.state.premium_data.read_details_doc, 'read_document')}>
                                &nbsp;policy prospectus
                            </span>
                        </div>
                    </div>

                    <div className="bototm-design">
                        <div className="bd-tile" onClick={() => this.navigateBenefits('whats_included')}>
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What's included?</div>
                        </div>
                        <div className="bd-tile" onClick={() => this.navigateBenefits('whats_not_included')}>
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_not_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What's not included?</div>
                        </div>
                        <div className="bd-tile" onClick={() => this.navigateBenefits('how_to_claim')}>
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_how_to_claim.svg`)}
                                alt="" />
                            <div className="bd-content">How to claim?</div>
                        </div>
                        <div className="generic-hr"></div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanDetails;