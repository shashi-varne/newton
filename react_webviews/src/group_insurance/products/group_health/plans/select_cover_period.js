import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';

import { storageService, inrFormatDecimal } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanSelectCoverPeriod extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data: [],
            show_loader: true
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);

    }


    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        this.setState({
            selectedIndex: this.state.groupHealthPlanData.selectedIndexCover || 0
        })

        let type_of_plan = this.state.groupHealthPlanData.post_body.type_of_plan;
        try {

            let body = this.state.groupHealthPlanData.post_body;
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/premium', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    premium_data: resultData.premium[0][type_of_plan],
                    type_of_plan: type_of_plan
                }, () => {
                    this.updateBottomPremium();
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
        let post_body = groupHealthPlanData.post_body;

        let plan_selected_final = this.state.premium_data[this.state.selectedIndex];
        groupHealthPlanData.plan_selected_final = plan_selected_final;
        post_body.tenure = plan_selected_final.tenure;
        post_body.tax_amount = plan_selected_final.gst_tax;
        post_body.base_premium = plan_selected_final.base_premium;
        post_body.premium = plan_selected_final.net_premium;
        post_body.total_amount = plan_selected_final.total_amount;
        post_body.discount_amount = plan_selected_final.total_discount;
        post_body.insured_pattern = plan_selected_final.insured_pattern;
        post_body.plan_code = groupHealthPlanData.plan_selected_final.plan_code;
        groupHealthPlanData.post_body.tenure  = plan_selected_final.tenure;
        groupHealthPlanData.tenure = plan_selected_final.tenure;

        groupHealthPlanData.selectedIndexCover = this.state.selectedIndex;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        this.navigate('plan-premium-summary');
    }

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index
        }, () => {
            this.updateBottomPremium();
        });

    }

    renderPlans = (props, index) => {
        return (

            <div onClick={() => this.choosePlan(index, props)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="flex-column">
                        <div className="name">
                            {props.tenure} year{props.tenure !== "1" && <span>s</span>} for {inrFormatDecimal(props.base_premium)}
                        </div>
                       {props.total_discount > 0 && 
                            <div className="flex" style={{margin: '4px 0 0 0'}}>
                            <img style={{ width: 10 }} src={require(`assets/ic_discount.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>save {inrFormatDecimal(props.total_discount)} </span>
                        </div>
                        }
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>


                </div>
            </div >
        )
    }



    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Select cover period"
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <div className="common-top-page-subtitle flex-between-center">
                    The period for which health expenses will be covered
                 <img 
                        className="tooltip-icon"
                        data-tip="As premium increases by insurer age, policy with longer cover period reduces the overall premium. 70% of our user has taken cover for 3 year period."
                        src={require(`assets/${this.state.productName}/info_icon.svg`)}
                        alt="" />
                </div>
                <div className="group-health-plan-select-sum-assured">

                    <div className="generic-choose-input">
                        {this.state.premium_data.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanSelectCoverPeriod;