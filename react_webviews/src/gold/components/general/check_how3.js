import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import LeftRightFooter from '../../../common/ui/leftRightFooter';
import {Imgc} from '../../../common/ui/Imgc';

class CheckHow2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            productName: getConfig().productName,
            rightButtonData: {
                title: 'Buy digital gold'
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
                "screen_name": 'check_how3'
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
        this.navigate('check-how2');
    }

    rightClick = () => {
        this.sendEvents('next');
        this.navigate('/gold/buy');
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Buy 24K gold to create long term wealth"
                edit={this.props.edit}
                events={this.sendEvents('just_set_events')}
                count={true}
                current={3}
                total={3}
                noFooter={true}
                headerData={{
                    icon: 'close'
                }}
            >
                <div className="check-how-gold">

                    <div className="mid-img">
                        <Imgc src={require(`assets/${this.state.productName}/ils_hassle_free.svg`)} 
                        alt="Gold" 
                        className="mid-img-class"
                        />
                    </div>

                    <div className="title">
                        Hassle free buy/sell/delivery
                    </div>
                    <div className="content">
                        <div className="content-tiles">
                            Digital Gold solves the issues of owning and storing physical gold.
                It also provides <b>flexibility to buy</b> at prices comfortable to you and <b>sell anytime</b> which is
                                                    just icing on the cake.
                                                    You can start accumulating gold now and sell/get gold coins delivered as per your convenience.
                    </div>

                    </div>

                    <GoldBottomSecureInfo parent={this} style={{margin: '60px 0 -20px 0'}} />
                </div>

         <div style={{border : '2px solid red'}}>   <LeftRightFooter parent={this} />  </div>     
            </Container>
        );
    }
}

export default CheckHow2;
