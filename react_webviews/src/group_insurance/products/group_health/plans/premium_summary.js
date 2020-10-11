import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { ghGetMember } from '../../../constants';
import { storageService } from 'utils/validators';
import { initialize } from '../common_data';
import BottomInfo from '../../../../common/ui/BottomInfo';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ReligarePremium from '../religare/religare_premium';
import HDFCPremium from '../hdfc/hdfc_premium';
import StarPremium from '../Star/star_premium';
class GroupHealthPlanPremiumSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: [],
            plan_selected_final: {},
            final_dob_data: [],
            show_loader: true,
            plan_selected: {},
            provider: this.props.match.params.provider,
        };

        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData || {};
        let group_health_landing = '/group-insurance/group-health/entry';

        if (!groupHealthPlanData.post_body) {
            this.navigate(group_health_landing);
            return;
        } else {
            this.setState({
                show_loader: false
            });
        }


        let post_body = groupHealthPlanData.post_body;

        this.setState({
            plan_selected_final: groupHealthPlanData.plan_selected_final,
            total_member: post_body.mem_info.adult + post_body.mem_info.child,
            type_of_plan: groupHealthPlanData.type_of_plan,
            final_dob_data: groupHealthPlanData.final_dob_data,
        });
            let groupHealthPlanDataPost = this.state.groupHealthPlanData;

            let plan_selected_final = groupHealthPlanDataPost.plan_selected_final || {};
            let body = groupHealthPlanDataPost.post_body;
            body.provider = this.state.providerConfig.provider_api;
            body.base_premium_showable = plan_selected_final.base_premium_showable;
            body.add_ons_amount = plan_selected_final.add_ons_premium || '';

            if(body.provider === 'star' && body.account_type.includes('parents') && 
            groupHealthPlanDataPost.ui_members.parents_option) {
                body.account_type = groupHealthPlanDataPost.ui_members.parents_option;
            }

            let total_member = body.mem_info.adult + body.mem_info.child;
            if(total_member === 1) {
                body.type_of_plan = 'NF';  //for backend handlling
            }
            
            try{
                const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/lead/quote`, body);
                this.setState({response: res});
            }catch(e){
                toast('Something went wrong');
            }
            
            storageService().remove('backToResume');
            storageService().remove('final-summary-reached');    
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'premium summary',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        this.sendEvents('next');
        try {

            this.setState({
                show_loader: true
            });
            let res = this.state.response;
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                let lead = resultData.lead;
                lead.member_base = ghGetMember(lead, this.state.providerConfig);
                storageService().set('ghs_ergo_quote_id', lead.id);
                this.navigate('personal-details/' + lead.member_base[0].key);
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

    renderProviderPremium() {
        const premiumComponentMap = {
            religare: <ReligarePremium {...this.state} />,
            hdfcergo: <HDFCPremium {...this.state} />,
            star: <StarPremium {...this.state} />
        };
        return premiumComponentMap[this.state.provider.toLowerCase()];
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
                            <div className="tc-title">{this.state.groupHealthPlanData.base_plan_title || this.state.providerData.title}</div>
                            <div className="tc-subtitle">{this.state.plan_selected.plan_title}</div>
                        </div>
                    </div>
                    
                    {this.renderProviderPremium()}

                    <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical treatments at affordable cost' }} />

                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanPremiumSummary;