import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';

import selected_option from 'assets/selected_option.png';
import no_smoke_icon from 'assets/no_smoke_icon.png';

class LifeStyle extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.localStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      selectedIndex: quoteData.selectedIndexSmoke || 0,
      smokeList: ['Yes', 'No'],
      quoteData: quoteData
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
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
    let quoteData = this.state.quoteData;
    quoteData.tobacco_choice = this.state.tobacco_choice === 'Yes' ? 'Y' : 'N';
    quoteData.selectedIndexSmoke = this.state.selectedIndex;
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

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.setValue(index)}
        className={'ins-row-scroll' + (this.state.selectedIndex === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedIndex !== index &&
          <div> {props}</div>}
        {this.state.selectedIndex === index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '88%', color: '#4f2da7', fontWeight: 500 }}>{props}</div>
            <img width="20" src={selected_option} alt="Insurance" />
          </div>}
      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Your Lifestyle"
        count={true}
        total={5}
        current={5}
        handleClick={this.handleClick}
        buttonTitle="Show Best Insurance"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >
        <div style={{ display: '-webkit-box', margin: '0 0 20px 0' }}>
          <img style={{ width: 40 }} src={no_smoke_icon} alt="Insurance" />
          <div style={{ color: '#4a4a4a', fontSize: 16, margin: '10px 0 0 7px' }}>Do you smoke or chew tobacco?</div>
        </div>

        <div>
          {this.state.smokeList.map(this.renderList)}
        </div>
      </Container>
    );
  }
}

export default LifeStyle;
