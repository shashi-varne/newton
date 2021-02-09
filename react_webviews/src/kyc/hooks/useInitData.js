import { useEffect, useState } from 'react'
import { isEmpty, storageService } from '../../utils/validators'

import { getAccountSummary, getNPSInvestmentStatus } from '../services'

function useInitData() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentUser, _setCurrentUser] = useState(false)
  const [user, _setUser] = useState(false)
  const [kyc, _setKyc] = useState(storageService().getObject('kyc') || null)
  const [npsUser, _setNpsUser] = useState(
    storageService().getObject('npsUser') || null
  )
  const [referral, _setReferral] = useState(
    storageService().getObject('referral') || []
  )
  const [firstlogin, _setFirstlogin] = useState(
    storageService().getObject('firstlogin')
  )
  const [banklist, _setBanklist] = useState(
    storageService().getObject('banklist') || []
  )
  const [npsData, _setNpsData] = useState(
    storageService().get('nps_additional_details_required')
  )
  const [campaign, _setCampaign] = useState(
    storageService().get('campaign') || []
  )

  useEffect(() => {
    syncData()
  }, [])

  const setNpsData = (flag) => {
    _setNpsData((prevFla) => flag)
    storageService().set('nps_additional_details_required', flag)
  }

  const setKyc = (kyc) => {
    _setKyc(() => ({ ...kyc }))
    storageService().setObject('kyc', kyc)
  }

  const setBanklist = (list) => {
    _setBanklist((list) => [...list])
    storageService().setObject('banklist', list)
  }

  const setNpsUser = (npsUser) => {
    _setNpsUser(() => ({ ...npsUser }))
    storageService().setObject('npsUser', user)
  }

  const setReferral = (referral) => {
    _setReferral(() => ({ ...referral }))
    storageService().setObject('referral', referral)
  }

  const setUser = (user) => {
    _setUser(() => ({ ...user }))
    storageService().setObject('user', user)
  }

  const setFirstLogin = (firstlogin) => {
    _setFirstlogin(() => firstlogin)
    storageService().setObject('firstlogin', firstlogin)
  }

  const setCurrentUser = (currentUser) => {
    _setCurrentUser(() => ({ ...currentUser }))
    storageService().set('currentUser', currentUser)
  }

  async function syncData() {
    console.log(!!referral)
    if (currentUser && user && kyc) {
      if (!referral) {
        const queryParams = {
          campaign: ['user_campaign'],
          nps: ['nps_user'],
          bank_list: ['bank_list'],
          referral: ['subbroker', 'p2p'],
        }
        setLoading(true)
        try {
          const result = await getAccountSummary(queryParams)
          console.log(result)
          const npsUser = result.data.nps.nps_user.data
          const banklist = result.data.bank_list.data
          const referral = result.data.referral
          setBanklist(banklist)
          setReferral(referral)
          setNpsUser(npsUser)
          setLoading(false)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
    } else {
      const queryParams = {
        campaign: ['user_campaign'],
        kyc: ['kyc'],
        user: ['user'],
        nps: ['nps_user'],
        partner: ['partner'],
        bank_list: ['bank_list'],
        referral: ['subbroker', 'p2p'],
      }
      setLoading(true)
      try {
        const [result, npsResult] = await Promise.all([
          getAccountSummary(queryParams),
          getNPSInvestmentStatus(),
        ])
        console.log(result, npsResult)
        const user = result.data.user.user.data
        const kyc = result.data.kyc.kyc.data
        let firstlogin = false
        if (kyc.firstlogin) {
          firstlogin = true
        } else {
          firstlogin = false
        }
        const nps_additional_details_required =
          npsResult?.data?.user?.user?.data?.nps_investment &&
          npsResult?.data?.nps?.nps_user?.data?.is_doc_required
            ? true
            : false

        setUser(user)
        setKyc(kyc)
        setFirstLogin(firstlogin)
        setNpsData(nps_additional_details_required)
        setLoading(false)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    loading,
    error,
    kyc,
    npsUser,
    currentUser,
    npsData,
    firstlogin,
    setKyc,
    setNpsData,
    setNpsUser,
    setBanklist,
    setUser,
    setCurrentUser,
    setFirstLogin,
  }
}

export default useInitData
