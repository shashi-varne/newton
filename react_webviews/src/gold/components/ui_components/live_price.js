import React, { Component } from 'react';

import ic_live_green from 'assets/ic_live_green.svg';
import SVG from 'react-inlinesvg';
import { inrFormatDecimal } from 'utils/validators';
import {getConfig} from 'utils/functions';

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
                    {this.props.parent.state.minutes < 1 && 
                    <SVG
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#D0021B' )}
                        src={ic_live_green}
                    />}
                    {this.props.parent.state.minutes >= 1 && 
                    <SVG
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().secondary )}
                        src={ic_live_green}
                    />}
                </div>
                <div className="mid-text">
        Live price: {inrFormatDecimal(this.props.parent.state.live_price)} 
        {(!this.props.parent.state.live_price ? '-' : '')}/gm
                </div>
                <div className="right-text" 
                style={{color: this.props.parent.state.minutes <1 ? '#D0021B' : getConfig().secondary}}>
                    VALID FOR {this.props.parent.state.minutes}:{this.props.parent.state.seconds}
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