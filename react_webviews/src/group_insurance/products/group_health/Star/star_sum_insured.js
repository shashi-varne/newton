import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize, updateBottomPremium } from '../common_data';
import { numDifferentiationInr, formatAmountInr } from 'utils/validators';
import Api from 'utils/api';
import DotDotLoader from 'common/ui/DotDotLoader';
import { getConfig } from 'utils/functions';
import { isEmpty } from '../../../../utils/validators';
import toast from '../../../../common/ui/Toast';
import GenericTooltip from '../../../../common/ui/GenericTooltip'

class GroupHealthPlanStarSumInsured extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            sum_assured_data: [300000, 400000, 500000, 1000000, 1500000, 2000000, 2500000],
            next_screen: '',
            premiumAmt: null,
            selectedIndex: 0,
            loadingPremium: true
        };

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
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
              button_text1: 'Retry',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleClick,
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
        this.onload();
    }

    onload = async() =>{
        let error="";
        let errorType="";
        this.setErrorData("onload");

        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id', 'postal_code'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['si'] = '300000';
        this.setState({
            skelton: true,
            loadingPremium: true
        });

        try {
            this.setState({ loadingPremium: true, apiError :false });
            const res = await Api.post('api/insurancev2/api/insurance/health/quotation/get_premium/star', body);

            this.setState({ loadingPremium: false, premiumData: [] });
            let resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
    
                this.setState({
                    premiumAmt: resultData.premium_details.premium,
                    plan_selected_final: resultData.premium_details,
                    loadingPremium: false
                });
                this.setState({
                    skelton: false
                });
            } else {
                this.setState({
                    premiumAmt: '--',
                    apiError :true
                })
                error=resultData.error || resultData.message || true;
                
            }
           

        } catch (err) {
            console.log(err);
            error=true;
            errorType="crash";
            this.setState({
                premiumAmt: '--',
                loadingPremium: false,
                apiError :true,
                skelton:false
            });
        }
        if (error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error,
                type:errorType
              },
              showError: "page",
            });
          }
        let dob_data = {};
        groupHealthPlanData.final_dob_data.forEach(item => {
            dob_data[item.backend_key] = {
                dob: item.value
            }
        });       
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'star',
                "flow": this.state.insured_account_type || '',
                sum_assured:  this.state.sum_assured_data[this.state.selectedIndex],
                screen_name: 'select sum Insured',
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    };

    choosePlan = async (index) => {
        this.setState({
            selectedIndex: index,
            loadingPremium: true
        })
       
        const { groupHealthPlanData } = this.state;
        let post_body = groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id', 'postal_code'];
        let body = {};
        
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        body['si'] = this.state.sum_assured_data[index]; ;
        
        try{
            const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/star`, body);

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
            
                this.setState({
                    plan_selected_final: resultData.premium_details,
                    premiumAmt: resultData.premium_details.premium,
                    loadingPremium: false
                })
            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        }catch(err){

        }
        
    }

    renderPlans = (item, index) => {
        return (
            <div onClick={() => this.choosePlan(index)}
                className={`tile ${index === this.state.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="name">
                        {numDifferentiationInr(item)}
                    </div>
                    <div className="completed-icon">
                        {index === this.state.selectedIndex &&
                            <img src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>
                </div>
            </div>
        )
    }

    handleClick = async () => {
        const { groupHealthPlanData } = this.state;
        this.sendEvents('next');
        let post_body = groupHealthPlanData.post_body;

        var plan_selected_final = this.state.plan_selected_final;

        if (this.state.loadingPremium || isEmpty(plan_selected_final)) return;

        groupHealthPlanData.selectedIndexSumAssured = this.state.selectedIndex;
        groupHealthPlanData.sum_assured = this.state.sum_assured_data[this.state.selectedIndex];
        groupHealthPlanData.post_body.sum_assured = this.state.sum_assured_data[this.state.selectedIndex];
        groupHealthPlanData.post_body.individual_si = this.state.sum_assured_data[this.state.selectedIndex];
        groupHealthPlanData.plan_selected_final = plan_selected_final;

        Object.assign(groupHealthPlanData.post_body, {
            tenure: plan_selected_final.tenure,
            tax_amount: plan_selected_final.gst[1],
            base_premium: plan_selected_final.base_premium,
            premium: plan_selected_final.premium,
            total_amount: plan_selected_final.total_amount || 0,
            discount_amount: plan_selected_final.total_discount,
            insured_pattern: plan_selected_final.insured_pattern,
            plan_code: plan_selected_final.plan_code,
            postal_code: post_body.postal_code,
            total_si: plan_selected_final.total_si,
            sum_assured: this.state.sum_assured_data[this.state.selectedIndex],
            gst: plan_selected_final.gst[1],
            floater_type: plan_selected_final.floater_type
        });


        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen || 'plan-premium-summary');

    }
    
    render() {
        let bottomButtonData = {
            leftTitle: this.state.groupHealthPlanData.plan_selected.plan_title,
            leftSubtitle: this.state.loadingPremium ? <DotDotLoader /> : formatAmountInr(this.state.premiumAmt),
            provider: this.state.providerConfig.key,
            logo: this.state.providerConfig.logo_cta
        }

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title="Select sum insured"
                buttonTitle="CONTINUE"
                buttonDisabled={this.state.loadingPremium || this.state.apiError}
                withProvider={true}
                buttonData={bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle flex-between-center">
                    Claim can be made upto the selected amount
                <GenericTooltip productName = {
                    getConfig().productName
                }
                content = "In the last 10 years, the average cost per hospitalisation for urban patients has increased by about 176%. Also, this amount will be shared amongst all the insured members; hence, we recommend to have adequate coverage to manage health expenses."/>
                </div>
                <div className="group-health-plan-select-sum-assured">
                    <div className="generic-choose-input">
                        {  this.state.sum_assured_data.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanStarSumInsured;