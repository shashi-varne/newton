import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { inrFormatDecimal } from 'utils/validators';
import dmi_logo from 'assets/dmi_logo.svg';

class Landing2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    onload = async () => {
        // ****************************************************
        // code goes here
        // common things can be added inside initialize
        // use/add common functions from/to  ../../common/functions

    }

    handleClick = () => {
        this.sendEvents('next');
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'lending',
            "properties": {
              "user_action": user_action,
              "screen_name": 'introduction'
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
            title="Loan"
            events={this.sendEvents('just_set_events')}
            handleClick={this.handleClick}
            buttonTitle="CONTINUE"
            noFooter={true}
            styleHeader={{
              backgroundColor:'#0a1d32',
              color:'#fff'
            }}
          >
            <div className="loan-landing2">
                <div className="container">
                <div style={{lineHeight:'24px'}}>
                    <div style={{fontSize:'10px', fontWeight:'bold', color:"#d3dbe4"}}>
                        Closing principle balance
                    </div>
                    <div style={{fontSize:'20px', fontWeight:'bold', color:'#fff'}}>
                        {inrFormatDecimal(288000)}
                    </div>
                </div>

                <div className="block1">
                    <div style={{lineHeight:'24px'}}>
                        <div className="block1-head">Loan amount</div>
                        <div className="block1-amount">{inrFormatDecimal(300000)}</div>
                    </div>
                    <div style={{lineHeight:'24px'}}>
                        <div className="block1-head">Upcoming EMI</div>
                        <div className="block1-amount">{inrFormatDecimal(300000)}
                            <span style={{color:'#7ED321', fontSize:'12px'}}> (10 JULY 2020)</span>
                        </div>
                    </div>
                </div>
                </div>

                <div className="block2">
                    <div className="card-info">
                      <img src={require(`assets/${this.state.productName}/ic_read.svg`)}
                        style={{marginRight: 10}}
                        alt="" />
                        Get loan schedule document
                    </div>
                </div>

                <div className="block2">
                    <div className="card-info">
                      <img src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                        style={{marginRight: 10}}
                        alt="" />
                        DMI customer portal
                    </div>
                </div>

                <div className="block2">
                    <div className="card-info">
                      <img src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                        style={{marginRight: 10}}
                        alt="" />
                        Need help
                    </div>
                </div>

                <div className="dmi-info">
                  In partnership with
                  <img style={{marginLeft: 10}} src={dmi_logo} alt="" />
                </div>

            </div>
          </Container>
        );
    }
}

export default Landing2;
