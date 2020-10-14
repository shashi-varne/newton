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
            get_lead: storageService().getObject('resumeToPremium') ? true : false,
            force_onload_call: true,
            provider: this.props.match.params.provider,
        };

        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload =()=>{
        let properties = {}
        let lead = this.state.lead;
        let groupHealthPlanDataProp = this.state.groupHealthPlanData;
            if(this.state.get_lead){
                properties.add_ons = lead.add_ons;
                properties.type_of_plan = lead.cover_type;
                properties.sum_assured = lead.sum_assured;
                properties.total_members = lead.member_base.length;
                properties.members = lead.member_base;
                properties.tenure = lead.tenure;
                properties.base_premium = lead.base_premium + lead.discount_amount;
                properties.discount_amount = lead.discount_amount;
                properties.net_premium = lead.premium;
                properties.gst_tax = lead.tax_amount;
                properties.total_amount = lead.total_amount;
            }else{
                properties.add_ons = groupHealthPlanDataProp.add_ons_data || '';
                properties.type_of_plan = groupHealthPlanDataProp.type_of_plan;
                properties.sum_assured = groupHealthPlanDataProp.sum_assured;
                properties.total_members = groupHealthPlanDataProp.post_body.mem_info.adult + groupHealthPlanDataProp.post_body.mem_info.child,
                properties.members = groupHealthPlanDataProp.final_dob_data;
                properties.tenure = groupHealthPlanDataProp.plan_selected_final.tenure;
                properties.base_premium = groupHealthPlanDataProp.plan_selected_final.base_premium; 
                properties.net_premium = groupHealthPlanDataProp.plan_selected_final.net_premium;
                properties.gst_tax = groupHealthPlanDataProp.plan_selected_final.gst_tax;
                properties.discount_amount = groupHealthPlanDataProp.plan_selected_final.total_discount;
                properties.total_amount = groupHealthPlanDataProp.plan_selected_final.total_amount;
            }
        this.setState({properties: properties});
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

        if(this.state.get_lead){

            let member = this.state.lead.member_base[0].relation.toLowerCase();
            this.navigate(`personal-details/${member}`);
            return;
        }else{
            try {
                this.setState({
                    show_loader: true
                });
    
                let {groupHealthPlanData} = this.state;
                let plan_selected_final = groupHealthPlanData.plan_selected_final || {};
                let body = groupHealthPlanData.post_body;
                body.provider = this.state.providerConfig.provider_api;
                body.base_premium_showable = plan_selected_final.base_premium_showable;
                body.add_ons_amount = plan_selected_final.add_ons_premium || '';
    
                if(body.provider === 'star' && body.account_type.includes('parents') && 
                groupHealthPlanData.ui_members.parents_option) {
                    body.account_type = groupHealthPlanData.ui_members.parents_option;
                }
    
                let total_member = body.mem_info.adult + body.mem_info.child;
                if(total_member === 1) {
                    body.type_of_plan = 'NF';  //for backend handlling
                }
                console.log('body', body)
                const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/lead/quote`, body);
                
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
        
    }

    renderProviderPremium() {
    
        const premiumComponentMap = {
            religare: <ReligarePremium properties={this.state.properties} />,
            hdfcergo: <HDFCPremium properties={this.state.properties} />,
            star: <StarPremium properties={this.state.properties} />
        };
        return premiumComponentMap[this.state.provider.toLowerCase()];
    }

    render() {
        console.log('plan data', this.state.groupHealthPlanData);
        console.log('lead', this.state.lead);
        console.log('state', this.state.properties);
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
                    {
                        this.state.properties && this.renderProviderPremium()
                    }
                    {/* {()=>this.renderProviderPremium(this.state.properties)} */}

                    <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical treatments at affordable cost' }} />

                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanPremiumSummary;