import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';
import { validatePan, validateEmpty, getUrlParams } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldLivePrice from '../ui_components/live_price';
import ConfirmDialog from '../ui_components/confirm_dialog';

import RefreshBuyPrice from '../ui_components/buy_price';
import RefreshSellPrice from '../ui_components/sell_price';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import { isUserRegistered } from '../../constants';

const commonMapper = {
    'buy': {
        'editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per government guidelines, PAN is mandatory to buy more than ₹1 lac worth gold',
            'cta': 'Continue',
            'cta2': 'Buy gold worth',
            'name': 'Buy'
        },
        'non-editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per government guidelines, PAN is mandatory to buy more than ₹1 lac worth gold',
            'cta': 'Continue',
            'cta2': 'Buy gold worth',
            'name': 'Buy'
        },
        'name': 'Buy',
        'next_state': ''
    },
    'sell': {
        'editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per Indian government, PAN is mandatory to sell gold',
            'cta': 'Continue',
            'cta2': 'Sell gold worth',
            'name': 'Sell'
        },
        'non-editable': {
            'top_title': 'Share PAN details',
            'top_subtitle': 'As per Indian government, PAN is mandatory to sell gold',
            'cta': 'Continue',
            'cta2': 'Sell gold worth',
            'name': 'Sell'
        },
        'name': 'Sell',
        'next_state': 'sell-select-bank'
    }

}

class GoldPanDataClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            pan_number: "",
            pan_number_error: '',
            openConfirmDialog: false,
            openPriceChangedDialog: false,
            provider: this.props.parent.props.match.params.provider,
            orderType: this.props.parent.state.orderType,
            pan_editable_status: 'editable',
            pan_bank_flow: getUrlParams().pan_bank_flow || false,
            user_info: {}
        }

    }

    componentWillMount() {

        this.setState({
            commonMapper: commonMapper[this.state.orderType][this.state.pan_editable_status],
            orderName: commonMapper[this.state.orderType].name,
            next_state: commonMapper[this.state.orderType].next_state,
            storageKey: this.state.orderType === 'buy' ? 'buyData' : 'sellData'
        })
    }

    // common code for buy live price start

    // common code start
    onload = () => {

        this.setState({
            openOnloadModal: false
        })
        this.setState({
            openOnloadModal: true
        })
    }

    updateParent(key, value) {
        this.setState({
            [key]: value
        })
    }

    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });

        if (this.state.openPriceChangedDialog && this.state.timeAvailable > 0) {
            this.setState({
                openPriceChangedDialog: false
            })
        }
    }

    async componentDidMount() {

        this.onload();
        try {

            const res = await Api.get('/api/gold/user/account/' + this.state.provider);

            this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {
                let result = res.pfwresponse.result;
                let isRegistered = isUserRegistered(result);

                let user_info = result.gold_user_info.user_info || {};
                this.setState({
                    provider_info: result.gold_user_info.provider_info || {},
                    user_info: user_info,
                    isRegistered: isRegistered,
                    pan_number: user_info.pan_number || ''
                });

            } else {
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                    'Something went wrong');
            }
        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    navigate = (pathname) => {

        let searchParams = getConfig().searchParams;

        if (this.state.pan_bank_flow) {
            searchParams += '&pan_bank_flow=' + this.state.pan_bank_flow
        }
        this.props.parent.props.history.push({
            pathname: pathname,
            search: searchParams
        });

    }

    handleChange = (field) => (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            [event.target.name + '_error']: ''
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'gold_investment_flow',
            "properties": {
                "user_action": user_action,
                "screen_name": 'pan_entry',
                'flow': this.state.orderType,
                'pan_entered': this.state.pan_number ? 'yes' : 'no',
                'price_summary_clicked': this.state.price_summary_clicked ? 'yes' : 'no',
                "timeout_alert": this.state.timeout_alert_event ? 'yes' : 'no',
                "refresh_price": this.state.refresh_price_event ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {

        this.handleClose();
        this.sendEvents('next');

        if (!validateEmpty(this.state.pan_number)) {
            this.setState({
                pan_number_error: 'PAN number cannot be empty'
            });
            return;
        } else if (!validatePan(this.state.pan_number)) {
            this.setState({
                pan_number_error: 'Invalid PAN number'
            });
            return;
        } else {

            this.setState({
                show_loader: true
            });

            let options = {
                kyc: {
                    pan: {
                        pan_number: this.state.pan_number
                    }
                }
            }


            try {
                const res = await Api.post('/api/kyc/v2/mine', options);


                if (res.pfwresponse.status_code === 200) {

                    if (this.state.orderType === 'buy' && this.state.isRegistered) {
                        this.props.parent.updateParent('proceedForOrder', true);
                    } if (this.state.orderType === 'buy' && !this.state.isRegistered) {
                        this.navigate('gold-register');
                        return;
                    } else if (this.state.orderType === 'sell' && this.state.pan_bank_flow) {
                        this.navigate('sell-add-bank');
                        return;
                    } else {
                        this.navigate(this.state.next_state);
                    }

                } else {
                    this.setState({
                        show_loader: false
                    });

                    toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                        'Something went wrong');

                }
            } catch (err) {
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong');
            }
        }
    }

    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true,
            price_summary_clicked: true
        })
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader || this.props.parent.state.show_loader}
                title={this.state.commonMapper.top_title}
                handleClick={this.handleClick}
                handleClick2={this.handleClick2}
                edit={this.props.edit}
                withProvider={!this.state.pan_bank_flow ? true : false}
                count={this.state.pan_bank_flow ? true : false}
                current={1}
                total={2}
                buttonTitle={this.state.commonMapper.cta}
                events={this.sendEvents('just_set_events')}
                buttonData={this.state.bottomButtonData}
            >
                <div className="common-top-page-subtitle">
                    {this.state.commonMapper.top_subtitle}
                </div>

                <GoldLivePrice parent={this} />

                <div className="register-form">
                    <div className="InputField">
                        <Input
                            error={(this.state.pan_number_error) ? true : false}
                            helperText={this.state.pan_number_error}
                            disabled={(this.state.user_info.pan_status === 'APPROVED' || 
                            this.state.user_info.pan_status === 'approved' ? true : false)}
                            type="text"
                            width="40"
                            label="Enter PAN"
                            class="name"
                            id="name"
                            name="pan_number"
                            maxLength="10"
                            value={this.state.pan_number}
                            onChange={this.handleChange('pan_number')} />
                    </div>
                </div>

                <ConfirmDialog parent={this} />
                <PriceChangeDialog parent={this} />

                {this.state.orderType === 'buy' && this.state.openRefreshModule &&
                    <RefreshBuyPrice parent={this} />}
                {this.state.orderType === 'sell' && this.state.openRefreshModule &&
                    <RefreshSellPrice parent={this} />}

                {this.state.openOnloadModal &&
                    <GoldOnloadAndTimer parent={this} />}
            </Container>
        );
    }
}

const GoldPanData = (props) => (
    <GoldPanDataClass
        {...props} />
);

export default GoldPanData;