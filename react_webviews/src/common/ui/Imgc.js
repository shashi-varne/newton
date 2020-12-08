import React, { Component, Fragment } from 'react';

import "react-placeholder/lib/reactPlaceholder.css";
import './style.scss';
import { SkeltonRect } from './Skelton';
// import SVG from 'react-inlinesvg';


class ImgcClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchFailed: false,
            loaded: false
        };
    }

    onLoad = () => {

    }

    onError = () => {

    }

    render() {

        let props = this.props;
        let skeltonFlag = this.state.fetchFailed || !this.state.loaded;
        console.log(skeltonFlag)
        return (

            // <SVG
            // src={props.src}
            // className={props.className}
            // alt={props.alt}
            // style={props.style}
            // loader={<SkeltonRect style={props.style} className={props.className} />}
            // />
            // <SkeltonRect style={props.style} className={props.className} />

            <Fragment>
                <img src={props.src} className={props.className}
                    onLoad={() => {
                        console.log("loaded")
                        this.setState({
                            loaded: true
                        })
                    }}
                    onError={() => {
                        console.log("error")
                        this.setState({
                            fetchFailed: true
                        })
                    }}
                    style={{ ...props.style, display: skeltonFlag ? 'none' : '',
                    flexShrink: 0 }} className={props.className}
                />



                <SkeltonRect
                    hide={!skeltonFlag}
                    style={{...props.style,flexShrink: 0}} className={props.className} />
            </Fragment>
        );

    }
}

export const Imgc = (props) => (
    <ImgcClass
        {...props} />
);
