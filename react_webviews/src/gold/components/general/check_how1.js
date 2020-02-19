import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import { Bar } from 'react-chartjs-2';
import LeftRightFooter from '../../../common/ui/leftRightFooter';

class CheckHow1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false
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
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Know More'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    this.navigate('check-how2');
  }

  leftClick = () => {
    this.sendEvents('back');
    this.navigate('/gold/landing');
  }

  rightClick = () => {
    this.sendEvents('next');
    this.navigate('check-how2');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Buy 24K gold to create long term wealth"
        edit={this.props.edit}
        events={this.sendEvents('just_set_events')}
        count={true}
        current={1}
        total={3}
        noFooter={true}
      >
        <div className="check-how-gold">

        <div className="chart">
            <div style={{color: '#D3DBE4', fontSize: 10,fontWeight: 700, textAlign: 'center'}}>Gold prices since 1975</div>
            <Bar
            data={
                {labels: [0, 1900, 2000, 2010, 2020],
                datasets: [
                  {
                    label: 'Price',
                    data: [0, 200, 300, 500, 1000],
                     backgroundColor: getConfig().primary,
                  }
                ]}
            }
            width={100}
            height={50}
            />

         </div>

            <div className="title">
                Returns of gold
            </div>
            <div className="content">
                <div className="content-tiles">
                    Over the last 30 years gold price has increased by <b>~423%.</b> It acts as a cushion to stock market risks.
                </div>
                <div className="content-tiles">
                    For example, gold has generated a return of <b>24.58%</b> during the financial year <b>2008-09,</b> 
                    when the Sensex has crashed almost 38%.
                </div>
            </div>
       </div>

       <LeftRightFooter parent={this} />
      </Container>
    );
  }
}

export default CheckHow1;
