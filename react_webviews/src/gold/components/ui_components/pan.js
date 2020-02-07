import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';
import { validatePan, validateEmpty, inrFormatDecimal2 } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldLivePrice from '../ui_components/live_price';
import ConfirmDialog from '../ui_components/confirm_dialog';
import PriceChangeDialog from '../ui_components/price_change_dialog';

import RefreshBuyPrice from '../ui_components/buy_price';
import RefreshSellPrice from '../ui_components/sell_price';
import {stateMapper} from  '../../constants';
import { storageService } from 'utils/validators';

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
        'name': 'Buy'
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
        'name': 'Sell'
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
            openPriceChangedDialog: true,
            provider: this.props.parent.props.match.params.provider,
            orderType: this.props.parent.state.orderType,
            pan_editable_status: 'editable'
        }

        this.refreshData = this.refreshData.bind(this);
    }

    componentWillMount() {

        this.setState({
            commonMapper: commonMapper[this.state.orderType][this.state.pan_editable_status],
            orderName: commonMapper[this.state.orderType].name,
            storageKey: this.state.orderType === 'buy' ? 'buyData' : 'sellData'
        })
    }

     // common code for buy live price start

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    let timeAvailable = this.state.orderData.timeAvailable;
    console.log('timeAvailable :' + timeAvailable);
    let orderData = this.state.orderData;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: 0,
        seconds: 0,
        openPriceChangedDialog: true,
        live_price: '',
        timeAvailable: timeAvailable || 0
      })

      storageService().set('forceBackState', stateMapper['buy-home']);

      return;
    }

    let minutes = Math.floor(timeAvailable / 60);
    let seconds = Math.floor(timeAvailable - minutes * 60);
    timeAvailable--;
    orderData.timeAvailable = timeAvailable;

    this.setState({
      timeAvailable: timeAvailable,
      minutes: minutes,
      seconds: seconds,
      orderData: orderData
    })
    
    storageService().setObject(this.state.storageKey, orderData);
   
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

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
  }

  refreshData () {

    if(this.state.timeAvailable > 0) {
      this.handleClick();
    } else {
      this.setState({
        show_loader: true,
        openRefreshModule: true
      })
    }
    
  }

  onload() {

    try {
        storageService().remove('forceBackState');

        let orderData = storageService().getObject(this.state.storageKey);
        console.log(orderData);
        this.setState({
          orderData: orderData,
          live_price: this.state.orderType === 'buy' ?  orderData.goldBuyInfo.plutus_rate : orderData.goldSellInfo.plutus_rate,
          openRefreshModule: false,
          timeAvailable: orderData.timeAvailable
        })
        this.startTimer(orderData);
    
        let confirmDialogData = {
          buttonData: {
            leftTitle: 'Buy gold worth',
            leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
            leftArrow: 'down',
            provider: 'safegold'
          },
          buttonTitle: "OK",
          content1: [
            { 'name':  this.state.orderName + ' price for <b>' + orderData.weight_selected + '</b> gms', 'value': inrFormatDecimal2(orderData.base_amount) },
            { 'name': 'GST', 'value': inrFormatDecimal2(orderData.gst_amount) }
          ],
          content2: [
            { 'name': 'Total', 'value': inrFormatDecimal2(orderData.total_amount) }
          ]
        }
    
        let priceChangeDialogData = {
          buttonData: {
            leftTitle: 'To ' +  this.state.orderType + 'gold worth',
            leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
            leftArrow: 'down',
            provider: 'safegold'
          },
          buttonTitle: "REFRESH",
          content1: [
            { 'name': this.state.orderName +  ' price for <b>' +  orderData.weight_selected  + '</b> gms', 'value': inrFormatDecimal2(orderData.base_amount) },
            { 'name': 'GST', 'value': inrFormatDecimal2(orderData.gst_amount) }
          ],
          content2: [
            { 'name': 'Total', 'value': inrFormatDecimal2(orderData.total_amount) }
          ]
        }
    
        let bottomButtonData = {
          leftTitle: this.state.orderName + ' gold worth',
          leftSubtitle: inrFormatDecimal2(orderData.amount_selected),
          leftArrow: 'up',
          provider: 'safegold'
        }
    
        this.setState({
          confirmDialogData: confirmDialogData,
          priceChangeDialogData: priceChangeDialogData,
          bottomButtonData: bottomButtonData
        })
    }catch(err) {
        this.setState({
            show_loader: false
        });
        toast('Something went wrong', 'error');
        this.navigate('/gold/my-gold');
    }
  
    
  }

    async componentDidMount() {

        this.onload();
       
        try {

            const res = await Api.get('/api/gold/user/account');
            if (res.pfwresponse.status_code === 200) {
                let result = res.pfwresponse.result;

                const { pan_number } = result;
                this.setState({
                    show_loader: false,
                    pan_number: pan_number || '',
                });

            } else {
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                    'Something went wrong', 'error');
            }
        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong', 'error');
        }
    }

    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleChange = (field) => (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            [event.target.name + '_error']: ''
        });
    }


    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });

        if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
            this.setState({
              openPriceChangedDialog: false
            })
          }
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'GOLD',
            "properties": {
                "user_action": user_action,
                "screen_name": 'Registeration',
                'pan_number': this.state.pan_number_error ? 'invalid' : this.state.pan_number ? 'valid' : 'empty',
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
                pan_number: this.state.pan_number
            }


            try {
                const res = await Api.post('/api/gold/user/account', options);

                this.setState({
                    show_loader: false
                });


                if (res.pfwresponse.status_code === 200) {
                    //   next step
                } else {

                    toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                        'Something went wrong', 'error');

                }
            } catch (err) {
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong', 'error');
            }
        }
    }

    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true
        })
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title={this.state.commonMapper.top_title}
                handleClick={this.handleClick}
                handleClick2={this.handleClick2}
                edit={this.props.edit}
                withProvider={true}
                buttonTitle={this.state.commonMapper.cta}
                events={this.sendEvents('just_set_events')}
                buttonData={{
                    leftTitle: this.state.commonMapper.cta2,
                    leftSubtitle: '₹1,000',
                    leftArrow: 'up',
                    provider: 'safegold'
                }}
            >
                <div className="common-top-page-subtitle">
                    {this.state.commonMapper.top_subtitle}
                </div>

                <GoldLivePrice parent={this} />
                <ConfirmDialog parent={this} />
                <PriceChangeDialog parent={this} />

                <div className="register-form">
                    <div className="InputField">
                        <Input
                            error={(this.state.pan_number_error) ? true : false}
                            helperText={this.state.pan_number_error}
                            type="text"
                            width="40"
                            label="Enter PAN"
                            class="name"
                            id="name"
                            name="pan_number"
                            value={this.state.pan_number}
                            onChange={this.handleChange('pan_number')} />
                    </div>
                </div>

                <PriceChangeDialog parent={this} />

                {this.state.orderType === 'buy' && this.state.openRefreshModule &&
                    <RefreshBuyPrice parent={this} />}
                {this.state.orderType === 'sell' && this.state.openRefreshModule &&
                    <RefreshSellPrice parent={this} />}
            </Container>
        );
    }
}

const GoldPanData = (props) => (
    <GoldPanDataClass
    {...props} />
);

export default GoldPanData;