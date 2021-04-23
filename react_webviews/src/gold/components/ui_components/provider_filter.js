import React, { Component } from 'react';

import { getConfig } from 'utils/functions';
import down_arrow from 'assets/down_arrow.svg';
import SVG from 'react-inlinesvg';
import { gold_providers } from '../../constants';
import {SkeltonRect} from '../../../common/ui/Skelton';

class GoldProviderFilterClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            providerInfo: gold_providers[this.props.parent.state.provider]
        }
    }

    navigate = (pathname) => {
        this.props.parent.sendEvents('next', {change_provider : true})
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams + '&redirect_state=' + this.props.parent.state.redirect_state
        });
    }
    renderUi() {
        return (
            <div 
            className={`gold-provider-filter ${this.props.parent.state.inPageTitle ? 'slide-fade-show' : 'slide-fade2'}`}
            >
                <div className="tile1">
                    <div className="tile1-left">
                        <span style={{textTransform: 'capitalize'}}>{this.props.parent.state.orderType}</span> gold:
                        <span onClick={() => this.navigate('providers', { redirect_state: 'buy-home' })}
                            style={{ color: getConfig().styles.primaryColor,cursor: 'pointer' }}> {this.state.providerInfo.title}
                            <SVG
                                className="arrow-img"
                                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
                                src={down_arrow}
                            />
                        </span>
                    </div>
                    <div className="tile1-right">
                        <img src={require(`assets/${this.state.providerInfo.logo}`)} alt="Gold" />
                    </div>
                </div>
                <div className="tile2">
                    <div className="tile2-left">
                        {this.state.providerInfo.subtitle}
                    </div>
                    {!this.props.parent.state.skelton && this.props.parent.state.orderType !== 'buy' && 
                        <div className="tile2-right">
                        {this.props.parent.state.provider_info.gold_balance || 0} gms in {this.state.providerInfo.title}
                        </div>
                    }
                     <SkeltonRect className="tile2-right-skelton" 
                        hide={!this.props.parent.state.skelton} 
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderUi()}
            </div>
        )
    }


}

const GoldProviderFilter = (props) => (
    <GoldProviderFilterClass
        {...props} />
);

export default GoldProviderFilter;