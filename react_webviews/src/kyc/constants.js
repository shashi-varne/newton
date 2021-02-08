export const apiConstants = {
  getPan: "/api/kyc/checkv2/mine",
  submit: "/api/kyc/v2/mine",
};

export const getPathname = (name) => {
  let pathnames = {
    aadhar: "/kyc/aadhar",
    aadharConfirmation: "/kyc/aadhar/confirmation",
  };
  return pathnames[name] || "";
};

export const storageConstants = {
  USER: "user",
  KYC: "kyc",
};

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
    name: "Indian",
    value: true,
  },
  {
    name: "Non indian",
    value: false,
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
