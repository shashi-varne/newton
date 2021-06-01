import React from 'react'

function VideoBlock() {
    return (
        <div className="info-container">
            <div className="info-block">
                <div>
                    <img src={require("../../../assets/passive_info1.svg")} alt="" />
                </div>
                <p>Lower cost</p>
            </div>
            <p>|</p>
            <div className="info-block">
                <div>
                    <img src={require("../../../assets/passive_info2.svg")} alt="" />
                </div>
                <p>Broad diversification</p>
            </div>
            <p>|</p>
            <div className="info-block">
                <div>
                    <img src={require("../../../assets/passive_info3.svg")} alt="" />
                </div>
                <p>Mirror the market</p>
            </div>
        </div>
    )
}

export default VideoBlock;