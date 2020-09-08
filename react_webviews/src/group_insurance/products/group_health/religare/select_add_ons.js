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
            ctaWithProvider: true,
            add_ons_data: []
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    };

    componentWillMount() {
        
        this.initialize();

        let add_ons_data = [
            {
                "title": "Unlimited Automatic Recharge ",
                "default_premium": 8050.68,
                "tooltip_content": "",
                "key": "UAR",
                "default_cover_amount": "",
                "options": []
                
            },
            {
                "title": "OPD care",
                "default_premium": "50000",
                "tooltip_content": "",
                "key": "OPD",
                "default_cover_amount": '2000',
                "options": [
                    {
                        "key": "OPDCARE-15000",
                        "premium": 9730.0,
                        "cover_amount": "15000"
                    },
                    {
                        "key": "OPDCARE-45000",
                        "premium": 25067.0,
                        "cover_amount": "45000"
                    },
                    {
                        "key": "OPDCARE-40000",
                        "premium": 22507.0,
                        "cover_amount": "40000"
                    },
                    {
                        "key": "OPDCARE-25000",
                        "premium": 15167.0,
                        "cover_amount": "25000"
                    },
                    {
                        "key": "OPDCARE-20000",
                        "premium": 12541.0,
                        "cover_amount": "20000"
                    },
                    {
                        "key": "OPDCARE-30000",
                        "premium": 17626.0,
                        "cover_amount": "30000"
                    }
                ]
            },
            {
                "title": "Reduction in PED Wait Period",
                "default_premium": 8050.68,
                "tooltip_content": "",
                "key": "REDPEDWAITPRD",
                "default_cover_amount": "",
                "options": []
                
            },
            {
                "title": "No Claim Bonus Super ",
                "default_premium": 10734.24,
                "tooltip_content": "",
                "key": "CAREWITHNCB",
                "default_cover_amount": "",
                "options": []
                
            }
        ]

        let amount_options = {};

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
        } else {
            this.setState({
                selectedIndex: {
                    [name]: this.state.amount_options[name][event].name
                }
            }, () => {
              this.setState({
                selectedValue: {
                    [name]: this.state.amount_options[name][event].value,
                }
              })
            });
        }
    }

    renderOptions = (add_ons_data) => {

        let { amount_options, selectedValue, selectedIndex } = this.state;

        return (
            <div>
                {add_ons_data.map((item, index) => (
                    <Grid container spacing={16} key={index}>
                    <Grid item xs={1} className="">
                    <Checkbox
                      style={{alignItems:'start'}}
                      checked={this.state[item.key]}
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
                                {`in ${item.options.length !== 0 ? 
                                    (selectedValue ? formatAmountInr(selectedValue[item.key]) : formatAmountInr(item.default_premium)) :
                                    formatAmountInr(item.default_premium)}`}
                            </div>
                        </div>
                        <img
                        className="tooltip-icon"
                        data-tip={item.tooltip}
                        src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                    </span>
                    {this.state[item.key] && item.options.length !== 0 && <DropdownInModal
                        parent={this}
                        options={amount_options[item.key]}
                        header_title="Select amount"
                        cta_title="SAVE"
                        selectedIndex={selectedIndex || ''}
                        value={selectedIndex ? selectedIndex[item.key] : ''}
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

    handleClick = () => {
        this.sendEvents('next');
        let { selectedValue } = this.state

        let groupHealthPlanData = this.state.groupHealthPlanData;
        let post_body = groupHealthPlanData.post_body || {};

        let add_ons = this.state.add_ons_data.map((item) => {
            
            if (this.state[item.key]) {
                return item.key + `-${selectedValue[item.key] ? selectedValue[item.key] : item.default_premium}`
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