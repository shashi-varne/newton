export const withdrawTiles = [
  { title: 'Total balance', amount: '₹ 7,76,574' },
  { title: 'Pending Switch', amount: '₹ 0' },
  { title: 'Pending Redemption', amount: '₹ 0' },
]

export const withdrawOptions = [
  { title: 'Instant Withdraw', desc: 'Get the amount within 30 mins', redirectUrl: 'insta-redeem', openModal: false },
  {
    title: 'System Selected',
    desc: 'System selected funds optimized for your portfolio.',
    redirectUrl: 'systematic',
    openModal: true
  },
  {
    title: 'Manual',
    desc: 'You can choose specific funds from which you want to withdraw',
    redirectUrl: 'self',
    openModal: false
  },
]

export const disclaimers = [
  '* Actual withdrawal may differ slightly as it depends on NAV',
  '* Actual withdrawal may differ slightly as it depends on NAV',
  '* Actual withdrawal may differ slightly as it depends on NAV'
]
