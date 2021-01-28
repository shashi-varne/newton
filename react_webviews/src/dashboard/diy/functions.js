import Api from 'utils/api'
import { isEmpty, storageService } from '../../utils/validators'

const genericErrorMessage = 'Something went wrong!!!'

export async function getFundList() {
  const sub = storageService().get('diystore_subCategpry')
  const cat = storageService().get('diystore_category')
  const type = storageService().get('diystore_investmentType')
  const res = await Api.get(`/api/funds/Equity/Multi_Cap/sip`)
  if (
    res.pfwresponse.result.message === 'success' &&
    res.pfwresponse.status_code === 200
  ) {
    return res.pfwresponse.result.funds
  }
  throw new Error(res.pfwresponse.result.message || genericErrorMessage)
}

export function removeFromCart(item) {
  const currentCartItems = storageService().getObject('diystore_cart') || []
  const index = currentCartItems.findIndex(({ isin }) => isin === item.isin)
  if (index !== -1) {
    const updatedCartItems = currentCartItems.filter(
      ({ isin }) => isin !== item.isin
    )
    storageService().setObject('diystore_cart', updatedCartItems)
  }
}

export function getFundHouses() {
  const fundsList = storageService().getObject('diystore_fundsList')

  if (fundsList.length > 0) {
    const fundsHouseArr = fundsList.map((item) => item.fund_house)
    const uniqueSet = new Set(fundsHouseArr)
    const uniqueArr = Array.from(uniqueSet)
    return uniqueArr
  }
  return []
}

export function resetDiy() {
  storageService().set('diystore_sortFilter', 'returns')
  storageService().set('diystore_fundOption', 'growth')
  storageService().set('diystore_fundHouse', '')
}
