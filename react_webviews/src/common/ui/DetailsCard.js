import React, { Component } from 'react'

class DetailsCard extends Component {
    render() {
        var {item} = this.props;
        return (
            <div className="details-card-container" onClick={() => this.props.handleClick(item)} style={{backgroundColor: item.backgroundColor}}>
                
                <div className="status-bar">
                    {item.topTextLeft && <div className="status-container">
                        <p className="status-circle" style={{backgroundColor: item.color}}></p>
                        <p className="status-text" style={{color: item.color}}>{item.topTextLeft}</p>
                    </div>
                    }
                    {
                        item.topTextRight && <p className="status-bar-right" style={{color: item.topTextRightColor}}>{item.topTextRight}</p>
                    }
                </div>

                <div className="heading-container">
                    <div className="heading-left">
                        {
                            item.headingTitle && <p className="heading-title">{item.headingTitle}</p>
                        }
                        {
                            item.headingSubtitle && <p className="heading-subtitle">{item.headingSubtitle}</p>
                        }
                        
                    </div>
                    {
                        item.headingLogo && <img alt="product-icon" src={`${item.headingLogo}`}/>
                    }
                </div>

                <div className="card-bottom-info">
                    {
                        item.bottomValues.map( (val, index) =>(
                            <div className="individual-card-info" key={index}>
                                <p className="info-title">{val.title}</p>
                                <p className="info-subtitle">{val.subtitle}{val.postfix && <span>{val.postfix}</span>}  </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default DetailsCard;
