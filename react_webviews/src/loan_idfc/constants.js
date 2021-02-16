import { getConfig } from "utils/functions";
import { capitalizeFirstLetter } from "../utils/validators";
let productName = capitalizeFirstLetter(getConfig().productName);

export function goBackMap(path) {
  let mapper = {
    "/loan/idfc/journey": "/loan/idfc/loan-know-more",
    "/loan/idfc/edit-number": "/loan/idfc/loan-know-more",
    "/loan/idfc/application-summary": "/loan/idfc/journey",
    "/loan/idfc/personal-details": "/loan/idfc/journey",
    "/loan/idfc/basic-details": "/loan/idfc/loan-know-more",
    "/loan/idfc/professional-details": "/loan/idfc/basic-details",
    "/loan/idfc/address-details": "/loan/idfc/personal-details",
    "/loan/idfc/loan-requirement-details": "/loan/idfc/journey",
    "/loan/idfc/income-details": "/loan/idfc/journey",
    "/loan/idfc/upload-bank": "/loan/idfc/income-details",
    "/loan/idfc/eligible-loan": "/loan/idfc/journey",
    "/loan/idfc/loan-eligible": "/loan/idfc/journey",
    "/loan/idfc/additional-details": "/loan/idfc/journey",
    "/loan/idfc/bt-info": "/loan/idfc/journey",
    "/loan/idfc/doc-list": "/loan/idfc/journey",
    "/loan/idfc/doc-upload": "/loan/idfc/doc-list",
    "/loan/idfc/final-loan": "/loan/idfc/loan-know-more",
    "/loan/idfc/reports": "/loan/idfc/loan-know-more",
    "/loan/idfc/final-offer": '/loan/idfc/journey',
    "/loan/calculator": "/loan/home",
    "/loan/edit-details": "/loan/home",
    "/loan/idfc/otp-verify": "/loan/idfc/edit-number",
    "/loan/idfc/loan-bt": "/loan/idfc/journey",
    "/loan/idfc/credit-bt": "/loan/idfc/loan-bt",
    "/loan/dmi/tnc": "/loan/dmi/loan-eligible"
  };

  return mapper[path] || false;
}

export function getCssMapperReport(vendor_info) {
  let cssMapper = {
    callback_awaited_disbursement_approval: {
      color: "green",
      disc: "Approved",
    },
    disbursement_approved: {
      color: "yellow",
      disc: "Pending For Disbursal",
    },
    complete: {
      color: "green",
      disc: "Disbursed",
    },
  };

  let obj = {};
  obj.status = vendor_info.dmi_loan_status;

  obj.cssMapper =
    cssMapper[obj.status] ||
    cssMapper["callback_awaited_disbursement_approval"];

  return obj;
}

export const idfc_config = {
  key: "idfc",
  get_next: {
    main_landing_screen: "edit-number",
    know_more_screen: "edit-number",
    calculator: "edit-number",
    mobile_verification: "otp-verify",
    otp_verify: "basic-details",
    basic_details: "professional-details",
    professional_details_screen: "journey",
    personal_details_screen: "address-details",
    address_details: "journey",
    bt_info_screen: "loan-bt-details",
    requirement_details_screen: "loan-status",
    loan_eligible: "additional-details",
    loan_bt: "credit-bt",
    credit_bt: "eligible-loan",
    eligible_loan: "loan-eligible",
    additional_details: "doc-list",
    recommended: "select-loan",
  },
  landing_screen: {
    stepContentMapper: {
      title: "Top features",
      options: [
        {
          icon: "icn_b_1",
          subtitle: "Interest rates starting as low as 10.75% pa",
        },
        {
          icon: "icn_b_2",
          subtitle: "Instant eligibility and sanction in less than 4 hrs",
        },
        { icon: "icn_b_3", subtitle: "Flexible loan tenure up to 60 months" },
      ],
    },
    journeyData: {
      title: "Personal loan in just 5 steps",
      options: [
        {
          step: "1",
          title: "Enter basic details",
          subtitle:
            "Fill in basic and work details to get started with your loan application.",
        },
        {
          step: "2",
          title: "Create loan application",
          subtitle:
            "Provide/confirm your personal and address details to proceed with your loan application.",
        },
        {
          step: "3",
          title: "Provide income details",
          subtitle:
            "Enter your loan requirements and income details to get the best loan offer.",
        },
        {
          step: "4",
          title: "Upload documents",
          subtitle:
            "Provide your office address and upload documents to get your loan sanctioned.",
        },
        {
          step: "5",
          title: "Sanction and disbursal",
          subtitle:
            "IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.",
        },
      ],
    },
    faqsInfo: {
      header_title: "Frequently asked questions",
      cta_title: "OK",
      faqs: [
        {
          header_title: "Personal Loan from IDFC FIRST Bank",
          options: [
            {
              title: `Is ${productName} the lender?`,
              subtitle: `No, ${productName} is not the lender. It is IDFC FIRST Bank who is offering credit to the users of our app. We have a contractual partnership with IDFC FIRST Bank and we will only facilitate your loan application for availing credit.
              <br> <br> <b>Note</b>: Any credit facility offered to you by IDFC FIRST Bank on the ${productName} app shall be governed by Terms and Conditions agreed between you and IDFC FIRST Bank, and ${productName} shall not be a party to the same.`,
            },
            {
              title:
                "How long does it usually take for a loan to get disbursed?",
              subtitle: `Usually, loans get sanctioned in less than four hours. If all your documents are in order then the loan amount gets disbursed in 1 to 2 days.
              <br> <br> <b>Note</b>: All loan approvals and disbursals are at the sole discretion of IDFC FIRST Bank.`,
            },
            {
              title: `Can I cancel my loan application post-approval?`,
              subtitle: `Yes, you can and it is free of cost. Give us a call on ${getConfig().mobile} or write to ${getConfig().askEmail} should you wish to cancel your loan.`,
            },
            {
              title: `The interest rate of my personal loan will be flat or reducing?`,
              subtitle: `The interest rate that will apply will be reducing in nature. This means as the outstanding principal amount will reduce -- the interest payable will also come down.`,
            },
          ],
        },
        {
          header_title: "Eligibility",
          options: [
            {
              title:
                "What is the maximum and minimum loan amount that I can get if I apply for a personal loan?",
              subtitle:
                "For salaried professionals, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs 40 lakhs. For self-employed, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs. 9 lakhs.",
            },
            {
              title: "On what criteria will the loan be sanctioned to me ?",
              subtitle:
                "The final amount sanctioned will depend on your net monthly income, your credit bureau and other eligibility criterias.",
            },
            {
              title: `Loan sanction depends on what factors?`,
              subtitle: `The final amount sanctioned will depend on your income and other factors like credit score, repayment ability, age, employer, etc.`,
            },
            {
              title: `Is it necessary for me to have a salary account with IDFC FIRST Bank for getting a personal loan?`,
              subtitle: `No, it is not mandatory to have a salary account with IDFC FIRST Bank.`,
            },
          ],
        },

        {
          header_title: "Fees and charges",
          is_table: true,
          options: [
            {
              title: "EMI Bounce charges per presentation",
              subtitle: "Rs. 400",
            },
            {
              title:
                "Late payment/Penal charges/ Default interest/Overdue (per month)",
              subtitle: "2% of the unpaid EMI or Rs. 300 whichever is higher",
            },
            {
              title: `Cheque Swap charges (per swap)`,
              subtitle: `Rs. 500`,
            },
            {
              title: `Foreclosure / Prepayment charges`,
              subtitle: `You can foreclose personal loan after a lock-in period of 6 months by paying a foreclosure charge of 5% on the outstanding principal amount`,
            },
            {
              title: "Duplicate No Objection Certificate Issuance Charges",
              subtitle: "Rs. 500",
            },
            {
              title: "Physical Repayment Schedule",
              subtitle: "Rs. 500",
            },
            {
              title: `Physical Statement of Account`,
              subtitle: `Rs. 500`,
            },
            {
              title: `Document retrieval charges (per retrieval)`,
              subtitle: "Rs. 500",
            },
            {
              title: "Processing fees",
              subtitle: "Up to 3% of the loan amount",
            },
            {
              title: `Part Payment charges`,
              subtitle: `Part-payment is not allowed`,
            },
            {
              title: `EMI Pickup / Collection Charges`,
              subtitle: "Rs. 350",
            },
          ],
        },
        {
          header_title: "Others",
          options: [
            {
              title: "I have a question that is not listed here, what do I do?",
              subtitle: `We will be glad to help you with any questions regarding the personal loan from IDFC FIRST
              Bank. Please feel free to contact our customer care representative at xxxxxxxxxx or email us at
              xxx@fisdom.com`,
            },
          ],
        },
      ],
    },
  },
  bt_info_screen: {
    benefits: {
      title: "What benefits will I get?",
      options: [
        {
          icon: "icn_bt_1",
          subtitle: "Lower interest rate compared to your existing loan(s)",
        },
        {
          icon: "icn_bt_2",
          subtitle: "An option to choose a longer loan repayment tenure",
        },
        {
          icon: "icn_bt_3",
          subtitle:
            "Possibility of getting a bigger loan offer depending on your profile",
        },
      ],
    },
    required_info: {
      title: "What information do I need to provide for BT?",
      options: [
        {
          icon: "icon_color",
          subtitle:
            "Outstanding principal amount of existing loan(s) or credit card(s)",
        },
        {
          icon: "icon_color",
          subtitle:
            "Account statement of the existing loan(s) for which you want to avail ‘balance transfer’",
        },
      ],
    },
  },
  know_more_screen: {
    features: {
      content: [
        {
          data: "Loan up to 40 lakhs:",
          sub_data: [
            "For salaried, the range is from Rs. 1 lakh to 40 lakhs",
            "For self-employed the max loan amount is Rs. 9 lakhs",
          ],
        },
        "Low interest rate starting at 10.75% p.a.",
        "Flexible loan tenure -- min 12 months, max 60 months",
        "Option of ‘balance transfer’ at attractive rates",
        "Loan sanction in less than 4 hrs",
        "100% digital with easy documentation",
        "Top-up facility to avail extra funds on the existing loan",
      ],
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
          "Should at least be 25 years of age",
          "Maximum age at the time of loan maturity should not be more than 65 years",
          "Business must be in operations for at least 3 years",
          "Must be managing your business from the same office premises for at least a year",
        ],
      },
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
      },
    },
  },
  loan_bt: {
    bankOptions: [
      "Axis Bank",
      "ICICI Bank",
      "HDFC Bank",
      "Yes bank",
      "Bajaj Finance",
      "Tata Capital",
      "Standard Chartered Bank",
      "State Bank Group",
      "Indiabulls Consumer Finance",
      "HDB Financial Services Limited",
      "Aditya Birla Finance Limited",
      "Bandhan Bank",
      "Bank of Baroda",
      "Bank of India",
      "Bank of Maharashtra",
      "Canara Bank",
      "Capital Float",
      "Central Bank of India",
      "Citibank",
      "Federal Bank",
      "Fullerton India Credit Company Ltd",
      "HSBC",
      "IDBI Bank",
      "Indian Bank",
      "Indian Overseas Bank",
      "Indusind Bank",
      "Karnataka Bank",
      "Kotak Mahindra Bank",
      "Oriental Bank of Commerce",
      "Punjab National Bank",
      "RBL Bank",
      "South Indian Bank",
      "Union Bank",
      "Ujjivan Small Finance Bank",
      "Jana Small Finance Bank",
      "Muthoot Finance Ltd",
      "Others"
    ]
  },
  professional_details_screen: {
    companyOptions: [
      "Essel Mining & Industries Ltd",
      "Berger Paints India Limited",
      "Adani Enterprises Limited",
      "Falken Tyre India Private Limited",
      "Classic Concepts Home India Private Limited",
      "Damodar Mangalji And Company Limited",
      "Navair International Private Limited",
      "Magus It Solutions Private Limited",
      "Medsoft (India) Private Limited",
      "Dbs Bank Ltd",
      "Zydus Wellness Limited",
      "Wockhardt Limited",
      "Rbl Bank Limited",
      "Aegon Life Insurance Companylimited",
      "Wolseley",
      "Xerox Modicorp Ltd Xerox (I) Ltd",
      "Zurich Financial Services",
      "Zydus Cadila",
    ],
    salaryRecieptOptions: ["Bank Account Transfer", "Cash", "Cheque"],
    constitutionOptions: [
      "Huf",
      "Individual",
      "Individual – Mutual Fund",
      "Partnership",
      "Private Limited Company",
      "Private Ltd.",
      "Proprietor",
      "Public Limited Company",
      "Society",
      "Trust",
    ],
    organisationTypeOptions: [
      "Central Govt.",
      "Educational Institute",
      "Partnership Firm",
      "Private Limited Company",
      "Public Limited Company",
      "Proprietorship Firm",
      "Public Sector Undertaking.",
      "Society",
      "State Govt.",
      "Trust",
    ],
    departmentOptions: ["Accounts", "Backoffice", "Education"],
  },
  credit_bt: {
    bankOptions: [
      "Axis Bank",
      "ICICI Bank",
      "HDFC Bank",
      "Yes bank",
      "Bajaj Finance",
      "Tata Capital",
      "Standard Chartered Bank",
      "State Bank Group",
      "Indiabulls Consumer Finance",
      "HDB Financial Services Limited",
      "Aditya Birla Finance Limited",
      "Bandhan Bank",
      "Bank of Baroda",
      "Bank of India",
      "Bank of Maharashtra",
      "Canara Bank",
      "Capital Float",
      "Central Bank of India",
      "Citibank",
      "Federal Bank",
      "Fullerton India Credit Company Ltd",
      "HSBC",
      "IDBI Bank",
      "Indian Bank",
      "Indian Overseas Bank",
      "Indusind Bank",
      "Karnataka Bank",
      "Kotak Mahindra Bank",
      "Oriental Bank of Commerce",
      "Punjab National Bank",
      "RBL Bank",
      "South Indian Bank",
      "Union Bank",
      "Ujjivan Small Finance Bank",
      "Jana Small Finance Bank",
      "Muthoot Finance Ltd",
      "Others"
    ]
  },
  additional_details: {
    businessOptions: [
      "Architect",
      "Astrologer",
      "Auto Spare Dealers",
      "Builders And Developers",
      "Building Material Suppliers",
      "Cable Tv Operators",
      "Chartered Accountant",
      "Chit Fund Operators / SE Operating Finance Business",
      "Commission Agents",
      "Massage Parlours /Beauty Parlour",
      "Consultants Operating From Residence",
      "Contractors (All Types)",
      "Doctor",
      "Dsa",
      "Film Industry Related People",
      "Garage Owner",
      "Insurance Agent",
      "Labour Contractors",
      "Lawyer",
      "Manpower Consultants",
      "Manufacturing",
      "Mbbs Doctor",
      "Md/Ms/Mds Doctor",
      "Motor Training School",
      "Octroi/Rto Agents",
      "Owners Of Private Security Services Agencies",
      "Petrol Pump Owner",
      "Politicians",
      "Real Estate Agents",
      "Recovery Agent",
      "Retailer",
      "Services",
      "Small Non Branded Courier Companies",
      "Small Time Courier Cos",
      "Small Travel Agents/Tour Operators/Tour Taxi Operators",
      "Stand Alone Std / Xerox Booth Owners",
      "Stock Brokers",
      "Trading",
      "Wholesaler",
      "Wine Shop Owners/Bar Restaurant Owners",
      "Young Insurance Agents < 30 Years"
    ]
  },
  personal_details_screen: {
    maritalOptions: ["Single", "Married"],
    religionOptions: ["Hindu", "Jain", "Muslim", "Catholic", "Others"],
  },
  requirement_details_screen: {
    purposeOfLoanOptions: [
      "Agri Gold Loan",
      "Any Other Legal Purpose",
      "Appliance/Furniture/Electronics",
      "Balance Transfer",
      "Business",
      "Car Repair/Purchase",
      "Debt Consolidation",
      "Education",
      "Expansion",
      "Expansion And Long Term Working Capital",
      "Family Celebration",
      "Health And Wellness",
      "Holidays",
      "Home Improvement/Lot Downpayment",
      "Insurance Payments",
      "Investments",
      "Long Term Working Capital",
      "Medical Expense",
      "Memorial Service",
      "Multipurpose",
      "Paying College Fees Or For A Professional Course",
      "Renovation Of House",
      "Vacation/Travel Expense",
      "Wedding",
      "Others",
    ],
    tenorOptions: ["12", "24", "36", "48"],
  },
  main_landing_screen: {
    loan_partners: {
      dmi: {
        stepContentMapper: {
          title: "Eligibility criteria",
          options: [
            {
              icon: "ic_why_loan1",
              subtitle: "Salaried and resident Indian citizens",
            },
            {
              icon: "ic_why_loan2",
              subtitle: "Age between 23 and 55 years",
            },
            {
              icon: "ic_why_loan3",
              subtitle:
                "Employed with a private, public limited company, or an MNC",
            },
          ],
        },

        partnerData: {
          title: "DMI Finance",
          subtitle: "Quick disbursal",
          loan_amount: "₹1 lakh",
          logo: "dmi-finance",
        },

        faqsInfo: {
          header_title: "Frequently asked questions",
          header_subtitle: '',
          cta_title: "OK",
          faqs: [
            {
              'title': 'What is the max loan amount for salaried Personal loan ?',
              'subtitle': 'Max loan amount is 1 lakh.'
            },
            {
              'title': 'On what criteria will the loan be sanctioned to me ?',
              'subtitle': 'The final amount sanctioned will depend on your net monthly income, your credit bureau and other eligibility criterias.'
            },
            {
              'title': `Is ${productName} the lender ?`,
              'subtitle': `${productName} is not the lender. ${productName} will only facilitate your 
              loan application for availing credit facilities. ${productName} has a contractual 
              relationship with DMI Finance Pvt Ltd who offers credit facilities to the users of the app. 
              Any credit facility offered to you by any lender on App shall be governed by Terms and 
              Conditions agreed 
              between you and the lender and ${productName} shall not be a party to the same.`
            },
            {
              'title': `What are the benefits of applying for a personal loan from ${productName} ?`,
              points: [
                'Digital loans: Bid farewell to piles of paperwork and branch visits',
                'Zero documentation: No income documents required',
                'Money in account within 48 hrs: Submit loan application in 10 mins and get credit within 48 hrs',
                'Collateral free loan: You don’t have to provide any security for your loan'
              ]
            },
            {
              'title': `What documents are required to get a Personal loan from ${productName}?`,
              'subtitle': `You just need to upload a photo of your PAN card to get a Personal 
              loan from ${productName}. No other documents are required.`
            },
            {
              'title': 'What will be my First EMI payment date ?',
              'subtitle': `
              Cases disbursed between 1st to 20th of the month – will have their first EMI on 5th of coming month.</br>
              Cases disbursed between 21st till last day of month – will have first EMI on 5th of next to next month.</br>
              Please note – there will be few cases approved on 20th but will get disbursed on 21st or later date 
              (due to bank holiday or late hours), but their first EMI will be on 5th of next month only.</br>
              `
            },
            {
              'title': 'Are there any prepayment charges ?',
              'subtitle': 'Prepayment not allowed for first 6 months. Prepayment charges of 3% flat on the o/s principal to be applied post this.'
            },
            {
              'title': 'What is the minimum and maximum period for repayment?',
              'subtitle': 'Minimum tenor is 6 months and maximum is 24 months.'
            },
            {
              'title': 'What is the Processing fee? ',
              'subtitle': 'Processing fee is 2% of gross disbursement amount plus GST as applicable.'
            }
          ],
        }
      },

      idfc: {
        documents: true,
        partnerData: {
          title: "IDFC FIRST Bank",
          subtitle: "Competitive interest rate",
          loan_amount: " ₹40 lakhs",
          logo: "idfc_logo",
        },

        journeyData: {
          title: "Personal loan in just 5 steps",
          options: [
            {
              step: "1",
              title: "Enter basic details",
              subtitle:
                "Fill in basic and work details to get started with your loan application.",
            },
            {
              step: "2",
              title: "Create loan application",
              subtitle:
                "Provide/confirm your personal and address details to proceed with your loan application.",
            },
            {
              step: "3",
              title: "Provide income details",
              subtitle:
                "Enter your loan requirements and income details to get the best loan offer.",
            },
            {
              step: "4",
              title: "Upload documents",
              subtitle:
                "Provide your office address and upload documents to get your loan sanctioned.",
            },
            {
              step: "5",
              title: "Sanction and disbursal",
              subtitle:
                "IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.",
            },
          ],
        },

        stepContentMapper: {
          title: "Top features",
          options: [
            {
              icon: "icn_b_1",
              subtitle: "Interest rates starting as low as 10.75% pa",
            },
            {
              icon: "icn_b_2",
              subtitle: "Instant eligibility and sanction in less than 4 hrs",
            },
            { icon: "icn_b_3", subtitle: "Flexible loan tenure up to 60 months" },
          ],
        },

        faqsInfo: {
          header_title: "Frequently asked questions",
          header_subtitle: '',
          cta_title: "OK",
          faqs: [
            {
              header_title: "Personal Loan from IDFC FIRST Bank",
              options: [
                {
                  title: `Is ${productName} the lender?`,
                  subtitle: `No, ${productName} is not the lender. It is IDFC FIRST Bank who is offering credit to the users of our app. We have a contractual partnership with IDFC FIRST Bank and we will only facilitate your loan application for availing credit.
                  <br> <br> <b>Note</b>: Any credit facility offered to you by IDFC FIRST Bank on the ${productName} app shall be governed by Terms and Conditions agreed between you and IDFC FIRST Bank, and ${productName} shall not be a party to the same.`,
                },
                {
                  title:
                    "How long does it usually take for a loan to get disbursed?",
                  subtitle: `Usually, loans get sanctioned in less than four hours. If all your documents are in order then the loan amount gets disbursed in 1 to 2 days.
                  <br> <br> <b>Note</b>: All loan approvals and disbursals are at the sole discretion of IDFC FIRST Bank.`,
                },
                {
                  title: `Can I cancel my loan application post-approval?`,
                  subtitle: `Yes, you can and it is free of cost. Give us a call on ${getConfig().mobile} or write to ${getConfig().askEmail} should you wish to cancel your loan.`,
                },
                {
                  title: `The interest rate of my personal loan will be flat or reducing?`,
                  subtitle: `The interest rate that will apply will be reducing in nature. This means as the outstanding principal amount will reduce -- the interest payable will also come down.`,
                },
              ],
            },
            {
              header_title: "Eligibility",
              options: [
                {
                  title:
                    "What is the maximum and minimum loan amount that I can get if I apply for a personal loan?",
                  subtitle:
                    "For salaried professionals, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs 40 lakhs. For self-employed, the minimum loan amount is Rs. 1 lakh and the maximum loan amount is Rs. 9 lakhs.",
                },
                {
                  title: "On what criteria will the loan be sanctioned to me ?",
                  subtitle:
                    "The final amount sanctioned will depend on your net monthly income, your credit bureau and other eligibility criterias.",
                },
                {
                  title: `Loan sanction depends on what factors?`,
                  subtitle: `The final amount sanctioned will depend on your income and other factors like credit score, repayment ability, age, employer, etc.`,
                },
                {
                  title: `Is it necessary for me to have a salary account with IDFC FIRST Bank for getting a personal loan?`,
                  subtitle: `No, it is not mandatory to have a salary account with IDFC FIRST Bank.`,
                },
              ],
            },
    
            {
              header_title: "Fees and charges",
              is_table: true,
              options: [
                {
                  title: "EMI Bounce charges per presentation",
                  subtitle: "Rs. 400",
                },
                {
                  title:
                    "Late payment/Penal charges/ Default interest/Overdue (per month)",
                  subtitle: "2% of the unpaid EMI or Rs. 300 whichever is higher",
                },
                {
                  title: `Cheque Swap charges (per swap)`,
                  subtitle: `Rs. 500`,
                },
                {
                  title: `Foreclosure / Prepayment charges`,
                  subtitle: `You can foreclose personal loan after a lock-in period of 6 months by paying a foreclosure charge of 5% on the outstanding principal amount`,
                },
                {
                  title: "Duplicate No Objection Certificate Issuance Charges",
                  subtitle: "Rs. 500",
                },
                {
                  title: "Physical Repayment Schedule",
                  subtitle: "Rs. 500",
                },
                {
                  title: `Physical Statement of Account`,
                  subtitle: `Rs. 500`,
                },
                {
                  title: `Document retrieval charges (per retrieval)`,
                  subtitle: "Rs. 500",
                },
                {
                  title: "Processing fees",
                  subtitle: "Up to 3% of the loan amount",
                },
                {
                  title: `Part Payment charges`,
                  subtitle: `Part-payment is not allowed`,
                },
                {
                  title: `EMI Pickup / Collection Charges`,
                  subtitle: "Rs. 350",
                },
              ],
            },
            {
              header_title: "Others",
              options: [
                {
                  title: "I have a question that is not listed here, what do I do?",
                  subtitle: `We will be glad to help you with any questions regarding the personal loan from IDFC FIRST
                  Bank. Please feel free to contact our customer care representative at ${getConfig().mobile} or email us at
                  ${getConfig().askEmail}`,
                },
              ],
            },
          ],
        },
      },
    },
  },
  eligibility_screen: {
    eligibility: [
      {
        title: "Salaried",
        options: [
          {
            icon: "icn_b1_m",
            subtitle:
              "Must be earning a minimum net monthly salary of Rs. 20,000",
          },
          {
            icon: "icn_b2_m",
            subtitle: "Should at least be 23 years of age",
          },
          {
            icon: "icn_b3_m",
            subtitle:
              "Maximum age at the time of loan maturity should not be >60 years ",
          },
        ],
      },
      {
        title: "Self-employed",
        options: [
          {
            icon: "icn_b2_m",
            subtitle: "Should at least be 25 years of age",
          },
          {
            icon: "icn_b3_m",
            subtitle:
              "Maximum age at the time of loan maturity should not be >65 years",
          },
          {
            icon: "icn_b4_m",
            subtitle: "Business must be in operations for at least 3 years",
          },
          {
            icon: "Group 9964",
            subtitle:
              "You must be managing your business from the same office premises for at least a year",
          },
        ],
      },
    ],
  },
};
