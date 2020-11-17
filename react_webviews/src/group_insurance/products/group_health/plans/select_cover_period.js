import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { inrFormatDecimal } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import GenericTooltip from '../../../../common/ui/GenericTooltip'
import { getConfig } from 'utils/functions';
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
        let type_of_plan = this.state.groupHealthPlanData.post_body.floater_type;
        let post_body = this.state.groupHealthPlanData.post_body;
        
        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', "plan_id","si"];        
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['add_ons'] = post_body.add_ons_array;

        if(this.state.groupHealthPlanData.account_type === "self" || Object.keys(this.state.groupHealthPlanData.post_body.member_details).length === 1){
            body['floater_type'] = 'non_floater';
        }
        try {
           
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,
            body);
            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            
            if (res.pfwresponse.status_code === 200){
                
                this.setState({
                    premium_data: resultData.premium_details,
                    type_of_plan: type_of_plan
                }, () => {
                    this.updateBottomPremium(this.state.premium_data[0].premium);
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
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'select cover period',
                'cover_period' : ((this.state.premium_data || [])[(this.state.selectedIndex || 0)] || {}).tenure || ''
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
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;
        let plan_selected_final = this.state.premium_data[this.state.selectedIndex];
        

        let allowed_post_body_keys = ['adults', 'children', 'city', 'plan_id', 'member_details', 'si', 'floater_type'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['tenure'] = plan_selected_final.tenure;
        body['add_ons'] = post_body.add_ons_array;

        if(this.state.groupHealthPlanData.account_type === "self" || Object.keys(this.state.groupHealthPlanData.post_body.member_details).length === 1){
            body['floater_type'] = 'non_floater';
        }

        this.setState({
            show_loader: true
        });

        try{
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`, body);

            if (res.pfwresponse.status_code === 200){
                var resultData = res.pfwresponse.result;
                plan_selected_final = resultData.premium_details;
            }else{
                toast(res.pfwresponse.result.error || res.pfwresponse.results.message
                    || 'Something went wrong');
            }
        }catch(err){
            console.log(err);
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }

        groupHealthPlanData.plan_selected_final = plan_selected_final;
        post_body.add_ons = plan_selected_final.add_on_premium;
        post_body.tenure = plan_selected_final.tenure;
        post_body.total_discount = plan_selected_final.total_discount;
        post_body.gst = plan_selected_final.gst[1] || 0;
        post_body.tax_amount = plan_selected_final.gst[1] || 0;
        post_body.base_premium = plan_selected_final.base_premium;
        post_body.individual_si = plan_selected_final.individual_si;
        post_body.total_si = plan_selected_final.total_si;
        post_body.premium = plan_selected_final.premium;
        post_body.family_discount = plan_selected_final.discount.family[1] || 0;
        post_body.tenure_discount = plan_selected_final.discount.tenure[1] || 0;
        post_body.total_amount = plan_selected_final.premium_after_tax;
        post_body.net_premium = plan_selected_final.premium;
        post_body.plan_code = groupHealthPlanData.plan_selected_final.plan_code;
        groupHealthPlanData.selectedIndexCover = this.state.selectedIndex;
        this.setLocalProviderData(groupHealthPlanData);
        this.navigate('plan-premium-summary');
    }

    choosePlan = (index) => {
        this.setState({
            selectedIndex: index
        }, () => {
            this.updateBottomPremium(this.state.premium_data[this.state.selectedIndex].premium);
        });
    }
    
    renderPlans = (props, index) => {

        return (
            <div onClick={() => this.choosePlan(index, props)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="flex-column">
                        <div className="name">
                            {props.tenure} year{props.tenure !== "1" && <span>s</span>} for {inrFormatDecimal(props.premium)}
                        </div>
                       {this.state.type_of_plan === "floater" && props.discount.tenure[1] > 0 && (
                            <div className="flex" style={{margin: '4px 0 0 0'}}>
                            <img style={{ width: 10 }} src={require(`assets/ic_discount.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>save {inrFormatDecimal(props.discount.tenure[1])} </span>
                        </div>)
                        }
                        {this.state.type_of_plan === "non_floater" && props.discount.family[1] > 0 && 
                            <div className="flex" style={{margin: '4px 0 0 0'}}>
                            <img style={{ width: 10 }} src={require(`assets/ic_discount.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>save {inrFormatDecimal(props.discount.family[1])} </span>
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
            events={this.sendEvents("just_set_events")}
            showLoader={this.state.show_loader}
            title="Select cover period"
            buttonTitle="CONTINUE"
            withProvider={true}
            buttonData={this.state.bottomButtonData}
            handleClick={() => this.handleClick()}
          >
            <div className="common-top-page-subtitle flex-between-center">
              Health expenses will be covered for this period
              <GenericTooltip
                productName={getConfig().productName}
                content="As premium increases by insured age, policy with longer cover period reduces the overall premium.70% of our users have taken a cover for 3 years."
              />
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