import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
// import { getConfig } from 'utils/functions';

import { storageService, inrFormatDecimal, numDifferentiationInr, numDifferentiation } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanSelectFloater extends Component {

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
        try {

            console.log(this.state.groupHealthPlanData);
            let body = {
                "city": "MUMBAI",
                "account_type": "selfandfamily",
                "mem_info": {
                    "adult": "2",
                    "child": "1"
                },
                "self_account_key": { "dob": "05/09/1995" },
                "spouse_account_key": { "dob": "05/09/1996" },
                "child_account1_key": { "dob": "05/09/2014" },
                'plan': this.state.groupHealthPlanData.plan_selected.plan_type,
                "sum_assured": "400000"
            }
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/premium', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            console.log(resultData.premium);
            if (res.pfwresponse.status_code === 200) {

                let premium_data_nf = resultData.premium[0].NF[0];
                let premium_data_wf = resultData.premium[0].WF[0];


                let premium_data = [
                    {
                        'title': 'All the members',
                        'subtitle': 'in ' + inrFormatDecimal(premium_data_wf.net_premium),
                        'key': 'wf'
                    },
                    {
                        'title': 'Each member individualy',
                        'subtitle': 'in ' + inrFormatDecimal(premium_data_nf.net_premium),
                        'key': 'nf'
                    }
                ];

                this.setState({
                    premium_data: premium_data
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
        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        this.navigate('plan-list');
    }

    choosePlan = (index) => {
        console.log(this.state.premium_data[index]);
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
                            {props.title}
                        </div>
                        <div style={{ margin: '5px 0 5px 0', color: '#0A1D32', fontSize: 14, fontWeight: 400 }}>
                            {props.subtitle}
                        </div>
                        <div className="flex" style={{ margin: '4px 0 0 0' }}>
                            <img style={{ width: 10 }} src={require(`assets/completed_step.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>save ₹200 </span>
                        </div>
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>


                </div>

                {props.key === 'nf' && index === this.state.selectedIndex &&
                    <div className="detail-info">
                        <div className="di-title">Sum assured</div>
                        <div className="flex-between di-tile">
                            <div className="di-tile-left">3 lacs x 3</div>
                            <div className="di-tile-right">{numDifferentiationInr(900000)}</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="di-title">Details</div>

                        <div className="di-sum-assured-data">

                        </div>

                        <div className="generic-hr"></div>

                        <div className="flex-between di-tile">
                            <div className="di-tile-left">Base premium</div>
                            <div className="di-tile-right">{inrFormatDecimal(18180)}</div>
                        </div>
                        <div className="flex-between di-tile">
                            <div className="di-tile-left">10% discount</div>
                            <div className="di-tile-right">{inrFormatDecimal(1080)}</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="flex-between di-tile">
                            <div className="di-tile-left">Total premium</div>
                            <div className="di-tile-right">{inrFormatDecimal(17100)}</div>
                        </div>
                        <div className="generic-hr"></div>
                    </div>
                }
            </div >
        )
    }



    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={'3 lacs sum assured For'}
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <div className="common-top-page-subtitle flex-between-center">
                    The period for which health expenses will be covered
                 <img
                        data-tip="As premium increases by insurer age, policy with longer cover period reduces the overall premium. 70% of our user has taken cover for 3 year period."
                        src={require(`assets/${this.state.productName}/info_icon.svg`)}
                        alt="" />
                </div>
                <div className="group-health-plan-select-floater">

                    <div className="generic-choose-input">
                        {this.state.premium_data.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanSelectFloater;