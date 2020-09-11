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

class GroupHealthPlanAddOns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            add_ons_data: [],
            show_loader: true
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    };

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let body = this.state.groupHealthPlanData.post_body;

        let add_ons_data = [];
        
        try {

            const res = await Api.post('/api/ins_service/api/insurance/religare/addons', body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                add_ons_data = resultData.premium.add_ons_data || [];
               
            } else {
                console.log(resultData)
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

        let amount_options = {};

        if(add_ons_data.length !== 0) {
            add_ons_data.forEach(item => {
                if (item.options.length !== 0) {
                    let options = item.options.sort((a,b) => a.cover_amount - b.cover_amount);
    
                    amount_options[item.key] = options.map(item => {
                        return   {
                            'name': formatAmountInr(item.cover_amount),
                            'value': item.premium,
                        }
                    })
                }
            })
        }

       

        this.setState({
            add_ons_data: add_ons_data,
            amount_options: amount_options
        })
    }

    handleChange = name => event => {
        if (!name) {
            name = event.target.name;

            this.setState({
                [name]: {
                    checked: event.target.checked
                },
                [name+'_error']: {
                    checked: ''
                }
            })
        } else {
            let {amount_options} = this.state;
            
            this.setState({
                selectedIndex: {
                    [name]: amount_options[name][event].name
                },
                [name]: {
                    ...this.state[name],
                    selected_cover_amount: amount_options[name][event].name
                }
            }, () => {
              this.setState({
                selectedValue: {
                    [name]: amount_options[name][event].value,
                },
                [name]: {
                    ...this.state[name],
                    selected_premium: amount_options[name][event].value
                }
              })
            });
        }
    }

    renderOptions = (add_ons_data) => {

        let { amount_options } = this.state;

        return (
            <div>
                {add_ons_data.map((item, index) => (
                    <Grid container spacing={16} key={index}>
                    <Grid item xs={1} className="">
                    <Checkbox
                      style={{alignItems:'start'}}
                      checked={this.state[item.key] ? this.state[item.key].checked : false}
                      color="primary"
                      value={item.key}
                      name={item.key}
                      disableRipple
                      onChange={this.handleChange()}
                      className="Checkbox" />
                    </Grid>
                    <Grid item xs={11}>
                    <span className="flex-between" style={{alignItems:'start'}}>
                        <div style={{color:'#0A1D32'}}>
                            <span style={{fontSize:"16px", fontWeight:'600'}}>{item.title}</span>
                            <div style={{marginTop:'10px', fontSize:'14px'}}>
                                {item.options.length !== 0 ?
                                     (!this.state[item.key] || !this.state[item.key].checked) ? formatAmountInr(item.default_premium) :
                                     this.state[item.key].selected_premium ? formatAmountInr(this.state[item.key].selected_premium)
                                     : formatAmountInr(item.default_premium)
                                     : formatAmountInr(item.default_premium)
                                }
                            </div>
                        </div>
                        <img
                        className="tooltip-icon"
                        data-tip={item.tooltip}
                        src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                    </span>
                    {(this.state[item.key] && this.state[item.key].checked) && item.options.length !== 0 && <DropdownInModal
                        parent={this}
                        options={amount_options[item.key]}
                        header_title="Select amount"
                        cta_title="SAVE"
                        value={this.state[item.key].selected_cover_amount || ''}
                        width="30"
                        label="Select amount"
                        id="amount"
                        name="amount"
                        onChange={this.handleChange(item.key)} />}
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
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": 'select add ons'
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
        let post_body = groupHealthPlanData.post_body || {};

        let add_ons = this.state.add_ons_data.map((item) => {
            
            if (this.state[item.key]) {
                return item.key + '-' + (this.state[item.key].selected_premium || item.default_premium)
            } else {
                return ''
            }
        })

        post_body.add_ons = add_ons;
        
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
                    You can boost your coverage with these optional benefits
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