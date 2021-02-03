import Api from '../utils/api'
import { isEmpty, storageService } from '../utils/validators'

export async function getAccountSummary(params = {}) {
  const url = '/api/user/account/summary'
  if (isEmpty(params)) {
    params = {
      campaign: ['user_campaign'],
      kyc: ['kyc'],
      user: ['user'],
      nps: ['nps_user'],
      partner: ['partner'],
      bank_list: ['bank_list'],
      referral: ['subbroker', 'p2p'],
    }
  }
  const response = await Api.post(url, params)
  if (
    response.pfwresponse.status_code === 200 &&
    response.pfwresponse.result.message === 'success'
  ) {
    return response.pfwresponse.result
  } else {
    throw new Error(response.result.message)
  }
}

export async function getNpsInvestMentStatus() {
  const url = '/api/nps/invest/status/v2'
  const response = await Api.get(url)
  if (
    response.pfwresponse.status_code === 200 &&
    response.pfwresponse.result.message === 'success'
  ) {
    return response.pfwresponse.result.data
  } else {
    throw new Error(response.result.message)
  }
}

export async function initData() {
  const currentUser = storageService().get('currentUser')
  const user = storageService().getObject('user')
  const kyc = storageService().getObject('kyc')

  if (currentUser && user && kyc) {
    const result = await getAccountSummary()
    
  }
}

async function _setSummaryData(result) {
  const currentUser = result.data.user.user.data
  const userKyc = result.data.kyc.kyc.data
  if (userKyc.firstlogin) {
    storageService().set('firstlogin', true)
  }
  storageService().set('currentUser', true)
  storageService().set('user', currentUser)
  storageService().set('kyc', userKyc)
}
