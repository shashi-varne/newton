import React from 'react'

function VideoBlockImageSection() {
    return (
        <div className="info-container" data-aid="info-container" style={{ color: "#94C5FF" }}>
            <div className="info-block" data-aid="info-block-1">
                <div>
                    <img src={require("../../../assets/passive_info1.svg")} alt="" />
                </div>
                <p style={{ color: "#94C5FF" }}>Lower cost</p>
            </div>
            <p>|</p>
            <div className="info-block" data-aid="info-block-2">
                <div>
                    <img src={require("../../../assets/passive_info2.svg")} alt="" />
                </div>
                <p style={{ color: "#94C5FF" }}>Broad diversification</p>
            </div>
            <p>|</p>
            <div className="info-block" data-aid="info-block-3">
                <div>
                    <img src={require("../../../assets/passive_info3.svg")} alt="" />
                </div>
                <p style={{ color: "#94C5FF" }}>Mirror the market</p>
            </div>
        </div>
    )
}

export default VideoBlockImageSection;