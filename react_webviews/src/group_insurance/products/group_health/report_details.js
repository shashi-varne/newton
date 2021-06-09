 import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {
    inrFormatDecimal,
    numDifferentiationInr, dateOrdinal , capitalizeFirstLetter, convertDateFormat, storageService
} from 'utils/validators';
import Api from 'utils/api';
import ic_hs_special_benefits from 'assets/ic_hs_special_benefits.svg';
import ic_hs_main_benefits from 'assets/ic_hs_main_benefits.svg';
import { initialize, openPdf } from './common_data';
import { ghGetMember, getCssMapperReport } from '../../constants';
import download from 'assets/download.svg';
import text_error_icon from 'assets/text_error_icon.svg';
import ReactHtmlParser from 'react-html-parser';
import { childeNameMapper , ProviderName } from '../../constants';
import {getCoverageType} from './constants';
import {Imgc} from 'common/ui/Imgc';


var hide_policy_period = ['incomplete', 'expired', 'rejected', 'policy_expired', 'failed', 'cancelled', 'Pending', 'Rejected', 'declined']
class GroupHealthReportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            premium_data: {
                WF: []
            },
            extra_data: {
                benefits: {
                    main: []
                },
                special_benefits: [],
                waiting_period: []
            },
            lead: {
                member_base: []
            },
            policy_data: {
                cssMapper: {}
            },
            skelton:true,
            ic_hs_special_benefits: ic_hs_special_benefits,
            ic_hs_main_benefits: ic_hs_main_benefits,
            dURL:""
        }

        this.initialize = initialize.bind(this);
        this.openPdf = openPdf.bind(this);

    }

    componentWillMount() {
        this.initialize();
        const { policy_id } = this.props.match.params;
        this.setState({
            policy_id: policy_id
        })
    }
    async componentDidMount() {
        this.onload();
    }
    componentDidUpdate(){
        var pending_statuses = ['pending', 'init', 'incomplete', 'pending_from_vendor', 'request_pending', 'plutus_submitted'];
        var issued_statuses = ['issued', 'policy_issued', 'success', 'complete'];
        var reportSelectedTab = '';
        var policy_status = this.state.policy_data.status;
        if(policy_status){
            if(issued_statuses.indexOf(policy_status.toLowerCase()) > -1){
                reportSelectedTab = 'activeReports';
            }else if(pending_statuses.indexOf(policy_status.toLowerCase()) > -1 ){
              reportSelectedTab = 'pendingReports';
            }else{
              reportSelectedTab = 'inactiveReports';
            }
            storageService().setObject('reportSelectedTab', reportSelectedTab)    
        }
        
    }
    onload = async()=>{
        this.setErrorData("onload");
        let error='';
        let errorType='';
        try {        
            
            const res = await Api.get(`api/insurancev2/api/insurance/health/policy/${this.state.providerConfig.provider_api}/check_status?application_id=${this.state.policy_id}`);
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                let lead = {};
                let member_details = {};

                let policy_data = resultData.policy || {};
                let common_data = resultData.common;
                let payment_details = resultData.payment_details;
                let application_details = resultData.application_details;
                
                payment_details.payment_success_dt = convertDateFormat(payment_details.payment_success_dt)
                
                policy_data.valid_from = convertDateFormat(policy_data.valid_from)
                policy_data.valid_upto = convertDateFormat(policy_data.valid_upto)
                
                lead.insurance_type = resultData.quotation_details.insurance_type;
                let insured_members = resultData.insured_member_details;
                for(var i = 0; i < insured_members.length; i++){
                    member_details[insured_members[i].relation_key]  = insured_members[i];
                }

                if(['parents', 'parents_in_law', 'family'].includes(lead.insurance_type)) {
                    member_details['self_account_key'] = resultData.buyer_details;
                }

                lead.member_details = member_details;
                lead.member_base = ghGetMember(lead, this.state.providerConfig);
                let member_base = lead.member_base;
                let applicantIndex = member_base.findIndex(item => item.key === 'applicant');
                if(applicantIndex >= 0) {
                    let appli_data = member_base[applicantIndex];
                    member_base.splice(applicantIndex, 1);
                    member_base.splice(0, 0, appli_data);
                }
                policy_data.provider = this.state.providerConfig.key
                let data = getCssMapperReport(policy_data);
                policy_data.status = data.status;
                policy_data.cssMapper = data.cssMapper;

                if(this.state.provider === "GMC"){
                    var premium_payment_frequency = resultData.quotation_details.payment_frequency === "YEARLY" ? 'Annual' : 'Monthly';
                }
                
                this.setState({
                    resultData: resultData,
                    common_data: common_data,
                    extra_data: resultData.plan_details,
                    policy_data: policy_data,
                    quote_info: resultData.plan_details,
                    lead: lead,
                    quotation_details: resultData.quotation_details,
                    applicantIndex: applicantIndex,
                    application_details: application_details,
                    payment_details: payment_details,
                    premium_payment_frequency: premium_payment_frequency
                })
                this.setState({
                    skelton:false
                });

            } else {
                error=resultData.error || resultData.message
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
            });
        }
    }


    downloadPolicy = (url) => {
        if(url){
            this.setState({
                dURL:url
            })
        }else{
            url=this.state.dURL
        }
       
        if (this.state.download_link || url) {
            // this.sendEvents('download');
            nativeCallback({
                action: 'open_in_browser',
                message: {
                    url: this.state.download_link || url
                }
            });
        } else {
            this.getDownloadLink();
        }

        this.setState({
            download_policy: true
        }, ()=>{
            this.sendEvents('next');
        })

    }

    getDownloadLink = async () => {
        this.setErrorData("submit", true, this.downloadPolicy)
        let error = "";
        let errorType = "";
        try {

            this.setState({
                show_loader: "page"
            });

           const res = await Api.get(`api/insurancev2/api/insurance/health/policy/${this.state.providerConfig.provider_api}/policy_download?application_id=${this.state.policy_id}`);
        
            var resultData = res.pfwresponse.result;
            this.setState({
                show_loader:false
            })
            if (res.pfwresponse.status_code === 200) {  
                let download_link = resultData.download_link;
                this.setState({
                    download_link: download_link
                })

                this.downloadPolicy(download_link);


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
        if(error){
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

    navigateBenefits = (type) => {

        let provider = this.state.provider;
        this.setState({
            how_to_claim_clicked: type === 'how_to_claim' ? true : false
        }, () => {
            this.sendEvents('next');

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
                    'pathname': `/group-insurance/group-health/${this.state.provider}/how-to-claim`
                }
            }
    
    
            let mapper_data = data_mapper[type];
    
            let renderData = {
                'header_title': mapper_data.header_title,
                'header_subtitle': mapper_data.header_subtitle || `${this.state.provider === 'STAR'? this.state.providerData.title2 : this.state.providerData.subtitle} ${this.state.provider === "HDFCERGO" ? this.state.plan_selected.plan_title: this.state.provider === 'STAR'? this.state.providerConfig.subtitle:''}`,
                'bottom_title': '*For detailed list, please refer policy prospectus',
                'steps': {
                    'options': mapper_data.steps
                },
                'cta_title': 'OKAY'
            }
    
            if (type === 'how_to_claim') {
                if(provider === 'HDFCERGO') {
                    renderData.page_title = 'HDFC ERGO provides cashless as well as reimbursement claim facility';
                    renderData.contact_email = 'healthclaims@hdfcergo.com';
                    renderData.steps = [
                        {
                            'title': 'Cashless claims:',
                            'subtitle': 'In this type of health insurance claim, the insurer company settles all the hospitalisation bills with the hospital directly. However, an insured needs to be hospitalized only at a network hospital and have to show the health card (issued after policy generation)  and valid photo ID'
                        },
                        {
                            'title': 'Reimbusment claims :',
                            'subtitle': 'In this type of claim process, the policyholder pays for the hospitalisation expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case. In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then makes a payment to the insured.'
                        }
                    ]
                }
                let basePath = `/group-insurance/group-health/${provider}/`;
                if(provider === 'RELIGARE' || provider === 'GMC' ) {
                    this.props.history.push({
                      pathname: basePath + 'how-to-claim-religare',
                      search: getConfig().searchParams,
                      params: {
                          cta_title: 'OKAY' 
                      }
                  });
                  return;
                }
    
                if(provider === 'STAR') {
                    this.navigate(basePath + 'how-to-claim-star');
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
        })
       
    }


    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action) {
        let providor_name = this.state.providerConfig.provider_api ? ProviderName(this.state.providerConfig.provider_api) : '';

        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                'policy': 'Health insurance',
                'policy_status': this.state.policy_data.status ? this.state.policy_data.status === 'policy_issued' ? 'Issued': capitalizeFirstLetter(this.state.policy_data.status.toLowerCase()) : '',
                "provider_name":  capitalizeFirstLetter(providor_name),
                "screen_name": 'policy_details',
                "how_to_claim": this.state.how_to_claim_clicked ? 'yes' : 'no',
                "plan_details": this.state.plan_details_clicked ? 'yes': 'no',
                "download_policy":  this.state.download_policy ? 'yes' : 'no',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    renderSteps = (option, index) => {
        return (
            <div key={index} className="tile">
                <Imgc className="icon" 
                    className="render-steps-icon"
                    src={option.img} alt="Gold" />
                <div className="content">
                    <div className="content">
                        <div className="content-title">{ReactHtmlParser(option.content)}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderMembertop = (props, index) => {
        if (props.key === 'applicant') {
            return (
                <div className="member-tile" key={index}>
                    <div className="mt-left">
                        <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                    </div>
                    <div className="mt-right">
                        <div className="mtr-top">
                            Applicant name
                        </div>
                        <div className="mtr-bottom">
                            {props.name}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="member-tile" key={index}>
                    <div className="mt-left">
                        <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                    </div>
                    <div className="mt-right">
                        <div className="mtr-top">
                        {this.state.applicantIndex === -1 ? (this.state.lead.insurance_type !== 'self' ? dateOrdinal(index + 1) : '') :dateOrdinal(index)} Insured name
                        </div>
                        <div className="mtr-bottom">
                            {props.name} <span style={{textTransform: 'none'}}> {props.key === 'self' && this.state.quotation_details.insurance_type === 'self'? '': `(${childeNameMapper(props.key)})`}</span>
                        </div>
                    </div>
                </div>
            );
        }

    }

    handleClick = () => {
        this.setState({
            showPlanDetails: false
        })
    }

    render() {
        let {provider} = this.state;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={'Health insurance'}
                fullWidthButton={true}
                buttonTitle="OKAY"
                onlyButton={true}
                handleClick={() => this.handleClick()}
                noFooter={!this.state.showPlanDetails}
            >
                 <div className="group-health-plan-details group-health-final-summary group-health-report-details">

                    <div style={{ margin: '18px 0 12px 0'}} className={`report-color-state`}>
                        <div className="circle" style={{ backgroundColor: this.state.policy_data.cssMapper.color}}></div>
                        <div className="report-color-state-title" style={{ color: this.state.policy_data.cssMapper.color}}>{this.state.policy_data.cssMapper.disc}</div>
                    </div>
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <div className="tc-title">{provider === 'HDFCERGO' ? this.state.providerData.subtitle  : this.state.provider === 'STAR' ? this.state.providerConfig.title: ''}</div>
                            <div className="tc-subtitle" style={{marginTop: (this.state.provider === 'GMC' || this.state.provider === 'RELIGARE') ? "-22px": "", fontSize: '17px'}} >{Object.keys(this.state.plan_selected).length > 0 && this.state.provider !== 'STAR' ? this.state.plan_selected.plan_title : this.state.provider === 'HDFCERGO' && this.state.quotation_details ? this.state.providerConfig.hdfc_plan_title_mapper[this.state.quotation_details.plan_id]: this.state.providerConfig.subtitle}</div>
                        </div>

                        <div className="tc-right">
                            <Imgc className="insurance-logo-top-right" src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                        {this.state.lead.member_base.map(this.renderMembertop)}

                        <div className="member-tile">
                            <div className="mt-left">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    SUM INSURED
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.quotation_details && numDifferentiationInr( this.state.quotation_details.individual_sum_insured)}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVER PERIOD
                                </div>
                                <div className="mtr-bottom">
                                    {
                                        this.state.quotation_details ? this.state.quotation_details.tenure > 1 ? `${this.state.quotation_details.tenure} years`: `${this.state.quotation_details.tenure} year` : ''
                                    }

                                </div>
                            </div>
                        </div>

                       {this.state.quotation_details && this.state.quotation_details.insurance_type !== 'self' && 
                        <div className="member-tile">
                            <div className="mt-left">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVERAGE TYPE
                                </div>
                                <div className="mtr-bottom">
                                    {getCoverageType(this.state.resultData)}
                                </div>
                            </div>
                        </div>}

                        <div className="member-tile">
                            <div className="mt-left">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                 TOTAL PREMIUM
                                </div>

                                <div className="mtr-bottom flex" style={{textTransform:'none'}}>
                                        <div>
                                            <div>  { this.state.quotation_details && inrFormatDecimal(this.state.quotation_details.total_premium - this.state.quotation_details.gst)} </div>
                                            <div style={{fontSize:10}}> {this.state.provider !== 'GMC' ? '(Net premium)' : '(Basic premium)'}</div>
                                        </div>
                                        <div>
                                            &nbsp;+&nbsp;
                                        </div>
                                        <div>
                                            <div>{this.state.quotation_details && inrFormatDecimal(this.state.quotation_details.gst)} </div>
                                            <div style={{fontSize:10}}>(18% GST) </div>
                                        </div>
                                        <div>
                                        &nbsp;=&nbsp;
                                        </div>
                                        <div>
                                         {this.state.quotation_details && inrFormatDecimal(this.state.quotation_details.total_premium)}
                                        </div>
                                </div>

                            </div>
                        </div>

                        {this.state.provider === 'GMC' ? ( 
                        <div className="member-tile">
                            <div className="mt-left">
                                <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/cash-payment.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    PREMIUM PAYMENT FREQUENCY
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.premium_payment_frequency}
                                </div>
                            </div>
                        </div>): null}

                    </div>

                    <div className="member-tile">
                        <div className="mt-left">
                            <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_date_payment.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                DATE OF PAYMENT
                                </div>
                            <div className="mtr-bottom">
                            {this.state.payment_details && this.state.payment_details.payment_success_dt} 
                            </div>
                        </div>
                    </div>
                    
                    {hide_policy_period.indexOf(this.state.policy_data.status) === -1 ? (
                    <div className="member-tile">
                        <div className="mt-left">
                            <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_policy_period.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                POLICY PERIOD
                                </div>
                            <div className="mtr-bottom">
                            {
                                this.state.policy_data && this.state.policy_data.status === 'policy_issued' ? `${this.state.policy_data.valid_from} - ${this.state.policy_data.valid_upto}`: 'To be issued'
                            }
                            </div>
                        </div>
                    </div>) : (null)
                    }
                    

                    {this.state.policy_data.status && this.state.policy_data.status === 'policy_issued' &&
                      <div className="member-tile">
                        <div className="mt-left">
                            <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                POLICY NUMBER
                                </div>
                            <div className="mtr-bottom">
                                {this.state.policy_data.policy_number || '-'}
                            </div>
                        </div>
                    </div>}

                    {this.state.policy_data && this.state.policy_data.status === 'pending' &&
                      <div className="member-tile">
                        <div className="mt-left">
                            <Imgc className="imgc-tile" src={require(`assets/${this.state.productName}/ic_hs_policy.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                PROPOSAL NUMBER
                                </div>
                            <div className="mtr-bottom">
                                {this.state.application_details && (this.state.application_details.proposal_number || '-')}
                            </div>
                        </div>
                    </div>}

                   {this.state.policy_data.vendor_action_required_message &&
                    <div style={{ margin: '30px 0 30px 0', display: 'flex', 
                    position: 'relative',background: '#FDF5F6'}} 
                    className="highlight-text highlight-color-info">
                        <div>
                        <Imgc className="highlight-text11"
                            src={text_error_icon}
                            alt="info" />
                        </div>

                        <div>
                            <div className="highlight-text1">
                                <div className="highlight-text12" style={{ display: 'flex' }}>
                                    {this.state.policy_data.vendor_action_required_title}
                                </div>
                            </div>
                            <div className="highlight-text2" style={{ color: '#767E86', marginLeft: 7 }}>
                                {this.state.policy_data.vendor_action_required_message}
                            </div>
                        </div>
                    </div>}

                    {!this.state.showPlanDetails &&
                        <div className="report-detail-download" style={{border: 'none'}}>

                            <div className="report-detail-download-text" style={{ fontWeight: 400 }} onClick={() => {
                                this.setState({
                                    showPlanDetails: !this.state.showPlanDetails,
                                    plan_details_clicked: true
                                }, () => {
                                    this.sendEvents('next');
                                })
                            }}>
                                Plan Details
                            </div>
                            {this.state.policy_data && this.state.policy_data.status === 'policy_issued' &&
                                <div className="flex">
                                    <div style={{ color: '#d8dadd', margin: '0 22px' }}>
                                        |
                                    </div>

                                    <div className="flex"
                                        onClick={() => this.downloadPolicy()}>
                                        <Imgc style={{width: '16px', height: '16px', margin: '0'}} src={download} alt="" />
                                        <div className="report-detail-download-text" style={{ fontWeight: 400 }}>Download Policy</div>
                                    </div>

                                </div>
                            }
                        </div>
                    }

                    {this.state.showPlanDetails &&
                        <div>

                            <div className="common-how-steps" style={{ border: 'none', marginTop: 0, marginBottom: 0 }}>
                                <div className="top-tile">
                                    <div className="top-title">
                                        Plan highlights
                            </div>
                                </div>


                                <div className="special-benefit"
                                    style={{ backgroundImage: `url(${this.state.ic_hs_special_benefits})` }}>
                                    <Imgc className="imgc-tile1 special-benefit-img" src={require(`assets/ic_hs_special.svg`)}
                                        alt="" />
                                    <span className="special-benefit-text">Special features</span>
                                </div>
                                <div className='common-steps-images'>
                                    {this.state.extra_data.benefits.special.map(this.renderSteps)}
                                </div>

                                <div className="special-benefit"
                                    style={{ backgroundImage: `url(${this.state.ic_hs_main_benefits})` }}>
                                    <Imgc className="imgc-tile1 special-benefit-img" src={require(`assets/ic_hs_main.svg`)}
                                        alt="" />
                                    <span className="special-benefit-text">Key benefits</span>
                                </div>
                                <div className='common-steps-images'>
                                    {this.state.extra_data.benefits.main.map(this.renderSteps)}
                                </div>
                            </div>

                            <div className="common-how-steps" style={{ border: 'none', marginTop: '-45px', marginBottom: 0 }}>
                                <div className="top-tile">
                                    <div className="top-title" style={{marginBottom: '-10px'}}>
                                        Waiting period
                            </div>
                                </div>
                                <div className='common-steps-images'>
                                    {this.state.extra_data.waiting_periods.map(this.renderSteps)}
                                </div>

                            </div>

                            <div className="accident-plan-read" style={{ padding: 0 }}>
                        
                           <div className="accident-plan-read-text">
                             *For detailed list of all terms and conditions, please refer
                             <span
                               style={{ color: getConfig().primary }}
                               onClick={() =>
                                 this.openPdf(
                                   this.state.common_data.policy_prospectus,
                                   "read_document"
                                 )
                               }
                             >
                               &nbsp;policy prospectus
                             </span>
                           </div>
                         </div>

                        </div>}

                    <div className="bototm-design">
                        {this.state.showPlanDetails &&
                            <div className="bd-tile" onClick={() => this.navigateBenefits('whats_included')}>
                                <Imgc className="bf-img imgc-tile" src={require(`assets/${this.state.productName}/ic_whats_covered.svg`)}
                                    alt="" />
                                <div className="bd-content">What is covered?</div>
                            </div>}
                        {this.state.showPlanDetails && <div className="bd-tile" onClick={() => this.navigateBenefits('whats_not_included')}>
                            <Imgc className="bf-img imgc-tile" src={require(`assets/${this.state.productName}/ic_whats_not_covered.svg`)}
                                alt="" />
                            <div className="bd-content">What is not covered?</div>
                        </div>}
                        <div className="bd-tile" onClick={() => this.navigateBenefits('how_to_claim')}>
                            <Imgc className="bf-img imgc-tile" src={require(`assets/${this.state.productName}/ic_how_to_claim.svg`)}
                                alt="" />
                            <div className="bd-content">How to claim?</div>
                        </div>
                        <div className="generic-hr"></div>
                    </div>
                </div> 
            </Container>
        );
    }
}

export default GroupHealthReportDetails;