export function goBackMap(path) {
    let mapper = {

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
    mobile_verification: 'otp-verify',
    otp_verify: 'basic-details',
    basic_details: 'professional-details',
    professional_details_screen: 'journey',
    personal_details_screen: 'address-details',
    address_details: 'journey',
    bt_info_screen: 'loan-bt-details'
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
    }
  },
  bt_info_screen:{
    benefits: {
      title: 'What benefits will I get?',
      options: [
        { 'icon': 'icn_bt_1', 'subtitle': 'Lower interest rate compared to your existing loan(s)'},
        { 'icon': 'icn_bt_2', 'subtitle': 'An option to choose a longer loan repayment tenure'},
        { 'icon': 'icn_bt_3', 'subtitle': 'Possibility of getting a bigger loan offer depending on your profile'}
      ]
    },
    required_info: {
      title: 'What information do I need to provide for BT?',
      options: [
        { 'icon': 'icon_color', 'subtitle': 'Outstanding principal amount of existing loan(s) or credit card(s)'},
        { 'icon': 'icon_color', 'subtitle': 'Account statement of the existing loan(s) for which you want to avail ‘balance transfer’'}
      ]
    }
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
    salaryRecieptOptions: [
      "Bank account transfer",
      "Cash",
      "Cheque",
    ],
    constitutionOptions: [
      "Huf",
      "Individual",
      "Individual mutual fund",
      "PARTNERSHIP",
      "PRIVATE LIMITED COMPANY",
      "PRIVATE LTD",
      "PROPERITOR",
      "PUBLICLIMITED COMPANY",
      "SOCIETY",
      "TRUST"
    ],
    organisationTypeOptions: [
      "Central govt",
      "Educational institute",
      "Partnership firm",
      "Private Limited Company",
      "Public Limited Company",
      "Proprietorship Firm",
      "Public Sector Undertaking",
      "Society",
      "State Govt",
      "Trust"
    ],
    departmentOptions: [
      "PRIVATE",
      "PUBLIC",
      "ACCOUNTS"
    ],
    industryOptions: [
      "ABRASIVES AND GRINDING",
      "ADVERTISING",
      "AGRICULTURAL IMPLEMENTS"
    ]
  },
  personal_details_screen: {
    maritalOptions: [
      "Single",
      "Married"
    ],
    religionOptions: [
      "Hindu",
      "Muslim",
      "Sikh"
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
      "60"
    ]
  }
}