import React, { Component } from "react";
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import Container from "../../common/Container";
import ReactResponsiveCarousel from "../../../common/ui/carousel";
import MenuListDropDown from '../../../common/ui/MenuListDropDown'
import { storageService } from "utils/validators";
import WVSecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer"
import { carousel_img, fund_category } from "../constants";
import { initialize } from "../common/commonFunctions";

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
        screenfull.request(findDOMNode(this.player));
        this.setState({ playing: !this.state.playing });
    }

    ref = player => {
        this.player = player
    }

    render() {

        const { playing } = this.state;

        return (
            <Container
                title="Passive index funds"
                noFooter={true}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                classHeader='header-color-blue'
                customBackButtonColor='white'
            >
                <div>
                    <div className='educational-video-block'>
                        <p>Get started with index funds</p>
                        <div className='player-wrapper' onClick={this.handleClickFullscreen}>
                            <ReactPlayer
                                className='react-player'
                                ref={this.ref}
                                url='https://www.youtube.com/watch?v=rxiGpgj-43c&ab_channel=fisdom'
                                width='100%'
                                height='180px'
                                playing={playing}
                                controls={false}
                                loop={true}
                                light={true}
                                playIcon={<img src={require(`assets/icon_play_btn.svg`)} className='react-player play-icon' alt="" />}
                            />
                        </div>
                        <img src={require(`assets/passive_index_video_info.svg`)} className='react-player play-info' alt="" />
                    </div>
                    <h1 className='category-title' style={{ marginTop: '400px' }}>Top index funds</h1>
                    <MenuListDropDown menulistProducts={fund_category} value={this.state.value} handleClick={this.handleClick} />
                    <h1 className='category-title'>Key insights</h1>
                    <div className='react-responsive-carousel'>
                        <ReactResponsiveCarousel
                            CarouselImg={carousel_img}
                            callbackFromParent={this.carouselSwipecount}
                            selectedIndexvalue={this.state.selectedIndex}
                        />
                    </div>
                    <WVSecurityDisclaimer />
                </div>
            </Container>
        );
    }
}

export default Landing;