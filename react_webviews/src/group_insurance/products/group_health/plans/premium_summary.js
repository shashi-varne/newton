import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';

import { storageService, inrFormatDecimal , numDifferentiationInr} from 'utils/validators';
import { initialize } from '../common_data';
import BottomInfo from '../../../../common/ui/BottomInfo';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanPremiumSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: [],
            post_body: {}
        }

        this.initialize = initialize.bind(this);

    }


    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        this.setState({
            post_body : this.state.groupHealthPlanData.post_body
        })
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

     handleClick = async() => {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        

        try {

            this.setState({
                show_loader: true
            });

            let body = this.state.groupHealthPlanData.post_body;
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/quote', body);
            
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                console.log(resultData);
                groupHealthPlanData.lead = resultData.lead;
                storageService().setObject('groupHealthPlanData', groupHealthPlanData);
                this.navigate('personal-details/self');
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
                            <div className="pi-tile-right">{numDifferentiationInr(this.state.post_body.sum_assured)}</div>
                        </div>

                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">Cover period</div>
                            <div className="pi-tile-right">{this.state.post_body.tenure} year</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="page-title">
                        Premium details
                        </div>

                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">Base premium</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.post_body.base_premium)}</div>
                        </div>

                        <div className="flex-between pi-tile">
                            <div className="pi-tile-left">GST & other taxes</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.post_body.tax_amount)}</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="flex-between pi-tile" style={{fontWeight:600}}>
                            <div className="pi-tile-left">Total payable</div>
                            <div className="pi-tile-right">{inrFormatDecimal(this.state.post_body.total_amount)}</div>
                        </div>

                        <div className="generic-hr"></div>
                    </div>

                    <BottomInfo baseData={{'content': 'Complete your details and get quality medical treatments at affordable cost'}} />

                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanPremiumSummary;