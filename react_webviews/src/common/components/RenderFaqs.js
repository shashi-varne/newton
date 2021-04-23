import React, { Component } from 'react';
import Container from '../../gold/common/Container';

import { getConfig } from 'utils/functions';
import Faqs from '../ui/Faqs';

class CommonRenderFaqs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderData: {
                steps: {
                    options: []
                }
            },
            type: getConfig().productName,
            color: getConfig().styles.primaryColor,
            show_loader: true
        };

    }

    componentWillMount() {

        window.scrollTo(0, 0);
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
    }


    async handleClick() {
        this.props.history.goBack();
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
                <div className="generic-render-faqs">
                    <Faqs options={this.state.renderData.steps.options} />
                </div>
            </Container>
        );
    }
}

export default CommonRenderFaqs;