import { getConfig } from 'utils/functions'
import { storageService } from '../../utils/validators'

import {
  ITR_APPLICATIONS_KEY,
  ITR_BACK_BUTTON_TRACKER_KEY,
  ITR_ID_KEY,
  ITR_TYPE_KEY,
  USER_SUMMARY_KEY,
} from '../constants'
export function navigate(pathname, params, replace = false) {
  if (!replace) {
    this.history.push({
      pathname,
      search: getConfig().searchParams,
      params,
    })
  } else {
    this.history.replace({
      pathname,
      search: getConfig().searchParams,
      params,
    })
  }
}

export const getTaxFilingFeatureLists = () => {
  const productName = getConfig().productName
  return [
    {
      frontImage: require('assets/icn_secure_safe.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: 'Secure & Safe',
      subtitle: 'Income tax department authorized platform',
    },
    {
      frontImage: require('assets/icn_tax_savings.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: 'Maximum tax savings',
      subtitle: 'Get every tax deduction you are eligible for',
    },
    {
      frontImage: require('assets/icn_calculator.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: '100% accuracy',
      subtitle: 'Precise calculations to avoid overpaying of taxes',
    },
  ]
}

export const trackBackButtonPress = (pathname) => {
  const allowedPaths = [
    '/tax-filing/steps',
    '/tax-filing/my-itr',
    '/tax-filing/faqs',
  ]
  if (allowedPaths.includes(pathname)) {
    storageService().setObject(ITR_BACK_BUTTON_TRACKER_KEY, {
      backButton: true,
    })
  } else {
    storageService().setObject(ITR_BACK_BUTTON_TRACKER_KEY, {
      backButton: false,
    })
  }
}

export const untrackBackButtonPress = () => {
  storageService().setObject(ITR_BACK_BUTTON_TRACKER_KEY, { backButton: false })
}

export const removeBackButtonTracker = () => {
  storageService().remove(ITR_BACK_BUTTON_TRACKER_KEY)
}

export const initBackButtonTracker = () => {
  const config = storageService().getObject(ITR_BACK_BUTTON_TRACKER_KEY)
  if (!config) {
    storageService().setObject(ITR_BACK_BUTTON_TRACKER_KEY, {
      backButton: false,
    })
  }
}

export const checkIfLandedByBackButton = () => {
  const config = storageService().getObject(ITR_BACK_BUTTON_TRACKER_KEY)
  return config?.backButton
}

export const setITRJourneyType = (type) => {
  storageService().set(ITR_TYPE_KEY, type)
}

export const setITRID = (itrId) => {
  storageService().set(ITR_ID_KEY, itrId)
}

export const clearITRSessionStorage = () => {
  storageService().remove(ITR_BACK_BUTTON_TRACKER_KEY)
  storageService().remove(ITR_ID_KEY)
  storageService().remove(ITR_TYPE_KEY)
  storageService().remove(ITR_APPLICATIONS_KEY)
  storageService().remove(USER_SUMMARY_KEY)
}
