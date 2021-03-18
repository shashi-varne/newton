import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';

class GroupHealthPlanHowToClaimStar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderData: {
                steps: []
            },
            type: getConfig().productName,
            color: getConfig().primary,
            show_loader: true
        };

    }

    componentWillMount() {
        this.handleData();
        this.setState({
            show_loader: false
        })
    }

    handleData = () => {
        let renderData = {
            'header_title': 'How to claim?',
            'header_subtitle': 'Star Family Health Optima',
            'cta_title': 'OKAY'
        }

        renderData.steps = [
            {
                'subtitle_details': 'Star Health provides cashless as well as reimbursement claim facility. In case of an emergency hospitalisation, call and inform Star claims desk within 24 hours of your admission. However, if your hospitalisation is planned, kindly intimate 48 hours prior to your admission.'
            },
            {
                'title': 'Contact details',
                'subtitle': <div className="contact_mail">support@starhealth.in</div>,
                'contact_no': <div className="contact_mail"><span id="contact-no">1800 425 2255 / 1800 102 4477</span></div>
            },
            {
                'title': 'Cashless claims:',
                'subtitle': 'In this type of health insurance claim, the insurance company settles all the hospitalisation bills with the hospital directly. However, an insured needs to be hospitalised only at a network hospital (find your nearest network hospital here) and have to show the health card (issued after policy generation) and valid photo ID.',
                'subtitle_one': <div id="cashless-claim">All you are required to do is adhere to a  <b>3-step process and avail cashless treatment</b></div>
            },
            {
                'title': 'Step 1',
                'subtitle': <div><b>Claim Intimation – </b> Inform Star claims desk both in case of emergency and planned hospitalisation </div>
            },
            {
                'title': 'Step 2',
                'subtitle': <div> <b>Initiating pre-authorisation approval –</b> Approach hospital’s claims desk </div>
            },
            {
                'title': 'Step 3',
                'subtitle': <div><b>Processing of Pre-Authorisation request –</b> Hospital will send the cashless request to Star and will coordinate with their claims team to get this processed</div>
            },
            {
                'title': 'Reimbusment claims :',
                'subtitle': 'In this type of claim process, the policyholder pays for the hospitalisation expenses upfront and requests for reimbursement by the insurance provider later. One can get reimbursement facility at both network and non-network hospitals in this case.',
                'subtitle_one': <div id="remb-claim">In order to avail reimbursement claim you have to provide the necessary documents including original bills to the insurance provider. The company will then evaluate the claim to see its scope under the policy cover and then make payment to the insured.</div>
            },
            {
                'title': 'Step 1',
                'subtitle': <div><b>Claim Intimation –</b> Inform Star claims desk within stipulated time</div>
            },
            {
                'title': 'Step 2',
                'subtitle': <div><b>Avail the treatment –</b>Get the insured admitted and pay directly to the hospital</div>
            },
            {
                'title': 'Step 3',
                'subtitle': <div><b>Submit the claim –</b> Send the claim documents to Star for processing</div>
            },
        ]

        this.setState({
            renderData: renderData
        })
    }


    async handleClick() {
        this.props.history.goBack();
    }

    renderInfo = (props, index) => {
        return (
            <div key={index} className="ri-tile">
                <div className="ri-tile-left">{props.title}</div>
                <div className="ri-tile-right_details">{props.subtitle_details}</div>
                <div className="ri-tile-right">{props.subtitle}</div>
                <div className="ri-tile-right-contact-no">{props.contact_no}</div>
                <div className="ri-tile-right">{props.subtitle_one}</div>
            </div>
        )
    }

    render() {
        return (
            <Container
                fullWidthButton={true}
                buttonTitle={this.state.renderData.cta_title}
                onlyButton={true}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClick()}
                title={this.state.renderData.header_title}
            >

                    <div className="common-top-page-subtitle-dark">
                        {this.state.renderData.header_subtitle}
                    </div>

                <div className="group-health-how-to-claim-religare">
                    <div className="render-info">
                        {this.state.renderData.steps.map(this.renderInfo)}
                    </div>
                </div>

            </Container>
        );
    }
}

export default GroupHealthPlanHowToClaimStar;