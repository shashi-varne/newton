import { productName } from "./common/commonFunctions";
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Done'

export const product_name = 'finity' || productName()


export const keyInsightsCarousel = [
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
export const passiveActiveCarousal = [
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
export const fund_category = [
    {
        key: 'nifty_backers',
        title: 'Nifty backers',
        subtitle: 'Invest in Nifty backers funds',
        icon: require(`assets/${product_name}/nifty_backers.svg`)
    },
    {
        key: 'sensex_backers',
        title: 'Sensex backers',
        subtitle: 'Top S&P BSE Sensex funds',
        icon: require(`assets/${product_name}/sensex_backers.svg`)
    },
    {
        key: 'thematic_funds',
        title: 'Thematic funds',
        subtitle: 'Funds tracking sectoral indices',
        icon: require(`assets/${product_name}/thematic_funds.svg`)
    },
    {
        key: 'global_indices',
        title: 'Global indices',
        subtitle: 'Invest in international indices',
        icon: require(`assets/${product_name}/global_indices.svg`)
    }
];

export const year_filters = [
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


export const sort_filter_data = [
    {
        value: "expense_ratio",
        control: Radio,
        title: "Expense ratio",
        labelPlacement: "end",
        color: "primary",
        subtitle: 'Low to hight',
    },
    {
        value: "tracking_error",
        control: Radio,
        title: "Tracking error",
        labelPlacement: "end",
        color: "primary",
        subtitle: 'Low to hight',
    },
    {
        value: "returns",
        control: Radio,
        title: "Returns",
        labelPlacement: "end",
        color: "primary",
        subtitle: 'Hight to low',
    },
    {
        value: "rating",
        control: Radio,
        title: "Ratings",
        labelPlacement: "end",
        color: "primary",
        subtitle: 'Hight to low',
    },
    {
        value: "fundsize",
        control: Radio,
        title: "Fund size",
        labelPlacement: "end",
        color: "primary",
        subtitle: 'Hight to low',
    },
]


export const fund_option_data = [
    {
        value: 'Growth',
        control: Radio,
        title: "Growth",
        labelPlacement: "end",
        color: "primary",
    },
    {
        value: 'Dividende',
        control: Radio,
        title: "Dividend",
        labelPlacement: "end",
        color: "primary",
    },
]





export const filter_options = [
    {
        "Sort by": sort_filter_data
    },
    {
        "Index": [] //   [ THIS DATA IS APPENED BY API ]
    },
    {
        "Fund Option": fund_option_data
    },
    {
        "Fund House": []  //   [ THIS DATA IS APPENED BY API ]
    }
];