// ---------------- Assets ----------------------
import IcSecFinanceIcon from '../assets/fisdom/ic_sec_finance.svg';
import IcSecAutoMobileIcon from '../assets/fisdom/ic_sec_automobile.svg';
// import IcSecChemicalsIcon from '../assets/fisdom/ic_sec_chemicals.svg';
import IcSecCommunicationIcon from '../assets/fisdom/ic_sec_communication.svg';
import IcSecConsDurableIcon from '../assets/fisdom/ic_sec_cons_durable.svg';
import IcSecConstructionIcon from '../assets/fisdom/ic_sec_construction.svg';
import IcSecEnergyIcon from '../assets/fisdom/ic_sec_energy.svg';
import IcSecFMCGIcon from '../assets/fisdom/ic_sec_fmcg.svg';
import IcSecHealthCare from '../assets/fisdom/ic_sec_healthcare.svg';
import IcSecServicesIcon from '../assets/fisdom/ic_sec_services.svg';
import IcSecTechnologyIcon from '../assets/fisdom/ic_sec_technology.svg';
// ----------------------------------------------
import React from 'react';
import { formatAmountInr } from "utils/validators";

export const genericErrMsg = 'Something went wrong!';

// import helper functions
export const topStocksIconMappings = {
  'Financial Services': IcSecFinanceIcon,
  Energy: IcSecEnergyIcon,
  Technology: IcSecTechnologyIcon,
  'Consumer Defensive': IcSecConsDurableIcon,
  'Real Estate': IcSecConstructionIcon,
  Utilities: IcSecServicesIcon,
  'Consumer Cyclical': IcSecAutoMobileIcon,
  Healthcare: IcSecHealthCare,
  'Communication Services': IcSecCommunicationIcon,
  'Basic Materials': IcSecFMCGIcon,
  Others: IcSecFMCGIcon,
};

export const dummyGrowth = {
  data: {
    "date_ticks": [
      "12-11-2020",
      "12-07-2020",
      "12-03-2020",
      "11-29-2020",
      "11-25-2020",
      "11-21-2020",
      "11-17-2020"
    ],
    "invested": [
      {
        "close": 500,
        "date": "12-11-2020"
      },
      {
        "close": 500,
        "date": "12-10-2020"
      },
      {
        "close": 500,
        "date": "12-09-2020"
      },
      {
        "close": 500,
        "date": "12-08-2020"
      },
      {
        "close": 500,
        "date": "12-07-2020"
      },
      {
        "close": 500,
        "date": "12-06-2020"
      },
      {
        "close": 500,
        "date": "12-05-2020"
      },
      {
        "close": 500,
        "date": "12-04-2020"
      },
      {
        "close": 500,
        "date": "12-03-2020"
      },
      {
        "close": 500,
        "date": "12-02-2020"
      },
      {
        "close": 500,
        "date": "12-01-2020"
      },
      {
        "close": 500,
        "date": "11-30-2020"
      },
      {
        "close": 500,
        "date": "11-29-2020"
      },
      {
        "close": 500,
        "date": "11-28-2020"
      },
      {
        "close": 500,
        "date": "11-27-2020"
      },
      {
        "close": 500,
        "date": "11-26-2020"
      },
      {
        "close": 500,
        "date": "11-25-2020"
      },
      {
        "close": 500,
        "date": "11-24-2020"
      },
      {
        "close": 500,
        "date": "11-23-2020"
      },
      {
        "close": 500,
        "date": "11-22-2020"
      },
      {
        "close": 500,
        "date": "11-21-2020"
      },
      {
        "close": 500,
        "date": "11-20-2020"
      },
      {
        "close": 500,
        "date": "11-19-2020"
      },
      {
        "close": 500,
        "date": "11-18-2020"
      },
      {
        "close": 500,
        "date": "11-17-2020"
      },
      {
        "close": 500,
        "date": "11-16-2020"
      },
      {
        "close": 500,
        "date": "11-12-2020"
      }
    ],
    "current": [
      {
        "close": 3400,
        "date": "12-11-2020"
      },
      {
        "close": 3400,
        "date": "12-10-2020"
      },
      {
        "close": 3400,
        "date": "12-09-2020"
      },
      {
        "close": 3300,
        "date": "12-08-2020"
      },
      {
        "close": 3200,
        "date": "12-07-2020"
      },
      {
        "close": 3100,
        "date": "12-06-2020"
      },
      {
        "close": 3000,
        "date": "12-05-2020"
      },
      {
        "close": 2900,
        "date": "12-04-2020"
      },
      {
        "close": 2800,
        "date": "12-03-2020"
      },
      {
        "close": 2700,
        "date": "12-02-2020"
      },
      {
        "close": 2600,
        "date": "12-01-2020"
      },
      {
        "close": 2500,
        "date": "11-30-2020"
      },
      {
        "close": 2400,
        "date": "11-29-2020"
      },
      {
        "close": 2300,
        "date": "11-28-2020"
      },
      {
        "close": 2200,
        "date": "11-27-2020"
      },
      {
        "close": 2100,
        "date": "11-26-2020"
      },
      {
        "close": 2000,
        "date": "11-25-2020"
      },
      {
        "close": 1900,
        "date": "11-24-2020"
      },
      {
        "close": 1800,
        "date": "11-23-2020"
      },
      {
        "close": 1700,
        "date": "11-22-2020"
      },
      {
        "close": 1600,
        "date": "11-21-2020"
      },
      {
        "close": 1500,
        "date": "11-20-2020"
      },
      {
        "close": 1400,
        "date": "11-19-2020"
      },
      {
        "close": 1300,
        "date": "11-18-2020"
      },
      {
        "close": 1200,
        "date": "11-17-2020"
      },
      {
        "close": 1100,
        "date": "11-16-2020"
      },
      {
        "close": 700,
        "date": "11-12-2020"
      }
    ]
  }
};

export const GraphDateRanges = [{
  label: '1m',
  value: '1 month',
}, {
  label: '3m',
  value: '3 months',
}, {
  label: '6m',
  value: '6 months',
}, {
  label: '1y',
  value: '1 year',
}, {
  label: '3y',
  value: '3 years',
}, {
  label: '5y',
  value: '5 years',
}, {
  label: 'YTD',
  value: 'ytd',
}];

export const HoldingFilterOptions = [
  {
    id: 'scheme_type',
    category: 'Fund Type',
    filters: [
      {
        label: 'Equity',
        value: 'equity',
      },
      {
        label: 'Debt',
        value: 'debt',
      },
      {
        label: 'Hybrid',
        value: 'hybrid',
      },
      {
        label: 'ELSS',
        value: 'elss',
      },
    ],
  },
  {
    id: 'current_value_type',
    category: 'Current Value',
    filters: [
      {
        label: '<1 lacs',
        value: '1',
      },
      {
        label: '1-5 lacs',
        value: '2',
      },
      {
        label: '5-10 lacs',
        value: '3',
      },
      {
        label: '10+lacs',
        value: '4',
      },
    ],
  },
  {
    id: 'fisdom_rating',
    category: 'Fisdom Rating',
    filters: [
      {
        label: '3 & Below',
        value: '1',
      },
      {
        label: '4 & above',
        value: '2',
      },
    ],
  },
];

const transaction_types = {
  Investment: {
    val: ['purchase', 'divreinvest', 'transferin'],
    img: <img src={require('assets/incr_arrow.svg')} alt={'invest'} />,
  },
  Withdrawal: {
    val: ['redemption', 'divpayout', 'transferout'],
    img: <img src={require('assets/decr_arrow.svg')} alt={'invest'} />,
  },
  'Switch in': {
    val: ['switchin'],
    img: <img src={require('assets/fisdom/arrow-right.svg')} alt={'invest'} />,
  },
  'Switch out': {
    val: ['switchout'],
    img: <img src={require('assets/fisdom/arrow-left.svg')} alt={'invest'} />,
  },
};

const invest_type_mapper = (type) => {
  const ttype = Object.keys(transaction_types).find((key) => transaction_types[key].val.includes(type));
  if (ttype) {
    return (
      <div className='iwd-table-type-container'>
        {transaction_types[ttype].img}
        <div className='iwd-table-type'>{ttype}</div>
      </div>
    );
  }
};

export const transactionsHeaderMap = [
  {
    label: 'Date',
    accessor: 'tdate',
  },
  {
    label: 'Type',
    accessor: 'ttype',
    formatter: (type) => {
      return invest_type_mapper(type);
    },
  },
  {
    label: 'Unit',
    accessor: 'units',
  },
  {
    label: 'Unit Price',
    accessor: 'nav',
  },
  {
    label: 'Amount',
    accessor: 'amount',
    formatter: (type) => {
      return formatAmountInr(type);
    },
  },
];

export const transactionFilterOptions = [
  {
    id: 'ttype',
    category: 'Transactions Type',
    filters: [
      {
        label: 'Investment',
        value: 'invest',
      },
      {
        label: 'Withdrawal',
        value: 'withdraw',
      },
      {
        label: 'Switch',
        value: 'switch',
      },
    ],
  },
];

const ViewForOptions = [
  {
    id: 'viewFor',
    category: 'View For',
    filters: [
      {
        label: 'Past 7 days',
        value: 'past_seven_days',
      },
      {
        label: 'Past 2 weeks',
        value: 'past_two_weeks',
      },
      {
        label: 'Past months',
        value: 'past_month',
      },
      {
        label: 'Month to date',
        value: 'month_to_date',
      },
      {
        label: 'Year to date',
        value: 'year_to_date',
      },
      {
        label: 'Select dates',
        value: 'select_dates',
      },
    ],
  },
];

export const mobileFilterOptions = [...transactionFilterOptions, ...ViewForOptions];
