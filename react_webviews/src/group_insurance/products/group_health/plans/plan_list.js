import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import { storageService, inrFormatDecimal } from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
class GroupHealthPlanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData') || {},
            show_loader: true,
            plan_data: {
                coverplan: []
            }
        }
    }

    componentWillMount() {
        this.setState({
            providerData: health_providers[this.state.provider],
        })
    }

    async componentDidMount() {
        try {

            let body = {
                "city": "MUMBAI",
                "account_type": "selfandfamily",
                "mem_info": {
                    "adult": "2",
                    "child": "1"
                },
                "self_account_key": { "dob": "05/09/1995" },
                "spouse_account_key": { "dob": "05/09/1996" },
                "child_account1_key": { "dob": "05/09/2014" }


            }
            const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/coverplan', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            console.log(resultData);
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    plan_data: resultData
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

    selectPlan = (plan, index) => {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.plan_selected = plan 
        storageService().setObject('groupHealthPlanData', groupHealthPlanData);

        this.navigate('plan-details');
    }

    renderPlans = (props, index) => {
        return (
            <div className="tile" key={index}>
                <div className="recommendation">{props.recommendation_tag}</div>
                <div className="group-health-top-content-plan-logo">
                    <div className="left">
                        <div className="tc-title">{this.state.plan_data.common.base_plan_title}</div>
                        <div className="tc-subtitle">{props.plan_title}</div>
                    </div>
                    <div className="tc-right">
                        <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                    </div>
                </div>

                <div className="plan-info">
                    <div className="pi-tile">
                        <div className="pi-left">Sum assured:</div>
                        <div className="pi-right">{props.sum_assured_options_text}</div>
                    </div>
                    <div className="pi-tile">
                        <div className="pi-left">Recovery benefit:</div>
                        <div className="pi-right">{props.recovery_benefit_extra}</div>
                        <div className="info-img">
                            <img src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                        </div>
                    </div>
                    <div className="pi-tile">
                        <div className="pi-left">Allowances:</div>
                        <div className="pi-right">{props.allowances}</div>
                    </div>
                </div>

                <div className="bottom-cta" onClick={() => this.selectPlan(props, index)}>
                    starts at {inrFormatDecimal(props.premium)}/year
                </div>
            </div>
        );
    }


    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="3 smart plans to choose from!"
                noFooter={true}
                onlyButton={true}
            >
                <div className="group-health-plan-list">
                    <div className="tiles">
                        {this.state.plan_data.coverplan.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanList;