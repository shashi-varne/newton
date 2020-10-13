import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
// import { getConfig } from 'utils/functions';

import {  inrFormatDecimal, numDifferentiationInr, numDifferentiation, calculateAge } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';

import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { childeNameMapper } from '../../../constants';
class GroupHealthPlanSelectFloater extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data_floater: [],
            show_loader: true,
            disableFloaterOption: false,
            screen_name: 'cover_type_screen'
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);

    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {


        let post_body = this.state.groupHealthPlanData.post_body;
        let selectedIndex = this.state.groupHealthPlanData.selectedIndexFloater || 0;
        let total_member = post_body.mem_info.adult + post_body.mem_info.child;
        this.setState({
            selectedIndex: selectedIndex,
            sum_assured: this.state.groupHealthPlanData.sum_assured || post_body.sum_assured,
            total_member: total_member,
            show_ind_mem_premium: this.state.providerConfig.show_ind_mem_premium
        });

        if(post_body.mem_info.child > 0){
            for(var key in post_body){
                    if(key.includes('child') && calculateAge(post_body[key].dob, false) < 5){
                        this.setState({disableFloaterOption: true });
                    }
            }
        }
        
        try {

            const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/premium`,
             post_body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                
                let premium_data_wf = resultData.premium.WF[0];
                let premium_data_nf = resultData.premium.NF[0];

                let premium_data_floater = [
                    {
                        'title': `${numDifferentiationInr(this.state.sum_assured)} for entire family`,
                        'premium': premium_data_wf.net_premium,
                        'subtitle': 'in ' + inrFormatDecimal(premium_data_wf.net_premium),
                        'discount': premium_data_wf.account_type_discount_percentage ? parseFloat(premium_data_wf.account_type_discount_percentage) : '',
                        'key': 'WF'
                    },
                    {
                        'title': `${numDifferentiationInr(this.state.sum_assured)} for each member`,
                        'subtitle': `${numDifferentiationInr(this.state.sum_assured * total_member)}
                                         sum insured in ${inrFormatDecimal(premium_data_nf.net_premium)} `,
                        'premium': premium_data_nf.net_premium,
                        'discount': premium_data_nf.account_type_discount_percentage ? parseFloat(premium_data_nf.account_type_discount_percentage) : '',
                        'key': 'NF'
                    }
                ];

                let ind_pre_data = [];

                let final_dob_data = this.state.groupHealthPlanData.final_dob_data;
                for (var i in final_dob_data) {
                    let mem = final_dob_data[i];
                    let backend_key = final_dob_data[i].backend_key;

                    if (premium_data_nf[backend_key]) {
                        let obj = {
                            name: numDifferentiation(this.state.sum_assured) + ' for ' + childeNameMapper(mem.key).toLowerCase(),
                            value: inrFormatDecimal(premium_data_nf[backend_key])
                        };
                        ind_pre_data.push(obj);
                    }
                }

                this.updateBottomPremium(premium_data_floater[selectedIndex].premium);

                this.setState({
                    premium_data_floater: premium_data_floater,
                    ind_pre_data: ind_pre_data,
                    premium_data_nf: premium_data_nf,
                    premium_data_wf: premium_data_wf,
                    premium_base: resultData.premium
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
                "screen_name": 'select sum Insured for',
                'sum_assured_for' : (this.state.premium_data_floater[this.state.selectedIndex || 0]  || {}).key === 'WF' ? 'complete family' : 'individual'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        this.sendEvents('next');
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let type_of_plan = this.state.premium_data_floater[this.state.selectedIndex].key;

        let selectedPlan = this.state.premium_base[type_of_plan][0]; //first of WF or NF;
        groupHealthPlanData.net_premium_addons = selectedPlan.net_premium;

        groupHealthPlanData.selectedIndexFloater = this.state.selectedIndex;
        groupHealthPlanData.type_of_plan = type_of_plan;
        groupHealthPlanData.post_body.type_of_plan = type_of_plan;

        groupHealthPlanData.post_body.base_premium = selectedPlan.base_premium;
        groupHealthPlanData.post_body.premium = selectedPlan.net_premium;
        
        this.setLocalProviderData(groupHealthPlanData);

        this.navigate(this.state.next_screen || 'plan-select-cover-period');
    }

    choosePlan = (index, props) => {
        if(props.key == "NF" && this.state.disableFloaterOption){
            return;
        }
        this.setState({
            selectedIndex: index
        }, () => {
            this.updateBottomPremium(this.state.premium_data_floater[index].premium);
        });

    }
    renderIndPlans = (props, index) => {
        return (
            <div key={index} className="flex-between di-tile">
                <div className="di-tile-left">{props.name}</div>
                <div className="di-tile-right">{props.value}</div>
            </div>
        );
    }

    renderPlans = (props, index) => {
        console.log(props);
        return (

            <div onClick={() => this.choosePlan(index, props)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''} ${this.state.disableFloaterOption && props.key == "NF" ? 'tile-disabled': ''}`} key={index}>
                <div className="select-tile">
                    <div className="flex-column">
                        <div className="name">
                            {props.title}
                        </div>
                        <div style={{ margin: '5px 0 5px 0', color: '#0A1D32', fontSize: 14, fontWeight: 400 }}>
                            {props.subtitle}
                        </div>
                        {props.discount > 0 && <div className="flex" style={{ margin: '4px 0 0 0' }}>
                            <img style={{ width: 10 }} src={require(`assets/completed_step.svg`)} alt="" />
                            <span style={{
                                color: '#4D890D', fontSize: 10,
                                fontWeight: 400, margin: '0 0 0 4px'
                            }}>Discount {props.discount}% </span>
                        </div>}
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>


                </div>

                {props.key === 'NF' && index === this.state.selectedIndex && this.state.show_ind_mem_premium &&
                    <div className="detail-info">
                        <div className="di-title">Sum insured</div>
                        <div className="flex-between di-tile">
                            <div className="di-tile-left">{numDifferentiation(this.state.sum_assured)} x {this.state.total_member}</div>
                            <div className="di-tile-right">{numDifferentiationInr(this.state.sum_assured * this.state.total_member)}</div>
                        </div>

                        <div className="generic-hr"></div>

                        <div className="di-title">Details</div>

                        <div className="di-sum-assured-data">
                            {this.state.ind_pre_data.map(this.renderIndPlans)}
                        </div>

                        <div className="generic-hr"></div>

                        <div className="flex-between di-tile">
                            <div className="di-tile-left">Base premium</div>
                            <div className="di-tile-right">{inrFormatDecimal(this.state.premium_data_nf.base_premium)}</div>
                        </div>
                       {this.state.premium_data_nf.account_type_discount > 0  &&
                        <div className="flex-between di-tile" style={{color: 'var(--primary)'}}>
                            <div className="di-tile-left">{this.state.premium_data_nf.account_type_discount_percentage}% discount</div>
                            <div className="di-tile-right">-{inrFormatDecimal(this.state.premium_data_nf.account_type_discount)}</div>
                        </div>}

                        <div className="generic-hr"></div>

                        <div className="flex-between di-tile">
                            <div className="di-tile-left">Total premium</div>
                            <div className="di-tile-right">{inrFormatDecimal(this.state.premium_data_nf.net_premium)}</div>
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
                title={'Select cover type'}
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <div className="common-top-page-subtitle flex-between-center">
                    Choose how to use the sum insured across family members
                 <img 
                        className="tooltip-icon"
                        data-tip="1. For entire family -<br />
                        Also called 'Family floater', in this case sum insured is shared amongst the members. For ex- if the sum insured is ₹4 lacs, total claims of all the members together will be covered upto ₹4 lacs.<br />
                        <br />
                        2. For each member -<br />
                        Sum insured limit is applicable for each member individually. For ex- if the sum insured is ₹4 lacs, each member can individually claim upto ₹4 lacs."
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