import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import help_myway from 'assets/help_myway.svg';
import help_fisdom from 'assets/help_fisdom.svg';
import secure_family_myway from 'assets/secure_family_myway.svg';
import secure_family_fisdom from 'assets/secure_family_fisdom.svg';
import unfortunate_events_fisdom from 'assets/unfortunate_events_fisdom.svg';
import unfortunate_events_myway from 'assets/unfortunate_events_myway.svg';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      selectedItem: 0,
      selectedIndex: 0,
      card_swipe: 'no',
      card_swipe_count: 0,
      time_spent: 0
    }
    this.renderTitle = this.renderTitle.bind(this);
  }

  componentWillMount() {
    let intervalId = setInterval(this.countdown, 1000);
    this.setState({
      countdownInterval: intervalId,
      show_loader: false
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    this.setState({
      time_spent: this.state.time_spent + 1
    })
  };

  renderTitle(index) {
    index = index * 1;
    if (this.state.imageData) {
      return (
        <div style={{
          color: '#4a4a4a', fontSize: 16, fontWeight: 500, textAlign: 'center',
          marginTop: 20
        }}>
          {this.state.imageData[this.state.selectedIndex].text}
        </div>
      )
    }
  }

  async componentDidMount() {


    let imageData = [
      {
        text: 'Insurance is securing family',
        src: this.state.type === 'fisdom' ? secure_family_fisdom : secure_family_myway
      },
      {
        text: 'from unfortunate events',
        src: this.state.type === 'fisdom' ? unfortunate_events_fisdom : unfortunate_events_myway
      },
      {
        text: '& we help you to choose right policy',
        src: this.state.type === 'fisdom' ? help_fisdom : help_myway
      }
    ];

    this.setState({
      imageData: imageData
    })
    this.renderTitle(0);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    this.navigate('journey-intro')
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'term_insurance_intro',
        "card_swipe": this.state.card_swipe,
        'card_swipe_count': this.state.card_swipe_count / 2,
        'current_card_pos': this.state.selectedIndex + 1,
        'time_spent': this.state.time_spent
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
        title="Term Insurance"
        handleClick={this.handleClick}
        buttonTitle="Protect Your Family"
        fullWidthButton={true}
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
      >

        {this.state.imageData && <Carousel
          showStatus={false} showThumbs={false}
          showArrows={true}
          infiniteLoop={false}
          selectedItem={this.state.selectedIndex}
          onChange={(index) => {
            this.setState({
              selectedIndex: index,
              card_swipe: 'yes',
              card_swipe_count: this.state.card_swipe_count + 1
            });
          }}
        >
          <div>
            <img src={this.state.imageData[0].src} alt="Insurance" />
          </div>
          <div>
            <img src={this.state.imageData[1].src} alt="Insurance" />
          </div>
          <div>
            <img src={this.state.imageData[2].src} alt="Insurance" />
          </div>
        </Carousel>}
        {this.renderTitle(this.state.selectedIndex)}
      </Container>
    );
  }
}

export default Intro;
