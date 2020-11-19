import React, { Component } from 'react';
import Container from '../../../common/Container';
import { formatAmountInr } from "utils/validators";
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import DropdownInModal from '../../../../common/ui/DropdownInModal';
import { initialize, updateBottomPremium, updateBottomPremiumAddOns } from '../common_data';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { compact } from 'lodash';
import GenericTooltip from '../../../../common/ui/GenericTooltip'

class GroupHealthPlanAddOns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            add_ons_data: [],
            show_loader: true,
            screen_name: 'add_ons_screen',
            total_add_on_premiums: 0
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
        this.updateBottomPremiumAddOns = updateBottomPremiumAddOns.bind(this);
    };

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let post_body = this.state.groupHealthPlanData.post_body;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details', 'plan_id', 'insurance_type','floater_type', "plan_id","si"];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        if(this.state.groupHealthPlanData.account_type === "self" || Object.keys(this.state.groupHealthPlanData.post_body.member_details).length === 1){
            body['floater_type'] = 'non_floater';
        }

        let add_ons_data = this.state.groupHealthPlanData.add_ons_data || []; 
        // eslint-disable-next-line radix
        let cta_premium = this.state.groupHealthPlanData.post_body.premium || this.state.bottomButtonData.leftSubtitleUnformatted;
        this.updateBottomPremiumAddOns(cta_premium);
        
        this.setState({
            // add_ons_data: add_ons_data,
            cta_premium: cta_premium
        });
        
        if (add_ons_data.length === 0) {
            try {
                const res = await Api.post('api/insurancev2/api/insurance/health/quotation/get_add_ons/religare', body);

                this.setState({
                    show_loader: false
                });
                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    
                    add_ons_data = resultData.compulsary.concat(resultData.optional)  || [];

                    
                    let options = [];
                    let opd_data_options = add_ons_data[1].price;
                    for(var key in opd_data_options){
                        let opt = {
                            cover_amount: key,
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
                    add_ons_data[1].default_premium = parseInt(add_ons_data[1].price[0].premium, 10);
                    add_ons_data[1].default_cover_amount = add_ons_data[1].price[0].cover_amount;
                    
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

        } else {
            this.setState({
                show_loader: false
            })
        }

        this.setState({
            add_ons_data: add_ons_data
        }, () => {
            this.updateCtaPremium()
        })
        
    }

    updateCtaPremium = () => {
        let { add_ons_data, cta_premium } = this.state;

        let total_premium = 0;

        add_ons_data.forEach((item, index) => {
            if (item.checked) {
                total_premium += item.selected_premium || item.default_premium || item.price;
            }
        });

        let updated_premium = parseInt(cta_premium, 10) + parseInt(total_premium, 10);
        
        this.updateBottomPremiumAddOns(updated_premium);
    }

    handleChangeCheckboxes = index => event => {
        let { add_ons_data } = this.state;
        add_ons_data[index].checked = !add_ons_data[index].checked;

        this.setState({
            add_ons_data: add_ons_data,
        }, () => {
            this.updateCtaPremium()
        })
    }

    handleChange = index => event => {

        let { add_ons_data } = this.state;
         
        let data = add_ons_data[index];

        
        let indexOption = event;
        data.selectedIndexOption = indexOption;

        data.selected_cover_amount =  data.price[indexOption].cover_amount;
        data.selected_premium =  parseInt(data.price[indexOption].premium, 10);

        add_ons_data[index] = data;
        this.setState({
            add_ons_data: add_ons_data
        }, () => {
            this.updateCtaPremium()
        })
    }

    renderOptions = (add_ons_data) => {
        
        return (
            <div>
                {add_ons_data.map((item, index) => (
                    <Grid container spacing={16} key={index}>
                        <Grid item xs={1} className="">
                            <Checkbox
                                style={{ alignItems: 'start' }}
                                checked={item.checked || false}
                                color="primary"
                                disabled={item.disabled}
                                value={item.id}
                                name={item.id}
                                disableRipple
                                onChange={this.handleChangeCheckboxes(index)}
                                className="Checkbox" />
                        </Grid>
                        <Grid item xs={11}>
                            <span className="flex-between" style={{ alignItems: 'start' }} onClick={this.handleChangeCheckboxes(index)}>
                                <div style={{ color: '#0A1D32' }}>
                                    <span style={{ fontSize: "16px", fontWeight: '600' }}>{item.name}</span> 
                                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                                        in { !Array.isArray(item.price) ? formatAmountInr(item.price) : 
                                             item.checked ? formatAmountInr(item.selected_premium || item.default_premium) :
                                            formatAmountInr(item.default_premium)
                                        }
                                    </div>
                                    <div id="add_ons_bottom_text">{item.bottom_text}</div>
                                </div>
                          <GenericTooltip content={item.description} productName={getConfig().productName} />
                            </span>
                            {item.checked && Array.isArray(item.price) && <DropdownInModal
                                parent={this}
                                options={item.price}
                                header_title="Select amount"
                                cta_title="SAVE"
                                selectedIndex={item.selectedIndexOption || 0}
                                value={item.selected_cover_amount || item.default_cover_amount || '' }
                                width="30"
                                showInrSymbol={true}
                                label="Select amount"
                                id="amount"
                                name="amount"
                                onChange={this.handleChange(index)} />}
                        </Grid>
                    </Grid>
                ))}
            </div>
        )
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action) {
        const selected_add_ons = this.state.add_ons_data.map(add_on => add_on.checked ? add_on.name : '');
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": 'select add ons',
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "add_ons": compact(selected_add_ons).join(', '),
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        this.sendEvents('next');

        let groupHealthPlanData = this.state.groupHealthPlanData;

        let add_ons_body = [];
        let  add_ons_json = {};
        // eslint-disable-next-line
        console.log(this.state.add_ons_data)
        this.state.add_ons_data.forEach((item) => {            
            if(item.checked) {

                if (Array.isArray(item.price)) {
                    add_ons_body.push(`opd-${item.selected_cover_amount || item.default_cover_amount}`)
                    add_ons_json[item.id || 'opd'] = {
                        price: item.selected_premium || item.default_premium,
                        title: item.name
                    };
                } else {
                    add_ons_json[item.id] = {
                        price: item.price || item.selected_premium || item.default_premium,
                        title: item.name
                    };
                    add_ons_body.push(item.id);
                }
            }
        })

        groupHealthPlanData.post_body.add_ons = add_ons_body; //add ons in array format for get final premium api in the select cover period page
        groupHealthPlanData.post_body.add_ons_array = add_ons_body;
        groupHealthPlanData.post_body.add_ons_json = add_ons_json || {};

        groupHealthPlanData.add_ons_data = this.state.add_ons_data;
        this.setLocalProviderData(groupHealthPlanData);

        this.navigate(this.state.next_screen);

    }

    render() {
        let { add_ons_data } = this.state;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title='Select add-ons'
                buttonTitle="CONTINUE"
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle">
                    Boost your coverage with these optional benefits
                </div>
                <div className="group-health-plan-select-add-ons">
                    <FormControl fullWidth>
                        {this.renderOptions(add_ons_data)}
                    </FormControl>
                </div>
            </Container>
        );
    };
};

export default GroupHealthPlanAddOns;