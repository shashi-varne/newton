export const maritalOptions = [
  {
    'name': 'Single',
    'value': 'UNMARRIED'
  },
  {
    'name': 'Married',
    'value': 'MARRIED'
  },
  {
    'name': 'Divorced',
    'value': 'DIVORCED'
  },
  {
    'name': 'Widow',
    'value': 'WIDOW'
  }
];

export const genderOptions = [
  {
    'name': 'Male',
    'value': 'MALE'
  },
  {
    'name': 'Female',
    'value': 'FEMALE'
  }
];

export const relationshipOptions = [
  'BROTHER',
  'DAUGHTER',
  'FATHER',
  'GRAND DAUGHTER',
  'GRAND FATHER',
  'GRAND MOTHER',
  'GRAND SON',
  'HUSBAND',
  'MOTHER',
  'NEPHEW',
  'NIECE',
  'SISTER',
  'SON',
  'WIFE'
];

export const relationshipOptionsAll = {
  'male_to_male': [
    'BROTHER',
    'FATHER',
    'GRAND FATHER',
    'GRAND SON',
    'NEPHEW',
    'SON',
  ],
  'male_to_female': [
    'DAUGHTER',
    'GRAND DAUGHTER',
    'GRAND MOTHER',
    'MOTHER',
    'NIECE',
    'SISTER',
    'WIFE'
  ],
  'female_to_male': [
    'BROTHER',
    'FATHER',
    'GRAND FATHER',
    'GRAND SON',
    'HUSBAND',
    'NEPHEW',
    'SON',
  ],
  'female_to_female': [
    'DAUGHTER',
    'GRAND DAUGHTER',
    'GRAND MOTHER',
    'MOTHER',
    'NIECE',
    'SISTER',
  ]
}

export const appointeeRelationshipOptions = ["BROTHER", "UNCLE", "AUNT", "FATHER", "FATHER IN-LAW", "GRAND FATHER", "GRAND MOTHER", "MOTHER", "SISTER"];

export const appointeeRelationshipOptionsAll = {
  'male': ["BROTHER", "UNCLE", "FATHER", "FATHER IN-LAW", "GRAND FATHER"],
  'female': ["AUNT", "GRAND MOTHER", "MOTHER", "SISTER"]
}

export const income_pairs = [
  {
    "name": "upto3",
    "value": "upto 3 lakhs"
  },
  {
    "name": "3-5",
    "value": "3-5 lakhs"
  },
  {
    "name": "5-7",
    "value": "5-7 lakhs"
  },
  {
    "name": "7-10",
    "value": "7-10 lakhs"
  },
  {
    "name": "10-15",
    "value": "10-15 lakhs"
  },
  {
    "name": "above15",
    "value": "15 lakhs +"
  }
];

export const declareOptions = [
  {
    'name': 'Yes',
    'value': 'Y'
  },
  {
    'name': 'No',
    'value': 'N'
  },
];

export const occupationDetailOptions = [
  {
    'name': 'Self-Employed',
    'value': 'SELF-EMPLOYED'
  },
  {
    'name': 'Salaried',
    'value': 'SALRIED'
  }
  // ,
  // {
  //   'name': 'Student',
  //   'value': 'STUDENT'
  // }
];

export const occupationDetailOptionsIpru = [
  {
    'name': 'Self-Employed',
    'value': 'SELF-EMPLOYED'
  },
  {
    'name': 'Salaried',
    'value': 'SALRIED'
  },
  {
    'name': 'Buisness',
    'value': 'BUISNESS'
  },
  {
    'name': 'Agriculturist',
    'value': 'AGRICULTURIST'
  },
  {
    'name': 'Professional',
    'value': 'PROFESSIONAL'
  }
];

export const occupationDetailOptionsHdfc = [
  {
    'name': 'Self-Employed',
    'value': 'SELF-EMPLOYED'
  },
  {
    'name': 'Salaried',
    'value': 'SALRIED'
  }
];

export const educationQualificationsOptionsIpru = [
  {
    'name': 'Post-Graduate',
    'value': 'POST-GRADUATE'
  },
  {
    'name': 'Graduate',
    'value': 'GRADUATE'
  },
  {
    'name': 'Diploma',
    'value': 'DIPLOMA'
  }
];

export const educationQualificationsOptionsMaxlife = [
  {
    'name': 'Post-Graduate',
    'value': 'POST-GRADUATE'
  },
  {
    'name': 'Graduate',
    'value': 'GRADUATE'
  },
  {
    'name': 'Professional',
    'value': 'PROFESSIONAL'
  }
];

export const occupationDetailOptionsMaxlife = [
  {
    'name': 'SALARIED',
    'value': 'SALRIED'
  },
  {
    'name': 'RETIRED',
    'value': 'RETIRED'
  },
  {
    'name': 'PROFESSIONAL',
    'value': 'PROFESSIONAL'
  },
  {
    'name': 'SELF-EMPLOYED',
    'value': 'SELF-EMPLOYED'
  },

  {
    'name': 'SELF-EMPLOYED-HOME',
    'value': 'SELF-EMPLOYED-HOME'
  },
  {
    'name': 'HOUSEWIFE',
    'value': 'HOUSEWIFE'
  },
  {
    'name': 'OTHERS',
    'value': 'OTHERS'
  }
];

export const occupationCategoryOptions = [
  {
    'name': 'Government',
    'value': 'GOVERNMENT'
  },
  {
    'name': 'Private',
    'value': 'PRIVATE'
  },
  {
    'name': 'Public',
    'value': 'PUBLIC'
  }
];

export const qualification = [
  'B A',
  'BAMS',
  'BAC',
  'B B A',
  'BCA',
  'B COM',
  'BDS',
  'B E',
  'B ED',
  'BHMS',
  'BMLT',
  'B M S',
  'B PHARM',
  'BPY',
  'B SC',
  'B TECH',
  'BUMS',
  'BACHELOR OF VETERINARY SCIENCE',
  'CA',
  'CFA',
  'CSC',
  'DCE',
  'DIPLOMA IN CIVIL ENGINEERING',
  'D ED',
  'DIPLOMA IN ELECTRICAL ENGINEERING',
  'DIPLOMA IN FASHION DESIGNING',
  'DIPLOMA IN GENERAL NURSING',
  'DIPLOMA IN INTERIOR DESIGNING',
  'DIPLOMA IN INSTRUMENTATION ENGINEERING',
  'DIPLOMA',
  'DIPLOMA IN MECHANICAL ENGINEERING',
  'DMLT',
  'DIPLOMA IN PHARMACY',
  'DTE',
  'GRD',
  'H S C',
  'ICWA',
  'ILLITERATE',
  'ITI',
  'LLB',
  'MASTER OF LAW',
  'M A',
  'M. ARCH.',
  'MBA',
  'MBBS',
  'MCA',
  'M.CH',
  'MCM',
  'M D',
  'M E',
  'MED',
  'MMS',
  'M PHARM',
  'M. PHIL',
  'MPY',
  'M S',
  'M SC',
  'M TECH',
  'PGR',
  'PG DIPLOMA  BUSINESS ADMIN',
  'PBM',
  'PG DIPLOMA MARKETING MANAGEMENT',
  'PHARMD',
  'PH.D.',
  'S S C',
  'UNDER MATRIC (CLASS L TO LX)'
];


export const payFreqOptionInsurance = [
  { name: 'Half-yearly', value: 'HALF YEARLY' },
  { name: 'Quarterly', value: 'Quarterly' },
  { name: 'Monthly', value: 'Monthly' }
]


export const quotePoints = {
  'HDFC': {
    basic_benefits: [
      'Lump sum payment of  ₹ 1 crore to your nominee',
      'Early claim on terminal illness',
      'Full premium waiver incase of  Total Permanent Disability',
      'Get tax benefit on premium under sec 80(C)',
      'No tax to be paid on claim amount under section 10 (10D)'
    ],
    add_on_benefits: [
      'Extra payout on Accidental  death or disability',
      'Full premium waiver incase of critical illness',
      'Cover against 19 critical illness'
    ],
    popup_info: {
      title: 'Plan benefits',
      content: 'This plan will cover your death (till x years of age) in all cases except suicide for the first year. Plan benefit includes a payout of Rs 1 Crore to your nominee. Additionally, full payout will happen in case of terminal illness and your entire premium will be waived of incase of  Total Permanent Disability.'
    }
  },
  'IPRU': {
    basic_benefits: [
      'Lump sum payment of  ₹ 1 crore to your nominee',
      'Early claim on terminal illness',
      'Full premium waiver incase of  Total Permanent Disability',
      'Get tax benefit on premium under sec 80(C)',
      'No tax to be paid on claim amount under section 10 (10D)'
    ],
    add_on_benefits: [
      'Extra payout on Accidental  death or disability',
      'Full premium waiver incase of critical illness',
      'Cover against 34 critical illness'
    ],
    popup_info: {
      title: 'Plan benefits',
      content: 'This plan will cover your death (till x years of age) in all cases except suicide for the first year. Plan benefit includes a payout of Rs 1 Crore to your nominee. Additionally, full payout will happen in case of terminal illness and your entire premium will be waived of incase of  Total Permanent Disability.'
    }
  },
  'Maxlife': {
    basic_benefits: [
      'Lump sum payment of  ₹ 1 crore to your nominee',
      'Get tax benefit on premium under sec 80(C)',
      'No tax to be paid on claim amount under section 10 (10D)'
    ],
    add_on_benefits: [
      'Extra payout on Accidental  death or disability',
      'Full premium waiver incase of critical illness',
      'Cover against 40 critical illness'
    ],
    popup_info: {
      title: 'Plan benefits',
      content: 'This plan will cover your death (till x years of age) in all cases except suicide for the first year. Plan benefit includes a payout of Rs 1 Crore to your nominee.'
    }
  }
};

export const add_on_benefits_points = {
  'ci_benefit': {
    'title': 'Waiver of premium',
    'benefit': 'All your future premium will be waived of in case you are diagnosed with critical illness or dismemberment (disability)',
    'content': "This additional benefits gives you relief in case of critical illness and disability, by waiving of all your future premiums. So, let say you have taken a cover amount of Rs 1 Cr and paying Rs 656 monthly premium. In case you are diagnosed with critical illness or disability, you don't need to pay monthly premium of Rs 656, and your policy continues. "
  },
  'ci_amount': {
    'title': 'Critical Illness Rider',
    'benefit': 'On diagnosis of CI, get immediate payout of the critical illness cover amount',
    'content': 'This additional benefit, cover yourself against 40 critical illness. Let say you have taken a coverage of Rs 1 crore, and Rs 15 Lakh as Critical Illness Rider. So, incase of diagnosis of critical illness you will get Rs 15 Lakh and policy will continue with remaining Rs 85 Lakh as cover amount. '
  },
  'accident_benefit': {
    'title': 'Accidental Death Benefit',
    'benefit': 'Get additional cover in case of Death or disability',
    'content': 'Incase of death due to accident or disability due to accident, your family (nominee) gets an additional amount. For e.g  some one who has taken a life cover of Rs 1 Crore and added 10 Lakh of accidental benefit cover, will get Rs 10 Lakh cover immediately in case of disability due to accident and life cover of 1 crore remains intact. '
  }
}

export const all_providers = { 'HDFC': '', 'IPRU': '', 'Maxlife': '' };

export const back_button_mapper = {
  '/insurance/quote': '/insurance/lifestyle',
  '/insurance/lifestyle': '/insurance/cover-period',
  '/insurance/cover-period': '/insurance/cover-amount',
  '/insurance/cover-amount': '/insurance/annual-income',
  '/insurance/annual-income': '/insurance/personal-details-intro',
  '/insurance/personal-details-intro': '/insurance/journey-intro',
  '/insurance/journey-intro': '/insurance/intro'
};
