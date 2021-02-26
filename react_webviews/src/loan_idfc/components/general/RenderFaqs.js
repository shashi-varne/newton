import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import Faqs from '../../../common/ui/Faqs';
import { nativeCallback } from "utils/native_callback";
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
        let renderData = this.props.location.state.renderData;
        this.setState({
            renderData: renderData,
            show_loader: false,
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

    handleClick() {
        this.sendEvents('next');
        this.props.history.goBack();
    }

    sendEvents(user_action) {
        let eventObj = {
          event_category: "Lending IDFC",
          event_name: "idfc_faq",
          properties: {
            user_action: user_action,
            event_name: "idfc_faq",
          },
        };
    
        if (user_action === "just_set_events") {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
      }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                buttonTitle="OKAY"
                onlyButton={true}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClick()}
                title={this.state.renderData.header_title}
            >
                <div className="idfc-faqs">
                    {this.state.renderData.steps.options.map((option, index) => {
                        let isSelected = this.state.selectedIndex === index;
                        return <div key={index}
                            className={option.is_table && 'render-faqs-table-content'}
                            onClick={() => option.is_table && this.showHideSteps(index)}
                        >
                            <div className="render-faqs-title" >
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
                </div>
            </Container>
        );
    }
}

export default CommonRenderFaqs;