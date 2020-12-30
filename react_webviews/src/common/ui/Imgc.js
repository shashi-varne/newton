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
            loaded: this.isCached(props.src) || this.props.hideSkelton
        };
    }



    isCached = (src) => {
        var img = new Image();
        img.src = src;
        var complete = img.complete;
        // img.src = "";
        return complete;
    }

    renderImage = (props, skeltonFlag) => {
        return (

            // <SVG
            // src={props.src}
            // className={props.className}
            // alt={props.alt}
            // style={props.style}
            // loader={<SkeltonRect style={props.style} className={props.className} />}
            // />


            // <SkeltonRect style={props.style} className={props.className} />
            <img id="image" src={props.src}
                onLoad={() => {
                    this.setState({
                        loaded: true
                    })

                    if (this.props.callbackImgc) {
                        this.props.callbackImgc(this.props.type);
                    }


                }}
                onError={() => {
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
                className={`${props.className}`}
            />

        )

    }

    renderFallbackIcon = (props) => {
        return (
            <div className={`${props.className} generic-fallback-img`} style={props.style}>
                <img
                    src={require(`assets/fallback_icon.svg`)} alt="Icon"
                />
            </div>
        )
    }

    render() {

        let props = this.props;
        let skeltonFlag = !this.state.loaded;

        let {fetchFailed} = this.state;

        return (

            <Fragment>

                {this.renderImage(props, skeltonFlag)}
                {fetchFailed && this.renderFallbackIcon(props)}

                <SkeltonRect
                    hide={!skeltonFlag || fetchFailed}
                    style={{ ...props.style, flexShrink: 0 }} className={props.className} />
            </Fragment>
        );

    }
}

export const Imgc = (props) => (
    <ImgcClass
        {...props} />
);
