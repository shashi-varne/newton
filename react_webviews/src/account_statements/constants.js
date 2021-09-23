export const ACCOUNT_STATEMENT_OPTIONS = [
  // {
  //   type: 'contract',
  //   title: 'Contract notes',
  //   subtitle: 'View details of your share purchsases',
  //   withIcon: false,
  //   withRuler: true,
  //   pageProps: {
  //     // subtitle: // Use only if custom subtitle is required,
  //     fields: [
  //       {
  //         type: 'fin-year',
  //         paramName: 'fiscal_year'
  //       },
  //       {
  //         type: 'date-select',
  //         dateType: 'from',
  //         paramName: 'dt_start'
  //       },
  //       {
  //         type: 'date-select',
  //         dateType: 'to',
  //         paramName: 'dt_end'
  //       },
  //     ]
  //   }
  // },
  {
    type: 'profit_loss',
    title: 'P&L statements',
    subtitle: 'Track profit and loss on your trades',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      fields: [
        {
          type: 'radio',
          paramName: 'segment_type',
          options: [
            {
              value: 'cash',
              name: 'Equity',
            }, {
              value: 'fno',
              name: 'F&O'
            }
          ],
        },
        {
          type: 'fin-year',
          paramName: 'fiscal_year'
        },
        {
          type: 'date-select',
          dateType: 'from',
          paramName: 'dt_start',
          fieldProps: {
            label: 'Enter date you want statement from'
          }
        },
        {
          type: 'date-select',
          dateType: 'to',
          paramName: 'dt_end',
          fieldProps: {
            label: 'Enter date you want statement till'
          }
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
        {
          type: 'fin-year',
          paramName: 'fiscal_year'
        },
        {
          type: 'date-select',
          dateType: 'from',
          paramName: 'dt_start',
          fieldProps: {
            label: 'Enter date you want statement from'
          }
        },
        {
          type: 'date-select',
          dateType: 'to',
          paramName: 'dt_end',
          fieldProps: {
            label: 'Enter date you want statement till'
          }
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
        {
          type: 'fin-year',
          paramName: 'fiscal_year'
        },
        {
          type: 'date-select',
          dateType: 'from',
          paramName: 'dt_start',
          fieldProps: {
            label: 'Enter date you want statement from'
          }
        },
        {
          type: 'date-select',
          dateType: 'to',
          paramName: 'dt_end',
          fieldProps: {
            label: 'Enter date you want statement till'
          }
        },
      ]
    }
  },
  {
    type: 'demat_holding',
    title: 'Demat holdings statement',
    subtitle: 'View your stocks and holdings',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      infoText: 'Statement will be generated as of current date',
      fields: [
        {
          type: 'date-select',
          dateType: 'date',
          paramName: 'dt_end',
          fieldProps: {
            disabled: true,
            label: 'Holdings as of',
          }
        },
      ]
    }
  },
  {
    type: 'capital_gains',
    title: 'Capital gains statement',
    subtitle: 'Track short term & long term gains',
    withIcon: false,
    withRuler: true,
    pageProps: {
      // subtitle: // Use only if custom subtitle is required,
      infoText: 'Statement will be generated for selected financial year period',
      fields: [
        {
          type: 'fin-year',
          paramName: 'fiscal_year'
        },
        {
          type: 'date-select',
          dateType: 'from',
          paramName: 'dt_start',
          fieldProps: {
            label: 'Enter date you want statement from',
            disabled: true
          }
        },
        {
          type: 'date-select',
          dateType: 'to',
          paramName: 'dt_end',
          fieldProps: {
            label: 'Enter date you want statement till',
            disabled: true
          }
        },
      ]
    }
  },
  // {
  //   type: 'form-10db',
  //   title: 'Form 10DB',
  //   subtitle: 'View your STT payments',
  //   withIcon: false,
  //   withRuler: false,
  //   pageProps: {
  //     // subtitle: // Use only if custom subtitle is required,
  //     fields: [
  //       {
  //         type: 'fin-year',
  //         paramName: 'fiscal_year'
  //       }
  //     ]
  //   }
  // },
];