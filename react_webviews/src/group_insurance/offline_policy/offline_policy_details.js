import React, { Component } from 'react';
import Container from '../common/Container'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {
    inrFormatDecimal, capitalizeFirstLetter , numDifferentiationInr
} from 'utils/validators';
import Api from 'utils/api';
import toast from  '../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import ReactHtmlParser from 'react-html-parser';

import { getCssMapperReport ,  TitleMaper , ProviderName } from '../constants'

class GroupHealthReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName : getConfig().productName,
            lead: {},
            policy_data: {
                cssMapper: {}
            },
            show_loader: true,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits,
            // TitleMaper : {}
        }
    }

    componentWillMount() {  
      const { policy_id } = this.props.match.params;
        this.setState({
            policy_id: policy_id
        })
    }

    async componentDidMount() {

        try {
            const res = await Api.get(`api/insurancev2/api/insurance/o2o/get/applications?o2o_app_id=${this.state.policy_id}`);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result.result[0];
            var policy_data = getCssMapperReport(resultData)
            if (res.pfwresponse.status_code === 200) {
                this.setState({
                    lead: resultData,
                    policy_data : policy_data
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
        let providor_name = ProviderName(this.state.lead.provider)
        let eventObj = {
            "event_name": 'portfolio',
            "properties": {
                "user_action": user_action,
                'policy': TitleMaper(this.state.lead.policy_type),
                'provider_name': capitalizeFirstLetter(providor_name),
                'policy_status': this.state.lead.status,
                "screen_name": 'policy_details',
                "how_to_claim": this.state.how_to_claim_clicked ? 'yes' : 'no',
                "plan_details": this.state.plan_details_clicked ? 'yes': 'no',
                'download_policy': 'no',
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

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                // title={ this.state.TitleMaper[this.state.lead.policy_type] ? this.state.TitleMaper[this.state.lead.policy_type]  : ''}
                title = {TitleMaper(this.state.lead.policy_type)}
                fullWidthButton={true}
                buttonTitle="OK"
                onlyButton={true}
                handleClick={() => this.handleClick()}
                noFooter={!this.state.showPlanDetails}
            >
                <div className="group-health-plan-details group-health-final-summary">

                    <div style={{ margin: '20px 0 14px 0' }} className={`report-color-state ${this.state.policy_data.cssMapper.color}`}>
                        <div className="circle" style={{backgroundColor: this.state.policy_data.cssMapper.color}}></div>
                        <div className="report-color-state-title" style={{color: this.state.policy_data.cssMapper.color}}>{this.state.policy_data.cssMapper.disc}</div>
                    </div>
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            {/* <div className="tc-title">{this.state.lead.provider === 'Hdfc Ergo' ? 'HDFC Ergo'  : capitalizeFirstLetter(this.state.lead.provider)}</div> */}
                            <div className="tc-subtitle">{this.state.lead.product_name === 'Hdfc Ergo' ? 'HDFC Ergo' : capitalizeFirstLetter(this.state.lead.product_name)}</div>
                        </div>

                        <div className="tc-right">
                        <img style={{ width: 50 }} src={this.state.lead.logo} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'> 

                    { this.state.lead.customer_name && 
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
                        </div> }       

                    { this.state.lead.customer_name &&
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
                        </div>}

                        { this.state.lead.mobile_number &&
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
                        </div>}

                         {this.state.lead.email_id &&
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/icn_mail_id.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                EMAIL ID
                                </div>
                                <div className="mtr-bottom" style={{textTransform:'lowercase'}}>
                                    {this.state.lead.email_id}
                                </div>
                            </div>
                        </div>}

                        {this.state.lead.policy_number &&
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
                        </div>}

                        {!this.state.lead.policy_number &&  this.state.lead.application_number &&
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                PROPOSAL NUMBER
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.application_number}
                                </div>
                            </div>
                        </div>}

                        {this.state.lead.total_amount &&
                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                               {this.state.lead.policy_type === 'Motor' ? 'IDV' : this.state.lead.policy_type === 'Life' ?  'SUM ASSURED'  : 'SUM INSURED'}
                                </div>
                                <div className="mtr-bottom">
                                    {numDifferentiationInr(this.state.lead.cover_amount)} 
                                </div>
                            </div>
                        </div>}

                         {this.state.lead.cover_period &&
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
                        </div>}

                       {this.state.lead.plan_type && 
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
                                    {this.state.lead.premium_paying_term} year{this.state.lead.cover_period>'1' && <span>s</span>}
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
                                            <div> {inrFormatDecimal(this.state.lead.premium)} </div>
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

                    {this.state.lead.frequency &&
                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_payment_frequency.svg`)} alt="" />  
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            Payment frequency
                                </div>
                            <div className="mtr-bottom">
                                 {this.state.lead.frequency === 'Single'? 'One Time Payment' : this.state.lead.frequency}
                            </div>
                        </div>
                    </div>}

                     {this.state.lead.dt_policy_issued  &&
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
                    </div>}

                    {this.state.lead.dt_policy_start && 
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_start_date_1.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            POLICY START DATE
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_policy_start || '-'}
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

                    {this.state.lead.dt_next_renewal && 
                      <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/icn_start_date_1.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                            RENEWAL START DATE
                                </div>
                            <div className="mtr-bottom">
                                {this.state.lead.dt_next_renewal || '-'}
                            </div>
                        </div>
                    </div>}
                </div>
            </Container>
        );
    }
}

export default GroupHealthReportDetails;