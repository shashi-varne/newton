import React, { Component } from 'react';
import Container from '../common/Container'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {
    inrFormatDecimal,
    numDifferentiationInr, dateOrdinal
} from 'utils/validators';
import Api from 'utils/api';
import toast from  '../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import { initialize } from '../products/group_health/common_data'
import { ghGetMember, getCssMapperReport } from '../constants';
import download from 'assets/download.svg';
import text_error_icon from 'assets/text_error_icon.svg';
import ReactHtmlParser from 'react-html-parser';
import { childeNameMapper } from '../constants';
import {getCoverageType} from '../products/group_health/constants';

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

                let member_base = lead.member_base;
                let applicantIndex = member_base.findIndex(item => item.key === 'applicant');

                if(applicantIndex >= 0) {
                    let appli_data = member_base[applicantIndex];
                    member_base.splice(applicantIndex, 1);
                    member_base.splice(0, 0, appli_data);
                }

                let data = getCssMapperReport(policy_data);
                policy_data.status = data.status;
                policy_data.cssMapper = data.cssMapper;

                this.setState({
                    extra_data: resultData.quote_info,
                    policy_data: resultData.policy_data,
                    quote_info: resultData.quote_info,
                    lead: lead,
                    applicantIndex: applicantIndex
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

    // getDownloadLink = async () => {
    //     try {

    //         this.setState({
    //             show_loader: true
    //         });
    //         const res = await Api.get(`api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/policy/download?policy_number=${this.state.policy_data.policy_number}`);
    //         this.setState({
    //             show_loader: false
    //         });
    //         var resultData = res.pfwresponse.result;
    //         if (res.pfwresponse.status_code === 200) {


    //             let download_link = resultData.download_link;
    //             this.setState({
    //                 download_link: download_link
    //             })

    //             this.downloadPolicy(download_link);


    //         } else {
    //             toast(resultData.error || resultData.message
    //                 || 'Something went wrong');
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         this.setState({
    //             show_loader: false
    //         });
    //         toast('Something went wrong');
    //     }
    // }



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
                "product": this.state.providerConfig.provider_api,
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
                        <div className="content-title">{ReactHtmlParser(option.content)}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let {provider} = this.state;

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
                            <div className="tc-title">{provider === 'HDFCERGO' ? this.state.providerData.subtitle  : this.state.providerData.title}</div>
                            <div className="tc-subtitle">{this.state.lead.plan_title || this.state.providerData.subtitle}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

        

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
                                    {this.state.lead.tenure} year{this.state.lead.tenure>'1' && <span>s</span>}
                                </div>
                            </div>
                        </div>

                       {this.state.lead.cover_type && 
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVERAGE TYPE
                                </div>
                                <div className="mtr-bottom">
                                    {getCoverageType(this.state.lead)}
                                </div>
                            </div>
                        </div>}

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                 PREMIUM PAID
                                </div>

                                <div className="mtr-bottom flex" style={{textTransform:'none'}}>
                                        <div>
                                            <div> {inrFormatDecimal(this.state.lead.base_premium_showable ||
                                                 this.state.lead.premium)} </div>
                                            <div style={{fontSize:10}}> (Basic premium)</div>
                                        </div>
                                        <div>
                                            &nbsp;+&nbsp;
                                        </div>
                                        {this.state.lead.add_ons_amount > 0 &&
                                        <div>
                                            <div> {inrFormatDecimal(this.state.lead.add_ons_amount)} </div>
                                            <div style={{ fontSize: 10 }}> (Add on amount)</div>
                                        </div>
                                         }
                                        {this.state.lead.add_ons_amount > 0 &&
                                            <div>
                                                &nbsp;+&nbsp;
                                            </div>
                                        }
                                        <div>
                                            <div>{inrFormatDecimal(this.state.lead.tax_amount)} </div>
                                            <div style={{fontSize:10}}>(18% GST) </div>
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

                    {this.state.policy_data.policy_number && 
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
                    </div>}

                    {!this.state.policy_data.policy_number && this.state.policy_data.proposal_number &&
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                PROPOSAL NUMBER
                                </div>
                            <div className="mtr-bottom">
                                {this.state.policy_data.proposal_number || '-'}
                            </div>
                        </div>
                    </div>}
                </div>
            </Container>
        );
    }
}

export default GroupHealthReportDetails;