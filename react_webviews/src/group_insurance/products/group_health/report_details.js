import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {
    inrFormatDecimal,
    numDifferentiationInr
} from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import { initialize } from './common_data';
import { ghGetMember, getCssMapperReport } from '../../constants';
import download from 'assets/download.svg';
import text_error_icon from 'assets/text_error_icon.svg';
class GroupHealthReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: {
                WF: []
            },
            extra_data: {
                benefits: {
                    main: []
                },
                special_benefits: [],
                waiting_period: []
            },
            lead: {
                member_base: []
            },
            policy_data: {
                cssMapper: {}
            },
            show_loader: true,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits
        }

        this.initialize = initialize.bind(this);

    }

    componentWillMount() {
        this.initialize();

        const { policy_id } = this.props.match.params;
        this.setState({
            policy_id: policy_id
        })
    }

    async componentDidMount() {

        try {

            const res = await Api.get(`api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/get/policy/${this.state.policy_id}`);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                let policy_data = resultData.policy_data || {};
                let lead = policy_data.insured_lead_details || {};
                lead.member_base = ghGetMember(lead, this.state.providerConfig);


                let data = getCssMapperReport(policy_data);
                policy_data.status = data.status;
                policy_data.cssMapper = data.cssMapper;

                this.setState({
                    extra_data: resultData.quote_info,
                    policy_data: resultData.policy_data,
                    quote_info: resultData.quote_info,
                    lead: lead
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

    downloadPolicy(url) {


        if (this.state.download_link || url) {
            this.sendEvents('download');
            nativeCallback({
                action: 'open_in_browser',
                message: {
                    url: url
                }
            });
        } else {
            this.getDownloadLink();
        }

    }

    getDownloadLink = async () => {
        try {

            this.setState({
                show_loader: true
            });
            const res = await Api.get(`api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/policy/download?policy_number=${this.state.policy_data.policy_number}`);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {


                let download_link = resultData.download_link;
                this.setState({
                    download_link: download_link
                })

                this.downloadPolicy(download_link);


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

        let provider = this.state.provider;
        this.setState({
            how_to_claim_clicked: type === 'how_to_claim' ? true : false
        }, () => {
            this.sendEvents('next');

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
                    'pathname': `/group-insurance/group-health/${this.state.provider}/how-to-claim`
                }
            }
    
    
            let mapper_data = data_mapper[type];
    
            let renderData = {
                'header_title': mapper_data.header_title,
                'header_subtitle': `${this.state.providerData.subtitle} ${this.state.lead.plan_title}`,
                'steps': {
                    'options': mapper_data.steps
                },
                'cta_title': 'OK'
            }
    
            if (type === 'how_to_claim') {
                if(provider === 'HDFCERGO') {
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
    
                if(provider === 'RELIGARE') {
                    this.navigate('how-to-claim-religare');
                    return;
                }
    
                if(provider === 'STAR') {
                    this.navigate('how-to-claim-star');
                    return;
                }
    
            }
    
            this.props.history.push({
                pathname: mapper_data.pathname,
                search: getConfig().searchParams,
                params: {
                    renderData: renderData
                }
            });
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
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'report details',
                "how_to_claim": this.state.how_to_claim_clicked ? 'yes' : 'no',
                "plan_details": this.state.plan_details_clicked ? 'yes': 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
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

    renderMembertop = (props, index) => {
        if (props.key === 'applicant') {
            return (
                <div className="member-tile" key={index}>
                    <div className="mt-left">
                        <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                    </div>
                    <div className="mt-right">
                        <div className="mtr-top">
                            Applicant name
                        </div>
                        <div className="mtr-bottom">
                            {props.name}
                        </div>
                    </div>
                </div>
            );
        } else {
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

    }

    handleClick = () => {
        this.setState({
            showPlanDetails: false
        })
    }

    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={'Health insurance'}
                fullWidthButton={true}
                buttonTitle="OK"
                onlyButton={true}
                handleClick={() => this.handleClick()}
                noFooter={!this.state.showPlanDetails}
            >
                <div className="group-health-plan-details group-health-final-summary">

                    <div style={{ margin: '0px 0 40px 0' }} className={`report-color-state ${this.state.policy_data.cssMapper.color}`}>
                        <div className="circle"></div>
                        <div className="report-color-state-title">{this.state.policy_data.cssMapper.disc}</div>
                    </div>
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <div className="tc-title">{this.state.providerData.subtitle}</div>
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
                                    SUM INSURED
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

                                <div className="mtr-bottom flex">
                                        <div>
                                            <div> {inrFormatDecimal(this.state.lead.premium)} </div>
                                            <div style={{fontSize:10}}> (Basic premium)</div>
                                        </div>
                                        <div>
                                            &nbsp;+&nbsp;
                                        </div>
                                        {this.state.lead.add_ons_amount &&
                                        <div>
                                            <div> {inrFormatDecimal(this.state.lead.add_ons_amount)} </div>
                                            <div style={{ fontSize: 10 }}> (Add on amount)</div>
                                        </div>
                                         }
                                        {this.state.lead.add_ons_amount &&
                                            <div>
                                                &nbsp;+&nbsp;
                                            </div>
                                        }
                                        <div>
                                            <div>{inrFormatDecimal(this.state.lead.tax_amount)} </div>
                                            <div style={{fontSize:10}}>(18% GST & other taxes) </div>
                                        </div>
                                        <div>
                                        &nbsp;=&nbsp;
                                        </div>
                                        <div>
                                         {inrFormatDecimal(this.state.lead.total_amount)}
                                        </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                Purchased on
                                </div>
                            <div className="mtr-bottom">
                                {this.state.policy_data.dt_created}
                            </div>
                        </div>
                    </div>

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_date_payment.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                DATE OF PAYMENT
                                </div>
                            <div className="mtr-bottom">
                                {this.state.policy_data.transaction_date || '-'}
                            </div>
                        </div>
                    </div>

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                POLICY NUMBER
                                </div>
                            <div className="mtr-bottom">
                                {this.state.policy_data.policy_number || '-'}
                            </div>
                        </div>
                    </div>

                   {this.state.policy_data.vendor_action_required_message &&
                    <div style={{ margin: '30px 0 30px 0', display: 'flex', 
                    position: 'relative',background: '#FDF5F6'}} 
                    className="highlight-text highlight-color-info">
                        <div>
                        <img className="highlight-text11"
                            src={text_error_icon}
                            alt="info" />
                        </div>

                        <div>
                            <div className="highlight-text1">
                                <div className="highlight-text12" style={{ display: 'flex' }}>
                                    {this.state.policy_data.vendor_action_required_title}
                                </div>
                            </div>
                            <div className="highlight-text2" style={{ color: '#767E86', marginLeft: 7 }}>
                                {this.state.policy_data.vendor_action_required_message}
                            </div>
                        </div>
                    </div>}

                    {!this.state.showPlanDetails &&
                        <div className="report-detail-download">

                            <div className="report-detail-download-text" style={{ fontWeight: 400 }} onClick={() => {
                                this.setState({
                                    showPlanDetails: !this.state.showPlanDetails,
                                    plan_details_clicked: true
                                }, () => {
                                    this.sendEvents('next');
                                })
                            }}>
                                Plan Details
                            </div>
                            {this.state.policy_data.policy_number &&
                                <div className="flex">
                                    <div style={{ color: '#d8dadd', margin: '0 10px 0 10px' }}>
                                        |
                                    </div>

                                    <div className="flex"
                                        onClick={() => this.downloadPolicy()}>
                                        <img src={download} alt="" />
                                        <div className="report-detail-download-text" style={{ fontWeight: 400 }}>Download Policy</div>
                                    </div>

                                </div>
                            }
                        </div>
                    }

                    {this.state.showPlanDetails &&
                        <div>

                            <div className="common-how-steps" style={{ border: 'none', marginTop: 0, marginBottom: 0 }}>
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
                                    {this.state.extra_data.special_benefits.map(this.renderSteps)}
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

                            <div className="common-how-steps" style={{ border: 'none', marginTop: 0, marginBottom: 0 }}>
                                <div className="top-tile">
                                    <div className="top-title">
                                        Waiting period
                            </div>
                                </div>
                                <div className='common-steps-images'>
                                    {this.state.extra_data.waiting_period.map(this.renderSteps)}
                                </div>

                            </div>

                        </div>}

                    <div className="bototm-design">
                        {this.state.showPlanDetails &&
                            <div className="bd-tile" onClick={() => this.navigateBenefits('whats_included')}>
                                <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_covered.svg`)}
                                    alt="" />
                                <div className="bd-content">What's included?</div>
                            </div>}
                        {this.state.showPlanDetails && <div className="bd-tile" onClick={() => this.navigateBenefits('whats_not_included')}>
                            <img className="bf-img" src={require(`assets/${this.state.productName}/ic_whats_not_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What's not included?</div>
                        </div>}
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

export default GroupHealthReportDetails;