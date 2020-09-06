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

class GroupHealthPlanAddOns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            ctaWithProvider: true,
            product_name: getConfig().productName,
            add_ons_data: []
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    };

    componentWillMount() {
        
        this.initialize();

        let add_ons_data = [
            {
                'title': 'Unlimited Automatic Recharge',
                'tooltip': 'Unlimited Automatic Recharge',
                'key': 'UAR',
                'default_cover_amount': '2000',
                'default_premium': '2000',
            },
            {
                'title': 'OPD care',
                'tooltip': 'OPD care',
                'key': 'OPD',
                'default_cover_amount': '2000',
                'default_premium': '2000',
                'OPD_DICT': {
                    "5000": 3536.0,
                    "10000": 6467.0,
                    "15000": 9730.0,
                    "35000": 20069.0,
                    "40000": 22507.0,
                    "45000": 25067.0,
                    "50000": 27574.0
                }
            },
            {
                'title': 'Reduction in PED Wait Period',
                'tooltip': 'Reduction in PED Wait Period',
                'key': 'REDPEDWAITPRD',
                'default_cover_amount': '2000',
                'default_premium': '2000'
            },
            {
                'title': 'No Claim Bonus Super',
                'tooltip': 'No Claim Bonus Super',
                'key': 'CAREWITHNCB',
                'default_cover_amount': '2000',
                'default_premium': '2000'
            }
        ];

        let amount_options = [];
        let sum_assured_list = Object.keys(add_ons_data[1].OPD_DICT)

        amount_options = sum_assured_list.map(amount => {
            return {name: formatAmountInr(amount), value: amount}
        })


        this.setState({
            add_ons_data: add_ons_data,
            amount_options: amount_options
        })
    }

    handleChange = name => event => {
        if (!name) {
            name = event.target.name;

            this.setState({
                [name]: event.target.checked
            })
        }

        if (name === 'amount') {
            this.setState({
                selectedIndex: event
            }, () => {
              this.setState({
                amount: this.state.amount_options[this.state.selectedIndex].value
              })
            });
        }
    }

    renderOptions = (add_ons_data) => {
        return (
            <div>
                {add_ons_data.map((option, index) => (
                    <Grid container spacing={16} key={index}>
                    <Grid item xs={1} className="">
                    <Checkbox
                      style={{alignItems:'start'}}
                      checked={this.state[option.key]}
                      color="primary"
                      value={option.key}
                      name={option.key}
                      disableRipple
                      onChange={this.handleChange()}
                      className="Checkbox" />
                    </Grid>
                    <Grid item xs={11}>
                    <span className="flex-between" style={{alignItems:'start'}}>
                        <div style={{color:'#0A1D32'}}>
                            <span style={{fontSize:"16px", fontWeight:'600'}}>{option.title}</span>
                            <div style={{marginTop:'10px', fontSize:'14px'}}>
                                {`in ${option.OPD_DICT ? formatAmountInr(option.OPD_DICT[this.state.amount] || 0) : formatAmountInr(option.default_premium)}`}
                            </div>
                        </div>
                        <img
                        className="tooltip-icon"
                        data-tip={option.tooltip}
                        src={require(`assets/${this.state.product_name}/info_icon.svg`)} alt="" />
                    </span>
                    {option.key === 'OPD' && this.state[option.key] && <DropdownInModal
                        parent={this}
                        options={this.state.amount_options}
                        header_title="Select amount"
                        cta_title="SAVE"
                        selectedIndex={this.state.selectedIndex}
                        value={this.state.amount}
                        width="30"
                        label="Select amount"
                        id="amount"
                        name="amount"
                        onChange={this.handleChange('amount')} />}
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

    handleClick = () => {
        this.sendEvents('next');
    }

    render() {
        let { add_ons_data } = this.state;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                show_loader={this.state.show_loader}
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