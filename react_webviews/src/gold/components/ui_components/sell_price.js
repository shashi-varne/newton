import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import {storageService} from 'utils/validators';
import {getUpdatedSellData} from '../../constants';

class SellPriceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            provider: this.props.parent.state.provider,
        }
    }

    resetTimer(sellData) {
        sellData.goldSellInfo = {};
        sellData.plutus_rate_id = '';
        sellData.timeAvailable = 0;

        storageService().setObject('sellData', sellData);
        return sellData;
    }

    async componentDidMount() {

        let sellData = storageService().getObject('sellData') || {};

        try {

            if(!this.props.parent.state.fetchLivePrice) {
                this.setState({
                    show_loader: true
                })
            }

            this.props.parent.updateParent('price_crashed', false);
            const res = await Api.get('/api/gold/sell/currentprice/' + this.state.provider);
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    show_loader: false
                })
                let result = res.pfwresponse.result;
                let goldSellInfo = result.sell_info;
                var currentDate = new Date();
                let timeAvailable = ((goldSellInfo.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);
                
                sellData.goldSellInfo = result.sell_info;
                sellData.provider = this.state.provider;
                sellData.plutus_rate_id = result.sell_info.plutus_rate_id;
                sellData.timeAvailable = timeAvailable;

                storageService().setObject('sellData', sellData);
                getUpdatedSellData(sellData);

                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
                this.props.parent.updateParent('show_loader', false);
                
            } else {
                this.resetTimer(sellData);

                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
                this.props.parent.updateParent('show_loader', false);
                this.props.parent.updateParent('price_crashed', true);
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
            }

            

        } catch (err) {
            this.resetTimer(sellData);
            console.log(err);
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    render() {
        if(!this.state.show_loader) {
            return null;
        }
        
        return(
            <Container
            showLoader={this.state.show_loader}
            noFooter={true}
            loaderData= {
                {
                    'loaderClass': 'Loader-Dialog',
                    'loadingText': 'Wait for a moment...'
                }
            }
                >
            </Container>
        )
    }

}

const RefreshSellPrice = (props) => (
    <SellPriceClass
        {...props} />
);

export default RefreshSellPrice;