import React, { Component } from "react";
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import Container from "../../common/Container";
import MenuListDropDown from '../../../common/ui/MenuListDropDown'
import { storageService } from "utils/validators";
import WVSecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer"
import { fund_category, passiveActiveCarousal, keyInsightsCarousel } from "../constants";
import { initialize } from "../common/commonFunctions";
import { nativeCallback } from "../../../utils/native_callback";
import ActivePassiveCarousel from "../../../common/ui/ActivePassiveCarousel";
import KeyInsightCarousel from "../../../common/ui/KeyInsightCarousel";
import VideoBlock from "../mini-components/VideoBlock"
import { Imgc } from "../../../common/ui/Imgc";

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
        storageService().set("video_clicked", true);
        screenfull.request(findDOMNode(this.player));
        this.setState({ playing: !this.state.playing });
    }

    ref = player => {
        this.player = player
    }

    sendEvents = (userAction, fundCategory) => {
        // VIDEO PAUSED EVENT LEFT
        let eventObj = {
          event_name: "passive_funds",
          properties: {
            user_action: userAction || "",
            screen_name: "learn_more_passive_funds",
            video_clicked: storageService().get("video_clicked") ? "yes" : "no",
            passive_index_funds_clicked: fundCategory || "",
            // video_duration: 
          },
        };
        storageService().remove("video_clicked");
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
            classHeader="header-color-blue"
            customBackButtonColor="white"
            noPadding
          >
            <div>
              <div className="educational-video-block">
                <p style={{ padding: "5px 0 30px 20px" }}>
                  Get started with index funds
                </p>
                <div
                  className="player-wrapper"
                  onClick={this.handleClickFullscreen}
                >
                  <ReactPlayer
                    className="react-player"
                    ref={this.ref}
                    url="https://www.youtube.com/watch?v=rxiGpgj-43c&ab_channel=fisdom"
                    width="100%"
                    height="180px"
                    playing={playing}
                    controls={false}
                    loop={true}
                    light={true}
                    playIcon={
                      <Imgc
                        src={require(`assets/icon_play_btn.svg`)}
                        className="react-player play-icon"
                        alt=""
                      />
                    }
                  />
                </div>
                <VideoBlock/>
              </div>
              <div className="content-main">
                <h1 className="category-title">Top index funds</h1>
                <MenuListDropDown
                  menulistProducts={fund_category}
                  value={this.state.value}
                  handleClick={this.handleClick}
                />
                <h1 className="category-title">Key insights</h1>
                <div className="react-responsive-carousel">
                  <KeyInsightCarousel
                    customData={keyInsightsCarousel}
                    callbackFromParent={this.carouselSwipecount}
                    selectedIndexvalue={this.state.selectedIndex}
                  />
                </div>
                <h1 className="category-title">Passive vs. Active investing</h1>
                <div className="react-responsive-carousel">
                  <ActivePassiveCarousel
                    customData={passiveActiveCarousal}
                    callbackFromParent={this.carouselSwipecount}
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