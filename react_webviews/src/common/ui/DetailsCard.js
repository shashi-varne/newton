import React, { Component } from 'react'

class DetailsCard extends Component {
    render() {
        var {item} = this.props;
        return (
            <div className="details-card-container" onClick={() => this.props.handleClick(item)} style={{backgroundColor: item.backgroundColor}}>
                
                <div className="status-bar">
                    <div className="status-container">
                        <p className="status-circle" style={{backgroundColor: item.color}}></p>
                        <p className="status-text" style={{color: item.color}}>{item.topTextLeft}</p>
                    </div>
                    <p className="status-bar-right" style={{color: item.topTextRightColor}}>{item.topTextRight}</p>
                </div>

                <div className="heading-container">
                    <div className="heading-left">
                        <p className="heading-title">{item.headingTitle}</p>
                        <p className="heading-subtitle">{item.headingSubtitle}</p>
                    </div>
                    <img alt="product-icon" src={`${item.headingLogo}`}/>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">{item.line1TitleLeft}</p>
                        <p className="info-subtitle">{item.line1SubtitleLeft}</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">{item.line1TitleRight}</p>
                        <p className="info-subtitle">{item.line1SubtitleRight}</p>
                    </div>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">{item.line2TitleLeft}</p>
                        <p className="info-subtitle capitalize">{item.line2SubtitleLeft}</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">{item.line2TitleRight}</p>
                        <p className="info-subtitle">{item.line2SubtitleRight}</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default DetailsCard;
