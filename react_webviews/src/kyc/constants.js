export const apiConstants = {
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
  getKRAForm: '/api/kyc/formfiller2/kraformfiller/get_kraform',
  sendOtp: '/api/communication/send/otp',
  resendOtp: '/api/communication/resend/otp',
  verifyOtp: '/api/communication/verify/otp',
  socialAuth: '/api/communication'
}

export const getPathname = {
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
  tradingExperience: '/kyc/trading-experience',
}

export const storageConstants = {
  USER: 'user',
  KYC: 'kyc',
  BANK_MANDATES: 'bank_mandates',
  CHANGE_REQUEST: 'change_requests',
  NATIVE: 'native',
  AUTH_IDS: 'auth_ids',
}

export const docMapper = {
  DL: "Driving license",
  PASSPORT: "Passport",
  AADHAAR: "Aadhaar card",
  VOTER_ID_CARD: "Voter ID",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook",
};

export const nriDocMapper = {
  DL: "Driving license",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook",
}

export const occupationOptions = [
  {
    name: "Private Sector",
    value: "PRIVATE SECTOR",
  },
  {
    name: "Professional",
    value: "PROFESSIONAL",
  },
  {
    name: "Business",
    value: "BUSINESS",
  },
  {
    name: "House Wife",
    value: "HOUSE WIFE",
  },
  {
    name: "Public Sector",
    value: "PUBLIC SECTOR",
  },
  {
    name: "Government",
    value: "GOVERNMENT",
  },
  {
    name: "Student",
    value: "STUDENT",
  },
  {
    name: "Retired",
    value: "RETIRED",
  },
  {
    name: "Others",
    value: "OTHERS",
  },
];

export const incomeOptions = [
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

export const residentialOptions = [
  {
    name: 'Indian',
    value: 'INDIAN',
  },
  {
    name: 'Non indian',
    value: 'NON INDIAN',
  },
];

export const relationshipOptions = [
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

export const reportCardDetails = [
  {
    key: "personal",
    title: "Personal details",
    click_image: "plus_icon.svg",
  },
  {
    key: "professional",
    title: "Professional details",
    click_image: "plus_icon.svg",
  },
  {
    key: "address",
    title: "Address details",
    click_image: "plus_icon.svg",
  },
  {
    key: "nominee",
    title: "Nominee details",
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

export const genderOptions = [
  { name: "Male", value: "MALE" },
  { name: "Female", value: "FEMALE" },
  { name: "Transgender", value: "TRANSGENDER" },
];

export const maritalStatusOptions = [
  { name: "Single", value: "SINGLE" },
  { name: "Married", value: "MARRIED" },
  { name: "Unmarried", value: "UNMARRIED" },
];

export const occupationTypeOptions = [
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

export const kycDocNameMapper = {
  DL: 'Driving license',
  PASSPORT: 'Passport',
  AADHAAR: 'Aadhaar card',
  VOTER_ID_CARD: 'Voter ID',
  UTILITY_BILL: 'Gas receipt',
  LAT_BANK_PB: 'Passbook',
}

export const kycNRIDocNameMapper = {
  DL: "Driving license",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook"
};

export const verificationDocOptions = [
  { name: 'Bank statement', value: 'bankstatement' },
  { name: 'Cancelled cheque', value: 'cheque' },
  { name: 'First page of passbook', value: 'passbook' },
]

export const addressProofOptions = [
  { name: "Driving license", value: "DL" },
  { name: "Passport", value: "PASSPORT" },
  { name: "Aadhaar card", value: "AADHAAR" },
  { name: "Voter ID", value: "VOTER_ID_CARD" },
  { name: "Gas receipt", value: "UTILITY_BILL" },
  { name: "Passbook", value: "LAT_BANK_PB" }
];

export const nriAddressProofOptions = [
  { name: "Driving license", value: "DL" },
  { name: "Passport", value: "PASSPORT" },
  { name: "Passport", value: "PASSPORT" } 
]

export const dlDocs = [
  {name: 'Aadhaar Card', icon: 'ic_aadhaar_card'},
  {name: 'Pan Card', icon: 'ic_pan_card'},
  {name: 'Address Details', icon: 'ic_address_details'}
]

export const companyDetails = {
  NAME: "Finwizard technology Private Ltd.",
  ADDRESS: "Queens Paradise, No. 16/1, 1st Floor, Curve Rd, Shivaji Nagar, Bengaluru, Karnataka 560051"
}

export const SUPPORTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'bmp'];

export const eqkycDocsGroupMapper = {
  "equity_pan": {
    title: "PAN details",
    doc: "PAN card"
  },
  "sign": {
    title: "Signature",
    doc: "Signature"
  },
  "equity_identification": {
    title: "Personal details",
    doc: "Selfie"
  },
  "address": {
    title: "Address details",
    doc: ""
  },
  "ipvvideo": {
    title: "IPV video",
    doc: "IPV video"
  },
  "bank": {
    title: "Bank account",
    doc: ""
  },
  "nri_address": {
    title: "NRI Address Details",
    doc: ""
  }
};