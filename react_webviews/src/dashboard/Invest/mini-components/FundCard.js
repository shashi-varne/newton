import React from 'react';
import { formatAmountInr } from 'utils/validators';
import RatingStar from '../../../fund_details/common/RatingStar';
import { navigate as navigateFunc } from 'utils/functions';
import './mini-components.scss';

const STOCKS_FUND_LIST = [
  "equity",
  "arbitrage",
  "index",
  "midcap",
  "shariah",
  "sectoral",
  "elss",
];
const BOND_FUND_LIST = [
  "reliance_simply_save",
  "fixed_income_lt",
  "fixed_income_st",
];
const HYBRID_FUND_LIST = ["balanced", "equity_saver", "monthlyincomeplan"];
const FundCard = ({ 
  classOverRide, 
  fund,
  graph, 
  isins, 
  setInvestmentData, 
  parentProps
}) => {
  const {
    amount,
    mf: { mfname, rating, isin, amc_logo_small,mftype_name, mftype },
  } = fund;
  const navigate = navigateFunc.bind(parentProps);
  const handleGraph = () => {
    if(!graph) {
      return;
    }
    setInvestmentData({}, "", true)
    navigate(
      `/fund-details`,
      {
        searchParams: `${parentProps.location.search}&isins=${isins}&selected_isin=${isin}&type=mf`,
        state:{flow:"mf journey"}
      }
    )
    return;
  };
  return (
    <div className={`recommendations-funds-item ${classOverRide}`} onClick={handleGraph}>
      <div className='recommendations-funds-item-icon'>
        <img alt={amc_logo_small} src={amc_logo_small} />
      </div>
      <div className='recommendations-funds-item-info'>
        <div className='recommendations-funds-item-name'>{mfname}</div>
        <div className='recommendations-funds-item-status'>
        <span
            className={
              STOCKS_FUND_LIST.includes(mftype)
                ? "recommendations-funds-stock"
                : BOND_FUND_LIST.includes(mftype)
                ? "recommendations-funds-bond"
                : HYBRID_FUND_LIST.includes(mftype)
                ? "recommendations-funds-hybrid"
                : ""
            }
          >
            {mftype_name}
          </span>
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
