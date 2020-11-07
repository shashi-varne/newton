import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';

import {
    numDifferentiationInr, 
} from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';


class FyntuneReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: {
                WF: []
            },
            policy_data: {
                cssMapper: {}
            },
            show_loader: false,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits,
        }
    }

    async componentDidMount() {

        const { policy_id } = this.props.match.params;
        try {

            const res = await Api.get(`api/ins_service/api/insurance/fyntune/get/policy/${policy_id}`);

            this.setState({
                show_loader: false
            });
            
            var resultData = res.pfwresponse.result;
            if(res.pfwresponse.status_code === 200){
                let policy_data = resultData.policy_data || {};

                this.setState({
                    policy_data: policy_data,
                })


            } else {
                toast(resultData.error || resultData.message || 'Something went wrong');
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
        // let eventObj = {
        //     "event_name": 'health_insurance',
        //     "properties": {
        //         "user_action": user_action,
        //         "product": this.state.providerConfig.provider_api,
        //         "flow": this.state.insured_account_type || '',
        //         "screen_name": 'report details',
        //         "how_to_claim": this.state.how_to_claim_clicked ? 'yes' : 'no',
        //         "plan_details": this.state.plan_details_clicked ? 'yes': 'no'
        //     }
        // };

        // if (user_action === 'just_set_events') {
        //     return eventObj;
        // } else {
        //     nativeCallback({ events: eventObj });
        // }
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
                title={'Insurance Savings Plan'}
                fullWidthButton={true}
                buttonTitle="OK"
                onlyButton={true}
                handleClick={() => this.handleClick()}
                noFooter={true}
            >
                <div className="group-health-plan-details group-health-final-summary group-health-life-insurance">

                    <div className={`report-color-state`}>
                        <div className="circle" style={{backgroundColor: '#78CE5D'}}></div>
                        <div className="report-color-state-title" style={{color: '#78CE5D'}}>ISSUED ON {this.state.policy_data.dt_policy_start}</div>
                    </div>
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <h2 style={{margin: "0px 0px"}}>Sanchay Plus</h2>
                            <p style={{margin: "5px 0px"}}>(Gauranteed Income)</p>
                        </div>

                        <div className="tc-right">
                            <img src={this.state.policy_data.logo} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                    <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/icn_identity.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    INSURED NAME
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.name}
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_hs_policy.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    INSURANCE TYPE
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.insurance_type}
                                </div>
                            </div>
                        </div>


                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    SUM ASSURED
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {numDifferentiationInr(this.state.policy_data.sum_assured)}
                                </div>
                            </div>
                        </div>
                        
                        {this.state.policy_data.insurance_type !== "" && (
                            <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    ADD ONS
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.add_ons_amount}
                                </div>
                            </div>
                        </div>
                            )
                        }
                        
                        { this.state.policy_data.insurance_type === 'ULIPs' && (
                            <div className="member-tile-fyntune">
                                <div className="mt-left-fyntune">
                                    <img src={require(`assets/fisdom/certificate-rs.svg`)} alt="" />
                                </div>
                                <div className="mt-right-fyntune">
                                    <div className="mtr-top-fyntune">
                                        INVESTMENT FUND
                                    </div>
                                    <div className="mtr-bottom-fyntune">
                                        {this.state.policy_data.type_investment_fund}
                                    </div>
                                </div>
                            </div>
                        
                        )}
                    
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/calender-rs.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PAYOUT TYPE
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.payout_type}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    POLICY TERM
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.tenure}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM AMOUNT
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.premium}
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/hourglass.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM PAYMENT TERM
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.premium_payment_term}
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/cash-payment.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM PAYMENT FREQUENCY
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.premium_payment_freq}
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <img src={require(`assets/fisdom/ic_date_payment.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM DUE DATE
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.dt_policy_end}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default FyntuneReportDetails;