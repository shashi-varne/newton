import Api from 'utils/api'
import { storageService } from '../../utils/validators'

const genericErrorMessage = 'Something went wrong!!!'

export async function getFundList() {
  const res = await Api.get(`/api/funds/Equity/Large_cap/sip`)
  if (
    res.pfwresponse.result.message === 'success' &&
    res.pfwresponse.status_code === 200
  ) {
    return res.pfwresponse.result.funds
  }
  throw new Error(res.pfwresponse.result.message || genericErrorMessage)
}

export function addToCart(item) {
  const currentCartItems = storageService().getObject('diystore_cart') || []
  currentCartItems.push(item)
  storageService().setObject(currentCartItems)
}

export function deleteItemFromCart(isinNo) {
  const cartItems = storageService().getObject('diystore_cart')
  if (cartItems.length) {
    const updatedCartItems = cartItems.filter(({ isin }) => {
      return isin === isinNo
    })
    storageService().setObject('diystore_cart', updatedCartItems)
  }
}

export function resetDiy() {
  storageService().set('diystore_sortFilter', 'returns')
  storageService().set('diystore_fundOption', 'growth')
  storageService().set('diystore_fundHouse', '')
}
