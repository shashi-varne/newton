// Temporary file for development : contains expected mock api data

export const referralMockData = [
  {
    title: "Demat account",
    subtitle: "Earn ₹150 for every friend who opens an account",
    expiryDescription: "Expires on 18 May 22",
    isExpiringSoon: false,
    amount: "150",
    dataAid: "dematAccount",
    bottomSheetData: {
      title: "Refer & earn cash rewards",
      dataAid: "trading&Demat",
      stepsData: [
        { text: "Refer a friend to open a Trading & Demat account" },
        {
          text: `Your friend opens an account`,
        },
        { text: "You get ₹150 " },
      ],
    },
  },
  {
    title: "Mutual funds",
    subtitle: "Earn ₹100 for every friend who makes an investment",
    expiryDescription: "Expiring in 24 hours",
    isExpiringSoon: true,
    amount: "100",
    dataAid: "mutualFunds",
    bottomSheetData: {
      title: "Refer & earn cash rewards",
      dataAid: "mutualFunds",
      stepsData: [
        { text: "Refer a friend to invest in Equity mutual funds" },
        {
          text: `Your friend starts an SIP of ₹1,000 & authorises a bank mandate or makes a Lumpsum investment of ₹5,000`,
        },
        { text: "You get ₹100" },
      ],
    },
  },
  {
    title: "Freedom plan ",
    subtitle: "Earn ₹150 for every friend who buys a Freedom plan ",
    expiryDescription: "Expires on 18 May 22",
    isExpiringSoon: false,
    amount: "100",
    dataAid: "freedomPlan",
    bottomSheetData: {
      title: "Refer & earn cash rewards",
      dataAid: "mutualFunds",
      stepsData: [
        { text: "Refer a friend to invest in Equity mutual funds" },
        {
          text: `Your friend starts an SIP of ₹1,000 & authorises a bank mandate or makes a Lumpsum investment of ₹5,000`,
        },
        { text: "You get ₹100" },
      ],
    },
  },
];
