import React, { Component } from "react";
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import Container from "../../common/Container";
import MenuListDropDown from '../../../common/ui/MenuListDropDown'
import WVSecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer"
import { FUND_CATEGORY, ACTIVE_PASSIVE_FACTS_CAROUSEL, KEY_INSIGHTS_CAROUSEL } from "../constants";
import { initialize } from "../common/commonFunctions";
import { nativeCallback } from "../../../utils/native_callback";
import GenericFactCarousel from "../../../common/ui/GenericFactCarousel";
import GenericContentCarousel from "../../../common/ui/GenericContentCarousel";
import VideoBlockImageSection from "../mini-components/VideoBlockImageSection"
import { Imgc } from "../../../common/ui/Imgc";
import KeyInsightBackground from "../../../assets/passiveFundKeyInsights.svg"
import ActivePassiveBackground from "../../../assets/active_passive_background.svg"
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle"
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen_name: 'landing_screen',
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  handleClickFullscreen = () => {
    this.setState({ video_clicked: 'yes' })
    screenfull.request(findDOMNode(this.player));
    this.setState({ playing: !this.state.playing });
  }

  ref = player => {
    this.player = player
  }

  sendEvents = (userAction, fundCategory) => {
    let eventObj = {
      event_name: "passive_funds",
      properties: {
        user_action: this.state.video_paused || userAction || "",
        screen_name: "learn_more_passive_funds",
        video_clicked: this.state.video_clicked || "no",
        video_duration: this.state.video_duration || "",
      },
    };

    if (fundCategory) {
      eventObj.properties.passive_index_funds_clicked = fundCategory || ''
    }

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {

    const { playing } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        title="Passive index funds"
        noFooter={true}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        classHeader="passive-index-header-color"
        customBackButtonColor="white"
        noPadding
      >
        <div>
          <div className="educational-video-block">
            <WVInPageSubtitle children={"Get started with index funds"} className='inpage-subtitle' />
            <div className="player-wrapper" onClick={this.handleClickFullscreen}>
              <ReactPlayer
                className="react-player"
                ref={this.ref}
                url="https://youtu.be/_jG3A96fu8o&ab_channel=fisdom"
                width="100%"
                height="180px"
                playing={playing}
                controls={true}
                loop={true}
                onProgress={(callback) => this.setState({ video_duration: callback?.playedSeconds })}
                onPause={() => this.sendEvents("video_paused")}
                light={true}
                playIcon={
                  <Imgc
                    src={require(`assets/icon_play_btn.svg`)}
                    className="react-player play-icon"
                    alt=""
                  />
                }
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1, rel: 0, fs: 1 }
                  }
                }}
              />
            </div>
            <VideoBlockImageSection />
          </div>
          <div className="content-main">
            <h1 className="category-title">Top index funds</h1>
            <MenuListDropDown
              menulistProducts={FUND_CATEGORY}
              value={this.state.value}
              handleClick={this.handleClick}
            />
            <h1 className="category-title">Key insights</h1>
            <div className="react-responsive-carousel">
              <GenericContentCarousel
                customData={KEY_INSIGHTS_CAROUSEL}
                callbackFromParent={this.countCarouselSwipe}
                selectedIndexvalue={this.state.selectedIndex}
                style={{
                  backgroundImage: `url(${KeyInsightBackground})`,
                  backgroundColor: "#FBFDFF"
                }}
              />
            </div>
            <h1 className="category-title">Passive vs. Active investing</h1>
            <div className="react-responsive-carousel">
              <GenericFactCarousel
                customData={ACTIVE_PASSIVE_FACTS_CAROUSEL}
                callbackFromParent={this.countCarouselSwipe}
                style={{
                  backgroundImage: `url(${ActivePassiveBackground})`,
                  backgroundColor: "#FAFCFF"
                }}
              />
            </div>
            <WVSecurityDisclaimer />
          </div>
        </div>
      </Container>
    );
  }
}

export default Landing;