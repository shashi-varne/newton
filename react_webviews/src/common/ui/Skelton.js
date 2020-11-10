
import React, { Component } from 'react';
import { getConfig } from 'utils/functions';

import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import './style.scss';

// import { TextBlock, MediaBlock, TextRow, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';


let highlight_color = '#D0E6ff';



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
                    <ReactPlaceholder type='rect' color={highlight_color} showLoadingAnimation={true} className="mid-right-skelton1" />
                    <ReactPlaceholder type='rect' color={highlight_color} showLoadingAnimation={true} className="mid-right-skelton2" />
                </div>
            </div>
        )
    }

    twoLines = () => {
        return (
            <div className="two-lines">
                    <ReactPlaceholder type='rect' color={highlight_color} showLoadingAnimation={true} className="mid-right-skelton1" />
                    <ReactPlaceholder type='rect' color={highlight_color} showLoadingAnimation={true} className="mid-right-skelton2" />
            </div>
        )
    }

    render() {

        return (
            <div className="generic-skelton">

                <div className="products-listing">

                    <div className="top">
                        {this.singleImage()}
                    </div>


                    <div className="mid">
                        {this.imageAndLines()}
                        {this.imageAndLines()}
                        {this.twoLines()}
                    </div>

                </div>

            </div>
        );
    }
};

const UiSkelton = (props) => (
    <UiSkeltonClass
        {...props} />
);

export default UiSkelton;
