import React, { Component } from 'react';
import GoldPanData from "../ui_components/pan";

class GoldPanBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderType: 'sell'
        }
    }

    render() {
        return (
           <GoldPanData parent={this} />
        );
    }
}

export default GoldPanBuy;
