import { productName } from "./common/commonFunctions";

export const product_name = 'finity'  //productName()

export const carousel_img = [
    { src: 'passive_index_keyinsight_1.svg' },
    { src: 'passive_index_keyinsight_1.svg' },
    { src: 'religare_icn_landing_card_3.png' }
]

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