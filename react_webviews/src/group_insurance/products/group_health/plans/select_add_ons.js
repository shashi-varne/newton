import React, { Component } from 'react';
import Container from '../../../common/Container';

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
            options: []
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    onload = () => {

        this.setState({
            options: [],
            show_checkbox: false
        });

        let options = [
            { 'name': 'Unlimited Automatic Recharge', 'rate': '₹710' },
            { 'name': 'OPD care', 'rate': '₹456' },
            { 'name': 'Reduction in PED Wait Period', 'rate': '₹3456' }
        ];

        this.setState({
            options: options
        }, () => {
            this.setState({
                show_checkbox: true,
                show_loader: false
            })
        })

        let amount_options = [];

        for (var j =  1000; j < 10000; j+2000) {
            let data = {
              name: j,
              value: j
            };
            amount_options.push(data);
        }

        this.setState({
            amount_options: amount_options
        })

    }

    componentWillMount() {
        this.initialize();
        this.onload();
    }

    async componentDidMount() {
        this.setState({
            selectedIndex: this.state.groupHealthPlanData.selectedIndexSumAssured || 0
        }, () => {
            this.updateBottomPremium();
        })
    }

    handleChange = name => event => {
        if (!name) {
            name = event.target.name;
        }

        this.setState({
            [name]: event.target.checked
        })
    }

    handleAmountChange = name => event => {
            this.setState({
              selectedIndex: event
            }, () => {
              this.setState({
                amount: this.state.amount_options[this.state.selectedIndex].value
              })
            });
    }

    renderOptions = (options) => {
        return (
            <div>
                {options.map((option, index) => (
                    <Grid container spacing={16} key={index}>
                    <Grid item xs={1} className="">
                    <Checkbox
                      style={{alignItems:'start'}}
                      checked={this.state[option.name]}
                      color="primary"
                      value={option.name}
                      name={option.name}
                      disableRipple
                      onChange={this.handleChange()}
                      className="Checkbox" />
                    </Grid>
                    <Grid item xs={11}>
                    <span className="flex-between" style={{alignItems:'start'}}>
                        <div>
                            <span style={{fontSize:"16px", fontWeight:'600'}}>{option.name}</span>
                            <div style={{marginTop:'10px', fontSize:'14px'}}>{`in ${option.rate}`}</div>
                        </div>
                        <img
                        className="tooltip-icon"
                        data-tip=""
                        src={require(`assets/fisdom/info_icon.svg`)} alt="" />
                        
                    </span>
                    {<DropdownInModal
                        parent={this}
                        options={this.state.amount_options}
                        header_title="Select amount"
                        cta_title="SAVE"
                        selectedIndex={this.state.selectedIndex}
                        width="30"
                        label="Select amount"
                        class="Education"
                        id="amount"
                        name="amount"
                        onChange={this.handleAmountChange('amount')} />}
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
        let { options } = this.state;
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
                        {this.renderOptions(options)}
                    </FormControl>
                </div>
            </Container>
        );
    };
};

export default GroupHealthPlanAddOns;