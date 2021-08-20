import { getConfig } from "utils/functions";
import Radio from '@material-ui/core/Radio';
export const productName = 'finity' || getConfig().productName;


export const KEY_INSIGHTS_CAROUSEL = [
  {
    title: "AUM growth",
    content:
      "AUM of index funds has <b>increased by 188%</b> from Apr 2019 - Dec 2020",
  },
  {
    title: "Returns",
    content:
      "Sensex has clocked annualised <b>return of 14%</b> in the last 3 yrs <small>(as of Dec 31, 2020)</small>",
  },
  {
    title: "Performance",
    content:
      "Nifty has <b>outperformed 90%</b> of the large-cap funds over a 5-year cycle",
  },
  {
    title: "Suitable for",
    content:
      "<b>Long-term investors</b> looking for low-cost funds & portfolio diversification",
  },
];
export const ACTIVE_PASSIVE_FACTS_CAROUSEL = [
  {
    src: "cost.svg",
    header: "Cost",
    left: {
      title: "Active",
      content: "High operating cost due to active fund management",
    },
    right: {
      title: "Passive",
      content: "Low operating cost as no active fund management involved",
    },
  },
  {
    src: "transparency.svg",
    header: "Transparency",
    left: {
      title: "Active",
      content: "Fund manager changes the portfolio as per discretion",
    },
    right: {
      title: "Passive",
      content: "It's always clear which assets are in an index fund",
    },
  },
  {
    src: "investment_objective.svg",
    header: "Investment objective",
    left: {
      title: "Active",
      content: "Fund manager takes a higher risk to beat the market",
    },
    right: {
      title: "Passive",
      content: "Comparatively lower risk since it mirrors the market returns",
    },
  },
];
export const FUND_CATEGORY = [
  {
    key: 'nifty_backers',
    title: 'Nifty backers',
    subtitle: 'Invest in Nifty backed funds',
    icon: require(`assets/${productName}/nifty_backers.svg`)
  },
  {
    key: 'sensex_backers',
    title: 'Sensex backers',
    subtitle: 'Top S&P BSE Sensex funds',
    icon: require(`assets/${productName}/sensex_backers.svg`)
  },
  {
    key: 'thematic_funds',
    title: 'Thematic funds',
    subtitle: 'Funds tracking sectoral indices',
    icon: require(`assets/${productName}/thematic_funds.svg`)
  },
  {
    key: 'global_indices',
    title: 'Global indices',
    subtitle: 'Invest in international indices',
    icon: require(`assets/${productName}/global_indices.svg`)
  }
];

export const YEARS_FILTERS = [
  {
    type: "month",
    text: "1M",
  },
  {
    type: "month",
    text: "3M",
  },
  {
    type: "month",
    text: "6M",
  },
  {
    type: "year",
    text: "1Y",
  },
  {
    type: "year",
    text: "3Y",
  },
  {
    type: "year",
    text: "5Y",
  },
]

export const SELECTED_YEAR = {
  "1M": 'one_month_return',
  "3M": 'three_month_return',
  "6M": 'six_month_return',
  "1Y": 'one_year_return',
  "3Y": 'three_year_return',
  "5Y": 'five_year_return',
}

export const SORT_OPTIONS = [
  {
    value: "expense_ratio",
    control: Radio,
    title: "Expense ratio",
    controlProps: {
      color: "primary",
    },
    subtitle: 'Low to high',
  },
  {
    value: "tracking_error",
    control: Radio,
    title: "Tracking error",
    controlProps: {
      color: "primary",
    },
    subtitle: 'Low to high',
  },
  {
    value: "returns",
    control: Radio,
    title: "Returns",
    controlProps: {
      color: "primary",
    },
    subtitle: 'High to low',
  },
  {
    value: "rating",
    control: Radio,
    title: "Ratings",
    controlProps: {
      color: "primary",
    },
    subtitle: 'High to low',
  },
  {
    value: "fund_size",
    control: Radio,
    title: "Fund size",
    controlProps: {
      color: "primary",
    },
    subtitle: 'High to low',
  },
]


export const FUND_OPTIONS = [
  {
    value: 'Growth',
    control: Radio,
    title: "Growth",
    controlProps: {
      color: "primary",
    },
  },
  {
    value: 'Dividend',
    control: Radio,
    title: "Dividend",
    controlProps: {
      color: "primary",
    },
  },
]

export const BOTTOM_FILTER_NAME = [
  {
    "name": "Sort by",
    "option": SORT_OPTIONS,
    "key": "sort_value",
  },
  {
    "name": "Index", //   [ THIS DATA IS APPENED BY API ]
    "option": [],
    "key": "index_value",
  },
  {
    "name": "Fund Option",
    "option": FUND_OPTIONS,
    "key": "fund_option_value",
  },
  {
    "name": "Fund House",
    "option": [],  //   [ THIS DATA IS APPENED BY API ]
    "key": "fund_house_value",
  }
];

export const BUTTON_MAPPER = {
  "1M": {
    index: 0,
    format: "ddmm"
  },
  "3M": {
    index: 1,
    format: "ddmm"
  },
  "6M": {
    index: 2,
    format: "ddmm"
  },
  "1Y": {
    index: 3,
    format: "ddmm"
  },
  "3Y": {
    index: 4,
    format: "yyyy"
  },
  "5Y": {
    index: 5,
    format: "yyyy"
  },
}