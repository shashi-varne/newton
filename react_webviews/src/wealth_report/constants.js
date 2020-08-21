// Function to create randomized data based on investment values
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

export const regenTimeLimit = 30;

export const genericErrMsg = 'Something went wrong. Please try again';

export const HoldingFilterOptions = [
  {
    id: "scheme_type",
    category: "Fund Type",
    filters: [{
      label: 'Debt',
      value: 'debt',
    }, {
      label: 'Equity',
      value: 'equity',
    }, {
      label: 'Other',
      value: 'others',
    }],
  },
  {
    id: "current_value_type",
    category: "Current Value",
    filters: [{
      label: '<1L',
      value: '1',
    }, {
      label: '1.5L',
      value: '2',
    }, {
      label: '5-10L',
      value: '3',
    }, {
      label: '10L+',
      value: '4',
    }],
  },
  {
    id: "fisdom_rating",
    category: "Fisdom Rating",
    filters: [{
      label: '3 & Below',
      value: '1',
    }, {
      label: '4 & above',
      value: '2',
    }],
  },
];

export const InsightMap = {
  'InvestmentStrategy': {
    icon: 'ic-investment-strategy',
    title: 'Investment Strategy',
  },
  'PortfolioComposition': {
    icon: 'ic-portfolio-composition',
    title: 'Portfolio Composition',
  },
  'Diversification': {
    icon: 'ic-diversification',
    title: 'Diversification',
  },
  'FundSelection': {
    icon: 'ic-fund-selection',
    title: 'Fund Selection',
  },
  'PortfolioLiquidity': {
    icon: 'ic-portfolio-liquidity',
    title: 'Portfolio Liquidity',
  },
  'TaxEfficiency': {
    icon: 'ic-tax-efficiency',
    title: 'Tax Efficiency',
  },
};

export const GraphDateRanges = [{
  label: isMobileView ? '1m' : '1 Month',
  value: '1 month',
}, {
  label: isMobileView ? '3m' : '3 Months',
  value: '3 months',
}, {
  label: isMobileView ? '6m' : '6 Months',
  value: '6 months',
}, {
  label: isMobileView ? '1y' : '1 Year',
  value: '1 year',
}, {
  label: isMobileView ? '3y' : '3 Years',
  value: '3 years',
}, {
  label: isMobileView ? '5y' : '5 Years',
  value: '5 years',
}];

export const TriColorScheme = ['#856cc1', '#7458b9', '#512ea7'];

export const MultiColorScheme = [
  '#f2effb',
  '#e4ddf7',
  '#d7cef3',
  '#c9beef',
  '#bcaeea',
  '#af9de7',
  '#a28ee2',
  '#957cde',
  '#896bda',
  '#795cd6',
  '#6d4bd2',
  '#603cce',
  '#5631c4',
  '#4f2eb4',
  '#4828a3',
];

export const dummyAlloc = [{
  id: 'Large Cap',
  label: 'Large Cap',
  value: 43,
  "color": "#856cc1"
}, {
  id: 'Mid Cap',
  label: 'Mid Cap',
  value: 12,
  "color": "#7458b9",
}, {
  id: 'Small Cap',
  label: 'Small Cap',
  value: 45,
  "color": "#512ea7",
}];

export const dummyTableData = [
  { date: '20 Apr 2020', type: 'Investment', amount: '₹ 2.30L' },
  { date: '8 Oct 2019', type: 'Withdrawal', amount: '₹ 1.80L' },
  { date: '20 Apr 2020', type: 'Investment', amount: '₹ 2.30L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
  { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L' },
];