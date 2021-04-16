import React, { Component } from 'react';

import ic_live_green from 'assets/ic_live_green.svg';
import SVG from 'react-inlinesvg';
import { inrFormatDecimal2 } from 'utils/validators';
import {getConfig} from 'utils/functions';

class GoldLivePriceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if(this.props.parent.state.pan_bank_flow) {
            return null;
        }
        
        return (
            <div className="live-price-gold" style={this.props.style}>
                <div style={{display: 'flex'}}>
                    <div className="left-img">
                        {this.props.parent.state.minutes < 1 && 
                        <SVG
                            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#D0021B' )}
                            src={ic_live_green}
                        />}
                        {this.props.parent.state.minutes >= 1 && 
                        <SVG
                            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.secondaryColor )}
                            src={ic_live_green}
                        />}
                    </div>
                    <div className="mid-text">
            Live price: {inrFormatDecimal2(this.props.parent.state.live_price)} 
            {(!this.props.parent.state.live_price ? '-' : '')}/gm
                    </div>
                </div>
                <div className="right-text" 
                style={{color: this.props.parent.state.minutes <1 ? '#D0021B' : getConfig().styles.secondaryColor}}>
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