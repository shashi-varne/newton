import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';

class GroupHealthPlanHowToClaim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderData: {
                steps:[]
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
                steps: []
            },
            show_loader: false
        })

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