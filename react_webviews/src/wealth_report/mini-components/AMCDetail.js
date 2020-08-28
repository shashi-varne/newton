import React from 'react';
import { formattedDate } from '../../utils/validators';

export default function AMCDetail(holding) {
  return (
    <div className="wr-hc-amc-detail">
      <img
        className="amc-logo"
        src={holding.amc_logo}
        alt="amc-logo"
      />
      <div className="wr-amc-detail" title={holding.fund_name.toUpperCase()}>
        <div className="amc-detail-title">
          {/* Setting text to lowercase here so that text-transform can convert it properly to capitalised text */}
          {holding.fund_name.toLowerCase()}
        </div>
        <div className="amc-detail-subtitle">
          {holding.scheme_type} · Since {formattedDate(holding.investment_since, 'm y')}
        </div>
        {/* // visbility will be modified based on the condition */}
        {holding.free_from_el_lockin && <div className="wr-EL-label">Free from EL / Lock-in</div>}
      </div>
      {FisdomRating(holding.fisdom_rating)}
    </div>
  );
}

const FisdomRating = (rating = 0) => {
  rating = parseInt(rating, 10);
  if (rating === 0) {
    return (<div
      className="wr-fisdom-rating"
      style={{ background: 'rgba(129, 129, 129, 0.08)' }}>
      <span
        className="rating-num"
        style={{ color: 'rgba(129, 129, 129, 0.5)' }}>
        --
      </span>
    </div>);
  }

  return (
    <div
      className="wr-fisdom-rating"
      style={{
        background: rating < 4 ? 'rgba(208,2,27,0.1)' : 'rgba(86,174,98,0.1)'
      }}>
      <span
        className="rating-num"
        style={{ color: rating < 4 ? '#d0021b' : '#56ae62' }}>
        {rating}
      </span>
      <img
        alt="star"
        src={require(`assets/ic-star-${rating < 4 ? 'red' : 'green'}.svg`)}
        className="rating-star"
      />
    </div>
  );
}