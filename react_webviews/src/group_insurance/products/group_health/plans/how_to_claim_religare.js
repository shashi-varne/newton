import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';

class GroupHealthPlanHowToClaimReligare extends Component {

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
        console.log('hi',params)

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

    handleData=()=>{
        let renderData={
            'contact_email':' customerfirst@religarehealthinsurance.com',
            'contanct_no':'1800-102-4488 (toll free number)',
        }
        this.setState({
            renderData:renderData
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
                <div className="ri-tile-right">{props.contact_no}</div>
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
                <div className="group-health-how-to-claim">
                    <div className="page-title">
                        {this.state.renderData.page_title}
                    </div>

                    <div className="render-info">
                        {this.state.renderData.steps.map(this.renderInfo)}
                    </div>
                </div> 

            </Container>
        );
    }
}

export default GroupHealthPlanHowToClaimReligare;