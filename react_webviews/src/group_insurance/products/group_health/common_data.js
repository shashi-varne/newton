import { storageService, inrFormatDecimal, getEditTitle, compareObjects } from 'utils/validators';
import { getConfig, 
    // isFeatureEnabled
 } from 'utils/functions';
import { ghGetMember } from '../../constants';
import Api from 'utils/api';
import {  openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';
import { isEmpty} from '../../../utils/validators';
import ReactTooltip from "react-tooltip";
import {getGhProviderConfig, memberKeyMapperFunction} from './constants';

export async function initialize() {
    this.setErrorData =setErrorData.bind(this)
    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.setEditTitle = setEditTitle.bind(this);
    this.setLocalProviderData = setLocalProviderData.bind(this);
    this.memberKeyMapper = memberKeyMapper.bind(this);
    this.getApplicationDetails = getApplicationDetails.bind(this);
    
    let provider = this.props.parent && this.props.parent.props ? this.props.parent.props.match.params.provider : this.props.match.params.provider;
    
    let providerConfig = getGhProviderConfig(provider);
    let screenData = {};
    if(this.state.screen_name && providerConfig[this.state.screen_name]) {
        screenData = providerConfig[this.state.screen_name];
    }

    let next_screen = this.state.next_state || '';
    if(this.state.screen_name && providerConfig.get_next[this.state.screen_name]) {
        next_screen = providerConfig.get_next[this.state.screen_name];
        this.setState({
            next_state: next_screen  //override
        })
    }

    let validation_props = providerConfig.validation_props || {};
    let pan_amount = providerConfig.pan_amount || '';
    let claim_settlement_ratio = providerConfig.claim_settlement_ratio || '';

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData_' + provider) || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerConfig,
        next_screen: next_screen,
        providerConfig: providerConfig,
        provider_api: providerConfig.provider_api,
        plan_selected: groupHealthPlanData && groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected : {},
        insured_account_type: provider === 'STAR' && (groupHealthPlanData.account_type || '').indexOf('parents') >=0 ? 
        (groupHealthPlanData.ui_members || {}).parents_option: groupHealthPlanData.account_type || '',
        screenData: screenData,
        validation_props: validation_props,
        pan_amount: pan_amount,
        claim_settlement_ratio: claim_settlement_ratio
    }, () => {
        if(!this.state.get_lead && this.state.force_onload_call) {
            this.onload();
        }
    })

    nativeCallback({ action: 'take_control_reset' });


    let lead = {
        member_base: [],
    };
    let error="";
    let errorType="";
    if (this.state.get_lead) {
        
        this.setErrorData("onload")
        
        try {

            this.setState({
                skelton: true
            });

            let quote_id = storageService().get('ghs_ergo_quote_id');
            let resume = storageService().getObject("resumeToPremiumHealthInsurance");
            let application_id = storageService().get('health_insurance_application_id');
            let url;
  
            var resultData = {}
            if (resume && !application_id) {
                url = `api/insurancev2/api/insurance/health/quotation/get/quotation_details?quotation_id=${quote_id}`
                const res = await Api.get(url);
                resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    
                    lead = resultData;
                    lead.member_base = ghGetMember(lead, providerConfig);               
                    this.setState({
                        lead: resultData || {},
                    }, () => {
                        if (this.onload && !this.state.ctaWithProvider) {
                            this.onload();
                        }
                    })
                    this.setState({
                        skelton: false
                    });
                } else {
                    error = resultData.error || resultData.message ||
                        true;
                }
                
            }else if(isEmpty(groupHealthPlanData.application_form_data)){
                this.getApplicationDetails(application_id, providerConfig);
            } else if(application_id && this.state.screen_name !== 'final_summary_screen') {
                var application_form_data = groupHealthPlanData.application_form_data;
                    lead = application_form_data.quotation_details;
                    var member_base = ghGetMember(lead, providerConfig);
                    this.setState({
                        lead: application_form_data || {},
                        member_base: member_base,
                        quotation: application_form_data.quotation_details || {},
                        common_data: {
                            ...application_form_data.common,
                            tnc: application_form_data.common.tnc || application_form_data.tnc
                        },
                        insured_account_type: lead.insurance_type || ''
                    }, () => {
                        if (this.onload && !this.state.ctaWithProvider) {
                            this.onload();
                        }

                    })
                    this.setState({
                        skelton: false
                    });
            }else if(application_id && this.state.screen_name === 'final_summary_screen'){
                this.getApplicationDetails(application_id, providerConfig);
            }
        } catch (err) {
            console.log(err);
            this.setState({
                skelton: false,
                lead: lead,
                common_data: {}
            });
            error=true;
            errorType="crash";
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

    if (this.state.ctaWithProvider) { 
        let leftTitle, leftSubtitle, individual_sum_insured, tenure, base_premium, total_amount, net_premium, total_discount, payment_frequency, postfix = '', gst = '';
        if (this.state.get_lead) {
            leftTitle = lead.plan_title || '';
            // eslint-disable-next-line 
            leftSubtitle = lead.total_premium;
            tenure = lead.tenure;
            base_premium = lead.base_premium;
            total_amount =  lead.total_premium;
            individual_sum_insured = lead.individual_sum_insured;
            total_discount = lead.total_discount;
            gst = lead.gst;
            net_premium = lead.total_premium - lead.gst;
            
            if(this.state.provider === 'GMC'){
                payment_frequency = lead.payment_frequency;
                postfix = payment_frequency === 'MONTHLY' ? '/month' : '/year';
            }
            
            if(provider === 'HDFCERGO'){
                leftTitle = providerConfig.hdfc_plan_title_mapper[lead.plan_id];
            }else if(provider === 'RELIGARE'){
                leftTitle = 'Care'
            }else if(provider === 'STAR'){
                leftTitle = 'Star health'
            }else{
                leftTitle = 'fisdom HealthProtect'
            }


        } else {
            let premium_data = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.premium_data : [];
            let selectedIndexSumAssured = groupHealthPlanData.selectedIndexSumAssured || 0;

            this.setState({
                premium_data: premium_data
            })

            leftTitle = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '';
            if(selectedIndexSumAssured && premium_data){
            leftSubtitle = premium_data[selectedIndexSumAssured] ? premium_data[selectedIndexSumAssured].premium : '';
            }

        }
        
        let bottomButtonData = {
            leftTitle: leftTitle,
            leftSubtitle: inrFormatDecimal(leftSubtitle) + postfix,
            leftSubtitleUnformatted: leftSubtitle,
            leftArrow: 'up',
            provider: providerConfig.key,
            logo: providerConfig.logo_cta
        }

        let confirmDialogData = {
            conten1_title: 'Premium details',
            buttonData: {
                ...bottomButtonData,
                leftArrow: 'down'
            },
            buttonTitle: "OK",
            content1: [
                {
                    'name': 'Basic premium ', 
                    'value': inrFormatDecimal(base_premium)
                },
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal(total_amount) }
            ],
            title_left: individual_sum_insured, //sum_assured
            heading_left: 'Sum insured:',
            title_right: tenure > 1 ? `${tenure} years` : `${tenure} year`, //tenure
            heading_right: 'Cover period',
        }
        if(provider === 'RELIGARE') {
            if(lead.add_ons && !isEmpty(lead.add_ons)){
                let add_ons_backend = lead.add_ons;
                let data = [];
                let heading_added = false;
                for (var key in add_ons_backend) {
                    data.push({
                        name: add_ons_backend[key].title,
                        value: inrFormatDecimal(add_ons_backend[key].price),
                        heading: !heading_added ? 'Add ons' : ''
                    })

                    heading_added = true;
                }
                confirmDialogData.content1 = confirmDialogData.content1.concat(data);
            }
        }

        if(total_discount > 0){
            confirmDialogData.content1.push({
                'name': 'Total discount', 
                'value': inrFormatDecimal(total_discount) 
            });
        }
        if(base_premium !== net_premium){
            confirmDialogData.content1.push({
                'name': 'Net premium', 
                'value': inrFormatDecimal(net_premium) 
            });
        }

        confirmDialogData.content1.push({
            'name': 'GST',
            'value': inrFormatDecimal(gst)
        })
        

        if(!error){
            this.setState({
                bottomButtonData: bottomButtonData,
                confirmDialogData: confirmDialogData
            }, () => {
                if (this.onload) {
                    this.onload();
                }
            })
        }
    }
}


export function updateBottomPremium(premium, postfix) {
    if(this.state.premium_data){
        var value = inrFormatDecimal(premium || this.state.premium_data[this.state.selectedIndex].premium || '');
        if(this.state.provider  === 'GMC'){
            value += postfix;
        }
        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                leftSubtitle: value
            }
        })    
    }
}

export function updateBottomPremiumAddOns(premium) {
    if(this.state.add_ons_data){
        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                leftSubtitle: inrFormatDecimal(premium ||'')
            }
        })    
    }
}

export async function getApplicationDetails(application_id, providerConfig) {
    let error="";
    let errorType="";
    this.setErrorData("submit")

    this.setState({
        skelton: true
    });
    try{
        var url = `api/insurancev2/api/insurance/proposal/${providerConfig.provider_api}/get_application_details?application_id=${application_id}&form_submitted=true`;
        const res = await Api.get(url);
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            var lead = resultData.quotation_details;
            
            var member_base = ghGetMember(lead, providerConfig);
                           
            this.setState({
                lead: resultData || {},
                member_base: member_base,
                quotation: resultData.quotation_details || {},
                common_data: {
                    ...resultData.common,
                    tnc: resultData.common.tnc || resultData.tnc
                },
                insured_account_type: lead.insurance_type || ''
            }, () => {
                if (this.onload && !this.state.ctaWithProvider) {
                    this.onload();
                }
    
            })
            this.setState({
                skelton: false
            });
        }else{
            error=resultData.error || resultData.message ||true;
        }
    }catch(err){
        console.log(err)
        this.setState({
            show_loader: false
        });
        error=true;
        errorType="crash";
    }
    if(error)
    {
        this.setState({
            errorData: {
              ...this.state.errorData,
              title2: error,
              type: errorType
            },
            showError: true,
          });
    }
}

export function checkCity(city, proceed, suggestions_list){
    if(!city) {
        if(proceed) {
            this.setState({
                city_error: 'Please select city from provided list'
            });
        }
        
        return;
    }
    let data  = suggestions_list.filter(data => (data.key).toUpperCase() === (city).toUpperCase());
    if(data.length === 0) {
        this.setState({
            city_error: 'Please select city from provided list'
        });
    } else if(proceed) {
        this.getPlanList();
    }
}

export async function getPlanList(){
    this.setErrorData("submit");
        this.setState({ show_loader: 'button' });
        let error = "";
        let errorType = "";
        let {groupHealthPlanData : {post_body}} = this.state;
        let {groupHealthPlanData} = this.state;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        try {

             const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/plans/${this.state.providerConfig.provider_api}`,
             body);

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    plan_data: resultData,
                    common: resultData.common,
                    show_loader: false
                }, () => {
                    ReactTooltip.rebuild()
                    var plan_list = {}
                    
                    plan_list['plan_data'] = resultData;
                    plan_list['common'] = resultData.common;
                    groupHealthPlanData['plan_list'] = plan_list;
                    groupHealthPlanData['list_previous_data'] = this.state.current_state;
                    this.setLocalProviderData(groupHealthPlanData);
                    this.navigate('plan-list')
                })


            } else {
                error = resultData.error || resultData.message
                    || true;
            }
        } catch (err) {
            console.log(err)
            this.setState({
                skelton: false
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
              showError: "page",
              show_loader: false
            });
          }
}

export async function getPlanDetails(){
    var groupHealthPlanData = this.state.groupHealthPlanData;
    var post_body = groupHealthPlanData.post_body;
    var provider = this.state.provider;
    let allowed_post_body_keys = ['adults', 'children', 'member_details', 'plan_id'];
    
    
    if(this.state.screen_name === 'plan_list_screen'){
        this.setErrorData("submit", '', this.selectPlan); 
    }else{
        this.setErrorData("submit"); 
    }

            let error = "";
            let errorType = "";
            
            let keys_to_empty = ['selectedIndexFloater', 'selectedIndexCover', 'selectedIndexSumAssured'];
            for(var x of keys_to_empty){
                groupHealthPlanData[x] = ""
            }
        
            let keys_to_remove = ['sum_assured', 'discount_amount', 'insured_pattern','tax_amount', 'tenure','total_amount', 'type_of_plan']
            for(let key in keys_to_remove){
              delete post_body[keys_to_remove[key]]
            }

            if(provider === 'GMC'){
              post_body.plan_id = "fisdom_health_protect";
              var plan_selected = {};
              plan_selected['plan_title'] = 'fisdom HealthProtect'
              plan_selected['copay'] = '0% copay is applicable only where insured age is less than 60 yrs, there will be 20% copay for insured whose age at the time of entry is 61 yrs and above';
            
              this.setState({
                plan_selected: plan_selected
              })
              groupHealthPlanData.plan_selected = plan_selected;
            }
            if(provider === 'HDFCERGO'){
                allowed_post_body_keys.push('city');
            }
            if(provider === 'STAR'){
                allowed_post_body_keys.push('postal_code');
            }
            let body = {};

            for(let key of allowed_post_body_keys){
                body[key] = post_body[key];
            }
            groupHealthPlanData.post_body = post_body;

            this.setState({
                groupHealthPlanData: groupHealthPlanData
            })
                this.setState({ show_loader: "button"});
                try {
                    const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/plan_information/${this.state.providerConfig.provider_api}`,body);
                    var resultData = res.pfwresponse.result;
                    if (res.pfwresponse.status_code === 200) {
                        
                        groupHealthPlanData['plan_details_screen'] = resultData;
                        groupHealthPlanData['plan_list_current_state'] = this.state.current_state;
                        delete groupHealthPlanData['sum_assured_screen'];
                        this.setLocalProviderData(groupHealthPlanData);
                        this.navigate(this.state.next_screen);
                        
                    } else {
                        error = resultData.error || resultData.message
                            || true;
                    }
                } catch (err) {
                    console.log(err)
                    this.setState({
                        show_loader: false
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
                      showError: "page",
                      show_loader: false
                    });
                }
}

export async function getCityDetails(){
    this.setErrorData("onload");
    this.setState({ show_loader : 'button' });
    let error = "";
    let errorType = "";
    var groupHealthPlanData = this.state.groupHealthPlanData;
    let body = {
        "provider": this.state.providerConfig.provider_api
      };
    var city = '';
    try {
            try {

                const res = await Api.post(
                    `api/insurancev2/api/insurance/health/quotation/account_summary`,
                    body
                );
                if (res.pfwstatus_code === 200) {
                    
                    var resultData = res.pfwresponse.result;
                    if(this.state.groupHealthPlanData.city){
                        city = this.state.groupHealthPlanData.city || '';
                    }else if(Object.keys(resultData.quotation).length > 0 && resultData.quotation.city_postal_code){
                        city = resultData.quotation.city_postal_code || '';
                    }else if(Object.keys(resultData.address_details).length > 0 && resultData.address_details.city){
                        city = resultData.address_details.city || '';
                    }
                    groupHealthPlanData.city = city;
                    this.setLocalProviderData(groupHealthPlanData)
                    this.setState({
                        city: city
                    });
                } else {
                    error=
                        resultData.error ||
                        resultData.message ||
                        true
                    
                }
            } catch (err) {
                console.log(err);
                error=true;
                errorType= "crash";
            }
        const res2 = await Api.get('api/insurancev2/api/insurance/health/quotation/get_cities/hdfc_ergo');
        
        var resultData2 = res2.pfwresponse.result
        var city_object =  resultData2.map(element => {
            return {
                key: element,
                value: element
            }
        });
        
        if (res2.pfwresponse.status_code === 200) {

            var select_city = {}
            select_city['suggestions_list'] = city_object;
            select_city['city'] = city;
            groupHealthPlanData.select_city = select_city;
            this.setState({
                show_loader:false
            });    
            this.setLocalProviderData(groupHealthPlanData);
            this.navigate('plan-select-city');
            return;
        
        } else {
            error=resultData2.error || resultData2.message
                || true;
        }
    } catch (err) {
    console.log(err)
       error=true;
       errorType="crash";
    }
    if (error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error,
            type: errorType
          },
          showError: "page",
          show_loader: false
        });
      }
}


export async function getAddOnsData(){
    this.setErrorData("submit");
        
        let error = "";
        let errorType = "";
        let post_body = this.state.groupHealthPlanData.post_body;
        let groupHealthPlanData = this.state.groupHealthPlanData;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', "si"];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        if(this.state.groupHealthPlanData.account_type === "self" || Object.keys(this.state.groupHealthPlanData.post_body.member_details).length === 1){
            body['floater_type'] = 'non_floater';
        }

        let add_ons_data = this.state.groupHealthPlanData.add_ons_data || []; 
        // eslint-disable-next-line radix
        this.setState({show_loader: 'button'})
            try {
                const res = await Api.post('api/insurancev2/api/insurance/health/quotation/get_add_ons/religare', body);

                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    this.setState({
                        skelton: false
                    });
                    add_ons_data = resultData.compulsary.concat(resultData.optional)  || [];

                    
                    let options = [];
                    let opd_data_options = add_ons_data[1].price;
                    for(var key in opd_data_options){
                        let opt = {
                            name: key,
                            premium: add_ons_data[1].price[key]
                        }
                        options.push(opt);
                    }

                    let temp = add_ons_data[2];
                        add_ons_data[2] = add_ons_data[3];
                        add_ons_data[3] = temp;
                    
                    
                    if(this.state.groupHealthPlanData.post_body.si === "400000"){
                        
                        for(var item in add_ons_data){
                            if(add_ons_data[item].id === "ncb"){
                                add_ons_data[item].checked = true;
                                add_ons_data[item].disabled = true;
                                add_ons_data[item].bottom_text = "This benefit is mandatory with your selected plan";
                            }
                        }    
                    }
                    
                    
                    add_ons_data[1].price = options;
                    add_ons_data[1].default_premium = add_ons_data[1].price[0].premium;
                    add_ons_data[1].default_cover_amount = add_ons_data[1].price[0].name;
                    
                    groupHealthPlanData['add_ons_screen'] = add_ons_data;
                    groupHealthPlanData['add_ons_previous_data'] = this.state.current_state;
                    this.setLocalProviderData(groupHealthPlanData);
                    this.navigate('plan-select-add-ons')
                } else {
                    error=resultData.error || resultData.message
                        || true;
                }
            } catch (err) {
                console.log(err)
                this.setState({
                    show_loader: false
                });
                error=true;
                errorType="crash";
            }
            if (error) {
                this.setState({
                  errorData: {
                    ...this.state.errorData,
                    title2: error,
                    type: errorType
                  },
                  showError: "page",
                  show_loader: false
                });
              }
}
export async function getCoverPeriodData(){
                this.setErrorData("submit");
                this.setState({ show_loader: 'button' });
                let error = "";
                let errorType = "";
                let post_body = this.state.groupHealthPlanData.post_body;
                let groupHealthPlanData = this.state.groupHealthPlanData;
                let type_of_plan = ''
                
                let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', "plan_id", "si"];        
                let body = {};
                for(let key of allowed_post_body_keys){
                    body[key] = post_body[key];
                }
                if(this.state.provider === 'RELIGARE'){
                    body['add_ons'] = post_body.add_ons_array;
                }
                if(this.state.screen_name === 'cover_type_screen'){
                    type_of_plan = this.state.premium_data_floater[this.state.selectedIndex].key;
                    body['floater_type'] = this.state.premium_data_floater[this.state.selectedIndex].key;
                }

                if(this.state.groupHealthPlanData.account_type === "self" || Object.keys(this.state.groupHealthPlanData.post_body.member_details).length === 1){
                    body['floater_type'] = 'non_floater';
                }
                try {
               
                    const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/get_premium/${this.state.providerConfig.provider_api}`,
                    body);
                    
                    var resultData = res.pfwresponse.result;
                    
                    if (res.pfwresponse.status_code === 200){
                        groupHealthPlanData['cover_period_screen']  = resultData;
                        
                        if(this.state.screen_name === 'cover_type_screen'){
                            groupHealthPlanData.type_of_plan = type_of_plan;
                            groupHealthPlanData.post_body.floater_type = type_of_plan;
                        }
                        if(this.state.screen_name === 'add_ons_screen'){
                            groupHealthPlanData.previous_add_ons_data = this.state.current_state;
                        }
                        
                        this.setLocalProviderData(groupHealthPlanData)
                        this.navigate('plan-select-cover-period')
                        this.setState({
                            show_loader: false
                        });
                    } else {
                        error = resultData.error || resultData.message
                            || true;
                    }
                } catch (err) {
                    console.log(err)
                    this.setState({
                        show_loader: false
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
                      showError: "page",
                      show_loader: false
                    });
                }
}

export async function updateLead( body, quote_id, current_state) {

    var groupHealthPlanData = this.state.groupHealthPlanData;
    var current_form_data = current_state || {};
    var prev_form_data = {}
    if(this.state.screen_name === 'personal_details_screen' || this.state.screen_name === 'select_ped_screen'){
        prev_form_data = groupHealthPlanData['application_data'][this.state.screen_name][`${this.state.member_key}`] || {};
    }else{
        prev_form_data = !isEmpty(groupHealthPlanData.application_data) ? groupHealthPlanData.application_data[this.state.screen_name] || {}: {};
    }

    var isFormDataSame = false;
    var keys_to_check = isEmpty(Object.keys(current_form_data)) ? Object.keys(prev_form_data) : Object.keys(current_form_data)
    isFormDataSame = compareObjects(keys_to_check, prev_form_data, current_form_data);

    if(isEmpty(current_form_data) && isEmpty(prev_form_data)){
        isFormDataSame = true;
    }
    
    if(isFormDataSame){
        this.navigate(this.state.next_state);
        return;
    }else{
        if(this.state.screen_name === 'personal_details_screen' || this.state.screen_name === 'select_ped_screen'){
            var personal_details_screen = groupHealthPlanData['application_data'][this.state.screen_name];
            personal_details_screen[`${this.state.member_key}`] = current_form_data; 
            groupHealthPlanData.personal_details_screen = personal_details_screen;   
        }else{
            groupHealthPlanData['application_data'][`${this.state.screen_name}`] = current_form_data;    
        }
        this.setLocalProviderData(groupHealthPlanData)
    }   

    let error="";
    let errorType="";
    this.setErrorData("submit")
    try {
        if (!quote_id) {
            quote_id = storageService().get('ghs_ergo_quote_id');
        }
        if(body.pedcase)
            this.setState({
                skelton:true
            })
        this.setState({
            show_loader: "button"
        });
        let application_id = storageService().get('health_insurance_application_id');
         body.application_id = application_id

        const res = await Api.put(`api/insurancev2/api/insurance/proposal/${this.state.provider_api}/update_application_details` , body)
        
        var resultData = res.pfwresponse.result;
        

        this.setState({
            show_loader: false
        })
        if(body.pedcase)
            this.setState({
                skelton:false
            })
        if (res.pfwresponse.status_code === 200) {
            groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.application_form_data = resultData;
            this.setLocalProviderData(groupHealthPlanData);
            
            if (body.pedcase) { 
                this.initialize(); 
                return}
            if(this.props.edit && !this.state.force_forward) {
                this.props.history.goBack();
            } else {
                this.navigate(this.state.next_state);
            }
            
        } else {
            if (resultData.error && resultData.error.length > 0 && resultData.error[0]==='BMI check failed.') {
                groupHealthPlanData['application_data'][this.state.screen_name][this.state.member_key] = {} 
                this.setLocalProviderData(groupHealthPlanData)
                this.setState({
                    openBmiDialog: true
                }, () => {
                    this.sendEvents('next', {bmi_check: true});
                });
            } else {
                if(resultData.error && resultData.error.length > 0 && resultData.error[0] && Array.isArray(resultData.error)){
                    resultData.error = resultData.error[0]
                }
                error=
                    resultData.error ||
                    resultData.message ||
                    true;
                
            }
        }
    } catch (err) {
        console.log(err)
        this.setState({
            show_loader: false
        });
        error=true;
        errorType="crash";
    }
    if(error){
        if(this.state.screen_name === 'personal_details_screen' || this.state.screen_name === 'select_ped_screen'){
            groupHealthPlanData['application_data'][`${this.state.screen_name}`][this.state.member_key] = {}
        }else{
            groupHealthPlanData['application_data'][`${this.state.screen_name}`] = {}
        }
        this.setLocalProviderData(groupHealthPlanData);
        this.setState({
            errorData: {
              ...this.state.errorData,
              title2: error,
              type: errorType
            },
            showError: true,
          });
    }
}

export function navigate(pathname, data = {}) {

    if ((this.props.edit || data.edit) && ['select_ped_screen', 'is_ped'].indexOf(this.state.screen_name) === -1) {
        this.props.history.goBack();
    } else {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
            params: {
                forceClose: this.state.forceClose || false
            }
        });
    }

}
function setErrorData(type, dismiss, HandleClickFunc) {
  this.setState({
    showError: false,
  });
  if (type) {
    let mapper = {
      onload: {
        handleClick1: this.state.get_lead ? this.initialize : this.onload,
        button_text1: "Retry",
        title1: "",
      },
      submit: {
        handleClick1: HandleClickFunc ? HandleClickFunc : this.handleClick,
        button_text1: "Retry",
        handleClick2: () => {
          this.setState({
            showError: false,
          });
        },
        button_text2: dismiss ? "Dismiss" : "Edit",
      },
    };

    this.setState({
      errorData: { ...mapper[type], setErrorData: this.setErrorData },
    });
  }
}
export async function resetQuote() {
    this.setErrorData("submit", true, this.resetQuote)
    this.handleClose();
    this.setState({
        show_loader: "page",
        restart_conformation: true
    }, () => {
        this.sendEvents('next');
    });
    let error = "";
    let errorType = "";
    try {

        const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/${this.state.providerConfig.provider_api}/reset_previous_quotations`);

        var resultData = res.pfwresponse.result;
        
        if (res.pfwresponse.status_code === 200) {
            
            let next_state = `/group-insurance/group-health/${this.state.provider}/insure-type`;
            if(this.state.provider === 'GMC'){
                var groupHealthPlanData = this.state.groupHealthPlanData || {};
                groupHealthPlanData['goodHDec'] = false;
                this.setLocalProviderData(groupHealthPlanData)
            }
            this.navigate(next_state);
            this.setState({
                resultData: resultData
            })
        } else {
            error = resultData.error || resultData.message
                || true;
        }
    } catch (err) {
        console.log(err)
        this.setState({
            show_loader: false
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
          show_loader: false
        });
        
      }
}

export function openInBrowser(url, type) {

    if(!url) {
        return;
    }

    this.sendEvents('next', {more_info: type});

    let mapper = {
        'tnc' : {
            header_title: 'Terms & Conditions',
            file_name: 'terms_and_conditions'
        },
        'read_document' : {
            header_title: 'Read Detailed Document',
            file_name: 'read_detailed_document'
        }
    }

    let mapper_data = mapper[type];

    if(getConfig().Android && !getConfig().isWebCode) {
        nativeCallback({
            action: 'download_on_device',
            message: {
                url: url || '',
                file_name: mapper_data.file_name + '.pdf'
            }
        });
    } else {

        if (!getConfig().Web) {
            this.setState({
                show_loader: true
            })
        }
    
    
        
    
        let data = {
            url: url,
            header_title: mapper_data.header_title,
            icon: 'close'
        };
    
        openPdfCall(data);

        // let open_inapp_tab_hs = isFeatureEnabled(getConfig(), 'open_inapp_tab_hs');

        // if(open_inapp_tab_hs) {
    
        //     if(!getConfig().Web) {
        //         url = "https://docs.google.com/gview?embedded=true&url=" + url;
        //     }
            
        //     nativeCallback({
        //         action: 'open_inapp_tab',
        //         message: {
        //             url: url || ''
        //         }
        //     });
        // } else {
        //     if (!getConfig().Web) {
        //         this.setState({
        //             show_loader: true
        //         })
        //     }
        
        //     let mapper = {
        //         'tnc' : {
        //             header_title: 'Terms & Conditions',
        //         },
        //         'read_document' : {
        //             header_title: 'Read Detailed Document',
        //         }
        //     }
        
        //     let mapper_data = mapper[type];
        
        //     let data = {
        //         url: url,
        //         header_title: mapper_data.header_title,
        //         icon: 'close'
        //     };
        
        //     openPdfCall(data);
        // }
    }

    
    
}

export function openPdf(pdfLink, pdfType){
    
    if(getConfig().iOS){
        nativeCallback({
          action: 'open_inapp_tab',
          message: {
              url: pdfLink  || '',
              back_url: ''
          }
        });
    }else{
        this.openInBrowser(pdfLink, pdfType);
    }
}

export function setEditTitle(string) {

    if(this.props.edit) {
        return getEditTitle(string);
    }

    return string;
}

export function openMedicalDialog(type) {
    let data = {
        'header_title': 'Free medical check-up',
        'content': 'Based on your details, a medical checkup will be required to issue the policy. HDFC ERGO team will contact you for the <b>free medical checkup</b> after the policy payment.', //ppc
        'icon': `${getConfig().productName}/ic_medical_checkup2.svg`,
        'dialog_name': 'medical_dialog',
        'button_text1': 'CONTINUE TO PAYMENT',
        'handleClick1': this.redirectToPayment
    };
    let provider = this.state.provider;

    if(provider === 'HDFCERGO') {
        data = {
            ...data,
            'header_title': 'Free medical check-up',
            'content': 'Based on your details, a medical checkup will be required to issue the policy. HDFC ERGO team will contact you for the <b>free medical checkup</b> after the policy payment.', //ppc
            
        }
    
        if(type === 'ped') {
            data.content = 'Your details will be reviewed by the HDFC Ergo team before policy issuance. You may be contacted for a <b>free medical checkup</b> after the policy payment.'
        }
    }

    if(provider === 'RELIGARE') {
        data = {
            ...data,
            'header_title': 'Medical Review',
            'content': 'Please note that basis your health declaration, Care Health team may contact you for a medical review before policy issuance', //ped only
        }
    }

    if(provider === 'STAR') {
        data = {
            ...data,
            'header_title': 'Medical Review',
            'content': 'Please note that basis your health declaration, Star’s team may contact you for a medical review before policy issuance', //ped only
        }
    }
    

    this.setState({
        medical_dialog: true,
        medical_dialog_data: data,
        medical_dialog_opened: true,
        show_loader: false
    })
   
}

export function setLocalProviderData(data) {
    storageService().setObject('groupHealthPlanData_' + this.state.provider, data);
}

export function memberKeyMapper(member_key) {
    const final_dob_list = memberKeyMapperFunction(this.state.groupHealthPlanData);
    return final_dob_list.filter(data => data.key === member_key)[0];
}