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
  landing_screen: {
    stepeContentMapper: {
      title: 'Top features',
      options: [
        { 'icon': 'ic_why_loan1', 'subtitle': 'Interest rates starting as low as 10.75% pa' },
        { 'icon': 'ic_why_loan2', 'subtitle': 'Instant eligibility and sanction in less than 4 hrs' },
        { 'icon': 'ic_why_loan3', 'subtitle': 'Flexible loan tenure up to 60 months' }
      ]
    },
    journeyData: {
      title: 'Personal loan in just 5 steps',
      options: [
        { 'step': '1', 'title': 'Enter basic details', 'subtitle': 'Fill in personal and work details to get started with your loan application.' },
        { 'step': '2', 'title': 'Create loan application', 'subtitle': 'Check your KYC status to proceed with your loan application.' },
        { 'step': '3', 'title': 'Provide income details', 'subtitle': 'Enter your loan requirements and income details to get the best loan offer.' },
        { 'step': '4', 'title': 'Upload documents', 'subtitle': 'Provide your office address and upload documents to get your loan sanctioned.' },
        { 'step': '5', 'title': 'Sanction and disbursal', 'subtitle': 'IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.' }
      ]
    }
  },
  journey_screen: {
    journeyData: {
      options: [
        { 'step': '1', 'title': 'Enter basic details', 'subtitle': 'Fill in personal and work details to get started with your loan application.', 'status': 'completed'  },
        { 'step': '2', 'title': 'Create loan application', 'subtitle': 'Check your KYC status to proceed with your loan application.', 'status': 'completed' },
        { 'step': '3', 'title': 'Provide income details', 'subtitle': 'Enter your loan requirements and income details to get the best loan offer.', 'status': 'init' },
        { 'step': '4', 'title': 'Upload documents', 'subtitle': 'Provide your office address and upload documents to get your loan sanctioned.', 'status': 'pending' },
        { 'step': '5', 'title': 'Sanction and disbursal', 'subtitle': 'IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.', 'status': 'pending'  }
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
  }
}