import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';

class GroupHealthPlanHowToClaim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderData: {
                steps: {
                    options: []
                }
            },
            type: getConfig().productName,
            color: getConfig().primary,
            show_loader: true
        };

    }

    componentWillMount() {

        let { params } = this.props.location || {};
        if(!params || !params.renderData) {
            this.props.history.goBack();
            return;
        }
        this.setState({
            renderData: params ? params.renderData : {
                steps: {
                    options: []
                }
            },
            show_loader: false
        })

        // let renderData = { "header_title": "How to claim", "header_subtitle": "my: health Suraksha Silver smart plan", "steps": [{ "title": "Cashless claims:", "subtitle": "In this type of health insurance claim, the insurer company settles all the hospitalization bills with the hospital directly. However, an insured needs to be hospitalized only at a network hospital and have to show the health card (issued after policy generation)  and valid photo ID" }, { "title": "Reimbusment claims :", "subtitle": "In this type of claim process, the policyholder pays for the hospitalization expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case. In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then makes a payment to the insured." }], "cta_title": "BACK TO PLAN", "page_title": "HDFC ERGO provides cashless as well as reimbursement claim facility", "contact_email": "healthclaims@hdfcergo.com" };
        // this.setState({
        //     renderData: renderData,
        //     show_loader: false
        // })
    }


    async handleClick() {
        this.props.history.goBack();
    }

    renderInfo = (props, index) => {
        return (
            <div key={index} className="ri-tile">
                <div className="ri-tile-left">{props.title}</div>
                <div className="ri-tile-right">{props.subtitle}</div>
            </div>
        )
    }

    render() {
        return (
            <Container
                fullWidthButton={true}
                buttonTitle={this.state.renderData.cta_title}
                onlyButton={true}
                // events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClick()}
                title={this.state.renderData.header_title}
            >

                {this.state.renderData.header_subtitle &&
                    <div className="common-top-page-subtitle-dark">
                        {this.state.renderData.header_subtitle}
                    </div>}

                <div className="group-health-how-to-claim">
                    <div className="page-title">
                        {this.state.renderData.page_title}
                    </div>

                    <div className="render-info">
                        {this.state.renderData.steps.map(this.renderInfo)}
                    </div>

                    <div className="contact-email">
                        <span style={{fontWeight: 600}}>Contact details: </span> <span>{this.state.renderData.contact_email}</span>
                    </div>
                </div>

            </Container>
        );
    }
}

export default GroupHealthPlanHowToClaim;