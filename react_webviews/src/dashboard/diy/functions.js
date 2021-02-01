import Api from 'utils/api'
import { storageService } from '../../utils/validators'

const genericErrorMessage = 'Something went wrong!!!'

export async function getFundList({ key, name, type }) {
  const res = await Api.get(`/api/funds/${type}/${key}/sip`)
  if (
    res.pfwresponse.result.message === 'success' &&
    res.pfwresponse.status_code === 200
  ) {
    return res.pfwresponse.result.funds
  }
  throw new Error(res.pfwresponse.result.message || genericErrorMessage)
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
