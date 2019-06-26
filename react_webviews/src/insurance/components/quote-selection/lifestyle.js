import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import smoking_icon from 'assets/smoking_icon.png';
import no_smoke_icon from 'assets/no_smoke_icon.png';
import DropdownInPage from '../../../common/ui/DropdownInPage';

class LifeStyle extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.localStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      params: qs.parse(props.history.location.search.slice(1)),
      selectedIndex: quoteData.selectedIndexSmoke || 0,
      smokeList: ['Yes', 'No'],
      quoteData: quoteData
    }
    this.setValue = this.setValue.bind(this);
  }

  async componentDidMount() {
    this.setValue(this.state.selectedIndex);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    let quoteData = this.state.quoteData;
    quoteData.tobacco_choice = this.state.tobacco_choice === 'Yes' ? 'Y' : 'N';
    quoteData.selectedIndexSmoke = this.state.selectedIndex;
    quoteData.smokeList = this.state.smokeList;
    window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('lifestyle')
    this.navigate('quote')
  }

  setValue(index) {
    this.setState({
      selectedIndex: index,
      tobacco_choice: this.state.smokeList[index]
    })
  }

  renderPopUp() {
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'life_style',
        'chew_tobacco': this.state.tobacco_choice
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
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Your Lifestyle"
        count={true}
        total={5}
        current={5}
        handleClick={this.handleClick}
        buttonTitle="Show Best Insurance"
        fullWidthButton={true}
        onlyButton={true}
      >
        <div style={{ display: '-webkit-box', margin: '0 0 20px 0' }}>
          <img style={{ width: 40 }} src={this.state.smokeList[this.state.selectedIndex] === 'No' ?
            no_smoke_icon : smoking_icon} alt="Insurance" />
          <div style={{ color: '#4a4a4a', fontSize: 16, margin: '10px 0 0 7px' }}>Do you smoke or chew tobacco?</div>
        </div>

        <div>
          <DropdownInPage
            options={this.state.smokeList}
            value={this.state.selectedIndex}
            onChange={this.setValue}
          />
        </div>
      </Container>
    );
  }
}

export default LifeStyle;
