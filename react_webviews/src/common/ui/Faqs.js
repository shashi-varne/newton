import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';
import ReactHtmlParser from 'react-html-parser'; 

class FaqsClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
            productName: getConfig().type,
            selectedIndex: ''
        };
    }


    showHideSteps  = (index) => {

        if(this.state.selectedIndex === index) {
            this.setState({
                selectedIndex: -1
            })
        } else {
            this.setState({
                selectedIndex: index
            })
        }
       
    }

    renderList = (option, index) => {
        let isSelected = this.state.selectedIndex === index;
        return (
            <div key={index} className="common-faqs-tile"
               style={{borderTop: index === 0 ? '1px solid #d7d4d4' : ''}}
                onClick={() => this.showHideSteps(index)}>
                <div className="top-tile">
                    <div className="top-title">
                        {option.title}
                    </div>
                    <div className="top-icon">
                        <img src={require(`assets/${isSelected ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                    </div>
                </div>

                {isSelected &&
                    <div className='subtitle'>
                        {ReactHtmlParser(option.subtitle)}
                    </div>
                }
            </div>
        );
    }

    render() {

        return (

                <div className='common-faqs'>
                    {this.state.options.map(this.renderList)}
                </div>

        );

    }
}

const Faqs = (props) => (
    <FaqsClass
        {...props} />
);

export default Faqs;
