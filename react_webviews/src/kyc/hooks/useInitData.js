import React, { useEffect, useState } from 'react'
import { storageService } from '../../utils/validators'

import {
  getAccountSummary,
  getCampaignBySection,
  getNPSInvestmentStatus,
} from '../services'

function useInitData() {
  const [state, setState] = useState({
    loading: false,
    error: '',
    currentUser: storageService().get('currentUser'),
    user: storageService().get('user') || null,
    kyc: storageService().get('kyc') || null,
    referral: storageService().get('referral') || null,
    firstlogin: storageService().get('firstlogin'),
    campaign: storageService().get('campaign') || [],
    npsUser: storageService().get('npsUser') || [],
    banklist: storageService().get('banklist') || [],
    referral: storageService().get('referral') || [],
    nps_additional_details_required: storageService().get(
      'nps_additional_details_required'
    ),
  })

  useEffect(() => {
    const { kyc, user, npsUser } = state
    if (!!kyc || !!user || !!npsUser) {
      syncData()
    }
  }, [])

  const setError = (message) => {
    setState((prevState) => ({ ...prevState, error: message }))
  }

  const setLoading = (loading) => {
    setState((prevState) => ({
      ...prevState,
      loading,
    }))
  }

  const setNpsData = (flag) => {
    setState((prevState) => ({
      ...prevState,
      nps_additional_details_required: flag,
    }))
    storageService().set('nps_additional_details_required', flag)
  }

  const setKyc = (kyc) => {
    setState((prevState) => ({
      ...prevState,
      kyc,
    }))
    storageService().setObject('kyc', kyc)
  }

  const setBanklist = (list) => {
    setState((prevState) => ({
      ...prevState,
      banklist: list,
    }))
    storageService().setObject('banklist', list)
  }

  const setNpsUser = (user) => {
    setState((prevState) => ({ ...prevState, npsUser: user }))
    storageService().setObject('npsUser', user)
  }

  const setReferral = (referral) => {
    setState((prevState) => ({
      ...prevState,
      referral,
    }))
    storageService().setObject('referral', referral)
  }

  const setUser = (user) => {
    setState((prevState) => ({
      ...prevState,
      user,
    }))
    storageService().setObject('user', user)
  }

  const setFirstLogin = (firstlogin) => {
    setState((prevState) => ({
      ...prevState,
      firstlogin,
    }))
    storageService().setObject('firstlogin', firstlogin)
  }

  const setCurrentUser = (currentUser) => {
    setState((prevState) => ({
      ...prevState,
      currentUser,
    }))
    storageService().set('currentUser', currentUser)
  }

  async function syncData() {
    const { currentUser, user, kyc, referral } = state
    console.log(!!referral)
    if (!!currentUser && !!user && !!kyc) {
      if (!!referral) {
        const queryParams = {
          campaign: ['user_campaign'],
          nps: ['nps_user'],
          bank_list: ['bank_list'],
          referral: ['subbroker', 'p2p'],
        }
        setState((prevState) => ({ ...prevState, loading: true }))
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
    ...state,
  }
}

export default useInitData
