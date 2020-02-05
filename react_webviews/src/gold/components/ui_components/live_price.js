import React, { Component } from 'react';

import ic_live_green from 'assets/ic_live_green.svg';
import SVG from 'react-inlinesvg';

class GoldLivePriceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="live-price-gold">
                <div className="left-img">
                    <SVG
                        // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                        src={ic_live_green}
                    />
                </div>
                <div className="mid-text">
                    Live price: ₹4,173.00/gm
                </div>
                <div className="right-text">
                    VALID FOR 1:59
                </div>
            </div>
        );
    }
}

const GoldLivePrice = (props) => (
    <GoldLivePriceClass
    {...props} />
);

export default GoldLivePrice;