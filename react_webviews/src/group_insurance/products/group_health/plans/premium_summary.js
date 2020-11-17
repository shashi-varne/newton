import React, { Component } from "react";
import Container from "../../../common/Container";

import { nativeCallback } from "utils/native_callback";
import { storageService } from "utils/validators";
import { initialize } from "../common_data";
import { ghGetMember} from "../../../constants";
import BottomInfo from "../../../../common/ui/BottomInfo";
import Api from "utils/api";
import toast from "../../../../common/ui/Toast";
import ReligarePremium from "../religare/religare_premium";
import HDFCPremium from "../hdfc/hdfc_premium";
import StarPremium from "../Star/star_premium";
class GroupHealthPlanPremiumSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      premium_data: [],
      plan_selected_final: {},
      final_dob_data: [],
      show_loader: true,
      plan_selected: {},
      get_lead: storageService().getObject("resumeToPremiumHealthInsurance") ? true : false,
      force_onload_call: true,
      provider: this.props.match.params.provider,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let groupHealthPlanData = this.state.groupHealthPlanData || {};
    let post_body = groupHealthPlanData.post_body;

    let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', 'plan_code','tenure', 'individual_si', 'total_si', 'premium', 'base_premium', 'gst', 'family_discount', 'tenure_discount', 'gst', 'postal_code'];
    
    if(post_body.quotation_id){
      allowed_post_body_keys.push('quotation_id');
    }

    let body = {};
    for(let key of allowed_post_body_keys){
        body[key] = post_body[key];
    }    
    body['add_ons'] = post_body.add_ons_json;
    body['total_premium'] = post_body.total_amount;
    body['total_discount'] = post_body.total_discount;
    
    //quote creation api
    if(!this.state.get_lead){
      
      this.setState({
        show_loader: true
      });

      try{
        let res = await Api.post(`api/insurancev2/api/insurance/health/quotation/upsert_quote/${this.state.providerConfig.provider_api}`, body );
        
      let resultData = res.pfwresponse.result;
      let quote_id = resultData.quotation.id || '';
  
      groupHealthPlanData.post_body.quotation_id = quote_id;
      this.setLocalProviderData(groupHealthPlanData)
  
      this.setState({
        show_loader: false
      });
      }catch(error){
        this.setState({
          show_loader: false
        });
        console.log(error)
      }
  
    }
    
    let properties = {};
    let lead = this.state.lead;
    let groupHealthPlanDataProp = this.state.groupHealthPlanData;

    if (this.state.get_lead) {
      let add_ons_data = [];
      let add_ons = lead.add_ons;
      for(var key in add_ons){
        add_ons_data.push(add_ons[key])
      }
      
      properties.add_ons = add_ons_data;
      properties.type_of_plan = lead.floater_type === "floater" ? "WF" : "NF";
      properties.sum_assured = lead.individual_sum_insured;
      properties.total_members = lead.no_of_people;
      properties.members = lead.member_base;
      properties.tenure = lead.tenure;
      properties.base_premium = lead.base_premium;
      properties.discount_amount = lead.total_discount;
      properties.net_premium = lead.total_premium;
      properties.gst_tax = lead.gst;
      properties.total_amount = lead.total_premium;
    } else {

      var add_on_title = {
        uar: 'Unlimited Automatic Recharge',
        opd: 'OPD care',
        ped_wait_period: 'Reduction in PED wait period',
        ncb: 'No Claim Bonus Super'
      }
      var final_add_ons_data = []
      
      for(var addOn in post_body.add_ons){
        if(addOn !== 'total' && post_body.add_ons[addOn] !== 0){
          let temp = {
            title: add_on_title[addOn],
            price: post_body.add_ons[addOn]
          }
          final_add_ons_data.push(temp);
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
	        show_loader: false,
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
    
    storageService().remove("resumeToPremiumHealthInsurance",false);
      try {
        this.setState({
          show_loader: true,
        });

        let { groupHealthPlanData } = this.state;
        let plan_selected_final = groupHealthPlanData.plan_selected_final || {};
        let body = groupHealthPlanData.post_body;
        body.provider = this.state.providerConfig.provider_api;
        body.base_premium_showable = plan_selected_final.base_premium_showable;
        body.add_ons_amount = plan_selected_final.add_ons_premium || "";

        let post_body = {}
        post_body['quotation_id'] = body.quotation_id;
        if (
          body.provider === "star" &&
          body.account_type.includes("parents") &&
          groupHealthPlanData.ui_members.parents_option
        ) {
          body.account_type = groupHealthPlanData.ui_members.parents_option;
        }

        let total_member = body.children + body.adults;
        if (total_member === 1) {
          body.type_of_plan = "NF"; //for backend handlling
        }

        //application creation
        const res = await Api.post(
          `api/insurancev2/api/insurance/proposal/${this.state.providerConfig.provider_api}/create_application`,
          post_body
        );
        
        var resultData = res.pfwresponse.result;
        
        if (res.pfwresponse.status_code === 200) {     
          let lead = resultData.quotation_details;
          lead.member_base = ghGetMember(lead, this.state.providerConfig); console.log(resultData.application_details.id,"id from api")
         

        groupHealthPlanData['health_insurance_application_id'] = resultData.application_details.id;
        this.setLocalProviderData(groupHealthPlanData);
         
         storageService().set("application_ID", application_id);
       console.log(lead.member_base,    resultData)
          this.navigate("personal-details/" + lead.member_base[0].key);
        } else {
          this.setState({
            show_loader: false,
          });
          toast(
            resultData.error || resultData.message || "Something went wrong"
          );
        }
      } catch (err) {
        this.setState({
          show_loader: false,
        });
        toast("Something went wrong");
      }

      let application_id =  storageService().get("application_ID")
      console.log(application_id, "<<<----session key")

    
  };

  renderProviderPremium() {
    const premiumComponentMap = {
      religare: <ReligarePremium {...this.state.properties} />,
      hdfcergo: <HDFCPremium {...this.state.properties} />,
      star: <StarPremium {...this.state.properties} />,
    };
    return premiumComponentMap[this.state.provider.toLowerCase()];
  }

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
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
              <img
                src={require(`assets/${this.state.providerData.logo_card}`)}
                alt=""
              />
            </div>
            <div className="left">
              <div className="tc-title">
                {this.state.groupHealthPlanData.base_plan_title ||
                  this.state.providerData.title}
              </div>
              <div className="tc-subtitle">
                {this.state.plan_selected.plan_title}
              </div>
            </div>
          </div>
          {this.state.properties && this.renderProviderPremium()}

          <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical treatments at affordable cost' }} />        </div>
      </Container>
    );
  }
}

export default GroupHealthPlanPremiumSummary;
