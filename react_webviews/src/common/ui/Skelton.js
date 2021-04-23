
import React, { Component, Fragment } from 'react';
import { getConfig } from 'utils/functions';

import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import './style.scss';

// import { TextBlock, MediaBlock, TextRow, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';


let highlight_color = getConfig().styles.skeltonColor;



class UiSkeltonClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName
        };
    }


    singleImage = () => {
        return (
            <div className="single-full-image">
                <ReactPlaceholder type='rect'
                    showLoadingAnimation={true}
                    className="single-full-image-skelton"
                    ready={false} color={highlight_color} style={{ width: '100%', height: 150 }}>
                </ReactPlaceholder>
            </div>
        )
    }

    imageAndLines = () => {
        return (
            <div className="image-and-lines">
                <div className="mid-left">
                    <ReactPlaceholder type='rect' color={highlight_color} showLoadingAnimation={true} className="mid-left-skelton" />
                </div>

                <div className="mid-right">
                    <SkeltonRect className="mid-right-skelton1" />
                    <SkeltonRect className="mid-right-skelton2" />
                </div>
            </div>
        )
    }

    twoLines = () => {
        return (
            <div className="two-lines">
                <SkeltonRect className="mid-right-skelton1" />
                <SkeltonRect className="mid-right-skelton2" />
            </div>
        )
    }

    productsSkelton() {
        return (
            <div className="products-listing">

                <div className="top">
                    {this.singleImage()}
                </div>


                <div className="mid">
                    {this.imageAndLines()}
                    {this.imageAndLines()}
                    {this.imageAndLines()}
                    {this.imageAndLines()}
                </div>

            </div>
        )
    }

    genericSkelton() {
        return (
            <div className="products-listing">

                <div className="top">
                    {this.singleImage()}
                </div>


                <div className="mid">
                    {this.twoLines()}
                    {this.twoLines()}
                    {this.twoLines()}
                    {this.twoLines()}
                </div>

            </div>
        )
    }

    render() {

        let type = this.props.type;

        if (type === true) {
            type = 'g';
        }

        return (
            <div className="generic-skelton">

                {type === 'p' && this.productsSkelton()}
                {type === 'g' && this.genericSkelton()}

            </div>
        );
    }
};

const UiSkelton = (props) => (
    <UiSkeltonClass
        {...props} />
);

export const SkeltonRect = (props) => {
    if (!props.hide) {
        return (
            <Fragment>
            <ReactPlaceholder type='rect' color={highlight_color}
                showLoadingAnimation={true} className={props.className} 
                style={props.style}
                />
            </Fragment>
        );
    }

    return null;

};

export default UiSkelton;
