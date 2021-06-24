import { getConfig } from 'utils/functions'

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
      title: 'Secure & Safe ',
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