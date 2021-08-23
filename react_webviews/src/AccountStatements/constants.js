export const ACCOUNT_STATEMENT_OPTIONS = [
  {
    type: 'contract',
    title: 'Contract notes',
    subtitle: 'View details of your share purchsases',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        { type: 'fin-year' },
        {
          type: 'date-select',
          title: 'From date',
          dateType: 'from',
        },
        {
          type: 'date-select',
          title: 'To date',
          dateType: 'to',
        },
      ]
    }
  },
  {
    type: 'pnl',
    title: 'P&L statements',
    subtitle: 'Track profit and loss on your trades',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        {
          type: 'radio',
          options: [
            {
              value: 'equity',
              name: 'Equity',
            }, {
              value: 'fno',
              name: 'F&O'
            }
          ],
        },
        { type: 'fin-year' },
        {
          type: 'date-select',
          title: 'From date',
          dateType: 'from',
        },
        {
          type: 'date-select',
          title: 'To date',
          dateType: 'to',
        },
      ]
    }
  },
  {
    type: 'transaction',
    title: 'Transaction statement',
    subtitle: 'View historical transactions',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        { type: 'fin-year' },
        {
          type: 'date-select',
          title: 'From date',
          dateType: 'from',

        },
        {
          type: 'date-select',
          title: 'To date',
          dateType: 'to',
        },
      ]
    }
  },
  {
    type: 'ledger',
    title: 'Ledger statement',
    subtitle: 'Track your ledger balances & fund movements',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        { type: 'fin-year' },
        {
          type: 'date-select',
          dateType: 'from',
          title: 'From date'
        },
        {
          type: 'date-select',
          dateType: 'to',
          title: 'To date'
        },
      ]
    }
  },
  {
    type: 'demat-holdings',
    title: 'Demat holdings statement',
    subtitle: 'View your stocks and holdings',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        {
          type: 'date-select',
          dateType: 'date'
        },
      ]
    }
  },
  {
    type: 'capital-gains',
    title: 'Capital gains statement',
    subtitle: 'Track short term & long term gains',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        { type: 'fin-year' },
      ]
    }
  },
  {
    type: 'form-10db',
    title: 'Form 10DB',
    subtitle: 'View your STT payments',
    withIcon: false,
    withRuler: false,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        { type: 'fin-year' },
      ]
    }
  },
];


export const FINANCIAL_YEAR_OPTIONS = [{
  name: '2019-20',
  value: '2019-20',
}, {
  name: '2020-21',
  value: '2020-21',
}, {
  name: '2021-22',
  value: '2021-22',
}, {
  name: '2022-23',
  value: '2022-23',
}];