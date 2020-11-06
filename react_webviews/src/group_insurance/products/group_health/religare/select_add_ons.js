import React, { Component } from 'react';
import Container from '../../../common/Container';
import { formatAmountInr } from "utils/validators";
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import DropdownInModal from '../../../../common/ui/DropdownInModal';
import { initialize, updateBottomPremium } from '../common_data';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ReactTooltip from "react-tooltip";
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
    };

    componentWillMount() {
        this.initialize();
    }

    setAmountOptions (add_ons_data) {

        let sum_assured = this.state.groupHealthPlanData.sum_assured;
    
            if (add_ons_data.length !== 0) {
                add_ons_data.forEach((item, index) => {
                    let default_cover_amount = item.default_cover_amount;

                    let final_data = item;

                    if (item.options.length !== 0) {
                        let options = item.options.sort((a, b) => a.cover_amount - b.cover_amount);
                        let selectedIndexOption = item.selectedIndexOption || 0;

                        final_data.options = options.map((opt, index2) => {

                            if((!final_data.selected_cover_amount && opt.cover_amount === default_cover_amount) || 
                            (final_data.selected_cover_amount && opt.cover_amount === final_data.selected_cover_amount)) {
                                selectedIndexOption = index2;
                                final_data.selected_cover_amount = opt.cover_amount;
                                final_data.selected_premium = opt.premium;
                                final_data.default_premium = opt.premium;
                            }
                            return {
                                ...opt,
                                'name': formatAmountInr(opt.cover_amount),
                                'value': opt.premium,
                            }
                        });

                        final_data.selectedIndexOption = selectedIndexOption;
                    }

                    if(sum_assured === 400000 && item.key === 'CAREWITHNCB') {
                        final_data.checked = true;
                        final_data.disabled = true;
                        final_data.bottom_text = 'This benefit is mandatory with your selected plan';
                    }


                    add_ons_data[index] = final_data;
                })
            }

            this.setState({
                add_ons_data: add_ons_data
            }, () => {
                ReactTooltip.rebuild();
                this.updateCtaPremium();
            })

    }

    async componentDidMount() {

        let body = this.state.groupHealthPlanData.post_body;

        let add_ons_data = this.state.groupHealthPlanData.add_ons_data || []; 
        // eslint-disable-next-line radix
        let cta_premium = this.state.groupHealthPlanData.net_premium_addons || this.state.bottomButtonData.leftSubtitleUnformatted;
        this.updateBottomPremium(cta_premium);
        
        this.setState({
            // add_ons_data: add_ons_data,
            cta_premium: cta_premium
        });
        
        if (add_ons_data.length === 0) {
            try {

                const res = await Api.post('/api/ins_service/api/insurance/religare/addons', body);

                this.setState({
                    show_loader: false
                });
                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    add_ons_data = resultData.premium.add_ons_data || [];
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
        
        this.setAmountOptions(add_ons_data);
    }

    updateCtaPremium = () => {
        let { add_ons_data, cta_premium } = this.state;

        let total_premium = 0;

        add_ons_data.forEach((item, index) => {
            if (item.checked) {
                total_premium += item.selected_premium || item.default_premium;
            }
        });

        let updated_premium = cta_premium + total_premium;

        this.updateBottomPremium(updated_premium);
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

        data.selected_cover_amount =  data.options[indexOption].cover_amount;
        data.selected_premium =  data.options[indexOption].premium;



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
                                value={item.key}
                                name={item.key}
                                disableRipple
                                onChange={this.handleChangeCheckboxes(index)}
                                className="Checkbox" />
                        </Grid>
                        <Grid item xs={11}>
                            <span className="flex-between" style={{ alignItems: 'start' }} onClick={this.handleChangeCheckboxes(index)}>
                                <div style={{ color: '#0A1D32' }}>
                                    <span style={{ fontSize: "16px", fontWeight: '600' }}>{item.title}</span> 
                                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                                        in {item.options.length !== 0 ?
                                            (!item.checked) ? formatAmountInr(item.default_premium) :
                                                item.selected_premium ? formatAmountInr(item.selected_premium)
                                                    : formatAmountInr(item.default_premium)
                                            : formatAmountInr(item.default_premium)
                                        }
                                        <div id="add_ons_bottom_text">{item.bottom_text}</div>
                                    </div>
                                </div>
                          <GenericTooltip content={item.tooltip_content} productName={getConfig().productName} />
                            </span>
                            {item.checked && item.options.length !== 0 && <DropdownInModal
                                parent={this}
                                options={item.options}
                                header_title="Select amount"
                                cta_title="SAVE"
                                selectedIndex={item.selectedIndexOption || 0}
                                value={item.selected_cover_amount || ''}
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
        const selected_add_ons = this.state.add_ons_data.map(add_on => add_on.checked ? add_on.title : '');
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
        this.state.add_ons_data.map((item) => {

            
            if(item.checked) {

                if (item.options.length !== 0) {
                    add_ons_body.push(item.options[item.selectedIndexOption].key);
                    add_ons_json[item.options[item.selectedIndexOption].key] = {
                        premium: item.selected_premium || item.default_premium,
                        title: item.title
                    };
                } else {
                    add_ons_json[item.key] = {
                        premium: item.selected_premium || item.default_premium,
                        title: item.title
                    };
                    add_ons_body.push(item.key);
                }
            }

        })


        groupHealthPlanData.post_body.add_ons = add_ons_body;
        groupHealthPlanData.post_body.add_ons_json = add_ons_json;
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