import React, { Component } from 'react';
import next_arrow from  'assets/arrow_next.svg';
import back_arrow from  'assets/arrow_back.svg';
import './style.scss';
import SVG from 'react-inlinesvg';
import { getConfig } from '../../utils/functions';
// import {getConfig} from 'utils/functions';

class LeftRightFooterClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightButtonData: this.props.parent.state.rightButtonData || {},
            leftButtonData: this.props.parent.state.leftButtonData || {}
        }
    }

    render() {
        return (
            <div className="bottom-short-footer" style={{justifyContent: this.state.leftButtonData.hide ? 'flex-end' : ''}}>
                {!this.state.leftButtonData.hide &&
                    <div className="left-arrow" 
                    style={{backgroundColor: this.state.leftButtonData.title  ? 'white': ''}}
                    onClick={() => this.props.parent.leftClick()}>
                        

                    {!this.state.leftButtonData.title &&  
                        <SVG
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#767E86' )}
                        src={back_arrow}
                        />
                    }           

                    {this.state.leftButtonData.title &&  
                        <span style={{color: getConfig().secondary, fontSize:12, fontWeight:700}}>
                            {this.state.leftButtonData.title}
                        </span>
                    }
                    </div>
                }
                <div className="right-arrow" onClick={() => this.props.parent.rightClick()}>
                    {!this.state.rightButtonData.title &&  
                        <SVG
                            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#fff' )}
                            src={next_arrow}
                        />}

                    {this.state.rightButtonData.title &&  
                        <span style={{backgroundColor: getConfig().secondary, color: 'white', fontSize:12, fontWeight:700}}>
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