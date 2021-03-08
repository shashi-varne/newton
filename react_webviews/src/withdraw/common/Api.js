import Api from '../../utils/api'
import { isEmpty } from 'utils/validators'
const genericErrMsg = 'Something went wrong'

export const getWithdrawReasons = async () => {
  try {
    const res = await Api.get('api/user-consent/redemption')
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const postWithdrawReasons = async (params) => {
  try {
    const res = await Api.post('api/user-consent/redemption', params)
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const getRecommendedSwitch = async (amount) => {
  try {
    // const res = await Api.get(`api/invest/switch/systematic/recommend?amount=${amount}`);
    const res = switchFunds
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

export const getRecommendedFund = async (type, amount = null) => {
  try {
    let api = `api/invest/redeem/recommendv3/mine/${type}`
    if (amount) {
      api += `?amount=${amount}`
    }
    await Api.get(api)
    let res
    if (type === 'insta-redeem') {
      res = insta
    } else if (type === 'self') {
      res = self
    } else if (type === 'systematic') {
      res = systematic
    }
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg
    }
    const { result, status_code: status } = res.pfwresponse

    if (status === 200) {
      return result
    } else {
      throw result.error || result.message || genericErrMsg
    }
  } catch (err) {
    throw err
  }
}

const otpVerification = async (url, otp) => {
  const res = await Api.post(`${url}?otp=${otp}`)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse
  if (status === 200) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}

const resendOtp = async (url) => {
  const res = await Api.post(url)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(genericErrMsg)
  }
  const { result, status_code: status } = res.pfwresponse
  if (status === 200) {
    return result
  } else {
    throw new Error(result.error || result.message || genericErrMsg)
  }
}

const insta = {
  pfwuser_id: 5121843795066880,
  pfwresponse: {
    status_code: 200,
    requestapi: '',
    result: {
      message: 'success',
      recommendations: [
        {
          ir_funds_available: true,
          all_success: true,
          allocations: [
            {
              units: 3.014,
              amount: 819.82,
              mf: {
                amfi: 'INF109K01VQ1',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'bond',
                ft: '',
                amc: 'ICICI Prudential Mutual Fund',
                amc_id: 'ICICIPRUDENTIALMUTUALFUND_MF',
                curr_nav: 302.2274,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
                mfname: 'ICICI Prudential Liquid Fund - Growth',
                name: 'ICICI Prudential Liquid Fund - Growth',
                cams: '',
                friendly_name: 'ICICI Pru Liquid Fund (G)',
                isin: 'INF109K01VQ1',
                karvy: '',
                mfid: 'INF109K01VQ1',
              },
              invested_since: '29 Jun 2020',
            },
          ],
        },
      ],
    },
  },
  pfwmessage: 'Success',
  pfwutime: '',
  pfwstatus_code: 200,
  pfwtime: '2021-03-02 12:52:40.775793',
}

const self = {
  pfwuser_id: 5121843795066880,
  pfwresponse: {
    status_code: 200,
    requestapi: '',
    result: {
      message: 'success',
      recommendations: [
        {
          subtype: 'overall',
          itype: 'overall',
          name: 'Existing Funds',
          allocations: [
            {
              mf: {
                amfi: 'INF204K01UN9',
                camsv2: [],
                is_fisdom_recommended: true,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'bond',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 4983.9066,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname: 'Nippon India Liquid Fund -Growth Plan',
                name: 'Nippon India Liquid Fund -Growth Plan',
                cams: '',
                friendly_name: 'Nippon India Liquid Fund',
                isin: 'INF204K01UN9',
                karvy: '',
                mfid: 'INF204K01UN9',
              },
              folio_number: '401162225816',
              locked_amount: 0.0,
              amount: 897.12,
              units: 0.18,
              locked_units: 0.0,
              invested_since: '25 Jun 2020',
            },
            {
              mf: {
                amfi: 'INF200KA1TM5',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: 'Interval Fund Schemes(Income)',
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: null,
                ft: '',
                amc: 'SBI Mutual Fund',
                amc_id: 'SBIMUTUALFUND_MF',
                curr_nav: 14.4151,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/sbi.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/sbi.png',
                mfname:
                  'SBI Long Term Advantage Fund - Series VI - Regular Plan - Growth',
                name:
                  'SBI Long Term Advantage Fund - Series VI - Regular Plan - Growth',
                cams: '',
                friendly_name: 'Sbi Long Term Advantage Fund',
                isin: 'INF200KA1TM5',
                karvy: '',
                mfid: 'INF200KA1TM5',
              },
              folio_number: '15423002',
              locked_amount: 7207.55,
              amount: 0.0,
              units: 0.0,
              locked_units: 500.0,
              invested_since: '17 Jul 2018',
            },
            {
              mf: {
                amfi: 'INF277K01I52',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Tata Mutual Fund',
                amc_id: 'TATAMUTUALFUND_MF',
                curr_nav: 23.5759,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/tata.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/tata.png',
                mfname: 'Tata India Tax Savings Fund-Growth-Regular Plan',
                name: 'Tata India Tax Savings Fund-Growth-Regular Plan',
                cams: '',
                friendly_name: 'Tata India Tax Savings Fund Reg (G)',
                isin: 'INF277K01I52',
                karvy: '',
                mfid: 'INF277K01I52',
              },
              folio_number: '4045900/07',
              locked_amount: 0.0,
              amount: 53508.31,
              units: 2269.619,
              locked_units: 0.0,
              invested_since: '02 Feb 2018',
            },
            {
              mf: {
                amfi: 'INF109K01BL4',
                camsv2: [],
                is_fisdom_recommended: true,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'ICICI Prudential Mutual Fund',
                amc_id: 'ICICIPRUDENTIALMUTUALFUND_MF',
                curr_nav: 54.31,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
                mfname: 'ICICI Prudential Bluechip Fund - Growth',
                name: 'ICICI Prudential Bluechip Fund - Growth',
                cams: '',
                friendly_name: 'ICICI Pru Bluechip Fund (G)',
                isin: 'INF109K01BL4',
                karvy: '',
                mfid: 'INF109K01BL4',
              },
              folio_number: '8261000/15',
              locked_amount: 0.0,
              amount: 26508.32,
              units: 488.093,
              locked_units: 0.0,
              invested_since: '31 Dec 2018',
            },
            {
              mf: {
                amfi: 'INF179K01830',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'HDFC Mutual Fund',
                amc_id: 'HDFCMUTUALFUND_MF',
                curr_nav: 242.728,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/hdfc_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/hdfc_new.png',
                mfname: 'HDFC Balance Advantage Fund - Growth Option',
                name: 'HDFC Balance Advantage Fund - Growth Option',
                cams: '',
                friendly_name: 'HDFC Balanced Advt Fund (G)',
                isin: 'INF179K01830',
                karvy: '',
                mfid: 'INF179K01830',
              },
              folio_number: '12173714/37',
              locked_amount: 0.0,
              amount: 55622.1,
              units: 229.154,
              locked_units: 0.0,
              invested_since: '01 Jun 2018',
            },
            {
              mf: {
                amfi: 'INF204K01HY3',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 58.1094,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname:
                  'Nippon India Small Cap Fund - Growth Plan - Growth Option',
                name:
                  'Nippon India Small Cap Fund - Growth Plan - Growth Option',
                cams: '',
                friendly_name: 'Nippon India Small Cap Fund',
                isin: 'INF204K01HY3',
                karvy: '',
                mfid: 'INF204K01HY3',
              },
              folio_number: '477156831544',
              locked_amount: 0.0,
              amount: 17243.15,
              units: 296.736,
              locked_units: 0.0,
              invested_since: '14 Dec 2017',
            },
            {
              mf: {
                amfi: 'INF174K01336',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Kotak Mahindra Mutual Fund',
                amc_id: 'KOTAKMAHINDRAMF',
                curr_nav: 45.242,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/kotak_mahindra_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/kotak_mahindra_new.png',
                mfname: 'Kotak Flexicap Fund - Growth',
                name: 'Kotak Flexicap Fund - Growth',
                cams: '',
                friendly_name: 'Kotak Flexicap Fund',
                isin: 'INF174K01336',
                karvy: '',
                mfid: 'INF174K01336',
              },
              folio_number: '3540603/79',
              locked_amount: 0.0,
              amount: 112407.23,
              units: 2484.577,
              locked_units: 0.0,
              invested_since: '26 Apr 2016',
            },
            {
              mf: {
                amfi: 'INF204K01BU4',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'bond',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 29.7272,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname:
                  'Nippon India Gilt Securities Fund -Growth Plan - Growth Option',
                name:
                  'Nippon India Gilt Securities Fund -Growth Plan - Growth Option',
                cams: '',
                friendly_name: 'Nippon India Gilt Securities Fund',
                isin: 'INF204K01BU4',
                karvy: '',
                mfid: 'INF204K01BU4',
              },
              folio_number: '477158941712',
              locked_amount: 0.0,
              amount: 21380.38,
              units: 719.219,
              locked_units: 0.0,
              invested_since: '01 Aug 2016',
            },
            {
              mf: {
                amfi: 'INF769K01DK3',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: null,
                ft: '',
                amc: 'Mirae Asset Mutual Fund',
                amc_id: 'MIRAEASSET',
                curr_nav: 25.412,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/mirae_asset.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/mirae_asset.png',
                mfname: 'Mirae Asset Tax Saver Fund-Regular Plan-Growth',
                name: 'Mirae Asset Tax Saver Fund-Regular Plan-Growth',
                cams: '',
                friendly_name: 'Mirae Asset Tax Saver Fund -Reg Plan-(G)',
                isin: 'INF769K01DK3',
                karvy: '',
                mfid: 'INF769K01DK3',
              },
              folio_number: '77720568805',
              locked_amount: 708.08,
              amount: 0.0,
              units: 0.0,
              locked_units: 27.864,
              invested_since: '17 Jul 2019',
            },
            {
              mf: {
                amfi: 'INF109K01AF8',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'ICICI Prudential Mutual Fund',
                amc_id: 'ICICIPRUDENTIALMUTUALFUND_MF',
                curr_nav: 191.53,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
                mfname: 'ICICI Prudential Value Discovery Fund - Growth',
                name: 'ICICI Prudential Value Discovery Fund - Growth',
                cams: '',
                friendly_name: 'ICICI Pru Value Discovery Fund (G)',
                isin: 'INF109K01AF8',
                karvy: '',
                mfid: 'INF109K01AF8',
              },
              folio_number: '8269738/88',
              locked_amount: 0.0,
              amount: 137319.94,
              units: 716.963,
              locked_units: 0.0,
              invested_since: '26 Apr 2016',
            },
            {
              mf: {
                amfi: 'INF174K01FD6',
                camsv2: [],
                is_fisdom_recommended: true,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'bond',
                ft: '',
                amc: 'Kotak Mahindra Mutual Fund',
                amc_id: 'KOTAKMAHINDRAMF',
                curr_nav: 33.6152,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/kotak_mahindra_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/kotak_mahindra_new.png',
                mfname: 'Kotak Savings Fund -Growth',
                name: 'Kotak Savings Fund -Growth',
                cams: '',
                friendly_name: 'Kotak Savings Fund (G)',
                isin: 'INF174K01FD6',
                karvy: '',
                mfid: 'INF174K01FD6',
              },
              folio_number: '3623599/90',
              locked_amount: 0.0,
              amount: 5507.14,
              units: 163.829,
              locked_units: 0.0,
              invested_since: '02 Jul 2019',
            },
            {
              mf: {
                amfi: 'INF209K01108',
                camsv2: [],
                is_fisdom_recommended: true,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Aditya Birla Sun Life Mutual Fund',
                amc_id: 'BIRLASUNLIFEMUTUALFUND_MF',
                curr_nav: 38.97,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/aditya_birla_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/aditya_birla_new.png',
                mfname: "Aditya Birla Sun Life Tax Relief '96 - Growth Option",
                name: "Aditya Birla Sun Life Tax Relief '96 - Growth Option",
                cams: '',
                friendly_name: 'Aditya Birla SL Tax Relief 96 (G)',
                isin: 'INF209K01108',
                karvy: '',
                mfid: 'INF209K01108',
              },
              folio_number: '1018322080',
              locked_amount: 0.0,
              amount: 79668.63,
              units: 2044.358,
              locked_units: 0.0,
              invested_since: '30 Dec 2016',
            },
            {
              mf: {
                amfi: 'INF200K01305',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'SBI Mutual Fund',
                amc_id: 'SBIMUTUALFUND_MF',
                curr_nav: 290.176,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/sbi.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/sbi.png',
                mfname: 'SBI LARGE & MIDCAP FUND- REGULAR PLAN -Growth',
                name: 'SBI LARGE & MIDCAP FUND- REGULAR PLAN -Growth',
                cams: '',
                friendly_name: 'SBI Large & Midcap Fund Reg (G)',
                isin: 'INF200K01305',
                karvy: '',
                mfid: 'INF200K01305',
              },
              folio_number: '15423002',
              locked_amount: 0.0,
              amount: 119341.54,
              units: 411.273,
              locked_units: 0.0,
              invested_since: '26 Apr 2016',
            },
            {
              mf: {
                amfi: 'INF205K01247',
                camsv2: [],
                is_fisdom_recommended: true,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Invesco Mutual Fund',
                amc_id: 'INVESCOMUTUALFUND_MF',
                curr_nav: 44.31,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/invesco.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/invesco.png',
                mfname: 'Invesco India Growth Opportunities Fund - Growth',
                name: 'Invesco India Growth Opportunities Fund - Growth',
                cams: '',
                friendly_name: 'Invesco India (G) Opp. Fund - (G)',
                isin: 'INF205K01247',
                karvy: '',
                mfid: 'INF205K01247',
              },
              folio_number: '3101729075',
              locked_amount: 0.0,
              amount: 17034.08,
              units: 384.429,
              locked_units: 0.0,
              invested_since: '04 Jul 2019',
            },
            {
              mf: {
                amfi: 'INF109KC1RE6',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: null,
                ft: '',
                amc: 'ICICI Prudential Mutual Fund',
                amc_id: 'ICICIPRUDENTIALMUTUALFUND_MF',
                curr_nav: 13.44,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
                mfname:
                  'ICICI Prudential India Opportunities Fund - Cumulative Option',
                name:
                  'ICICI Prudential India Opportunities Fund - Cumulative Option',
                cams: '',
                friendly_name: 'Icici Prudential India Opportunities Fund',
                isin: 'INF109KC1RE6',
                karvy: '',
                mfid: 'INF109KC1RE6',
              },
              folio_number: '8261000/15',
              locked_amount: 0.0,
              amount: 27137.06,
              units: 2019.127,
              locked_units: 0.0,
              invested_since: '06 Jun 2019',
            },
            {
              mf: {
                amfi: 'INF204K01GK4',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 62.6026,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname:
                  'Nippon India Tax Saver (ELSS) Fund-Growth Plan-Growth Option',
                name:
                  'Nippon India Tax Saver (ELSS) Fund-Growth Plan-Growth Option',
                cams: '',
                friendly_name: 'Nippon India Tax Saver (Elss) Fund',
                isin: 'INF204K01GK4',
                karvy: '',
                mfid: 'INF204K01GK4',
              },
              folio_number: '477156831544',
              locked_amount: 0.0,
              amount: 34504.68,
              units: 551.17,
              locked_units: 0.0,
              invested_since: '02 Feb 2018',
            },
            {
              mf: {
                amfi: 'INF204K01489',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 114.9567,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname: 'Nippon India Multi Cap Fund-Growth Plan-Growth Option',
                name: 'Nippon India Multi Cap Fund-Growth Plan-Growth Option',
                cams: '',
                friendly_name: 'Nippon India Multi Cap Fund',
                isin: 'INF204K01489',
                karvy: '',
                mfid: 'INF204K01489',
              },
              folio_number: '477156831544',
              locked_amount: 0.0,
              amount: 252.1,
              units: 2.193,
              locked_units: 0.0,
              invested_since: '10 Aug 2018',
            },
            {
              mf: {
                amfi: 'INF109K01VQ1',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'bond',
                ft: '',
                amc: 'ICICI Prudential Mutual Fund',
                amc_id: 'ICICIPRUDENTIALMUTUALFUND_MF',
                curr_nav: 302.2274,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
                mfname: 'ICICI Prudential Liquid Fund - Growth',
                name: 'ICICI Prudential Liquid Fund - Growth',
                cams: '',
                friendly_name: 'ICICI Pru Liquid Fund (G)',
                isin: 'INF109K01VQ1',
                karvy: '',
                mfid: 'INF109K01VQ1',
              },
              folio_number: '8261000/15',
              locked_amount: 0.0,
              amount: 910.91,
              units: 3.014,
              locked_units: 0.0,
              invested_since: '29 Jun 2020',
            },
            {
              mf: {
                amfi: 'INF740K01185',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'DSP Mutual Fund',
                amc_id: 'DSPBLACKROCK',
                curr_nav: 65.338,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/dsp.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/dsp.png',
                mfname: 'DSP Tax Saver Fund - Regular Plan - Growth',
                name: 'DSP Tax Saver Fund - Regular Plan - Growth',
                cams: '',
                friendly_name: 'Dsp Tax Saver Fund',
                isin: 'INF740K01185',
                karvy: '',
                mfid: 'INF740K01185',
              },
              folio_number: '3860580/60',
              locked_amount: 0.0,
              amount: 36590.59,
              units: 560.02,
              locked_units: 0.0,
              invested_since: '30 Dec 2016',
            },
            {
              mf: {
                amfi: 'INF090I01775',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: 'FITGP',
                amc: 'Franklin Templeton Mutual Fund',
                amc_id: 'FRANKLINTEMPLETON',
                curr_nav: 708.0922,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/franklin.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/franklin.png',
                mfname: 'Franklin India Taxshield-Growth',
                name: 'Franklin India Taxshield-Growth',
                cams: '',
                friendly_name: 'Franklin India Taxshield Fund (G)',
                isin: 'INF090I01775',
                karvy: '',
                mfid: 'INF090I01775',
              },
              folio_number: '20441755',
              locked_amount: 0.0,
              amount: 32335.74,
              units: 45.666,
              locked_units: 0.0,
              invested_since: '30 Dec 2016',
            },
            {
              mf: {
                amfi: 'INF204K01406',
                camsv2: [],
                is_fisdom_recommended: false,
                sundaramv2: '',
                sundaram: [],
                ftype: null,
                nav_date: '03/01/2021',
                nfo_recommendation: false,
                bond_stock: 'stock',
                ft: '',
                amc: 'Nippon India Mutual Fund',
                amc_id: 'RELIANCEMUTUALFUND_MF',
                curr_nav: 674.1405,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                mfname: 'Nippon India Vision Fund-GROWTH PLAN-Growth Option',
                name: 'Nippon India Vision Fund-GROWTH PLAN-Growth Option',
                cams: '',
                friendly_name: 'Nippon India Vision Fund',
                isin: 'INF204K01406',
                karvy: '',
                mfid: 'INF204K01406',
              },
              folio_number: '477156831544',
              locked_amount: 0.0,
              amount: 256.85,
              units: 0.381,
              locked_units: 0.0,
              invested_since: '12 Jun 2018',
            },
          ],
        },
      ],
    },
  },
  pfwmessage: 'Success',
  pfwutime: '',
  pfwstatus_code: 200,
  pfwtime: '2021-03-02 13:03:03.356225',
}

const switchFunds = {
  pfwuser_id: 5121843795066880,
  pfwresponse: {
    status_code: 200,
    requestapi: '',
    result: {
      total_switched_amount: 213100,
      switch_message: '',
      recommendations: [
        {
          folios: [
            {
              all_units: false,
              amount: 30900,
              total_amount: 110858.655327,
              folio: '3623599/90',
            },
          ],
          from_mf: {
            amfi: 'INF174K01336',
            amc: 'Kotak Mahindra Mutual Fund',
            fisdom_rating: 4,
            curr_nav: 45.829,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/kotak_mahindra_new.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/kotak_mahindra_new.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/kotak_mahindra_new.png',
            name: 'Kotak Flexicap Fund - Growth',
            friendly_name: 'Kotak Flexicap Fund',
            mfid: 'INF174K01336',
            nav_date: '03/02/2021',
            isin: 'INF174K01336',
            bond_stock: 'stock',
          },
          switch_amount: 30900,
          total_amount: 110858.655327,
          to_mf: {
            amfi: 'INF174K01FD6',
            amc: 'Kotak Mahindra Mutual Fund',
            fisdom_rating: 2,
            curr_nav: 33.6166,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/kotak_mahindra_new.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/kotak_mahindra_new.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/kotak_mahindra_new.png',
            name: 'Kotak Savings Fund -Growth',
            friendly_name: 'Kotak Savings Fund (G)',
            mfid: 'INF174K01FD6',
            nav_date: '03/02/2021',
            isin: 'INF174K01FD6',
            bond_stock: 'bond',
          },
        },
        {
          folios: [
            {
              all_units: false,
              amount: 93500,
              total_amount: 117934.82047920002,
              folio: '15423002',
            },
          ],
          from_mf: {
            amfi: 'INF200K01305',
            amc: 'SBI Mutual Fund',
            fisdom_rating: 3,
            curr_nav: 292.9832,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/sbi.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/sbi.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/sbi.png',
            name: 'SBI LARGE & MIDCAP FUND- REGULAR PLAN -Growth',
            friendly_name: 'SBI Large & Midcap Fund Reg (G)',
            mfid: 'INF200K01305',
            nav_date: '03/02/2021',
            isin: 'INF200K01305',
            bond_stock: 'stock',
          },
          switch_amount: 93500,
          total_amount: 117934.82047920002,
          to_mf: {
            amfi: 'INF200K01636',
            amc: 'SBI Mutual Fund',
            fisdom_rating: 3,
            curr_nav: 32.4603,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/sbi.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/sbi.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/sbi.png',
            name: 'SBI  SAVINGS FUND - REGULAR PLAN - GROWTH',
            friendly_name: 'SBI ST Debt Fund Reg Plan (G)',
            mfid: 'INF200K01636',
            nav_date: '03/02/2021',
            isin: 'INF200K01636',
            bond_stock: 'bond',
          },
        },
        {
          folios: [
            {
              all_units: false,
              amount: 88700,
              total_amount: 113730.77632,
              folio: '8495046/60',
            },
          ],
          from_mf: {
            amfi: 'INF109K01AF8',
            amc: 'ICICI Prudential Mutual Fund',
            fisdom_rating: 3,
            curr_nav: 195.92,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/icici_new.png',
            name: 'ICICI Prudential Value Discovery Fund - Growth',
            friendly_name: 'ICICI Pru Value Discovery Fund (G)',
            mfid: 'INF109K01AF8',
            nav_date: '03/02/2021',
            isin: 'INF109K01AF8',
            bond_stock: 'stock',
          },
          switch_amount: 88700,
          total_amount: 113730.77632,
          to_mf: {
            amfi: 'INF109K01746',
            amc: 'ICICI Prudential Mutual Fund',
            fisdom_rating: 3,
            curr_nav: 415.8795,
            amc_logo_small:
              'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
            amc_logo_big:
              'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
            amc_logo_zoomed:
              'https://my.fisdom.com/static/img/amc-logo/high-zoom/icici_new.png',
            name: 'ICICI Prudential Savings Fund - Growth',
            friendly_name: 'ICICI Pru Savings Fund (G)',
            mfid: 'INF109K01746',
            nav_date: '03/02/2021',
            isin: 'INF109K01746',
            bond_stock: 'bond',
          },
        },
      ],
    },
  },
  pfwmessage: 'Success',
  pfwutime: '',
  pfwstatus_code: 200,
  pfwtime: '2021-03-03 11:56:32.989914',
}

const systematic = {
  pfwuser_id: 5121843795066880,
  pfwresponse: {
    status_code: 200,
    requestapi: '',
    result: {
      message: 'success',
      recommendations: [
        {
          tax_generated: true,
          subtype: null,
          debt_stcg_applied: true,
          itype: 'overall',
          name: 'Overall',
          allocations: [
            {
              folios: [
                {
                  available_amount: 20655.461008599996,
                  all_units: false,
                  amount: 14200,
                  folio_number: '477156831544',
                },
              ],
              ltcg_tax: 42.25869095757578,
              exit_load: 0,
              stcg_percent: 30,
              stcg_tax: 710.9604507186922,
              debt_stcg_applied: true,
              amc_logo_small:
                'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
              amc_logo_big:
                'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
              know_how_msg:
                'You can avoid short term taxes by holding your investments for 3 years',
              message: '* STCG Tax and LTCG Tax applicable',
              invested_since: '01 Aug 2016',
              ltcg_percent: 20,
              mf: {
                amfi: 'INF204K01BU4',
                amc: 'Nippon India Mutual Fund',
                fisdom_rating: 3,
                curr_nav: 29.7286,
                amc_logo_small:
                  'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
                amc_logo_big:
                  'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
                amc_logo_zoomed:
                  'https://my.fisdom.com/static/img/amc-logo/high-zoom/nippon_india.png',
                name:
                  'Nippon India Gilt Securities Fund -Growth Plan - Growth Option',
                friendly_name: 'Nippon India Gilt Securities Fund',
                mfid: 'INF204K01BU4',
                nav_date: '03/03/2021',
                isin: 'INF204K01BU4',
                bond_stock: 'bond',
              },
              tax_type: 'debt',
              friendly_name: 'Nippon India Gilt Securities Fund',
              amount: 14200,
              units: 719.2189999999999,
              isin: 'INF204K01BU4',
              balance: 21381.37,
              withdrawal_amount: 14200,
            },
          ],
          overall_tax: {
            ltcg_tax: 42.25869095757578,
            stcg_tax: 710.9604507186922,
            exit_load: 0,
          },
          extra_messages: [
            'All tax computations are based on your holding with us. Capital losses are also offset against overall gains wherever applicable.',
            '* Actual withdrawal may differ slightly as it depends on NAV',
            '** STCG Tax is computed based on the highest tax bracket. Actual amount will depend on individual taxable income',
            '*** LTCG tax is applicable only if total capital gain is more than 1 Lakh in a financial year. Total LTCG tax shown here is computed @10% on the gains over 1 Lakh. Current computation considers all LT gains till today.',
          ],
        },
      ],
    },
  },
  pfwmessage: 'Success',
  pfwutime: '',
  pfwstatus_code: 200,
  pfwtime: '2021-03-03 19:23:29.008908',
}
