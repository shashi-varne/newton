import React, { Component } from "react";
import Container from "../../../common/Container";

import { nativeCallback } from "utils/native_callback";
import { storageService } from "utils/validators";
import { initialize } from "../common_data";
import { ghGetMember} from "../../../constants";
import { getConfig } from "utils/functions";
import BottomInfo from "../../../../common/ui/BottomInfo";
import Api from "utils/api";
import ReligarePremium from "../religare/religare_premium";
import HDFCPremium from "../hdfc/hdfc_premium";
import StarPremium from "../Star/star_premium";
import GMCPremium from "../gmc/gmc_premium";
import { isEmpty } from "../../../../utils/validators";

class GroupHealthPlanPremiumSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      premium_data: [],
      plan_selected_final: {},
      final_dob_data: [],
      plan_selected: {},
      get_lead: storageService().getObject("resumeToPremiumHealthInsurance") ? true : false,
      force_onload_call: true,
      provider: this.props.match.params.provider,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    storageService().remove("health_insurance_application_id");
    this.initialize();
  }

  onload = async () => {
    this.setErrorData("onload");
    let error = "";
    let errorType = "";

    let groupHealthPlanData = this.state.groupHealthPlanData || {};
    let post_body = groupHealthPlanData.post_body;

    let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', 'plan_code','tenure', 'individual_si', 'total_si', 'premium', 'base_premium', 'gst', 'family_discount', 'tenure_discount', 'gst', 'postal_code'];
    
    if(post_body && post_body.quotation_id){
      allowed_post_body_keys.push('quotation_id');
    }

    let body = {};
    if(post_body){
      for(let key of allowed_post_body_keys){
        body[key] = post_body[key];
      }
      body['total_premium'] = post_body.total_amount;
      body['total_discount'] = post_body.total_discount;

      if(this.state.providerConfig.provider_api === 'religare'){
        body['add_ons'] = Object.keys(post_body.add_ons_payload).length === 0 ? {} : post_body.add_ons_payload;
        body['add_on_premium'] = post_body['add_on_premium'];
      }
      if(this.state.providerConfig.provider_api === 'star'){

        if ( post_body.account_type.includes("parents") && groupHealthPlanData.ui_members.parents_option ) {
          body.account_type = groupHealthPlanData.ui_members.parents_option;
          body.insurance_type = groupHealthPlanData.ui_members.parents_option;
        }
      }
      if(this.state.providerConfig.provider_api === 'care_plus'){
        body['payment_frequency'] = post_body.payment_frequency;
      }

    }

    //quote creation api
    if(!this.state.get_lead){
      this.setState({
        skelton:true
      });

      try{
        let res = await Api.post(`api/insurancev2/api/insurance/health/quotation/upsert_quote/${this.state.providerConfig.provider_api}`, body );
      let resultData = res.pfwresponse.result;
      let quote_id = "";
      
      if(res.pfwresponse.status_code === 200){
        quote_id = resultData.quotation ? resultData.quotation.id : '';
      }
      else{
        if(typeof(resultData.error) === 'object' && resultData.error.quotation_id){
          quote_id =  resultData.error.quotation_id;
        }else{
          error = resultData.error || resultData.message || true
        }
      }
      
      groupHealthPlanData.post_body.quotation_id = quote_id;
      this.setLocalProviderData(groupHealthPlanData)
      if(!error){
        this.setState({
          skelton: false
        });
      }
      }catch(err){
        console.log(err)
        this.setState({
          skelton: false
        });
        error=true;
        errorType= 'crash';
        
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
    
    let properties = {};
    let lead = this.state.lead;
    let groupHealthPlanDataProp = this.state.groupHealthPlanData;
    var add_ons_order = ['uar', 'opd', 'ped_wait_period', 'ncb'];

    if (this.state.get_lead) {
      let add_ons_data = [];
      let add_ons = lead.add_ons;
      
      for(var addOnOrder of add_ons_order){
        for(var key in add_ons){
        if(key.includes(addOnOrder)){
          add_ons_data.push(add_ons[key])
          }
        }
      }
      
      properties.add_ons = add_ons_data;
      properties.type_of_plan = lead.floater_type === "floater" ? "WF" : "NF";
      properties.sum_assured = lead.individual_sum_insured;
      properties.total_members = lead.no_of_people;
      properties.members = lead.member_base;
      properties.tenure = lead.tenure;
      properties.base_premium = lead.base_premium;
      properties.discount_amount = lead.total_discount;
      properties.net_premium = lead.total_premium - lead.gst ;
      properties.gst_tax = lead.gst;
      properties.total_amount = lead.total_premium;
      properties.payment_frequency = lead.payment_frequency;
    } else {
      var final_add_ons_data = []
      if(post_body){
        for(let addOnOrder of add_ons_order){
          for(var addOn in post_body.add_ons){
            if(addOn === addOnOrder){
              if(addOn !== 'total' && post_body.add_ons[addOn] !== 0){
                let temp = {
                  title: this.state.providerConfig.add_on_title[addOn],
                  price: post_body.add_ons[addOn]
                }
                final_add_ons_data.push(temp);
              }
            }
          }
        }

        properties.add_ons = final_add_ons_data || [];
        properties.type_of_plan = groupHealthPlanDataProp.type_of_plan === 'floater' ? "WF" : "NF";
        properties.sum_assured = groupHealthPlanDataProp.sum_assured;
        properties.total_members = groupHealthPlanDataProp.post_body.adults + groupHealthPlanDataProp.post_body.children;
        properties.members = groupHealthPlanDataProp.final_dob_data;
        properties.tenure = groupHealthPlanDataProp.plan_selected_final.tenure;
        properties.base_premium = groupHealthPlanDataProp.plan_selected_final.base_premium;
        properties.discount_amount = groupHealthPlanDataProp.plan_selected_final.total_discount || 0;
        properties.net_premium = groupHealthPlanDataProp.plan_selected_final.premium;
        properties.gst_tax = groupHealthPlanDataProp.post_body.gst || 0;
        properties.total_amount = groupHealthPlanDataProp.plan_selected_final.total_amount;
        properties.payment_frequency = groupHealthPlanDataProp.plan_selected_final.payment_frequency;
      }
    }
    properties.total_discount = properties.discount_amount;
    this.setState({ properties: properties });
  };

  async componentDidMount() {
    let groupHealthPlanData = this.state.groupHealthPlanData || {};
    let group_health_landing = "/group-insurance/group-health/entry";

    if (!this.state.get_lead)  {
	    if (!groupHealthPlanData.post_body) {
	      this.navigate(group_health_landing);
	      return;
	    } else {
	      this.setState({
	        skelton: false,
	      });
	    }
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        product: this.state.providerConfig.provider_api,
        flow: this.state.insured_account_type || "",
        screen_name: "premium summary",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  handleClick = async () => {
    this.sendEvents("next");
    this.setErrorData("submit",true)
    let error="";
    let errorType="";
    let { groupHealthPlanData } = this.state;
      try {
        this.setState({
          show_loader: "button",
        });

        let post_body = {}

        if(this.state.get_lead){
          post_body['quotation_id'] = storageService().get('ghs_ergo_quote_id');
        }else{
          let body = groupHealthPlanData.post_body;
          post_body['quotation_id'] = body.quotation_id;
        }
        //application creation
        const res = await Api.post(
          `api/insurancev2/api/insurance/proposal/${this.state.providerConfig.provider_api}/create_application`,
          post_body
        );

        var resultData = res.pfwresponse.result;
        
        if (res.pfwresponse.status_code === 200) { 
          this.setState({
            show_loader: false,
          });    
          let lead = resultData.quotation_details;
          lead.member_base = ghGetMember(lead, this.state.providerConfig);
          let application_id = resultData.application_details.id;

          storageService().set('health_insurance_application_id', application_id);
          //for form prefilling
          groupHealthPlanData.application_form_data = resultData;
          //for optimising APIs in form
          var application_data = !isEmpty(groupHealthPlanData.application_data) ? groupHealthPlanData.application_data  : {} ;
            
          application_data['personal_details_screen'] = groupHealthPlanData.application_data && !isEmpty(groupHealthPlanData.application_data.personal_details_screen) ? groupHealthPlanData.application_data.personal_details_screen : {}
          application_data['select_ped_screen'] = groupHealthPlanData.application_data && !isEmpty(groupHealthPlanData.application_data.select_ped_screen) ? groupHealthPlanData.application_data.select_ped_screen : {}
          
          groupHealthPlanData.application_data = application_data;
          this.setLocalProviderData(groupHealthPlanData);

          this.navigate("personal-details/" + lead.member_base[0].key);
        } else {
          this.setState({
            show_loader: false,
          });
          error=resultData.error || resultData.message || true
        }
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      error = true;
      errorType = "crash";
    }
    if (error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: true,
      });
    } 
  };

    renderProviderPremium() {
    const premiumComponentMap = {
      religare: <ReligarePremium account_type={this.state.groupHealthPlanData.account_type || this.state.lead.insurance_type} {...this.state.properties} />,
      hdfcergo: <HDFCPremium {...this.state.properties} />,
      star: <StarPremium {...this.state.properties} />,
      gmc: <GMCPremium {...this.state.properties} />,
    };
    return premiumComponentMap[this.state.provider.toLowerCase()];
  }

  render() {

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title="Premium summary"
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="CONTINUE"
        handleClick={() => this.handleClick()}
      >
        <div className="group-health-plan-premium-summary">
          <div className="group-health-top-content-plan-logo">
            <div className="tc-right">
              <img
                src={require(`assets/${this.state.providerData.logo_card}`)}
                alt=""
              />
            </div>
            <div className="left">
              <div className="tc-title" style={{fontSize: '15px', marginTop: this.state.providerConfig.key === 'GMC' ? '-20px': ''}}>
                {this.state.providerData.title2}
              </div>
              {this.state.providerConfig.key !== 'GMC' ? (
                <div className="tc-subtitle">
                {this.state.provider !== 'HDFCERGO' ? this.state.providerConfig.subtitle : this.state.get_lead ? this.state.providerConfig.hdfc_plan_title_mapper[this.state.lead && this.state.lead.plan_id]:  this.state.plan_selected.plan_title}
              </div>
              ): null}
            </div>
          </div>
          {this.state.properties && this.renderProviderPremium()}
          <div className="premium-summary-disclaimer" style={{ color: getConfig().primary }}>
            <p>Premium values are being rounded off for ease of representation, there may be a small difference in final payable value.</p>
          </div>
          <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical care at affordable cost' }} />
        </div>
      </Container>
    );
  }
}

export default GroupHealthPlanPremiumSummary;
