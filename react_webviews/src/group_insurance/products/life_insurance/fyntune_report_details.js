import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import {
    numDifferentiationInr, formatAmountInr , capitalizeFirstLetter
} from 'utils/validators';
import Api from 'utils/api';
import {fyntuneConstants} from './constants';
import { storageService } from '../../../utils/validators';
import {Imgc} from 'common/ui/Imgc';

class FyntuneReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            policy_data: {
                cssMapper: {}
            },
            productName: getConfig().productName,
            fyntune_ref_id: this.props.match.params.policy_id
        }
    }

    setErrorData = (type) => {

        this.setState({
          showError: false
        });
        if(type) {
          let mapper = {
            'onload':  {
              handleClick1: this.onload,
              button_text1: 'Fetch again',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleClick,
              button_text1: 'Retry',
              handleClick2: () => {
                this.setState({
                  showError: false
                })
              },
              button_text2: 'Edit'
            }
          };
      
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
    }


    onload = async () =>{
        this.setErrorData("onload");
        let error='';
        let errorType='';
        this.setState({skelton: true})
        
        try {

            const res = await Api.get(`api/ins_service/api/insurance/fyntune/get/policy/${this.state.fyntune_ref_id}`);
            var resultData = res.pfwresponse.result;

            if(res.pfwresponse.status_code === 200){
                this.setState({
                    skelton: false
                });
                let policy_data = resultData.policy_data || {};
                
                policy_data.dt_policy_end = policy_data.dt_policy_end && policy_data.dt_policy_end.substring(0,10);
                policy_data.dt_policy_start = policy_data.dt_policy_start &&  policy_data.dt_policy_start.substring(0,11);
                
                let final_status = fyntuneConstants.fyntune_policy_report_status_mapper[policy_data.status]
                storageService().setObject('reportSelectedTab', fyntuneConstants.fyntune_policy_report_status_mapper[policy_data.status].reportTab)
                policy_data.final_status = final_status; 
                
                let sanchay_subtitle = policy_data.product_subtitle ? policy_data.product_subtitle : '';

                this.setState({
                    policy_data: policy_data,
                    sanchay_subtitle
                })


            } else {
                error = resultData.error || resultData.message || true;
            }
        } catch (err) {
            console.log(err)
            this.setState({
                skelton: false
            });
            error = true;
            errorType = "crash";
        }
        if (error) {
            this.setState({
                errorData: {
                    ...this.state.errorData,
                    title2: error,
                    type: errorType
                },
                showError: "page",
            });
        }
    }
    async componentDidMount() {
        this.onload()        
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {
        this.setState({
            showPlanDetails: false
        })
    }

    sendEvents(user_action) {
 
        let eventObj = {
            "event_name": 'portfolio',
            "properties": {
                "user_action": user_action,
                'policy': 'Life insurance',
                'provider_name': 'HDFC Life',
                'policy_status': this.state.policy_data.status ? capitalizeFirstLetter(this.state.policy_data.status) : '',
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

    render() {
        
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={'Insurance Savings Plan'}
                fullWidthButton={true}
                buttonTitle="OK"
                onlyButton={true}
                handleClick={() => this.handleClick()}
                noFooter={true}
            >
                <div className="group-health-plan-details group-health-final-summary group-health-life-insurance">

                    <div className={`report-color-state`}>
                        <div className="circle" style={{background:this.state.policy_data.final_status && this.state.policy_data.final_status.color }} ></div>
                        <div className="report-color-state-title" style={{color: this.state.policy_data.final_status && this.state.policy_data.final_status.color}}>{this.state.policy_data.final_status && this.state.policy_data.final_status.text }</div>
                    </div> 
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                        {this.state.policy_data.product_title && <h3 style={{margin: "0px 0px",fontSize: '20px',lineHeight: '24px', fontWeight:'bold'}}> {this.state.policy_data.product_title}</h3> }
                        
                        {this.state.policy_data && this.state.policy_data.insurance_type === 'Saving' ? 
                        <span style={{margin: "0 0 20px 0",fontSize: '15px',lineHeight: '24px',fontWeight:'400'}}>{this.state.sanchay_subtitle}</span> 
                        : null}
                        </div>

                        <div className="tc-right">
                            <Imgc className="insurance-logo-top-right" src={this.state.policy_data.logo} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                    <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/icn_identity.svg`)} alt="" />
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
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    INSURANCE TYPE
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.insurance_type === 'Ulip' ? this.state.policy_data.insurance_type.toUpperCase() : this.state.policy_data.insurance_type}
                                </div>
                            </div>
                        </div>


                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
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
                        
                        {this.state.policy_data.add_ons && (
                            <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    ADD ONS
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.add_ons}
                                </div>
                            </div>
                        </div>)}
                        
                        {/* { this.state.policy_data.insurance_type === 'Ulip' && (
                            <div className="member-tile-fyntune">
                                <div className="mt-left-fyntune">
                                    <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/certificate-rs.svg`)} alt="" />
                                </div>
                                <div className="mt-right-fyntune">
                                    <div className="mtr-top-fyntune">
                                        INVESTMENT FUND
                                    </div>
                                    <div className="mtr-bottom-fyntune">
                                        {this.state.policy_data.type_investment_fund ? this.state.policy_data.type_investment_fund : '-'}
                                    </div>
                                </div>
                            </div>
                        )} */}
                    
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/calender-rs.svg`)} alt="" />
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
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    POLICY TERM
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.tenure} years
                                </div>
                            </div>
                        </div>

                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM AMOUNT
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {formatAmountInr(this.state.policy_data.premium)}
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/hourglass.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM PAYMENT TERM
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.premium_payment_term} years
                                </div>
                            </div>
                        </div>
                        <div className="member-tile-fyntune">
                            <div className="mt-left-fyntune">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/cash-payment.svg`)} alt="" />
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
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_date_payment.svg`)} alt="" />
                            </div>
                            <div className="mt-right-fyntune">
                                <div className="mtr-top-fyntune">
                                    PREMIUM DUE DATE
                                </div>
                                <div className="mtr-bottom-fyntune">
                                    {this.state.policy_data.dt_policy_end ? this.state.policy_data.dt_policy_end : '-' }
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