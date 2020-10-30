import React, { Component } from "react";
import Container from "../../../common/Container";

import { nativeCallback } from "utils/native_callback";
import { ghGetMember } from "../../../constants";
import { storageService } from "utils/validators";
import { initialize, setLocalProviderData } from "../common_data";
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
    console.log('post_body', body);

    let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', 'plan_code','tenure', 'individual_si', 'total_si', 'premium', 'base_premium', 'gst', 'family_discount', 'tenure_discount', 'gst', 'postal_code'];
    
    if(post_body.quotation_id){
      allowed_post_body_keys.push('quotation_id');
    }

    let body = {};
    for(let key of allowed_post_body_keys){
        body[key] = post_body[key];
    }    
    
    

    //quote creation api
    if(!this.state.get_lead){
      
      this.setState({
        show_loader: true
      });

      try{
        let res = await Api.post(`https://seguro-dot-plutus-staging.appspot.com/api/insurancev2/api/insurance/health/quotation/upsert_quote/${this.state.providerConfig.provider_api}`, body );
        console.log('res', res);
        
      let resultData = res.pfwresponse.result;
      let quote_id = resultData.quotation.id;
  
      groupHealthPlanData.post_body.quotation_id = quote_id;
      this.setLocalProviderData(groupHealthPlanData)
  
      this.setState({
        show_loader: false
      });
      }catch(error){
        console.log(error)
      }
  
    }
    console.log('in onload')
    let properties = {};
    let lead = this.state.lead;
    let groupHealthPlanDataProp = this.state.groupHealthPlanData;

    if (this.state.get_lead) {
      // let add_ons_data = [];
      // let add_ons = lead.add_ons_json;
      // for (var key in add_ons) {
      //   add_ons_data.push({
      //     title: add_ons[key].title,
      //     selected_premium: add_ons[key].premium,
      //     checked: true,
      //   });
      // }
      // properties.add_ons = add_ons_data;

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
      properties.add_ons = groupHealthPlanDataProp.add_ons_data || "";
      properties.type_of_plan = groupHealthPlanDataProp.type_of_plan === 'floater' ? "WF" : "NF"; 
      properties.sum_assured = groupHealthPlanDataProp.sum_assured; 
      properties.total_members = groupHealthPlanDataProp.post_body.adults + groupHealthPlanDataProp.post_body.children; 
      properties.members = groupHealthPlanDataProp.final_dob_data; 
      properties.tenure = groupHealthPlanDataProp.plan_selected_final.tenure;
      properties.base_premium = groupHealthPlanDataProp.plan_selected_final.base_premium;
      properties.discount_amount = groupHealthPlanDataProp.plan_selected_final.discount.tenure[1] || 0; 
      properties.net_premium = groupHealthPlanDataProp.plan_selected_final.premium_after_family_discount;
      properties.gst_tax = groupHealthPlanDataProp.plan_selected_final.gst[0] || 0; 
      properties.total_amount = groupHealthPlanDataProp.plan_selected_final.premium_after_family_discount;
    }
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

    if (this.state.get_lead) {
      let member = this.state.lead.member_base[0].relation.toLowerCase();
      this.navigate(`personal-details/${member}`);
      return;
    } else {
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
          `https://seguro-dot-plutus-staging.appspot.com/api/insurancev2/api/insurance/proposal/hdfc_ergo/create_application`,
          post_body
        );
        
        var resultData = res.pfwresponse.result;
        
        if (res.pfwresponse.status_code === 200) {
          let lead = resultData.quotation;
          // lead.member_base = ghGetMember(lead, this.state.providerConfig);
          // storageService().set("ghs_ergo_quote_id", resultData.quotation.id);
          // this.navigate("personal-details/" + lead.member_base[0].key);
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
    }
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

          <div className="premium-summary-motivator">
          <BottomInfo
            summaryPage={true}
            fixedPosition="0px"
            baseData={{
              content:
                "Complete your details and get quality medical treatments at affordable cost",
            }}
          />
          </div>
        </div>
      </Container>
    );
  }
}

export default GroupHealthPlanPremiumSummary;
