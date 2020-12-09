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
            loaded: this.isCached(props.src)
        };
    }



    isCached = (src) => {
        var img = new Image();
        img.src = src;
        var complete = img.complete;
        // img.src = "";
        return complete;
    }

    render() {

        let props = this.props;
        let skeltonFlag = this.state.fetchFailed || !this.state.loaded;

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

                <img id="image" src={props.src} className={props.className}
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
                    alt={props.alt}
                    style={{
                        ...props.style,
                        flexShrink: 0,
                        display: skeltonFlag ? 'none' : ''
                    }}
                    className={`${props.className}  ${skeltonFlag ? '' : ''}`}
                />


                <SkeltonRect
                    hide={!skeltonFlag}
                    style={{ ...props.style, flexShrink: 0 }} className={props.className} />
            </Fragment>
        );

    }
}

export const Imgc = (props) => (
    <ImgcClass
        {...props} />
);
