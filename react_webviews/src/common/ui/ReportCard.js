import React, { Component } from 'react'
import {numDifferentiationInr, timeStampToDate} from 'utils/validators';

class ReportCard extends Component {
    render() {
        var {report} = this.props;
        console.log(report.key)
        return (
            <div className="report-card-container" style={{backgroundColor: report.cssMapper.backgroundColor}}>
                
                <div className="status-bar">
                    <div className="status-container">
                        <p className="status-circle" style={{backgroundColor: report.cssMapper.color}}></p>
                        <p className="status-text" style={{color: report.cssMapper.color}}>{report.cssMapper.disc}</p>
                    </div>
                    <p className="product-category">{report.product_category}</p>
                </div>

                <div className="heading-container">
                    <div>
                        <p className="heading-title">{report.product_title}</p>
                        <p className="heading-subtitle">{report.product_name}</p>
                    </div>
                    <img alt="product-icon" src={`${report.logo}`}/>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">Cover amount</p>
                        <p className="info-subtitle">{numDifferentiationInr(report.sum_assured)}</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">Premium amount</p>
                        <p className="info-subtitle">{numDifferentiationInr(report.premium)}<span>/yr</span></p>
                    </div>
                </div>

                <div className="card-info-one">
                    <div className="info-left">
                        <p className="info-title">Policy issued to</p>
                        <p className="info-subtitle">Uttam Paswan</p>
                    </div>
                    <div className="info-right">
                        <p className="info-title">Valid upto</p>
                        <p className="info-subtitle">{ report.valid_upto ? timeStampToDate(report.valid_upto) : 'Not available' }</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default ReportCard;
