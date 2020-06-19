import React, { Component } from 'react';

import completed_step from "assets/completed_step.svg";
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { getUrlParams } from 'utils/validators';
import { stateMapper, default_PAN, user_PANs_array} from  '../../constants';
import {storageService, getIndexArray} from "utils/validators";
import { nativeCallback } from 'utils/native_callback';

class SelectPANClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PAN: storageService().get('user_PAN') || default_PAN,
            params: getUrlParams()
        }

        this.renderPANs = this.renderPANs.bind(this);
    }

    componentWillMount() {
        let PANs = user_PANs_array;

        let selectedIndex = getIndexArray(PANs, this.state.PAN, 'key');
        this.setState({
            PANs: PANs,
            selectedIndex: selectedIndex
        })
    }

    choosePAN = (index) => {
        this.sendEvents('next', {change_PAN: true});
        this.setState({
            selectedIndex: index,
            PAN: this.state.PANs[index].key
        })

    }


    renderPANs(props, index) {
        return (

            <div onClick={() => this.choosePAN(index, props)}
                className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
                key={index}
                style={{ opacity: props.status === 'pending' ? 0.4 : 1 }}
            >
                <div className="left-icon">
                    <img style={{ width: '40px', margin: '0 7px 0 0' }}
                        src={require(`assets/${props.logo}`)} alt="Gold"
                    />

                </div>
                <div className="select-bank" style={{ padding: '3px 0 0 0px', margin: 0 }}>
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
                                    <img
                                        style={{ width: 14, margin: '4px 0 0 8px', verticalAlign: 'middle' }}
                                        src={completed_step}
                                        alt="Gold Delivery"/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        let PAN = this.state.PANs[this.state.selectedIndex].key;
        storageService().set('gold_PAN', PAN);
        this.navigate(state);
    }

    sendEvents(user_action, current_data={}) {
        let eventObj = {
          "event_name": 'gold_investment_flow',
          "properties": {
            "user_action": user_action,
            "screen_name": 'select_PAN',
            "PAN": this.state.PAN || '',
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
                    {this.state.PANs && this.state.PANs.map(this.renderPANs)}
                </div>
            </Container>
        );
    }
}

const GoldSelectPAN = (props) => (
    <GoldSelectPANClass
        {...props} />
);

export default GoldSelectPAN;