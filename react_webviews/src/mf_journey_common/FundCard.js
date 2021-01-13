import React from 'react';
import { formatAmountInr } from '../utils/validators';
import RatingStar from '../fund_details/common/RatingStar';
import { Redirect } from 'react-router-dom';
const FundCard = ({ classOverRide, fund,history }) => {
  const {
    amount,
    mf: { mfname, rating, isin, amc_logo_small,mftype_name },
  } = fund;
  const handleGraph = () => {
      console.log("hello")
      return history.push({
        pathname: '/fund-details',
        search: `?isins=${isin}`,
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
        <img style={{ width: '80px', height: '80px' }} alt='' src={amc_logo_small} />
      </div>
      <div className='recommendations-funds-item-info'>
        <div className='recommendations-funds-item-name'>{mfname}</div>
        <div className='recommendations-funds-item-status'>
          <p>{mftype_name}</p>
          <p>{amount && formatAmountInr(amount)}</p>
        </div>
        <div className='recommendations-funds-item-rating'>
          <RatingStar value={rating} />
        </div>
      </div>
    </div>
  );
};

export default FundCard;
