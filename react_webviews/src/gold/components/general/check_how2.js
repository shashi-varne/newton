import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import LeftRightFooter from '../../../common/ui/leftRightFooter';


import {Imgc} from '../../../common/ui/Imgc';

class CheckHow2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            productName: getConfig().productName,
            rightButtonData: {
                title: 'NEXT'
              },
              leftButtonData: {
                title: 'BACK'
              }
        }
    }


    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'gold_investment_flow',
            "properties": {
                "user_action": user_action,
                "screen_name": 'check_how2'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    leftClick = () => {
        this.sendEvents('back');
        this.navigate('check-how1');
    }

    rightClick = () => {
        this.sendEvents('next');
        this.navigate('check-how3');
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Buy 24K gold to create long term wealth"
                edit={this.props.edit}
                events={this.sendEvents('just_set_events')}
                count={true}
                current={2}
                total={3}
                noFooter={true}
                headerData={{
                    icon: 'close'
                }}
            >
                <div className="check-how-gold">

                    <div className="mid-img">
                        <Imgc 
                        className='mid-img-class'
                        src={require(`assets/${this.state.productName}/ils_alternate_assets.svg`)}
                         />
                    </div>
                    <div className="title">
                        Gold is an alternate asset
                    </div>
                    <div className="content">
                        <div className="content-tiles">
                            Gold is globally considered by all wealth managers as an asset class which
                            provides <b>stability to your portfolio</b> against stock market risks.
                        </div>
                        <div className="content-tiles">
                            In India, gold is much more than an investment and you can convert your
                            <b> digital gold to gold coins</b> anytime.
                        </div>
                    </div>
                </div>
                <LeftRightFooter parent={this} />
            </Container>
        );
    }
}

export default CheckHow2;
