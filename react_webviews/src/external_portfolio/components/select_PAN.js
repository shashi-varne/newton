import React, { Component } from 'react';
import completed_step from "assets/completed_step.svg";
import Container from '../common/Container';
import { storageService } from "utils/validators";
import { nativeCallback } from 'utils/native_callback';
import { navigate, setLoader } from '../common/commonFunctions';
import { fetchAllPANs } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';

class PANSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPan: {},
            pans: [],
        };
        this.renderPANs = this.renderPANs.bind(this);
        this.navigate = navigate.bind(this);
        this.setLoader = setLoader.bind(this);
    }

    sendEvents(user_action, params) {
        let eventObj = {
            "event_name": 'portfolio_tracker',
            "properties": {
                "user_action": user_action,
                "screen_name": 'accounts',
                performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
                ...params, 
            }
        };
        
        nativeCallback({ events: eventObj });
    }

    async componentDidMount() {
        try {
            this.setLoader(true);
            let pans = await fetchAllPANs();
            const selectedPan = storageService().getObject('user_pan') || {};
            let selectedIndex = pans.find(pan => pan.pan === selectedPan.pan);
            this.setState({
                pans,
                selectedIndex,
                selectedPan,
                show_loader: false, // same as this.setLoader(false);
            });
        } catch(err) {
            this.setLoader(false);
            console.log(err);
            toast(err);
        }
    }

    choosePAN = (index) => {
        const old_pan = this.state.selectedPan;
        const new_pan = this.state.pans[index];
        if (old_pan.pan === new_pan.pan) return;
        this.sendEvents('back', { account_changed: true });
        storageService().setObject('user_pan', new_pan);
        storageService().remove('hni-portfolio');
        this.setState({
            selectedIndex: index,
            selectedPan: new_pan,
        })
        this.navigate('external_portfolio');
    }

    renderPANs(pan, index) {
        return (
            <div onClick={() => this.choosePAN(index, pan)}
                className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
                key={index}
                style={{
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
                    {pan.name ? pan.name[0] || '-' : '-'}
                </div>
                <div className="select-bank" style={{ padding: '3px 0 0 0px', margin: 0, flex: 1 }}>
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="bank-name" style={{ fontSize: '15px' }}>
                                    {pan.name || '--'}
                                </div>
                                <div className="account-number" style={{ textTransform: 'uppercase', lineHeight: '25px' }}>
                                    {pan.pan === 'NA' ? 'Unspecified PAN' : pan.pan}
                                </div>
                            </div>
                            <div>
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

    goBack = () => {
        this.sendEvents('back', { account_changed: false });
        this.navigate('external_portfolio');
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Portfolio accounts"
                noFooter={true}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                goBack={this.goBack}
                events={this.sendEvents('just_set_events')}
            >   
                { this.state.pans.length ?
                    <div className="gold-sell-select-bank">
                        {this.state.pans.map(this.renderPANs)}
                    </div> :
                    <span>
                        No PANs found
                    </span>
                }
            </Container>
        );
    }
}

export default PANSelector;