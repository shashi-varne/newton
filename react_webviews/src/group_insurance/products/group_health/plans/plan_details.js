import React, { Component } from "react";
import Container from "../../../common/Container";

import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import Api from "utils/api";
import ic_hs_special_benefits from "assets/ic_hs_special_benefits.svg";
import ic_hs_main_benefits from "assets/ic_hs_main_benefits.svg";
import { initialize } from "../common_data";
import ReactHtmlParser from "react-html-parser";
import GenericTooltip from "../../../../common/ui/GenericTooltip";
import { formatAmount } from "../../../../utils/validators";

class GroupHealthPlanDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      premium_data: [],
      common_data: {},
      plan_selected: {},
      extra_data: {
        benefits: {
          main: [],
        },
        special_benefits: [],
        waiting_period: [],
      },
      premiums_to_show: [],
      skelton:true,
      ic_hs_special_benefits: ic_hs_special_benefits,
      ic_hs_main_benefits: ic_hs_main_benefits,
      screen_name: "plan_details_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: "take_control_reset" });
    this.initialize();
  }
  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Fetch again',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Edit'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }
  async componentDidMount() {
    this.setErrorData("onload");
    this.setState({ skelton:true});
    let error = "";

    let { provider } = this.state;
    let groupHealthPlanData = this.state.groupHealthPlanData;
    let post_body = groupHealthPlanData.post_body;

    let keys_to_empty = [
      "tenure",
      "sum_assured",
      "tenure",
      "tax_amount",
      "base_premium",
      "total_amount",
      "discount_amount",
      "insured_pattern",
      "type_of_plan",
      "selectedIndexFloater",
      "selectedIndexCover",
      "selectedIndexSumAssured",
    ];
    let not_req_keys_for_backend = [
      "selectedIndexFloater",
      "selectedIndexCover",
      "selectedIndexSumAssured",
    ];

    for (var i in keys_to_empty) {
      if (!not_req_keys_for_backend.includes(keys_to_empty[i])) {
        post_body[keys_to_empty[i]] = "";
      }

      groupHealthPlanData[keys_to_empty[i]] = "";
    }

    let keys_to_remove = [
      "base_premium",
      "sum_assured",
      "discount_amount",
      "insured_pattern",
      "tax_amount",
      "tenure",
      "total_amount",
      "type_of_plan",
    ];
    for (let key in keys_to_remove) {
      delete post_body[keys_to_remove[key]];
    }

    let allowed_post_body_keys = [
      "adults",
      "children",
      "city",
      "member_details",
      "plan_id",
    ];

    if (provider === "STAR") {
      post_body.sum_assured = "300000";
      post_body.plan_id = "FHONEW";
      allowed_post_body_keys.push("postal_code");
    }
    let body = {};
    for (let key of allowed_post_body_keys) {
      body[key] = post_body[key];
    }
    groupHealthPlanData.post_body = post_body;

    this.setState({
      groupHealthPlanData: groupHealthPlanData,
    });

    this.setLocalProviderData(groupHealthPlanData);

    try {
      const res = await Api.post(
        `api/insurancev2/api/insurance/health/quotation/plan_information/${this.state.providerConfig.provider_api}`,
        body
      );
      this.setState({
        skelton:false
      });
      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          plan_data: resultData,
          benefits: resultData.benefits,
        });
      } else {
        error =
          resultData.error || resultData.message || "Something went wrong";
      }
    } catch (err) {
      console.log(err);
      this.setState({
        skelton: false,
      });
      error = "Something went wrong";
    }
    if (error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
        },
        showError: "page",
      });
    }
  }

  navigateBenefits = (type) => {
    let { provider } = this.state;
    this.sendEvents("next", { more_info: type });
    let data_mapper = {
      whats_included: {
        header_title: "What is covered?",
        header_subtitle:
          "These are some of the benefits that are covered under this policy",
        steps: this.state.plan_data.whats_included,
        pathname: "/gold/common/render-benefits",
      },
      whats_not_included: {
        header_title: "What is not covered?",
        header_subtitle:
          "These are some of the incidences that are not covered under this policy",
        steps: this.state.plan_data.whats_not_included,
        pathname: "/gold/common/render-benefits",
      },
      how_to_claim: {
        header_title: "How to claim",
        pathname: "how-to-claim",
      },
    };

    let mapper_data = data_mapper[type];

    let renderData = {
      header_title: mapper_data.header_title,
      header_subtitle:
        mapper_data.header_subtitle ||
        `${
          this.state.providerConfig.title2 || this.state.providerConfig.title
        } ${this.state.plan_selected.plan_title}`,
      bottom_title: "*For detailed list, please refer policy prospectus",
      steps: {
        options: mapper_data.steps,
      },
      cta_title: "BACK TO PLAN",
    };

    if (type === "how_to_claim") {
      if (provider === "HDFCERGO") {
        renderData.page_title =
          "HDFC ERGO provides cashless as well as reimbursement claim facility";
        renderData.contact_email = "healthclaims@hdfcergo.com";
        renderData.steps = [
          {
            title: "Cashless claims:",
            subtitle:
              "In this type of health insurance claim, the insurer company settles all the hospitalisation bills with the hospital directly. However, an insured needs to be hospitalisation only at a network hospital and have to show the health card (issued after policy generation)  and valid photo ID",
          },
          {
            title: "Reimbusment claims :",
            subtitle:
              "In this type of claim process, the policyholder pays for the hospitalisation expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case. In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then makes a payment to the insured.",
          },
        ];
      }

      if (provider === "RELIGARE") {
        this.navigate("how-to-claim-religare");
        return;
      }

      if (provider === "STAR") {
        this.navigate("how-to-claim-star");
        return;
      }
    }

    this.props.history.push({
      pathname: mapper_data.pathname,
      search: getConfig().searchParams,
      params: {
        renderData: renderData,
      },
    });
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        product: this.state.providerConfig.provider_api,
        flow: this.state.insured_account_type || "",
        screen_name: "plan details",
        more_info: data.more_info || "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents("next");
    let groupHealthPlanData = this.state.groupHealthPlanData;

    groupHealthPlanData.plan_selected.common_data = this.state.common_data;
    groupHealthPlanData.plan_selected.extra_data = this.state.extra_data;
    groupHealthPlanData.plan_selected.premium_data = this.state.premium_data;

    groupHealthPlanData.post_body.base_premium =
      groupHealthPlanData.plan_selected.base_premium;
    groupHealthPlanData.post_body.premium =
      groupHealthPlanData.plan_selected.net_premium;
    this.setLocalProviderData(groupHealthPlanData);
    this.navigate(this.state.next_screen || "plan-select-sum-assured");
  };

  renderSteps = (option, index) => {
    return (
      <div key={index} className="tile">
        <img className="icon" src={option.img} alt="Gold" />
        <div className="content">
          <div className="content">
            <div className="content-title">
              {ReactHtmlParser(option.content)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      skelton,
      showError,
      errorData,
      benefits,
      plan_selected,
      providerData,
      productName,
    } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        skelton={skelton}
        showError={showError}
        errorData={errorData}
        title="Plan details"
        fullWidthButton={true}
        buttonTitle="SELECT SUM INSURED"
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
        <div className="group-health-plan-details">
          <div className="group-health-top-content-plan-logo">
            <div className="left">
              <div className="tc-title">
                {this.state.provider !== "RELIGARE"
                  ? this.state.providerConfig.title2 ||
                    this.state.providerConfig.title
                  : ""}
              </div>
              <div className="tc-subtitle">
                {this.state.plan_data && this.state.provider !== "STAR"
                  ? this.state.plan_selected.plan_title
                  : this.state.providerConfig.subtitle}
              </div>
            </div>

            <div className="tc-right">
              <img
                src={require(`assets/${providerData.logo_card}`)}
                alt=""
                style={{ maxWidth: "140px" }}
              />
            </div>
          </div>

          <div className="settlement-info">
            Claim Settlement Ratio: {this.state.claim_settlement_ratio}%
          </div>

          {plan_selected.recommedation_tag && (
            <div
              className="recomm-info group-health-recommendation"
              style={{
                backgroundColor:
                  plan_selected.recommedation_tag === "Recommended"
                    ? "#E86364"
                    : "",
              }}
            >
              {plan_selected.recommedation_tag}
            </div>
          )}
          <div className="copay-info">
            <div className="ci-left">
              0% copay, assured 100% cashless treatment
            </div>
            <div className="ci-right">
              <GenericTooltip
                content={plan_selected.copay}
                productName={productName}
              />
            </div>
          </div>

          <div className="sum-assured-info" style={{ fontWeight: 600 }}>
            <div className="sai-left">Sum insured</div>
            <div className="sai-left">Premium</div>
          </div>

          {this.state.plan_data && (
            <div className="sum-assured-info">
              <div className="sai-left">{this.state.plan_data.SI}</div>
              <div className="sai-left">
                starts at ₹{formatAmount(this.state.plan_data.starts_at_value)}
                /year
              </div>
            </div>
          )}

          <div
            className="common-how-steps"
            style={{ border: "none", marginTop: 0, marginBottom: 0 }}
          >
            <div className="top-tile">
              <div className="top-title">Benefits under this plan</div>
            </div>

            <div
              className="special-benefit"
              style={{
                backgroundImage: `url(${this.state.ic_hs_special_benefits})`,
              }}
            >
              <img
                className="special-benefit-img"
                src={require(`assets/ic_hs_special.svg`)}
                alt=""
              />
              <span className="special-benefit-text">Special benefits</span>
            </div>
            <div className="common-steps-images">
              {benefits && benefits.special.map(this.renderSteps)}
            </div>

            <div
              className="special-benefit"
              style={{
                backgroundImage: `url(${this.state.ic_hs_main_benefits})`,
              }}
            >
              <img
                className="special-benefit-img"
                src={require(`assets/ic_hs_main.svg`)}
                alt=""
              />
              <span className="special-benefit-text">Main benefits</span>
            </div>
            <div className="common-steps-images">
              {benefits && benefits.main.map(this.renderSteps)}
            </div>
          </div>

          <div
            className="common-how-steps"
            style={{ border: "none", marginTop: "-45px", marginBottom: 0 }}
          >
            <div className="top-tile">
              <div className="top-title" style={{ marginBottom: "-10px" }}>
                Waiting period
              </div>
            </div>
            <div className="common-steps-images" style={{ marginTop: 0 }}>
              {this.state.plan_data &&
                this.state.plan_data.waiting_periods.map(this.renderSteps)}
            </div>
          </div>

          <div className="accident-plan-read" style={{ padding: 0 }}>
            <div className="accident-plan-read-text">
              *For detailed list of all terms and conditions, please refer
              <span
                style={{ color: getConfig().primary }}
                onClick={() =>
                  this.openInBrowser(
                    this.state.plan_data.policy_prospectus,
                    "read_document"
                  )
                }
              >
                &nbsp;policy prospectus
              </span>
            </div>
          </div>

          <div className="bototm-design">
            <div
              className="bd-tile"
              onClick={() => this.navigateBenefits("whats_included")}
            >
              <img
                className="bf-img"
                src={require(`assets/${productName}/ic_whats_covered.svg`)}
                alt=""
              />
              <div className="bd-content">What is covered?</div>
            </div>
            <div
              className="bd-tile"
              onClick={() => this.navigateBenefits("whats_not_included")}
            >
              <img
                className="bf-img"
                src={require(`assets/${productName}/ic_whats_not_covered.svg`)}
                alt=""
              />
              <div className="bd-content">What is not covered?</div>
            </div>
            <div
              className="bd-tile"
              onClick={() => this.navigateBenefits("how_to_claim")}
            >
              <img
                className="bf-img"
                src={require(`assets/${productName}/ic_how_to_claim.svg`)}
                alt=""
              />
              <div className="bd-content">How to claim?</div>
            </div>
            <div className="generic-hr"></div>
          </div>
        </div>
      </Container>
    );
  }
}

export default GroupHealthPlanDetails;
