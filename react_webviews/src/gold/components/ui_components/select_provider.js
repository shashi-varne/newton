import React, { Component } from 'react';

import completed_step from "assets/completed_step.svg";
import Container from '../../common/Container';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import { getConfig } from 'utils/functions';
import { getUrlParams } from 'utils/validators';
import {stateMapper, default_provider} from  '../../constants';
import {storageService, getIndexArray} from "utils/validators";

class GoldSelectProviderClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provider: storageService().get('gold_provider') || default_provider,
            params: getUrlParams()
        }

        this.renderProviders = this.renderProviders.bind(this);
    }

    componentWillMount() {
        let providers = [
            {
                key: 'mmtc',
                title: 'MMTC',
                subtitle: '24 Karat | 99.9% pure',
                icon: safegold_logo
            },
            {
                key: 'safegold',
                title: 'Safegold',
                subtitle: '24 Karat | 99.5% pure',
                icon: safegold_logo
            }
        ];

        let selectedIndex = getIndexArray(providers, this.state.provider, 'key');
        this.setState({
            providers: providers,
            selectedIndex: selectedIndex
        })
    }

    chooseProvider = (index) => {
        this.setState({
            selectedIndex: index
        })
    }


    renderProviders(props, index) {
        return (

            <div onClick={() => this.chooseProvider(index, props)}
                className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
                key={index}
                style={{ opacity: props.status === 'pending' ? 0.4 : 1 }}
            >
                <div className="left-icon">
                    <img style={{ width: '40px', margin: '0 7px 0 0' }}
                        src={props.icon} alt="info"
                    />
                </div>
                <div className="select-bank" style={{ padding: '3px 0 0 50px', margin: 0 }}>
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="bank-name">
                                    {props.title}
                                </div>
                                <div className="account-number">
                                    {props.subtitle}
                                </div>
                            </div>
                            <div style={{}}>
                                {index === this.state.selectedIndex &&
                                    <img style={{ width: 9, margin: '4px 0 0 8px', verticalAlign: 'middle' }} src={completed_step} alt="Gold Delivery" />}
                            </div>

                        </div>

                    </div>
                </div>
            </div >
        )
    }

    navigate = (pathname) => {
        this.props.history.push({
          pathname: pathname,
          search: getConfig().searchParams
        });
      }

    handleClick = () => {
        let state = stateMapper[this.state.params.redirect_state];
        let provider = this.state.providers[this.state.selectedIndex].key;
        storageService().set('gold_provider', provider)
        this.navigate(state);
    }

    render() {
        return (

            <Container
                showLoader={this.state.show_loader}
                title="Select a gold provider"
                handleClick={this.handleClick}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="Continue"
            >
                <div className="gold-sell-select-bank">
                    {this.state.providers && this.state.providers.map(this.renderProviders)}
                </div>
            </Container>
        );
    }
}

const GoldSelectProvider = (props) => (
    <GoldSelectProviderClass
        {...props} />
);

export default GoldSelectProvider;