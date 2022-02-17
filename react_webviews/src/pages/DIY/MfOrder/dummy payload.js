const onetime = {
  investment: {
    amount: 10000,
    type: 'diy',
    allocations: [
      {
        mfid: 'INF760K01AR3',
        mfname: 'CANARA ROBECO BLUE CHIP EQUITY FUND - REGULAR PLAN - GROWTH OPTION',
        amount: 5000,
      },
      { mfid: 'INF397L01869', mfname: 'IDBI India Top 100 Equity Fund Growth', amount: 5000 },
    ],
  },
};

const sip = {
  investment: {
    amount: 10000,
    type: 'diysip',
    allocations: [
      {
        mfid: 'INF760K01AR3',
        mfname: 'CANARA ROBECO BLUE CHIP EQUITY FUND - REGULAR PLAN - GROWTH OPTION',
        amount: 5000,
        default_date: 10,
        sip_dates: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
          26, 27, 28,
        ],
        sip_date: 10,
      },
      {
        mfid: 'INF397L01869',
        mfname: 'IDBI India Top 100 Equity Fund Growth',
        amount: 5000,
        default_date: 10,
        sip_dates: [1, 5, 10, 15, 20, 25],
        sip_date: 10,
      },
    ],
  },
};
