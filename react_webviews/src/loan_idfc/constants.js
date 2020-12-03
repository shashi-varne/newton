import { getConfig } from "utils/functions";
import { capitalizeFirstLetter } from "../utils/validators"
let productName = capitalizeFirstLetter(getConfig().productName);

export function goBackMap(path) {
    let mapper = {
      '/loan/idfc/journey': '/loan/idfc/home',
      '/loan/idfc/application-summary': '/loan/idfc/journey',
      '/loan/idfc/personal-details': '/loan/idfc/home',
      '/loan/idfc/professional-details': '/loan/idfc/basic-details'
    }

  return mapper[path] || false;
}

export function getCssMapperReport(vendor_info) {

  let cssMapper = {
    'callback_awaited_disbursement_approval': {
      color: 'green',
      disc: 'Approved'
    },
    'disbursement_approved': {
      color: 'yellow',
      disc: 'Pending For Disbursal'
    },
    'complete': {
      color: 'green',
      disc: 'Disbursed'
    }
  }


  let obj = {}
  obj.status = vendor_info.dmi_loan_status;

  obj.cssMapper = cssMapper[obj.status] || cssMapper['callback_awaited_disbursement_approval'];

  return obj;
}

export const idfc_config = {
  key: 'idfc',
  get_next: {
    landing_screen: 'edit-number',
    know_more_screen: 'edit-number',
    calculator: 'edit-number',
    mobile_verification: 'otp-verify',
    otp_verify: 'basic-details',
    basic_details: 'professional-details',
    professional_details_screen: 'journey',
    personal_details_screen: 'address-details',
    address_details: 'journey',
    bt_info_screen: 'loan-bt-details',
    additional_details: 'upload-documents',
    requirement_details_screen: 'loan-status'
  },
  landing_screen: {
    stepContentMapper: {
      title: 'Top features',
      options: [
        { 'icon': 'icn_b_1', 'subtitle': 'Interest rates starting as low as 10.75% pa' },
        { 'icon': 'icn_b_2', 'subtitle': 'Instant eligibility and sanction in less than 4 hrs' },
        { 'icon': 'icn_b_3', 'subtitle': 'Flexible loan tenure up to 60 months' }
      ]
    },
    journeyData: {
      title: 'Personal loan in just 5 steps',
      options: [
        { 'step': '1', 'title': 'Enter basic details', 'subtitle': 'Fill in personal and work details to get started with your loan application.' },
        { 'step': '2', 'title': 'Create loan application', 'subtitle': 'Provide/confirm your personal and address details to proceed with your loan application.' },
        { 'step': '3', 'title': 'Provide income details', 'subtitle': 'Enter your loan requirements and income details to get the best loan offer.' },
        { 'step': '4', 'title': 'Upload documents', 'subtitle': 'Provide your office address and upload documents to get your loan sanctioned.' },
        { 'step': '5', 'title': 'Sanction and disbursal', 'subtitle': 'IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.' }
      ]
    },
    faqsInfo: {
      'header_title': 'Frequently asked questions',
      'cta_title': 'OK',
      faqs: [
        {
          'header_title': 'Personal Loan from IDFC FIRST Bank',
          options: [
            {
              'title': `Is ${productName} the lender?`,
              'subtitle': `No, ${productName} is not the lender. It is IDFC FIRST Bank who is offering credit to the users of our app. We have a contractual partnership with IDFC FIRST Bank and we will only facilitate your loan application for availing credit.
              <br> <br> <b>Note</b>: Any credit facility offered to you by IDFC FIRST Bank on the ${productName} app shall be governed by Terms and Conditions agreed between you and IDFC FIRST Bank, and ${productName} shall not be a party to the same.`
            },
            {
              'title': 'How long does it usually take for a loan to get disbursed?',
              'subtitle': `Usually, loans get sanctioned in less than four hours. If all your documents are in order then the loan amount gets disbursed in 1 to 2 days.
              <br> <br> <b>Note</b>: All loan approvals and disbursals are at the sole discretion of IDFC FIRST Bank.`
            },
            {
              'title': `Can I cancel my loan application post-approval?`,
              'subtitle': `Yes, you can and it is free of cost. Give us a call on xxxxxxxxxx or write to xxx@xxxx.com should you wish to cancel your loan.`
            },
            {
              'title': `The interest rate of my personal loan will be flat or reducing?`,
              'subtitle': `The interest rate that will apply will be reducing in nature. This means as the outstanding principal amount will reduce -- the interest payable will also come down.`
            },
          ]
        },
        {
          'header_title': 'Eligibility',
          options: [
            {
              'title': 'What is the maximum and minimum loan amount that I can get if I apply for a personal loan?',
              'subtitle': 'For salaried professionals, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs 40 lakhs. For self-employed, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs. 9 lakhs.'
            },
            {
              'title': 'On what criteria will the loan be sanctioned to me ?',
              'subtitle': 'The final amount sanctioned will depend on your net monthly income, your credit bureau and other eligibility criterias.'
            },
            {
              'title': `Loan sanction depends on what factors?`,
              'subtitle': `The final amount sanctioned will depend on your income and other factors like credit score, repayment ability, age, employer, etc.`
            },
            {
              'title': `Is it necessary for me to have a salary account with IDFC FIRST Bank for getting a personal loan?`,
              'subtitle': `No, it is not mandatory to have a salary account with IDFC FIRST Bank.`
            },
          ]
        },

        {
          'header_title': 'Fees and charges',
          'is_table' : true,
          options: [
            {
              'title': 'EMI Bounce charges per presentation',
              'subtitle': 'Rs. 400'
            },
            {
              'title': 'Late payment/Penal charges/ Default interest/Overdue (per month)',
              'subtitle': '2% of the unpaid EMI or Rs. 300 whichever is higher'
            },
            {
              'title': `Cheque Swap charges (per swap)`,
              'subtitle': `Rs. 500`
            },
            {
              'title': `Foreclosure / Prepayment charges`,
              'subtitle': `You can foreclose personal loan after a lock-in period of 6 months by paying a foreclosure charge of 5% on the outstanding principal amount`
            },
            {
              'title': 'Duplicate No Objection Certificate Issuance Charges',
              'subtitle': 'Rs. 500'
            },
            {
              'title': 'Physical Repayment Schedule',
              'subtitle': 'Rs. 500'
            },
            {
              'title': `Physical Statement of Account`,
              'subtitle': `Rs. 500`
            },
            {
              'title': `Document retrieval charges (per retrieval)`,
              'subtitle': 'Rs. 500'
            },
            {
              'title': 'Processing fees',
              'subtitle': 'Up to 3% of the loan amount'
            },
            {
              'title': `Part Payment charges`,
              'subtitle': `Part-payment is not allowed`
            },
            {
              'title': `EMI Pickup / Collection Charges`,
              'subtitle': 'Rs. 350'
            },
          ]
        },
        {
          'header_title': 'Others',
          options: [
            {
              'title': 'I have a question that is not listed here, what do I do?',
              'subtitle': `We will be glad to help you with any questions regarding the personal loan from IDFC FIRST
              Bank. Please feel free to contact our customer care representative at xxxxxxxxxx or email us at
              xxx@fisdom.com`
            },
          ]
        },
      ],
    }
  },
  bt_info_screen: {
    benefits: {
      title: 'What benefits will I get?',
      options: [
        { 'icon': 'icn_bt_1', 'subtitle': 'Lower interest rate compared to your existing loan(s)' },
        { 'icon': 'icn_bt_2', 'subtitle': 'An option to choose a longer loan repayment tenure' },
        { 'icon': 'icn_bt_3', 'subtitle': 'Possibility of getting a bigger loan offer depending on your profile' }
      ]
    },
    required_info: {
      title: 'What information do I need to provide for BT?',
      options: [
        { 'icon': 'icon_color', 'subtitle': 'Outstanding principal amount of existing loan(s) or credit card(s)' },
        { 'icon': 'icon_color', 'subtitle': 'Account statement of the existing loan(s) for which you want to avail ‘balance transfer’' }
      ]
    },
  },
  know_more_screen: {
    features: {
      content: [
        "Loan up to 40 lakhs:",
        "Low interest rate starting at 10.75% p.a.",
        "Flexible loan tenure -- min 12 months, max 60 months",
        "Option of ‘balance transfer’ at attractive rates",
        "Loan sanction in less than 4 hrs",
        "100% digital with easy documentation",
        "Top-up facility to avail extra funds on the existing loan",
      ]
    },
    eligibility: {
      content1: {
        "sub-head": "For Salaried Applicants",
        points: [
          "Must be earning a minimum net monthly salary of Rs. 20,000",
          "Should at least be 23 years of age",
          "Maximum age at the time of loan maturity should not be more than 60 years",
        ],
      },
      content2: {
        "sub-head": "For Self-employed Applicants",
        points: [
          "Should at least be 23 years of age",
          "Maximum age at the time of loan maturity should not be more than 65 years",
          "Business must be in operations for at least 3 years",
          "You must be managing your business from the same office premises for at least a year",
        ],
      }
    },
    documentation: {
      content1: {
        "sub-head": "For Salaried Applicants",
        points: ["Photo Identity Proof", "Address Proof", "Income Proof"],
      },
      content2: {
        "sub-head": "For Self-employed Applicants",
        points: [
          "Photo Identity Proof",
          "Address Proof",
          "Business Proof",
          "Income Proof",
        ],
      }
    }
  },
  professional_details_screen: {
    companyOptions: [
      'ESSEL MINING & INDUSTRIES LTD',
      'BERGER PAINTS INDIA LIMITED',
      'ADANI ENTERPRISES LIMITED',
      'FALKEN TYRE INDIA PRIVATE LIMITED',
      'CLASSIC CONCEPTS HOME INDIA PRIVATE LIMITED',
      'DAMODAR MANGALJI AND COMPANY LIMITED',
      'NAVAIR INTERNATIONAL PRIVATE LIMITED',
      'MAGUS IT SOLUTIONS PRIVATE LIMITED',
      'MEDSOFT (INDIA) PRIVATE LIMITED',
      'DBS BANK LTD',
      'ZYDUS WELLNESS LIMITED',
      'WOCKHARDT LIMITED',
      'RBL BANK LIMITED',
      'AEGON LIFE INSURANCE COMPANYLIMITED',
      'WOLSELEY',
      'XEROX MODICORP LTD XEROX (I) LTD',
      'ZURICH FINANCIAL SERVICES',
      'ZYDUS CADILA'
    ],
    salaryRecieptOptions: [
      "BANK ACCOUNT TRANSFER",
      "CASH",
      "CHEQUE",
    ],
    constitutionOptions: [
      "HUF",
      "INDIVIDUAL",
      "INDIVIDUAL – MUTUAL FUND",
      "PARTNERSHIP",
      "PRIVATE LIMITED COMPANY",
      "PRIVATE LTD.",
      "PROPERITOR",
      "PUBLICLIMITED COMPANY",
      "SOCIETY",
      "TRUST",
    ],
    organisationTypeOptions: [
      "CENTRAL GOVT.",
      "EDUCATIONAl INSTITUTE",
      "PARTNERSHIP FIRM",
      "PRIVATE LIMITED COMPANY",
      "PUBLIC LIMITED COMPANY",
      "PROPRIETORSHIP FIRM",
      "PUBLIC SECTOR UNDERTAKING.",
      "SOCIETY",
      "STATE GOVT.",
      "TRUST",
  ],
    departmentOptions: [
      "ACCOUNTS",
      "BACKOFFICE",
      "EDUCATION"
    ],
  },
  personal_details_screen: {
    maritalOptions: [
      "SINGLE",
      "MARRIED"
    ],
    religionOptions: [
      "HINDU",
      "JAIN",
      "MUSLIM",
      "CATHOLIC",
      "Others"
    ]
  },
  requirement_details_screen: {
    purposeOfLoanOptions: [
      "AGRI GOLD LOAN",
      "ANY OTHER LEGAL PURPOSE",
      "APPLIANCE/FURNITURE/ELECTRONICS",
      "BALANCE TRANSFER",
      "BUSINESS",
      "CAR REPAIR/PURCHASE",
      "DEBT CONSOLIDATION",
      "EDUCATION",
      "EXPANSION",
      "EXPANSION AND LONG TERM WORKING CAPITAL",
      "FAMILY CELEBRATION",
      "HEALTH AND WELLNESS",
      "HOLIDAYS",
      "HOME IMPROVEMENT/LOT DOWNPAYMENT",
      "INSURANCE PAYMENTS",
      "INVESTMENTS",
      "LONG TERM WORKING CAPITAL",
      "MEDICAL EXPENSE",
      "MEMORIAL SERVICE",
      "MULTIPURPOSE",
      "PAYING COLLEGE FEES OR FOR A PROFESSIONAL COURSE",
      "RENOVATION OF HOUSE",
      "VACATION/TRAVEL EXPENSE",
      "WEDDING",
      "OTHERS"
    ],
    tenorOptions: [
      "12",
      "24",
      "36",
      "48",
    ]
  }
}