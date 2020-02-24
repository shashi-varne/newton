import React, { Component } from 'react';

import { storageService } from 'utils/validators';
import { stateMapper, calculate_gold_wt_buy } from '../../constants';
import { inrFormatDecimal2 } from 'utils/validators';

const mapper = {
    'buy': {
        'title': 'buy'
    },
    'sell': {
        'title': 'sell'
    },
    'delivery': {
        'title': 'delivery'
    }
}
class GoldOnloadAndTimerClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openOnloadModal: this.props.parent.state.openOnloadModal,
            title: mapper[this.props.parent.state.orderType].title,
            orderType: this.props.parent.state.orderType,
            orderKey: this.props.parent.state.orderType + 'Data',
            provider: this.props.parent.state.provider
        }

    }

    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    countdown = () => {

        let orderData = storageService().getObject(this.state.orderKey);

        // fresh time available
        var currentDate = new Date();
        let rate_validity = '';
        if(this.state.orderType === 'buy') {
            rate_validity = orderData.goldBuyInfo.rate_validity;
        }

        if(this.state.orderType === 'sell') {
            rate_validity = orderData.goldSellInfo.rate_validity;
        }

        let timeAvailable = ((rate_validity - currentDate.getTime()) / 1000 - 330 * 60);

        if (timeAvailable <= 0) {

            this.updateParent('openPriceChangedDialog', true);

            this.updateParent('timeout_alert_event', true);
            this.updateParent('refresh_price_event', false);

            this.updateParent('minutes', 0);
            this.updateParent('seconds', 0);
            this.updateParent('live_price', '');
            this.updateParent('timeAvailable', timeAvailable || 0);

            storageService().set('forceBackState', stateMapper[this.state.orderType]);
            clearInterval(this.state.countdownInterval);
            return;
        }

        let minutes = Math.floor(timeAvailable / 60);
        let seconds = Math.floor(timeAvailable - minutes * 60);
        orderData.timeAvailable = timeAvailable;

        this.updateParent('timeAvailable', timeAvailable);
        this.updateParent('minutes', minutes);
        this.updateParent('seconds', seconds);
        this.updateParent(this.state.orderKey, orderData);

        storageService().setObject(this.state.orderKey, orderData);

    };


    startTimer(orderData) {
        if (orderData) {
            let intervalId = setInterval(this.countdown, 1000);
            this.setState({
                countdownInterval: intervalId,
                show_loader: false
            });
            // this.updateParent('show_loader', false);
        }
    }

    updateParent = (key, value) => {
        this.props.parent.updateParent(key, value);
    }

    onload() {

        storageService().remove('forceBackState');
        if(this.props.parent.state.pan_bank_flow) {
            return;
        }
        
        let orderData = storageService().getObject(this.state.orderKey);

        this.updateParent(this.state.orderKey, orderData);

        if (this.state.orderType === 'buy') {
            this.updateParent('live_price', orderData.goldBuyInfo.plutus_rate);
        }

        if (this.state.orderType === 'sell') {
            this.updateParent('live_price', orderData.goldSellInfo.plutus_rate);
        }

        this.updateParent('openRefreshModule', false);
        this.updateParent('timeAvailable', orderData.timeAvailable || 0);

        this.startTimer(orderData);


        let priceChangeDialogData = {
            buttonData: {
                leftTitle: 'To ' + this.state.orderType + ' gold worth',
                leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
                leftArrow: 'down',
                provider: this.state.provider
            },
            buttonTitle: "REFRESH",
            content1: [
                { 'name': this.state.title + ' price for <b>' + orderData.weight_selected + '</b> gms', 'value': inrFormatDecimal2(orderData.base_amount) },
                { 'name': 'GST', 'value': inrFormatDecimal2(orderData.gst_amount) }
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal2(orderData.total_amount) }
            ],
            provider: this.state.provider
        }



        if (this.state.orderType === 'buy') {
            this.updateParent('goldBuyInfo', orderData.goldBuyInfo);

            let minimum_buy_price  = orderData.goldBuyInfo.minimum_buy_price || 1000;
            this.updateParent('minAmount', minimum_buy_price);


            let minWeight = calculate_gold_wt_buy(orderData, minimum_buy_price).weight;
            this.updateParent('minWeight', minWeight);
        }

        if (this.state.orderType === 'sell') {
            this.updateParent('goldSellInfo', orderData.goldSellInfo);
        }

        this.updateParent('timeAvailable', orderData.timeAvailable);
        this.updateParent(orderData, orderData);
        this.updateParent('priceChangeDialogData', priceChangeDialogData);

        if (this.state.orderData) {
            let intervalId = setInterval(this.countdown, 1000);
            this.setState({
                countdownInterval: intervalId
            });
        }

        let confirmDialogData = {};
        let bottomButtonData = {};
        if (this.state.orderType !== 'delivery') {
            confirmDialogData = {
                buttonData: {
                    leftTitle: this.state.orderType + ' gold worth',
                    leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
                    leftArrow: 'down',
                    provider: this.state.provider
                },
                buttonTitle: "Ok",
                content1: [
                    {
                        'name': this.state.orderType + ' price for <b>' + orderData.weight_selected + '</b> gms', 'value':
                            inrFormatDecimal2(orderData.base_amount)
                    },
                    { 'name': 'GST', 'value': inrFormatDecimal2(orderData.gst_amount) }
                ],
                content2: [
                    { 'name': 'Total', 'value': inrFormatDecimal2(orderData.total_amount) }
                ]
            }

            bottomButtonData = {
                leftTitle: this.state.orderType + ' gold worth',
                leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
                leftArrow: 'up',
                provider: this.state.provider
            }
        } else {
            confirmDialogData = {
                buttonData: {
                  leftTitle: orderData.description,
                  leftSubtitle: inrFormatDecimal2(orderData.delivery_minting_cost),
                  leftArrow: 'down',
                  provider: this.state.provider
                },
                buttonTitle: "Ok",
                content1: [
                  { 'name': 'Making charges', 'value': inrFormatDecimal2(orderData.delivery_minting_cost) },
                  { 'name': 'Shipping charges', 'value': 'Free' }
                ],
                content2: [
                  { 'name': 'Total', 'value': inrFormatDecimal2(orderData.delivery_minting_cost) }
                ]
            }

            bottomButtonData = {
                leftTitle: orderData.description,
                leftSubtitle: inrFormatDecimal2(orderData.delivery_minting_cost),
                leftArrow: 'up',
                provider: this.state.provider
            }
        }

        this.updateParent('confirmDialogData', confirmDialogData);
        this.updateParent('bottomButtonData', bottomButtonData)

    }

    componentDidMount() {
        this.onload();
    }


    render() {
        return null;
    }

}

const GoldOnloadAndTimer = (props) => (
    <GoldOnloadAndTimerClass
        {...props} />
);

export default GoldOnloadAndTimer;