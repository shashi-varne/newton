import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
// import { getConfig } from 'utils/functions';

import { storageService, inrFormatDecimal, numDifferentiationInr } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanSelectFloater extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data_floater: [],
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
            selectedIndex: this.state.groupHealthPlanData.selectedIndexFloater || 0
        });

        try {

            let body = this.state.groupHealthPlanData.post_body;
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/premium', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            console.log(resultData.premium);
            if (res.pfwresponse.status_code === 200) {

                let premium_data_nf = resultData.premium[0].NF[0];
                let premium_data_wf = resultData.premium[0].WF[0];


                let premium_data_floater = [
                    {
                        'title': 'All the members',
                        'subtitle': 'in ' + inrFormatDecimal(premium_data_wf.premium_after_account_discount),
                        'discount': premium_data_wf.total_discount ? inrFormatDecimal(premium_data_wf.total_discount): '',
                        'key': 'wf'
                    },
                    {
                        'title': 'Each member individualy',
                        'subtitle': 'in ' + inrFormatDecimal(premium_data_nf.premium_after_account_discount),
                        'discount': premium_data_nf.total_discount ? inrFormatDecimal(premium_data_nf.total_discount) : '',
                        'key': 'nf'
                    }
                ];

                console.log(premium_data_nf);
                console.log(premium_data_wf);

                this.setState({
                    premium_data_floater: premium_data_floater
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
                        {props.discount && <div className="flex" style={{ margin: '4px 0 0 0' }}>
                            <img style={{ width: 10 }} src={require(`assets/completed_step.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>save {props.discount} </span>
                        </div>}
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
                        {this.state.premium_data_floater.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanSelectFloater;