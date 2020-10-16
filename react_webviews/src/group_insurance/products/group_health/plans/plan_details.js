import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { inrFormatDecimal, numDifferentiationInr } from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import {initialize} from '../common_data';
import ReactHtmlParser from 'react-html-parser';
import GenericTooltip from '../../../../common/ui/ GenericTooltip'

class GroupHealthPlanDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: {
                WF: []
            },
            common_data: {},
            plan_selected: {},
            extra_data: {
                benefits: {
                    main: []
                },
                special_benefits: [],
                waiting_period: []
            },
            premiums_to_show: [],
            show_loader: true,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits,
            screen_name: 'plan_details_screen'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        this.initialize();
    }

    async componentDidMount() {

        let {provider} = this.state;
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let keys_to_empty = ['tenure', 'sum_assured', 'tenure', 'tax_amount', 'base_premium',
                            'total_amount', 'discount_amount', 'insured_pattern', 'type_of_plan',
                        'selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
        let not_req_keys_for_backend = ['selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
       

        for (var i in keys_to_empty) {

            if(!not_req_keys_for_backend.includes(keys_to_empty[i])) {
                post_body[keys_to_empty[i]] = '';
            }
            
            groupHealthPlanData[keys_to_empty[i]] = '';
        }

        if (provider === 'STAR') {
            post_body.sum_assured = '300000';
        }

        groupHealthPlanData.post_body = post_body;

        this.setState({
            groupHealthPlanData: groupHealthPlanData
        })

        this.setLocalProviderData(groupHealthPlanData);
        try {
            const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/premium`,
             post_body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;

           

            if (res.pfwresponse.status_code === 200) {
                let premiums_to_show_backend = resultData.premium.WF || [];

                let premiums_to_show = [];
                console.log(premiums_to_show_backend);
                if(provider === 'STAR') {
                    premiums_to_show = [
                        {
                            'name': '₹3 lacs to ₹25 lacs',
                            'value': premiums_to_show_backend[0].net_premium
                        }
                    ]
                } else {
                    let length = premiums_to_show_backend.length;
    
                    if(length  > 1) {
                        premiums_to_show = [
                            {
                                name: `${numDifferentiationInr(premiums_to_show_backend[0].sum_assured)} to ${numDifferentiationInr(premiums_to_show_backend[length - 1].sum_assured)}`,
                                value: premiums_to_show_backend[0].net_premium
                            }
                        ]
                    } else {
    
                        premiums_to_show = [
                            {
                                name: `${numDifferentiationInr(premiums_to_show_backend[0].sum_assured)}`,
                                value: premiums_to_show_backend[0].net_premium
                            }
                        ]
                    }
                   
                }

                this.setState({
                    common_data: resultData.common,
                    premium_data: resultData.premium,
                    premiums_to_show: premiums_to_show,
                    extra_data: resultData.quote_info
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

    navigateBenefits = (type) => {
       
        let {provider} = this.state;
        this.sendEvents('next', {more_info: type});
        let data_mapper = {
            'whats_included': {
                'header_title': "What is covered?",
                'header_subtitle': 'These are some of the benefits that are covered under this policy',
                'steps': this.state.extra_data.whats_included,
                'pathname': '/gold/common/render-benefits'
            },
            'whats_not_included': {
                'header_title': "What is not covered?",
                'header_subtitle' : 'These are some of the incidences that are not covered under this policy',
                'steps': this.state.extra_data.whats_not_included,
                'pathname': '/gold/common/render-benefits'
            },
            'how_to_claim': {
                'header_title': "How to claim",
                'pathname': 'how-to-claim'
            }
        }


        let mapper_data = data_mapper[type];

        let renderData = {
            'header_title': mapper_data.header_title,
            'header_subtitle': mapper_data.header_subtitle || `${this.state.common_data.base_plan_title} ${this.state.plan_selected.plan_title}`,
            'bottom_title': '*For detailed list, please refer policy prospectus',
            'steps': {
                'options': mapper_data.steps
            },
            'cta_title': 'BACK TO PLAN'
        }

        if(type === 'how_to_claim') {

            if(provider === 'HDFCERGO') {
                renderData.page_title = 'HDFC ERGO provides cashless as well as reimbursement claim facility';
                renderData.contact_email = 'healthclaims@hdfcergo.com';
                renderData.steps = [
                    {
                        'title': 'Cashless claims:',
                        'subtitle': 'In this type of health insurance claim, the insurer company settles all the hospitalization bills with the hospital directly. However, an insured needs to be hospitalized only at a network hospital and have to show the health card (issued after policy generation)  and valid photo ID'
                    },
                    {
                        'title': 'Reimbusment claims :',
                        'subtitle': 'In this type of claim process, the policyholder pays for the hospitalization expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case. In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then makes a payment to the insured.'
                    }
                ]
            }

            if(provider === 'RELIGARE') {
                this.navigate('how-to-claim-religare');
                return;
            }

            if(provider === 'STAR') {
                this.navigate('how-to-claim-star');
                return;
            }
            

        }

        this.props.history.push({
            pathname: mapper_data.pathname,
            search: getConfig().searchParams,
            params: {
                renderData: renderData
            }
        });
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action, data={}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'plan details',
                'more_info' : data.more_info || ''
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
        
        groupHealthPlanData.plan_selected.common_data = this.state.common_data;
        groupHealthPlanData.plan_selected.extra_data = this.state.extra_data;
        groupHealthPlanData.plan_selected.premium_data = this.state.premium_data;

        groupHealthPlanData.post_body.base_premium = groupHealthPlanData.plan_selected.base_premium;
        groupHealthPlanData.post_body.premium = groupHealthPlanData.plan_selected.net_premium;
        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen || 'plan-select-sum-assured');
    }


    renderPremiums = (props, index) => {

        return (
            <div className="sum-assured-info" key={index}>
                <div className="sai-left">
                    {props.name}
                </div>
                <div className="sai-left">
                    starts at   {inrFormatDecimal(props.value)}/year
                </div>
            </div>
        );
    }

    renderSteps = (option, index) => {
        return (
            <div key={index} className="tile">
                <img className="icon"
                    src={option.img} alt="Gold" />
                <div className="content">
                    <div className="content">
                        <div className="content-title">{ReactHtmlParser(option.content)}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            show_loader,
            plan_selected,
            providerData,
            productName,
            extra_data,
            premiums_to_show,
        } = this.state;

        return (
          <Container
            events={this.sendEvents("just_set_events")}
            showLoader={show_loader}
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
                    {this.state.providerConfig.title2 ||
                      this.state.providerConfig.title}
                  </div>
                  <div className="tc-subtitle">{plan_selected.plan_title}</div>
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

              {plan_selected.recommendation_tag && (
                <div
                  className="recomm-info group-health-recommendation"
                  style={{
                    backgroundColor:
                      plan_selected.recommendation_tag === "Recommended"
                        ? "#E86364"
                        : "",
                  }}
                >
                  {plan_selected.recommendation_tag}
                </div>
              )}
              <div className="copay-info">
                <div className="ci-left">
                  0% copay, assured 100% cashless treatment
                </div>
                <div className="ci-right">
               <GenericTooltip  content={plan_selected.copay} productName={productName}    />
                </div>
              </div>

              <div className="sum-assured-info" style={{ fontWeight: 600 }}>
                <div className="sai-left">Sum insured</div>
                <div className="sai-left">Premium</div>
              </div>

              {premiums_to_show.map(this.renderPremiums)}

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
                  {extra_data.special_benefits.map(this.renderSteps)}
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
                  {extra_data.benefits.main.map(this.renderSteps)}
                </div>
              </div>

              <div
                className="common-how-steps"
                style={{ border: "none", marginTop: -30, marginBottom: 0 }}
              >
                <div className="top-tile">
                  <div className="top-title">Waiting period</div>
                </div>
                <div className="common-steps-images" style={{ marginTop: 0 }}>
                  {extra_data.waiting_period.map(this.renderSteps)}
                </div>
              </div>

              <div className="accident-plan-read" style={{ padding: 0 }}>
                <div className="accident-plan-read-text">
                  *For detailed list of all terms and conditions, please refer
                  <span
                    style={{ color: getConfig().primary }}
                    onClick={() =>
                      this.openInBrowser(
                        this.state.common_data.policy_prospectus,
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