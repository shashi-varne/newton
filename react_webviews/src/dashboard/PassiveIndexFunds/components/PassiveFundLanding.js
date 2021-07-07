import React, { Component } from "react";
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import Container from "../../common/Container";
import WVSecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer"
import { FUND_CATEGORY, ACTIVE_PASSIVE_FACTS_CAROUSEL, KEY_INSIGHTS_CAROUSEL } from "../constants";
import { storageService } from "utils/validators";
import { initialize } from "../common/commonFunctions";
import { nativeCallback } from "../../../utils/native_callback";
import VideoBlockImageSection from "../mini-components/VideoBlockImageSection"
import { Imgc } from "../../../common/ui/Imgc";
import { isEmpty } from 'lodash';
import WVMenuListDropdownItem from "../../../common/ui/MenuListDropdown/WVMenuListDropdownItem"
import KeyInsightBackground from "../../../assets/passiveFundKeyInsights.svg";
import ActivePassiveBackground from "../../../assets/active_passive_background.svg";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import WVGenericContentCarousel from "../../../common/ui/GenericContentCarousel/WVGenericContentCarousel";
import WVGenericFactCarousel from "../../../common/ui/GenericFactCarousel/WVGenericFactCarousel";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen_name: 'landing_screen',
      playing: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  handleClickFullscreen = () => {
    this.setState({ video_clicked: 'yes', playing: !this.state.playing })
    setTimeout(() => {
      screenfull.request(findDOMNode(this.player));
    }, 1000);
  }

  ref = player => {
    this.player = player
  }

  handleClick = (data) => {
    const categoryName = data.key === "global_indices" ? "global_index_funds" : data.key;
    this.sendEvents("next", categoryName);
    storageService().set("category_index_name", data.title);
    this.navigate(`${data.key}/fund-list`, data.title);
  };

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
        data-aid={"passive-fund-landing-screen"}
        noPadding
      >
        <div data-aid="passive-fund-landing-section">
          <div className="educational-video-block" data-aid="educational-video-block">
            <WVInPageSubtitle children={"Get started with index funds"} className='inpage-subtitle' dataAidSuffix="fundlanding" />
            <div className="player-wrapper" onClick={this.handleClickFullscreen}>
              <ReactPlayer
                className="react-player"
                ref={this.ref}
                url="https://www.youtube.com/watch?v=PO1b1eD4-Ck&ab_channel=fisdom"
                width="100%"
                height="100%"
                playing={playing}
                controls={true}
                onProgress={(callback) => this.setState({ video_duration: callback?.playedSeconds })}
                onPause={() => this.sendEvents("video_paused")}
                onEnded={() => { window.location.reload() }}
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
                    playerVars: { modestbranding: 1, rel: 0, fs: 1, loop: 0, }
                  }
                }}
              />
            </div>
            <VideoBlockImageSection />
          </div>
          <div className="content-main" data-aid="content-main">
            <h1 className="category-title" data-aid="category-title-1">Top index funds</h1>
            <React.Fragment>
              {!isEmpty(FUND_CATEGORY) &&
                FUND_CATEGORY.map((item) => {
                  return (
                    <WVMenuListDropdownItem
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.icon}
                      keyname={item.key}
                      handleClick={() => this.handleClick(item)}
                      value={this.state.selectedValue}
                      isDropDown={item.isDropDown}
                      selectedValue={this.selectedValue}
                    />
                  );
                })}
            </React.Fragment>
            <h1 className="category-title" data-aid="category-title-2">Key insights</h1>
            <div className="react-responsive-carousel">
              <WVGenericContentCarousel
                customData={KEY_INSIGHTS_CAROUSEL}
                callbackFromParent={this.countCarouselSwipe}
                selectedIndexvalue={this.state.selectedIndex}
                carouselPageStyle={{
                  backgroundImage: `url(${KeyInsightBackground})`,
                  backgroundColor: "#FBFDFF"
                }}
                dataAidSuffix="passive-key-insights"
              />
            </div>
            <h1 className="category-title" data-aid="category-title-3">Passive vs. Active investing</h1>
            <div className="react-responsive-carousel">
              <WVGenericFactCarousel
                customData={ACTIVE_PASSIVE_FACTS_CAROUSEL}
                callbackFromParent={this.countCarouselSwipe}
                carouselPageStyle={{
                  backgroundImage: `url(${ActivePassiveBackground})`,
                  backgroundColor: "#FAFCFF"
                }}
                dataAidSuffix="active-vs-passive"
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