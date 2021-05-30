import React from 'react'
import PassiveStarRating from "../mini-components/PassiveStarRating"

let time;
function FundListCard(props) {

    const data = props.data
    selected_year(props?.selected)

    return (
        <div className="card funds-card" onClick={() => props.handleClick()}>
            <div className="funds-card-details">
                <div className="content">
                    <div className="title">{data.legal_name}</div>
                    <div className='subtitle' >{data.fund_house}
                        <img src={require(`assets/split.svg`)} alt='' className='split-img' />
                        <PassiveStarRating value={data.morning_star_rating} />
                    </div>
                </div>
                <img src={data.amc_logo_big} className="amc-logo-small" alt='' style={{ width: "50px", height: "50px" }} />
            </div>
            <div className="funds-card-details">
                <p className="tc-title">EXPENSE RATIO</p>
                <p className="tc-title">Returns</p>
            </div>
            <div className="funds-card-details">
                <p className="tc-title">{data.expense_ratio}%</p>
                <p className="tc-title return">{data[time]}%</p>
            </div>
            <div className="funds-card-details">
                <p className="tc-title">TRACKING ERROR%</p>
            </div>
            <div className="funds-card-details">
                <p className="tc-title">{data.expense_ratio}%</p>
            </div>
        </div>
    )
};

export default FundListCard;

let selected_year = (selected) => {
    switch (selected) {
        case "1M":
            time = 'one_month_return'
            break;
        case "3M":
            time = 'three_month_return'
            break;
        case "6M":
            time = 'six_month_return'
            break;
        case "1Y":
            time = 'one_year_return'
            break;
        case "3Y":
            time = 'three_year_return'
            break;
        case "5Y":
            time = 'five_year_return'
            break;
        default:
            time = 'five_year_return'
    }
}