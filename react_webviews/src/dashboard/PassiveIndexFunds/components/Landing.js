import React, { Component } from "react";
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

    render() {
        return (
            <Container
                title="Passive index funds"
                noFooter={true}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                classHeader='header-color-red'
                customBackButtonColor='white'
            >
                <div>
                    <div className='educational-video-block'>
                        <p style={{ marginLeft: '22px' }}>Get started with index funds</p>
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