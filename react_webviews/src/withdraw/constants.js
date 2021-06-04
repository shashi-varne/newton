

export const withdrawOptions = [
  { title: 'Instant Withdraw', desc: 'Get the amount within 30 mins', redirectUrl: '/withdraw/insta-redeem', openModal: false },
  {
    title: 'System Selected',
    desc: 'System selected funds optimized for your portfolio.',
    redirectUrl: '/withdraw/systematic',
    openModal: true
  },
  {
    title: 'Manual',
    desc: 'You can choose specific funds from which you want to withdraw',
    redirectUrl: '/withdraw/manual',
    openModal: false
  },
]

export const disclaimers = [
  '* Actual withdrawal may differ slightly as it depends on NAV',
  '* Actual withdrawal may differ slightly as it depends on NAV',
  '* Actual withdrawal may differ slightly as it depends on NAV'
]
