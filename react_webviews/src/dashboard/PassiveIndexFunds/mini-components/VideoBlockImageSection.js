import React from 'react';
import "./commonStyles.scss";

function VideoBlockImageSection(props) {
    return (
        <div className="info-container" data-aid="info-container">
            <div className="info-block" data-aid="info-block-1">
                <div>
                    <img src={require(`../../../assets/${props.productName}/passive_info1.svg`)} alt="" />
                </div>
                <p>Lower cost</p>
            </div>
            <p>|</p>
            <div className="info-block" data-aid="info-block-2">
                <div>
                    <img src={require(`../../../assets/${props.productName}/passive_info2.svg`)} alt="" />
                </div>
                <p>Broad diversification</p>
            </div>
            <p>|</p>
            <div className="info-block" data-aid="info-block-3">
                <div>
                    <img src={require(`../../../assets/${props.productName}/passive_info3.svg`)} alt="" />
                </div>
                <p>Mirror the index</p>
            </div>
        </div>
    )
}

export default VideoBlockImageSection;