import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';

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
      selectedIndex: 0
    }
    this.renderTitle = this.renderTitle.bind(this);
  }

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
    this.navigate('journey-intro')
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
      >

        {this.state.imageData && <Carousel
          showStatus={false} showThumbs={false}
          showArrows={true}
          infiniteLoop={false}
          selectedItem={this.state.selectedIndex}
          onChange={(index) => {
            this.setState({
              selectedIndex: index
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
