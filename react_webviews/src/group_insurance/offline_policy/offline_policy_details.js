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
            // const res = await Api.get(`api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/get/policy/${this.state.policy_id}`);

        const res ={
            "pfwmessage": "Success",
            "pfwstatus_code": 200,
            "pfwutime": "",
            "pfwtime": "2020-11-30 23:08:59.567507",
            "pfwresponse": {
              "requestapi": "",
              "status_code": 200,
              "result": [{
                "message": "success",
                "id": "",
                "product_name": "CARE",
                "provider": "",
                "name": "FISDOM",
                "cover_amount": "10,000",
                "cover_period": "3",
                "term": "",
                "policy_type": "INDIVIDUAL",
                "policy_number": "XXXXX1234567",
                "application_number": "XXXXX123457",
                "dt_policy_issued": "25/02/2020",
                "dt_policy_start_date": "25/02/2020",
                "dt_policy_end_date": "05/02/2029",
                "premium": "100000",
                "tax": "1345",
                "total_premium": "1,50,000",
                "mobile_no": "9738950664",
                "email": "FISDOM@FISDOM.COM",
                "status": "pending",
                "is_group_customer": "",
                "frequency": "MONTHLY",
                "dt_next_renewal": "25/02/2025",
                "product_category": ""
              }]
            }
          }

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result[0];
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
        let {provider} = this.state;console.log(this.state.providerData,'this.state.providerData')

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
                                    {this.state.lead.name}
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
                                {this.state.lead.name}
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
                                    {this.state.lead.mobile_no}
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
                                    {this.state.lead.email}
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
                                    {this.state.lead.tenure} year{this.state.lead.tenure>'1' && <span>s</span>}
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
                                    {getCoverageType(this.state.lead)}
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
                                            <div>{inrFormatDecimal(this.state.lead.tax)} </div>
                                            <div style={{fontSize:10}}>(18% GST) </div>
                                        </div>
                                        <div>
                                        &nbsp;=&nbsp;
                                        </div>
                                        <div>
                                         {inrFormatDecimal(this.state.lead.total_premium)}
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


                    {this.state.lead.dt_policy_end_date && 
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_end_date.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            Policy End date
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_policy_end_date || '-'}
                            </div>
                        </div>
                    </div>}
                </div>
            </Container>
        );
    }
}

export default GroupHealthReportDetails;