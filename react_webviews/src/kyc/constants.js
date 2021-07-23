export const API_CONSTANTS = {
  accountSummary: '/api/user/account/summary',
  getPan: '/api/kyc/checkv2/mine',
  submit: '/api/kyc/v2/mine',
  getMyaccount: '/api/iam/myaccount',
  getIFSC: '/api/ifsc/',
  addAdditionalBank: '/api/kyc/bank/add/additionalbank/mine',
  pennyVerification: '/api/account/add-bank/penny-verification',
  getBankStatus: '/api/account/penny-verification-status-check',
  getCVL: '/api/kyc/updatecvl/mine',
  getMerge: '/api/user/account/merge?pan_number=',
}

export const PATHNAME_MAPPER = {
  invest: '/invest',
  landing: '/',
  accountMerge: '/account/merge/',
  homeKyc: '/kyc/home',
  aadhar: '/kyc/aadhar',
  aadharConfirmation: '/kyc/aadhar/confirmation',
  bankList: '/kyc/add-bank',
  addBank: '/kyc/approved/banks/doc/',
  bankDetails: '/kyc/add-bank/details/',
  addBankVerify: '/kyc/approved/banks/verify/',
  journey: '/kyc/journey',
  compliantPersonalDetails1: '/kyc/compliant-personal-details',
  compliantPersonalDetails2: '/kyc/compliant-personal-details2',
  compliantPersonalDetails3: '/kyc/compliant-personal-details3',
  compliantPersonalDetails4: '/kyc/compliant-personal-details4',
  confirmPan: '/kyc/compliant-confirm-pan',
  compliantKycComplete: '/kyc/compliant-report-complete',
  compliantReport: '/kyc/compliant-report-details',
  uploadProgress: '/kyc/upload/progress',
  kycReport: '/kyc/report',
  rtaCompliantPersonalDetails: '/kyc/rta-compliant-personal-details',
  personalDetails1: '/kyc/personal-details1',
  personalDetails2: '/kyc/personal-details2',
  personalDetails3: '/kyc/personal-details3',
  personalDetails4: '/kyc/personal-details4',
  addressDetails1: '/kyc/address-details1',
  addressDetails2: '/kyc/address-details2',
  digilockerPersonalDetails1: '/kyc/dl/personal-details1',
  digilockerPersonalDetails2: '/kyc/dl/personal-details2',
  digilockerPersonalDetails3: '/kyc/dl/personal-details3',
  uploadSign: '/kyc/upload/sign',
  changeAddressDetails1: '/kyc/change-address-details1',
  changeAddressDetails2: '/kyc/change-address-details2',
  nriAddressDetails1: '/kyc/nri-address-details1',
  nriAddressDetails2: '/kyc/nri-address-details2',
  uploadPan: '/kyc/upload/pan',
  kycEsign: '/kyc-esign/info',
  uploadAddress: '/kyc/upload/address',
  uploadNriAddress: '/kyc/upload/address-nri',
  uploadSelfie: '/kyc/upload/selfie',
  uploadSelfieVideo: '/kyc/upload/selfie_video',
}

export const STORAGE_CONSTANTS = {
  USER: 'user',
  KYC: 'kyc',
  BANK_MANDATES: 'bank_mandates',
  CHANGE_REQUEST: 'change_requests',
  NATIVE: 'native',
  AUTH_IDS: 'auth_ids',
}

export const DOCUMENTS_MAPPER = {
  DL: "Driving license",
  PASSPORT: "Passport",
  AADHAAR: "Aadhaar card",
  VOTER_ID_CARD: "Voter ID",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook",
};

export const NRI_DOCUMENTS_MAPPER = {
  DL: "Driving license",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook",
}

export const INCOME_OPTIONS = [
  {
    name: "Below 1L",
    value: "BELOW 1L",
  },
  {
    name: "1-5L",
    value: "1-5L",
  },
  {
    name: "5-10L",
    value: "5-10L",
  },
  {
    name: "10-25L",
    value: "10-25L",
  },
  {
    name: "25-100L",
    value: "25-100L",
  },
  {
    name: ">100L",
    value: ">100L",
  },
];

export const RESIDENTIAL_OPTIONS = [
  {
    name: 'Indian',
    value: 'INDIAN',
  },
  {
    name: 'Non indian',
    value: 'NON INDIAN',
  },
];

export const RELATIONSHIP_OPTIONS = [
  {
    name: "Wife",
    value: "WIFE",
  },
  {
    name: "Husband",
    value: "HUSBAND",
  },
  {
    name: "Mother",
    value: "MOTHER",
  },
  {
    name: "Father",
    value: "FATHER",
  },
  {
    name: "Other",
    value: "OTHER",
  },
];

export const REPORT_CARD_DETAILS = [
  {
    key: "personal",
    title: "Personal",
    click_image: "plus_icon.svg",
  },
  {
    key: "address",
    title: "Address",
    click_image: "plus_icon.svg",
  },
  {
    key: "nominee",
    title: "Nominee",
    click_image: "plus_icon.svg",
  },
  {
    key: "bank",
    title: "Bank details",
    click_image: "plus_icon.svg",
  },
  {
    key: "docs",
    title: "Documents",
    click_image: "next_arrow_icon.svg",
  },
];

export const bankAccountTypeOptions = (isNri) => {
  let account_types = [];
  if (!isNri) {
    account_types = [
      {
        value: "CA",
        name: "Current Account",
      },
      {
        value: "CC",
        name: "Cash Credit",
      },
      {
        value: "SB",
        name: "Savings Account",
      },
    ];
  } else {
    account_types = [
      {
        value: "SB-NRE",
        name: "Non Resident External Account (NRE)",
      },
      {
        value: "SB-NRO",
        name: "Non Resident Ordinary Account (NRO)",
      },
    ];
  }

  return account_types;
};

export const GENDER_OPTIONS = [
  { name: "Male", value: "MALE" },
  { name: "Female", value: "FEMALE" },
  { name: "Transgender", value: "TRANSGENDER" },
];

export const MARITAL_STATUS_OPTIONS = [
  { name: "Single", value: "SINGLE" },
  { name: "Married", value: "MARRIED" },
  { name: "Unmarried", value: "UNMARRIED" },
];

export const OCCUPATION_TYPE_OPTIONS = [
  { name: "Salaried", value: "SALARIED" },
  { name: "Self employed", value: "SELF EMPLOYED" },
  { name: "Business", value: "BUSINESS" },
  { name: "Agriculturist", value: "AGRICULTURIST" },
  { name: "Professional", value: "PROFESSIONAL" },
];

export const getIfscCodeError = (code) => {
  switch (code) {
    case "lvb":
      return "Please enter a valid ifsc code of Lakshmi Vilas Bank";
    case "cub":
      return "Please enter a valid ifsc code of City Union Bank";
    case "ippb":
      return "Please enter a valid ifsc code of India Post Payments Bank";
    default:
      return "Please enter a valid ifsc code";
  }
}

export const VERIFICATION_DOC_OPTIONS = [
  { name: 'Bank statement', value: 'bankstatement' },
  { name: 'Cancelled cheque', value: 'cheque' },
  { name: 'First page of passbook', value: 'passbook' },
]

export const ADDRESS_PROOF_OPTIONS = [
  { name: "Driving license", value: "DL" },
  { name: "Passport", value: "PASSPORT" },
  { name: "Aadhaar card", value: "AADHAAR" },
  { name: "Voter ID", value: "VOTER_ID_CARD" },
  { name: "Gas receipt", value: "UTILITY_BILL" },
];

export const NRI_ADDRESS_PROOF_OPTIONS = [
  { name: "Driving license", value: "DL" },
  { name: "Passport", value: "PASSPORT" },
  { name: "Passport", value: "PASSPORT" } 
]

export const DL_DOCS = [
  {name: 'Aadhaar Card', icon: 'ic_aadhaar_card'},
  {name: 'Pan Card', icon: 'ic_pan_card'},
  {name: 'Address Details', icon: 'ic_address_details'}
]

export const SUPPORTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'bmp'];