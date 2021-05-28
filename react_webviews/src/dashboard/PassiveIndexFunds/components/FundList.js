import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { initialize } from "../common/commonFunctions";

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen_name: 'fund_list'
        };

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    render() {

        return (
            <Container
                title={this.state.title}
                noFooter={true}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                force_hide_inpage_title={true}
            >
                <div>
                    <h1 className='category-title'>{this.state.title}</h1>
                    <p>NIFTY is a benchmark index by the National Stock Exchange (NSE). It has a host of indices – NIFTY 50, Nifty Midcap 150, Nifty Smallcap 250 & more. Nifty50 comprises India's 50 largest companies traded on NSE such as Reliance Industries Ltd., HDFC Bank Ltd., Infosys Ltd., etc. Nifty50 has delivered a CAGR of 11.92% in the last 5 years as of 31 Dec 2020</p>
                </div>
            </Container>
        );
    }
}

export default Landing;
