import React, { Component } from 'react';
import next_arrow from  'assets/arrow_next.svg';
import back_arrow from  'assets/arrow_back.svg';
import './style.css';
import SVG from 'react-inlinesvg';
// import {getConfig} from 'utils/functions';

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
                    <SVG
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#767E86' )}
                        src={back_arrow}
                    />
                </div>
                <div className="right-arrow" onClick={() => this.props.parent.rightClick()}>
                    {!this.state.rightButtonData.title &&  
                        <SVG
                            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#fff' )}
                            src={next_arrow}
                        />}

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