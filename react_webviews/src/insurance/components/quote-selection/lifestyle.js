import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';

import no_smoke_icon from 'assets/no_smoke_icon.png';
import DropdownInPage from '../../../common/ui/DropdownInPage';

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
    this.setValue = this.setValue.bind(this);
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
