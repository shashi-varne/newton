import { storageService } from 'utils/validators';

export function forceBackState() {
    let forceBackState = storageService().get('forceBackState');

    return forceBackState || false;
}

export const stateMapper = {
    'buy-home': '/gold/buy',
    'sell-home': '/gold/sell',
    'delivery-products': '/gold/delivery-products'
}

export function calculate_gold_wt_buy(buyData, buy_price) {

    let current_gold_price = buyData.goldBuyInfo.plutus_rate;
    let tax = buyData.goldBuyInfo.applicable_tax;

    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2);
    var gold_wt = (buy_price / current_gold_price_with_tax).toFixed(4);

    var base_amount = (buy_price/tax).toFixed(2);

    let data = {
        'weight': gold_wt,
        'amount': buy_price,
        'gst_amount': buy_price - base_amount,
        'total_amount': buy_price,
        'tax': buyData.goldBuyInfo.applicable_tax,
        'base_amount': base_amount
    }
    return data;
}

export function calculate_gold_amount_buy(buyData, weight) {
    let current_gold_price = buyData.goldBuyInfo.plutus_rate;
    let tax = buyData.goldBuyInfo.applicable_tax;


    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2)
    var gold_amount = (weight * current_gold_price_with_tax).toFixed(2);

    var current_gold_price_without_tax = (current_gold_price).toFixed(2)
    var gold_amount_without_tax = (weight * current_gold_price_without_tax).toFixed(2);

    let data = {
        'amount': gold_amount,
        'weight': weight,
        'gst_amount': gold_amount - gold_amount_without_tax,
        'total_amount': gold_amount,
        'tax': buyData.goldBuyInfo.applicable_tax,
        'base_amount': gold_amount_without_tax
    }
    return data;
}

export function calculate_gold_wt_sell(sellData, amount) {
    

    let weight = ((amount) / (sellData.goldSellInfo.plutus_rate)).toFixed(4);
    let data = {
        'weight': weight,
        'amount': amount,
        'gst_amount': 0,
        'total_amount': amount,
        'tax': 0,
        'base_amount': amount
    }
    return data;
}

export function calculate_gold_amount_sell(sellData, weight) {
    let amount = ((sellData.goldSellInfo.plutus_rate) * (weight)).toFixed(2);
    let data = {
        'weight': sellData.weight,
        'amount': amount,
        'gst_amount': 0,
        'total_amount': amount,
        'tax': 0,
        'base_amount': amount
    }
    return data;
}

export function getUpdatedBuyData(new_rate) {

    let buyData = storageService().getObject('buyData');
    let amountUpdated, weightUpdated;
    let inputData;

    if (buyData.isAmount) {
        amountUpdated = buyData.amount;
        inputData = calculate_gold_wt_buy(buyData, buyData.amount);
        weightUpdated = inputData.weight;

    } else {
        weightUpdated = buyData.weight;
        amountUpdated = this.calculate_gold_amount(new_rate.plutus_rate,
            new_rate.applicable_tax, buyData.weight);
    }


    buyData.amount_selected = amountUpdated;
    buyData.weight_selected = weightUpdated;
    setBuyDataAfterUpdate(inputData);
    storageService().setObject('buyData', buyData)

    return buyData;

}

export function setBuyDataAfterUpdate(inputData) {
    let buyData = storageService().getObject('buyData');
    buyData.gst_amount = inputData.gst_amount;
    buyData.total_amount = inputData.total_amount;
    buyData.base_amount = inputData.base_amount
    buyData.tax = inputData.tax;
    storageService().setObject('buyData', buyData);
}

export function setSellDataAfterUpdate(inputData) {
    let sellData = storageService().getObject('sellData');
    sellData.gst_amount = inputData.gst_amount;
    sellData.total_amount = inputData.total_amount;
    sellData.base_amount = inputData.base_amount
    sellData.tax = inputData.tax;
    storageService().setObject('sellData', sellData);
}

export const default_provider = 'mmtc';

export const gold_providers = {
    'mmtc' : {
        key: 'mmtc',
        title: 'MMTC',
        subtitle: '24 Karat | 99.9% pure',
        logo: 'logo_mmtc.svg',
        karat: '24K 99.99%'
    },
    'safegold': { 
        key: 'safegold',
        title: 'Safegold',
        subtitle: '24 Karat | 99.5% pure',
        logo: 'logo_safegold.svg',
        karat: '24K 99.5%'
    }
}

export const gold_providers_array = [
    {
        key: 'mmtc',
        title: 'MMTC',
        subtitle: '24 Karat | 99.9% pure',
        logo: 'logo_mmtc.svg'
    },
    {
        key: 'safegold',
        title: 'Safegold',
        subtitle: '24 Karat | 99.5% pure',
        logo: 'logo_safegold.svg'
    }
]

export function isUserRegistered(result) {
    let provider_info = result.gold_user_info.provider_info;

    if (!provider_info || 
        provider_info.registration_status === "pending" || !provider_info.registration_status ||
      result.gold_user_info.is_new_gold_user) {
      return false;
    }

    return true;

}


export function goBackMap(path) {
    let mapper = {
        '/gold/sell' : '/gold/landing',
        '/gold/buy' : '/gold/landing',
        '/gold/delivery' : '/gold/landing',
        '/gold/delivery-products' : '/gold/delivery',
        '/gold/my-gold-locker' : '/gold/landing',
        '/gold/report' : '/gold/landing',
        '/gold/check-how3': '/gold/check-how2',
        '/gold/check-how2': '/gold/check-how1',
        '/gold/check-how1': '/gold/landing'
    }

    return mapper[path] || false;
}