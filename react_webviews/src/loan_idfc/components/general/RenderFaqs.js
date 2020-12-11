import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import Faqs from '../../../common/ui/Faqs';
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
            color: getConfig().primary,
            show_loader: true,
            selectedIndex: '',
        };
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        let { params } = this.props.location || {};
        if (!params || !params.renderData) {
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

    showHideSteps = (index) => {
        if (this.state.selectedIndex === index) {
            this.setState({
                selectedIndex: -1
            })
        } else {
            this.setState({
                selectedIndex: index
            })
        }
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
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClick()}
                title={this.state.renderData.header_title}
            >
                {this.state.renderData.steps.options.map((option, index) => {
                    let isSelected = this.state.selectedIndex === index;
                    return <div key={index}
                        className={option.is_table && 'render-faqs-table-content'}
                    >
                        <div className="render-faqs-title"
                            onClick={() => option.is_table && this.showHideSteps(index)}
                        >
                            {option.header_title}
                            {option.is_table && <div className="top-icon">
                                <img src={require(`assets/${isSelected ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                            </div>}
                        </div>
                        {isSelected && option.is_table && <table className="render-faqs-table">
                            <tbody>
                                {option.options.map((option, index) => {
                                    return <tr key={index}>
                                        <td className="render-faqs-table-title" >{option.title}</td>
                                        <td className="render-faqs-table-subtitle">{option.subtitle}</td>
                                    </tr>
                                }
                                )}
                            </tbody>
                        </table>}
                        {!option.is_table && <div className="generic-render-faqs" >
                            <Faqs options={option.options} />
                        </div>}
                    </div>
                })}
            </Container>
        );
    }
}

export default CommonRenderFaqs;