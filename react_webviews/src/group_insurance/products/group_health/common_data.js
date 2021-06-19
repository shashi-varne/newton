import { storageService, inrFormatDecimal, getEditTitle, compareObjects } from 'utils/validators';
import React from 'react'
import { getConfig, 
    // isFeatureEnabled
 } from 'utils/functions';
import { ghGetMember, getCssMapperReport } from '../../constants';
import Api from 'utils/api';
import {  openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';
import {isEmpty, sortArrayOfObjectsByTime, getDateBreakup, capitalizeFirstLetter, capitalize} from '../../../utils/validators';
import ReactTooltip from "react-tooltip";
import {getGhProviderConfig, memberKeyMapperFunction} from './constants';
import {TitleMaper, reportsfrequencyMapper, reportTopTextMapper, reportCoverAmountValue} from '../../../group_insurance/constants'

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

            var groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.application_form_data = resultData;
            var application_data = !isEmpty(groupHealthPlanData.application_data) ? groupHealthPlanData.application_data  : {} ;
            application_data['personal_details_screen'] = groupHealthPlanData.application_data && !isEmpty(groupHealthPlanData.application_data.personal_details_screen) ? groupHealthPlanData.application_data.personal_details_screen : {}
            application_data['select_ped_screen'] = groupHealthPlanData.application_data && !isEmpty(groupHealthPlanData.application_data.select_ped_screen) ? groupHealthPlanData.application_data.select_ped_screen : {}
            groupHealthPlanData.application_data = application_data;
            this.setLocalProviderData(groupHealthPlanData);
                           
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
                    if(!isEmpty(groupHealthPlanData.previous_add_ons_data)){
                        groupHealthPlanData.previous_add_ons_data = {}
                    }
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
            var groupHealthPlanData = this.state.groupHealthPlanData || {};
            if(this.state.provider === 'GMC'){
                groupHealthPlanData['goodHDec'] = false;
                this.setLocalProviderData(groupHealthPlanData)
            }
            if(!isEmpty(groupHealthPlanData.application_data)){
              groupHealthPlanData.application_data = {};
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

export function filterReportData(reportData){
    var activeReports = [], pendingReports = [], inactiveReports = [];
    var pending_statuses = ['pending', 'init', 'incomplete', 'pending_from_vendor', 'request_pending', 'plutus_submitted', 'payment_done'];
    var issued_statuses = ['issued', 'policy_issued', 'success', 'complete'];
    
    reportData.forEach(report =>{
      let policy_status = report.status;
      if(issued_statuses.indexOf(policy_status.toLowerCase()) > -1){
        report.main_status = 'active'
        activeReports.push(report)
      }else if(pending_statuses.indexOf(policy_status.toLowerCase()) > -1 ){
        report.main_status = 'pending'
        pendingReports.push(report)
      }else{
        report.main_status = 'inactive'
        inactiveReports.push(report)
      }
    })
    return {activeReports, pendingReports, inactiveReports};
}

export async function getReportCardsData(){
    let error = '';
    let errorType = '';
    this.setErrorData('onload');
    try {

      let res = await Api.get('api/ins_service/api/insurance/get/report');
      if (res.pfwresponse.status_code === 200) {

        var policyData = res.pfwresponse.result.response;
        var next_page = policyData.group_insurance.next_page;
        var has_more = policyData.group_insurance.more;

        this.setState({
          nextPage: (has_more) ? next_page : ''
        })

        let o2o_applications = policyData.o2o_applications;          
        // this.setReportData(policyData.term_insurance, ins_policies, o2o_applications);
        let group_insurance_policies = policyData.group_insurance || {};
        let health_insurance_policies = policyData.health_insurance || {};
        let term_insurance_policies = policyData.term_insurance || {};
        this.setState({
          skelton: false
        })
        this.setReportData(term_insurance_policies, group_insurance_policies, health_insurance_policies , o2o_applications);
      } else {
        error=res.pfwresponse.result.error || res.pfwresponse.result.message
          || true;
        // this.setState({ nextPage: ''})
      }

    } catch (err) {
      console.log(err)
      this.setState({
        skelton: false
      });
      error=true;
    }
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:'page'
      })
    }
    window.addEventListener("scroll", this.onScroll, false);
}

export function setReportData(termData, group_insurance_policies, health_insurance_policies  , o2o_applications ) {
    let canShowReport = false;
    let application;
    let pathname = ''

    if (!termData.error) {
      canShowReport = true;
      let insurance_apps = termData.insurance_apps;
      if (insurance_apps.complete.length > 0) {
        canShowReport = true;
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        canShowReport = true;
        application = insurance_apps.failed[0];
        pathname = 'report';
      } else if (insurance_apps.init.length > 0) {
        canShowReport = true;
        application = insurance_apps.init[0];
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        canShowReport = true;
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
      }

    } 

    let fullPath = '/group-insurance/term/' + pathname;

    let reportData = [];

    if (canShowReport && !isEmpty(application)) {
      let termReport = {
        status: application.status,
        product_name: application.quote.insurance_title,
        sum_assured: application.quote.cover_amount, //TODO
        premium: application.quote.quote_json.premium,
        key: 'TERM_INSURANCE',
        product_key: 'TERM_INSURANCE',
        product_category: application.quote.cover_plan + ' insurance',
        id: application.id, 
        logo: application.quote.quote_describer.image,
        product_title: application.quote.insurance_title,
        frequency: application.quote.quote_json.payment_frequency,
        company_name: 'HDFC Life Insurance',
        name: application.profile.name
        //TODO
        ///  , valid upto, date_cmp,
      }

      if (!termReport.product_name) {
        termReport.product_name = application.quote.quote_provider + ' ' + application.quote.quote_json.cover_plan;
      }

      let data = getCssMapperReport(termReport);
      termReport.status = data.status;
      termReport.cssMapper = data.cssMapper;

      reportData.push(termReport)
    }

    let hs_policies = health_insurance_policies.insurance_apps || [];
    for (let i = 0; i < hs_policies.length; i++) {
      let policy = this.getProviderObject(hs_policies[i]);
      reportData.push(policy);
    } 

    let ins_policies = group_insurance_policies.ins_policies || [];
    for (let i = 0; i < ins_policies.length; i++) {
      let policy = this.getProviderObject(ins_policies[i]);
      reportData.push(policy);
    }

    let o2o_details = o2o_applications || []; 
    for(let i = 0; i< o2o_details.length; i++){
      let policy = this.getProviderObject_offline(o2o_details[i]);
      reportData.push(policy);
    }
    
    var filteredReportData = filterReportData(reportData);
    var activeReports = sortArrayOfObjectsByTime(filteredReportData.activeReports, 'dt_updated_cmp');
    var pendingReports = sortArrayOfObjectsByTime(filteredReportData.pendingReports, 'dt_updated_cmp');
    var inactiveReports = sortArrayOfObjectsByTime(filteredReportData.inactiveReports, 'dt_updated_cmp');
    filteredReportData = {activeReports, pendingReports, inactiveReports}
    var bracketColor = this.state.productName === 'fisdom' ? '#A998D2' : '#94C5FF'
    for(var x in filteredReportData){
        var tabData = filteredReportData[x];
        var reports = [];
        for(var y of tabData){
            var temp = {}
            var frequency = y.frequency || y.payment_frequency;
            var provider = y.provider || y.vendor;
            temp = {
                //data
                ...y,
                topTextLeft: y.cssMapper.disc, 
                topTextRight:  (y.product_category && y.product_category.toUpperCase()) || '',
                headingTitle:  y.product_title,
                headingSubtitle: y.company_name,
                headingLogo: y.report_logo,
                status: y.status,
                key: provider,
                //css
                backgroundColor: y.cssMapper.backgroundColor,
                color: y.cssMapper.color,
                topTextRightColor: bracketColor
            }
            var bottomValues = [
             {
                'title': 'COVER AMOUNT',
                'subtitle': reportCoverAmountValue(y.sum_assured),
            },
            {
                'title': 'PREMIUM AMOUNT',
                'subtitle': inrFormatDecimal(y.premium),
                'postfix': <span className="details-card-postfix">{reportsfrequencyMapper(provider, frequency, y.product_key)}</span>
            },
            {
                'title': 'Policy issued to',
                'subtitle': y.name && capitalize(y.name),
            },
            {
                'title': 'Valid upto',
                'subtitle': !y.dt_policy_end ? 'Not available' : y.dt_policy_end.replace(/-/g, '/'),
            },
            ]
            temp.bottomValues = bottomValues; 
            reports.push(temp);
        }
        filteredReportData[x] = reports;
    }

    var reportTopText = reportTopTextMapper['activeReports'];
    var selectedReports = filteredReportData.activeReports;

    var prevSelectedTab = storageService().getObject('reportSelectedTab');
    var tabIndex = 0;
    var selectedTab = 'activeReports';
    if(prevSelectedTab){
        var tabMap = {
            'activeReports': 0,
            'pendingReports': 1,
            'inactiveReports': 2
          }
          tabIndex = tabMap[prevSelectedTab];
          selectedTab = prevSelectedTab;
          console.log({prevSelectedTab, tabIndex, selectedTab})
        storageService().remove('reportSelectedTab');
    }
    
    this.setState({
      reportData,
      selectedTab,
      reportCount: {
        active: filteredReportData.activeReports.length,
        pending: filteredReportData.pendingReports.length,
        inactive: filteredReportData.inactiveReports.length
      },
      selectedReports,
      filteredReportData,
      termRedirectionPath: fullPath,
      reportTopText,
      bracketColor, 
      tabIndex
    })
  }

export function getProviderObject(policy) {
    let provider = policy.vendor || policy.provider;
    let obj = policy;
    let formatted_valid_from = ''
    obj.key = provider;

    if(['hdfc_ergo','star','religare'].indexOf(provider) !== -1 ){
      let valid_from = obj.valid_from ? getDateBreakup(obj.valid_from): '';
      let formatted_day = valid_from && valid_from.plainDate.toString().length === 1 ? '0'+valid_from.plainDate : valid_from.plainDate ;
      formatted_valid_from = formatted_day +' '+ valid_from.month +' '+ valid_from.year;
    }
    
    if (provider === 'hdfc_ergo') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        product_title : 'my:health Suraksha',
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }else if( provider === 'FYNTUNE'){
      obj = {
        ...obj,
        product_name: policy.base_plan_title,
        product_title: policy.base_plan_title,
        top_title: 'Life Insurance',
        key: 'FYNTUNE',
        id: policy.fyntune_ref_id, 
        premium: policy.total_amount,
        frequency: policy.frequency ? policy.frequency.toLowerCase() : 'annually'
      };
    } else if (provider === 'care_plus') {
      obj = {
        ...obj,
        product_name: policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    } else if (provider === 'religare') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }  else if (provider === 'star') {
      obj = {
        ...obj,
        product_name: policy.base_plan_title + ' ' + policy.product_title,
        top_title: 'Health insurance',
        key: policy.vendor,
        id: policy.application_id,
        premium: Math.round(policy.total_amount),
        provider: policy.vendor,
        valid_from: formatted_valid_from
      };
    }  else if (provider === 'BHARTIAXA') {
      obj = {
        ...obj,
        // product_name: policy.product_title,
        product_name: 'Bharti AXA General Insurances',
        top_title: policy.product_title,
        product_key: policy.product_name,
        id: policy.policy_id
      }
    } else if (provider === 'EDELWEISS') {
      obj = {
        ...obj,
        product_name: 'Term insurance (Edelweiss tokio life zindagi plus)',
        top_title: 'Term insurance',
        id: policy.policy_id
      }
    }

    // var product_category_key = provider === 'BHARTIAXA' ? obj.product_key: obj.key;
    // obj['product_category'] = productNameMapper(product_category_key)

    let data = getCssMapperReport(obj);
    obj.status = data.status;
    obj.cssMapper = data.cssMapper;
    return obj;
  }

  export function getProviderObject_offline(o2o_details){
    let obj = o2o_details;
    obj.key = 'insurance';
    let top_title  = TitleMaper(o2o_details.policy_type)
    obj.top_title = top_title
    obj.sum_assured = o2o_details.cover_amount
    obj.product_category = o2o_details.product_category + ' insurance'
    obj.product_title = capitalizeFirstLetter(o2o_details.product_name)
    let data = getCssMapperReport(obj);
    obj.premium = o2o_details.total_amount;
    obj.status = data.status;
    obj.cssMapper = data.cssMapper;
    obj.product_key = 'offline_insurance';
    return obj;
  }
