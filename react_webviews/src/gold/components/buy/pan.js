import React, { Component } from 'react';
import GoldPanData from "../ui_components/pan";
import PlaceBuyOrder from '../ui_components/place_buy_order';

class GoldPanBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderType: 'buy'
        }
    }


    updateParent(key, value) {
        this.setState({
            [key]: value
        })
    }

    render() {
        return (
            <div>
                <GoldPanData parent={this} />
                {this.state.proceedForOrder &&
                    <PlaceBuyOrder parent={this} />
                }
            </div>

        );
    }
}

export default GoldPanBuy;
