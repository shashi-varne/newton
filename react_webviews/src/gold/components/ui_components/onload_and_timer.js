import React, { Component } from 'react';



import { storageService } from 'utils/validators';
import { stateMapper} from '../../constants';
import { inrFormatDecimal2 } from 'utils/validators';


const mapper = {
    'buy': {
        'title' : 'buy'
    },
    'sell': {
        'title' : 'sell'
    }
}
class GoldOnloadAndTimerClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openOnloadModal: this.props.parent.state.openOnloadModal,
            title: mapper[this.props.parent.state.orderType].title,
            orderType: this.props.parent.state.orderType,
            orderKey : this.props.parent.state.orderType + 'Data'
        }

    }

    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    countdown = () => {

        let orderData = storageService().getObject(this.state.orderKey);

        let timeAvailable = orderData.timeAvailable;
        if (timeAvailable <= 0) {

            this.updateParent('openPriceChangedDialog', true);
            this.updateParent('minutes', 0);
            this.updateParent('seconds', 0);
            this.updateParent('live_price', '');
            this.updateParent('timeAvailable', timeAvailable || 0);

            storageService().set('forceBackState', stateMapper['buy-home']);
            clearInterval(this.state.countdownInterval);
            return;
        }

        let minutes = Math.floor(timeAvailable / 60);
        let seconds = Math.floor(timeAvailable - minutes * 60);
        timeAvailable--;
        // timeAvailable = timeAvailable -100;
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
        }
    }

    updateParent = (key, value) => {
        this.props.parent.updateParent(key, value);
    }

    onload() {

        storageService().remove('forceBackState');

        let orderData = storageService().getObject(this.state.orderKey);
        
        this.updateParent(this.state.orderKey, orderData);

        if(this.state.orderType === 'buy') {
            this.updateParent('live_price', orderData.goldBuyInfo.plutus_rate);
        }

        if(this.state.orderType === 'sell') {
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
                provider: 'safegold'
            },
            buttonTitle: "REFRESH",
            content1: [
                { 'name': this.state.title + ' price for <b>' + orderData.weight_selected  +'</b> gms', 'value': inrFormatDecimal2(orderData.base_amount) },
                { 'name': 'GST', 'value': inrFormatDecimal2(orderData.gst_amount) }
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal2(orderData.total_amount) }
            ]
        }

        this.updateParent('show_loader', false);

        if(this.state.orderType === 'buy') {
            this.updateParent('goldBuyInfo', orderData.goldBuyInfo);
            this.updateParent('minAmount', orderData.goldBuyInfo.minimum_buy_price);
        }

        if(this.state.orderType === 'sell') {
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