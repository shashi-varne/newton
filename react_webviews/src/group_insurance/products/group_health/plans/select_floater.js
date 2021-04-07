import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import {  inrFormatDecimal, numDifferentiationInr, numDifferentiation, calculateAge } from 'utils/validators';
import { initialize, updateBottomPremium } from '../common_data';
import Api from 'utils/api';
import { childeNameMapper } from '../../../constants';
import GenericTooltip from '../../../../common/ui/GenericTooltip'
class GroupHealthPlanSelectFloater extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            premium_data_floater: [],
            skelton: true,
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
            this.onload();
        }

        onload = async() =>{
            let error="";
            let errorType="";
            this.setErrorData("onload");
            let {groupHealthPlanData} = this.state;
            groupHealthPlanData.add_ons_data = [];
            groupHealthPlanData.post_body.add_ons_json = {};
            let post_body = groupHealthPlanData.post_body;
            let selectedIndex = groupHealthPlanData.selectedIndexFloater || 0;
            let total_member = post_body.adults + post_body.children;
            this.setState({
                selectedIndex: selectedIndex,
                sum_assured: groupHealthPlanData.sum_assured || post_body.sum_assured, 
                total_member: total_member,
                show_ind_mem_premium: this.state.providerConfig.show_ind_mem_premium
            });
            if(post_body.children > 0){
                for(var key in post_body.member_details){
                        if(key.includes('child') && calculateAge(post_body.member_details[key].dob, false) < 5 && this.state.providerConfig.key === 'RELIGARE'){
                            this.setState({disableFloaterOption: true });
                        }
                }
            }
            
            if(post_body.floater_type){
                delete post_body['floater_type'];
            }

            let total_number = post_body.adults + post_body.children;

            let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','si'];
            let body = {};
            for(let key of allowed_post_body_keys){
                body[key] = post_body[key];
            }


            try {
                
                const res2 = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,
                    body);
                
                var resultData = res2.pfwresponse.result;
                if (res2.pfwresponse.status_code === 200) {
                    let premium_data_wf = resultData.premium_details['floater'][0];
                    let premium_data_nf = resultData.premium_details['non_floater'][0];
                    
                    let premium_data_floater = [{
                            'title': `${numDifferentiationInr(this.state.sum_assured)} for entire family`,
                            'premium': premium_data_wf.premium,
                            'subtitle': 'in ' + inrFormatDecimal(premium_data_wf.premium),
                            'discount': premium_data_wf.discount.family[0] ? parseFloat(premium_data_wf.discount.family[0]) : '',
                            'key': 'floater'
                        },
                        {
                            'title': `${numDifferentiationInr(this.state.sum_assured)} for each member`,
                            'premium': premium_data_nf.premium,
                            'subtitle': `${numDifferentiationInr(this.state.sum_assured * total_number)}
                                        sum insured in ${inrFormatDecimal(premium_data_nf.premium)} `,
                            'discount': premium_data_nf.discount.family[0] ? parseFloat(premium_data_nf.discount.family[0]) : '',
                            'key': 'non_floater'
                        }
                    ];
                    

                    let ind_pre_data = [];
                    let final_dob_data = this.state.groupHealthPlanData.final_dob_data;
                    
                    var individual_premiums = premium_data_nf.insured_individual_premium;
                    for (var i in final_dob_data) {
                        let mem = final_dob_data[i];
                        if (premium_data_nf['floater_type']) {
                            let obj = {
                                name: numDifferentiation(this.state.sum_assured) + ' for ' + childeNameMapper(mem.key).toLowerCase(),
                                value: inrFormatDecimal(individual_premiums[mem['backend_key']])
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
                        premium_base: resultData.premium_details
                    })
                    this.setState({
                        skelton: false
                    });
                } else {
                    error= resultData.error || resultData.message ||
                        true;
                }
            } catch (err) {
                console.log(err)
                this.setState({
                    skelton: false
                });
                error = true;
                errorType = "crash"
                }
                if(error)
                {
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

       sendEvents(user_action) {
           let eventObj = {
               "event_name": 'health_insurance',
               "properties": {
                   "user_action": user_action,
                   "product": this.state.providerConfig.provider_api,
                   "flow": this.state.insured_account_type || '',
                   "screen_name": 'select sum Insured for',
                   'sum_assured_for' : (this.state.premium_data_floater[this.state.selectedIndex || 0]  || {}).key === 'floater' ? 'complete family' : 'individual'
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
           let selectedPlan = this.state.premium_base[type_of_plan]; //first of WF or NF;
           groupHealthPlanData.net_premium_addons = selectedPlan.premium;
           groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
           groupHealthPlanData.type_of_plan = type_of_plan;
           groupHealthPlanData.post_body.floater_type = type_of_plan;
           groupHealthPlanData.post_body.premium = this.state.premium_data_floater[this.state.selectedIndex].premium
           this.setLocalProviderData(groupHealthPlanData);
           this.navigate(this.state.next_screen || 'plan-select-cover-period');
       }
       choosePlan = (index, props) => {
           if(props.key === "non_floater" && this.state.disableFloaterOption){
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
           
           return (
               <div onClick={() => this.choosePlan(index, props)}
                   className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''} ${this.state.disableFloaterOption && props.key === "non_floater" ? 'tile-disabled': ''}`} key={index}>
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
                   {props.key === 'non_floater' && index === this.state.selectedIndex && this.state.show_ind_mem_premium &&
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
                          {this.state.premium_data_nf.total_discount > 0  &&
                           <div className="flex-between di-tile" style={{color: 'var(--primary)'}}>
                               <div className="di-tile-left">{this.state.premium_data_nf.account_type_discount_percentage}% discount</div>
                               <div className="di-tile-right">-{inrFormatDecimal(this.state.premium_data_nf.total_discount)}</div>
                           </div>}
                           <div className="generic-hr"></div>
                           <div className="flex-between di-tile">
                               <div className="di-tile-left">Total premium</div>
                               <div className="di-tile-right">{inrFormatDecimal(this.state.premium_data_nf.premium)}</div>
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
               events={this.sendEvents("just_set_events")}
               showLoader={this.state.show_loader}
               skelton={this.state.skelton}
               showError={this.state.showError}
               errorData={this.state.errorData}
               title={"Select cover type"}
               buttonTitle="CONTINUE"
               withProvider={true}
               buttonData={this.state.bottomButtonData}
               handleClick={() => this.handleClick()}
             >
               <div className="common-top-page-subtitle flex-between-center">
                 Choose how to use the sum insured across family members
                 <GenericTooltip
                   productName={getConfig().productName}
                   content={( <div>1. For entire family 
                           Also called 'Family floater', in this case sum insured is shared amongst the members. For ex- if the sum insured is ₹4 lakhs, total claims of all the members together will be covered upto ₹4 lakhs.<br />
                             <br></br>
                           2. For each member 
                           Sum insured limit is applicable for each member individually. For ex- if the sum insured is ₹4 lakhs, each member can individually claim upto ₹4 lakhs.</div> )}
                 />
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
