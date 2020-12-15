import React, { Component } from "react";
import Container from "./common/container";
import { initialize } from "./common/functions";
import HowToSteps from "../common/ui/HowToSteps";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            screen_name: "home_screen",
        };
        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();

        let stepContentMapper = {
            title: 'Why choose us?',
            options: [
                {
                    'icon': 'b1',
                    'title': 'Instant approvals',
                    'subtitle': 'Digital KYC and instant approval'
                },
                {
                    'icon': 'b2',
                    'title': 'Minimal documentation',
                    'subtitle': 'Hassle free paperwork with easy application process'
                },
                {
                    'icon': 'b3',
                    'title': 'Built-in security',
                    'subtitle': 'Financial information safe and secure 24/7'
                },
                {
                    'icon': 'b4',
                    'title': 'Best EMI plans',
                    'subtitle': 'Choose your plans as per your comfort'
                },
            ]
        };

        this.setState({
            stepContentMapper: stepContentMapper
        });
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Loans"
                noFooter={true}
            >
                <div className="loan-home">
                    <div className="block1-info"   >
                        <img
                            src={require(`assets/${this.state.productName}/icn_hero.svg`)}
                            alt="info" />
                    </div>

                    <div className='block2-info'>
                        <div className="top-title">What are you looking for ?</div>
                        <div className='content'>
                            <img
                                src={require(`assets/${this.state.productName}/icn_loan_amnt.svg`)}
                                alt='amount icon'
                            />
                            <div className="data">
                                <div className="title generic-page-title">Personal loans</div>
                                <div className="subtitle generic-page-subtitle">Get loans upto ₹40 lac</div>
                            </div>
                        </div>
                    </div>

                    <HowToSteps
                        style={{ marginTop: 20, marginBottom: 0 }}
                        baseData={this.state.stepContentMapper}
                    />

                    <div className="block1-info" onClick={() => this.navigate("calculator")}>
                        <img
                            src={require(`assets/${this.state.productName}/calculatemi.svg`)}
                            alt="calculator" />
                    </div>

                    <div className="block3-info">
                        <div className="top-title">Our partners</div>
                        <div className='partners'>
                            <div>
                                <div className="card">
                                    <img
                                        src={require(`assets/idfc_logo.svg`)}
                                        alt='idfc logo'
                                    />
                                </div>
                            IDFC First Bank
                            </div>
                            <div>
                                <div className="card">
                                    <img
                                        src={require(`assets/dmi-finance.svg`)}
                                        alt='dmi logo'
                                    />
                                </div>
                            DMI finance
                            </div>
                        </div>
                    </div>
                </div>
            </Container >
        );
    }
}

export default Home;
