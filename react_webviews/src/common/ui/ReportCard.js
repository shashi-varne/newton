import React, { Component } from 'react'

class ReportCard extends Component {
    render() {
        return (
            <div className="report-card-container">
                
                <div className="status-bar">
                    <div className="status-container">
                        <p className="status-circle"></p>
                        <p className="status-text">ISSUED</p>
                    </div>
                    <p className="product-category">HEALTH INSURANCE</p>
                </div>

                <div className="heading-container">
                    <div>
                        <p className="heading-title">Sanchay Plus</p>
                        <p className="heading-subtitle">HDFC Life Insurance</p>
                    </div>
                    <img alt="product-icon" src={require(`assets/hdfc_ergo_ic_logo_card.svg`)}/>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">Cover amount</p>
                        <p className="info-subtitle">₹12,584</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">Premium amount</p>
                        <p className="info-subtitle">₹ 70<span>/yr</span></p>
                    </div>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">Policy issued to</p>
                        <p className="info-subtitle">Uttam Paswan</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">Valid upto</p>
                        <p className="info-subtitle">26/07/2021</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default ReportCard;
