import React, { Component } from 'react';
import Container from '../common/Container'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {
    inrFormatDecimal,
} from 'utils/validators';
import Api from 'utils/api';
import toast from  '../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import { initialize } from '../products/group_health/common_data'
import ReactHtmlParser from 'react-html-parser';
import {getCoverageType} from '../products/group_health/constants';

class GroupHealthReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            const res = await Api.get(`api/insurancev2/api/insurance/o2o/get/applications?o2o_app_id=089eb113-cbe2-44f0-b860-c0065236e726 `);

        // const ress = {
        //     "pfwmessage": "Success",
        //     "pfwstatus_code": 200,
        //     "pfwutime": "",
        //     "pfwtime": "2020-12-10 18:14:17.993520",
        //     "pfwresponse": {
        //         "requestapi": "",
        //         "status_code": 200,
        //         "result": {
        //             "result": [{
        //                 "group_customer": "",
        //                 "email_id": "thulasiram.athuru1989@gmail.com",
        //                 "policy_number": "000109439E",
        //                 "status": "Issued",
        //                 "application_number": "000109439E",
        //                 "policy_type": "Life",
        //                 "total_amount": 7262.0,
        //                 "id": "089eb113-cbe2-44f0-b860-c0065236e726",
        //                 "tax": 1107.7627118644,
        //                 "dt_login": null,
        //                 "logo": null,
        //                 "dt_next_renewal": "31/05/2021",
        //                 "insurance_account_id": "f1931aff-dff2-4629-b28d-cc421597fe3c",
        //                 "cover_period": 30.0,
        //                 "cover_amount": 15000000.0,
        //                 "dt_policy_issued": "31/05/2020",
        //                 "plan_type": "Term Plan",
        //                 "provider": "Edelweiss Tokio",
        //                 "mobile_number": "7500075000",
        //                 "dt_created": "2020-12-10T17:57:02",
        //                 "product_name": "Zindagi Plus",
        //                 "dt_policy_end": null,
        //                 "premium_paying_term": 30.0,
        //                 "premium": 6154.2372881356,
        //                 "customer_name": "Thulasiram  Athuru",
        //                 "dt_policy_start": null,
        //                 "dt_updated": "2020-12-10T17:57:14",
        //                 "frequency": "Yearly"
        //             }]
        //         }
        //     }
        // }

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result.result[0];
            if (res.pfwresponse.status_code === 200) {
                this.setState({
                    lead: resultData,
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
        let {provider} = this.state; console.log(this.state.providerData,'this.state.providerData.')

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
                            {/* <div className="tc-title">{provider === 'HDFCERGO' ? this.state.providerData.subtitle  : this.state.providerData.title}</div> */}
                            <div className="tc-subtitle">{this.state.lead.plan_title || this.state.providerData.subtitle}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

        

                    <div className="member-tile">
                            <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                INSURED NAME
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.customer_name}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                PROPOSER NAME
                                </div>
                                <div className="mtr-bottom">
                                {this.state.lead.customer_name}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/icn_phn_no.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                MOBILE NUMBER
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.mobile_number}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/icn_mail_id.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                EMAIL ID
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.email_id}
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
                                    {this.state.lead.policy_number}
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
                                    {this.state.lead.sum_assured} 
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
                                    {this.state.lead.cover_period} year{this.state.lead.cover_period>'1' && <span>s</span>}
                                </div>
                            </div>
                        </div>

                       {this.state.lead && 
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/icn_plan_type.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                PLAN TYPE
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.plan_type}
                                </div>
                            </div>
                        </div>}


                       {this.state.lead.cover_type || 
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/icn_time.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                PREMIUM PAYMENT TERM
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.premium_paying_term}
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
                                            <div>{inrFormatDecimal(this.state.lead.tax)} </div>
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
                            <img src={require(`assets/${this.state.productName}/icn_payment_frequency.svg`)} alt="" />  
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            Payment frequency
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.frequency}
                            </div>
                        </div>
                    </div>

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_issue_date.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top"> 
                             POLICY ISSUED DATE
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_policy_issued || '-'}
                            </div>
                        </div>
                    </div>

                    {this.state.lead.dt_policy_start_date && 
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_start_date_1.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            POLICY START DATE
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_policy_start_date || '-'}
                            </div>
                        </div>
                    </div>}


                    {this.state.lead.dt_policy_end && 
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_end_date.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            Policy End date
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_policy_end || '-'}
                            </div>
                        </div>
                    </div>}
                </div>
            </Container>
        );
    }
}

export default GroupHealthReportDetails;