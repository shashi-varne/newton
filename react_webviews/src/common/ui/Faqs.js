import React, { Component } from 'react';
import './style.scss';
import { getConfig } from 'utils/functions';
import ReactHtmlParser from 'react-html-parser'; 

class FaqsClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
            productName: getConfig().productName,
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

    renderPoints = (option, index) => {
        return (
            <div key={index} style={{display:'flex'}} data-aid={'render-points'+index+1} >
              <div className='subtitle' style={{margin: '10px 0 0px 0',marginRight:5}}>
                        {index + 1}.
               </div>
               <div className='subtitle' style={{margin: '10px 0 0px 0'}}>
                        {ReactHtmlParser(option)}
               </div>
            </div>
        );
    }

    renderList = (option, index) => {
        let isSelected = this.state.selectedIndex === index;
        return (
            <div key={index} className="common-faqs-tile" data-aid={`common-faqs-tile-${index}`}
               style={{borderTop: index === 0 ? '1px solid #d7d4d4' : ''}}
                onClick={() => this.showHideSteps(index)}>
                <div className="top-tile" data-aid='faq-top-tile'>
                    <div className="top-title-text">
                        {option.title}
                    </div>
                    <div className="top-icon">
                        <img src={require(`assets/${isSelected ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                    </div>
                </div>

                {isSelected && !option.points &&
                    <div className='subtitle' data-aid='faq-subtitle'>
                        {ReactHtmlParser(option.subtitle)}
                    </div>
                }
                {isSelected && option.points &&
                    <div style={{marginBottom: option.points.length >= 8 ? '30px' : ''}}>
                        {option.points.map(this.renderPoints)}
                    </div>
                }
            </div>
        );
    }

    render() {

        return (

                <div className='common-faqs' data-aid='common-faqs'>
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
