import React from 'react';
import { formatAmountInr } from 'utils/validators';
import RatingStar from '../../../../fund_details/common/RatingStar';
const FundCard = ({ classOverRide, fund,history,graph,isins }) => {
  const {
    amount,
    mf: { mfname, rating, isin, amc_logo_small,mftype_name },
  } = fund;
  const handleGraph = () => {
    if (!graph) return;
    
    return history.push({
      pathname: '/fund-details',
      search: `?isins=${isins}&selected_isin=${isin}`,
      state:{flow:"mf journey"}
    })
    // return <Redirect
    //   to={{
    //     pathname: '/invest-amount',
    //     //search: `?isin=${isin}`,
    //   }}
    // />;
  };
  return (
    <div className={`recommendations-funds-item ${classOverRide}`} onClick={handleGraph}>
      <div className='recommendations-funds-item-icon'>
        <img alt={amc_logo_small} src={amc_logo_small} />
      </div>
      <div className='recommendations-funds-item-info'>
        <div className='recommendations-funds-item-name'>{mfname}</div>
        <div className='recommendations-funds-item-status'>
          <span>{mftype_name}</span>
          <span>{amount && formatAmountInr(amount)}</span>
        </div>
        <div className='recommendations-funds-item-rating'>
          <RatingStar value={rating} />
        </div>
      </div>
    </div>
  );
};

export default FundCard;
