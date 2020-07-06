import React, { Component } from 'react';

import completed_step from "assets/completed_step.svg";
import Container from '../common/Container';
import { getUrlParams } from 'utils/validators';
import {storageService, getIndexArray} from "utils/validators";
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../common/commonFunctions';
import { fetchAllPANs } from '../common/ApiCalls';

class PANSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPan: storageService().getObject('user_pan'),
            params: getUrlParams()
        }
        this.renderPANs = this.renderPANs.bind(this);
        this.navigate = navigate.bind(this);
    }

    async componentWillMount() {
        let { pans } = await fetchAllPANs();
        pans = pans.map(pan => ({ pan }));
        let selectedIndex = getIndexArray(pans, this.state.selectedPan.pan, 'pan');
        this.setState({ pans, selectedIndex })
    }

    choosePAN = (index) => {
        this.sendEvents('next', {change_PAN: true});
        this.setState({
            selectedIndex: index,
            selectedPan: this.state.pans[index],
        })
    }


    renderPANs(props, index) {
        return (
            <div onClick={() => this.choosePAN(index, props)}
                className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
                key={index}
                style={{
                    opacity: props.status === 'pending' ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div
                    className="selected-pan-initial"
                    style={{
                        minWidth: '40px',
                        minHeight: '40px',
                        lineHeight: '40px',
                        fontSize: '19px',
                    }}
                >
                    J
                </div>
                <div className="select-bank" style={{ padding: '3px 0 0 0px', margin: 0, flex: 1 }}>
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="bank-name" style={{ fontSize: '15px' }}>
                                    {props.name || 'James Bond'}
                                </div>
                                <div className="account-number" style={{ textTransform: 'uppercase', lineHeight: '25px' }}>
                                    {props.pan}
                                </div>
                            </div>
                            <div style={{}}>
                                {index === this.state.selectedIndex &&
                                    <img
                                        style={{ width: 14, margin: '4px 0 0 8px', verticalAlign: 'middle' }}
                                        src={completed_step}
                                        alt="Check"/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    handleClick = () => {
        // let state = stateMapper[this.state.params.redirect_state];
        storageService().set('user_pan', this.state.selectedPan);
        this.navigate('external_portfolio');
    }

    sendEvents(user_action, current_data={}) {
        let eventObj = {
          "event_name": 'gold_investment_flow',
          "properties": {
            "user_action": user_action,
            "screen_name": 'select_PAN',
            "selectedPan": this.state.selectedPan || '',
            "change_PAN": current_data.change_PAN ? 'yes' : 'no'
          }
          
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
      }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Portfolio accounts"
                handleClick={this.handleClick}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                events={this.sendEvents('just_set_events')}
            >
                <div className="gold-sell-select-bank">
                    {this.state.pans && this.state.pans.map(this.renderPANs)}
                </div>
            </Container>
        );
    }
}

// const GoldSelectPAN = (props) => (
//     <PANSelector {...props} />
// );

export default PANSelector;