import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import { Bar } from 'react-chartjs-2';
import LeftRightFooter from '../../../common/ui/leftRightFooter';
import {inrFormatDecimal2} from 'utils/validators';

const options={
  legend: {
      display: false,
  },
  tooltips: {
    callbacks: {
        label: function(tooltipItem, data) {
          return 'PRICE ' + inrFormatDecimal2(tooltipItem.yLabel);
        }
    }
  },
  scales: {
    xAxes: [{
        gridLines: {
            color: "rgba(0, 0, 0, 0)",
        }
    }],
    yAxes: [{
        gridLines: {
            // color: "rgba(0, 0, 0, 0)",
            color: "#EEEEEE"
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value) {
              return (value/1000).toFixed(0) + 'K';
          },
          stepSize: 10000,
          beginAtZero: false,
          // display: false
        }
           
    }]
}
};

class CheckHow1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      rightButtonData: {
        title: 'NEXT'
      },
      leftButtonData: {
        hide: true
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
        "screen_name": 'check_how1'
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
        // classOverRide="gold-check-how-container"
        // classOverRideContainer="gold-check-how-container"
        headerData={ {
          icon: 'close'
        }}
      >
        <div className="check-how-gold">

        <div className="chart">
            <div style={{color: '#D3DBE4', fontSize: 10,fontWeight: 700, textAlign: 'center'}}>Gold prices since 1975</div>
            <Bar
            data={
                {labels: [1985, 1995, 2005, 2015, 2019],
                datasets: [
                  {
                    label: 'Price',
                    data: [1781.24, 5454.37, 9590.61, 28510.10, 42158.60],
                     backgroundColor: getConfig().styles.primaryColor,
                  }
                ]}
            }
            options = {options}
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
                    For example, gold has generated a return of <b>24.58%</b> during the financial year <b>2008-09, </b> 
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
