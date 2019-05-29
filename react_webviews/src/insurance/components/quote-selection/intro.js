import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
// import $ from 'jquery';

import help_myway from 'assets/help_myway.svg';
import help_fisdom from 'assets/help_fisdom.svg';
import secure_family_myway from 'assets/secure_family_myway.svg';
import secure_family_fisdom from 'assets/secure_family_fisdom.svg';
import unfortunate_events_fisdom from 'assets/unfortunate_events_fisdom.svg';
import unfortunate_events_myway from 'assets/unfortunate_events_myway.svg';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
// var CarouselComponent = Carousel.Carousel;

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      selectedIndex: 0,
      imageData: [
        { src: '' }
      ]
    }
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


    let imageData = [
      {
        text: 'Insurance is securing family',
        src: this.state.type === 'fisdom' ? help_fisdom : help_myway
      },
      {
        text: 'Insurance is securing family',
        src: this.state.type === 'fisdom' ? secure_family_fisdom : secure_family_myway
      },
      {
        text: 'Insurance is securing family',
        src: this.state.type === 'fisdom' ? unfortunate_events_fisdom : unfortunate_events_myway
      }
    ];

    this.setState({
      imageData: imageData
    })
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

  onChange() {

  }

  onClickItem() {

  }

  onClickThumb() {

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Term Insurance"
        handleClick={this.handleClick}
        buttonTitle="Protect Your Family"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >

        {/* <div>
          <div>
            <img style={{ width: 380 }} src={this.state.imageData[this.state.selectedIndex].src} alt="Insurance" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className={(this.state.selectedIndex === 0 ? 'intro-filled-dot' : 'intro-empty-dot')}></span>
            <span className={(this.state.selectedIndex === 1 ? 'intro-filled-dot' : 'intro-empty-dot')}></span>
            <span className={(this.state.selectedIndex === 2 ? 'intro-filled-dot' : 'intro-empty-dot')}></span>
          </div>
          <div style={{
            color: '#4a4a4a', fontSize: 16, fontWeight: 500, textAlign: 'center',
            marginTop: 50
          }}>{this.state.imageData[this.state.selectedIndex].text}</div>
        </div> */}


        {/* <CarouselComponent  */}
        <Carousel
          showStatus={false} showThumbs={false}
          showArrows={true} onChange={this.onChange} onClickItem={this.onClickItem}
          onClickThumb={this.onClickThumb}>
          <div>
            <img src={help_fisdom} alt="Insurance" />
            <p className="legend">Legend 1</p>
          </div>
          <div>
            <img src={secure_family_myway} alt="Insurance" />
            <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src={unfortunate_events_myway} alt="Insurance" />
            <p className="legend">Legend 3</p>
          </div>
        </Carousel>
      </Container>
    );
  }
}

export default Intro;
