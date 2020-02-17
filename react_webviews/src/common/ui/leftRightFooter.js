import React, { Component } from 'react';
import next_arrow from  'assets/next_arrow.png';
import './style.css';

class LeftRightFooterClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightButtonData: this.props.parent.state.rightButtonData || {}
        }
    }

    render() {
        return (
            <div className="bottom-short-footer">
                <div className="left-arrow" onClick={() => this.props.parent.leftClick()}>
                <img src={next_arrow} alt="" />
                </div>
                <div className="right-arrow" onClick={() => this.props.parent.rightClick()}>
                    {!this.state.rightButtonData.title &&  <img src={next_arrow} alt="" />}

                    {this.state.rightButtonData.title &&  
                        <span style={{color: 'white', fontSize:12, fontWeight:700}}>
                            {this.state.rightButtonData.title}
                        </span>
                    }
                </div>
            </div>
        );
    }
}

const LeftRightFooter = (props) => (
    <LeftRightFooterClass
    {...props} />
);

export default LeftRightFooter;