import {isEmpty} from 'utils/validators';

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

export const smokingOptions = [
  {
    'name': 'Yes',
    'value': 'YES'
  },
  {
    'name': 'No',
    'value': 'NO'
  }
]

export const yesNoOptions = [
  {
    'name': 'Yes',
    'value': 'YES'
  },
  {
    'name': 'No',
    'value': 'NO'
  }
]

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

export const relationshipOptionsGroupInsuranceAll = {
  'male' : ["WIFE", "BROTHER", "SISTER", "MOTHER", "FATHER", "SON", "DAUGHTER", "GRANDSON", "GRANDDAUGHTER",
  "NEPHEW", "NIECE", "GRANDFATHER", "GRANDMOTHER",  "UNCLE", "AUNT"],
  'female' : ["HUSBAND", "BROTHER", "SISTER", "MOTHER", "FATHER", "SON", "DAUGHTER", "GRANDSON", "GRANDDAUGHTER",
  "NEPHEW", "NIECE", "GRANDFATHER", "GRANDMOTHER", "UNCLE", "AUNT"],
}
export const relationshipOptionsGroupInsurance = [
  "BROTHER", "SISTER", "MOTHER", "FATHER", "SON", "DAUGHTER", "GRANDSON", "GRANDDAUGHTER",
  "NEPHEW", "NIECE", "GRANDFATHER", "GRANDMOTHER", "WIFE", "HUSBAND", "UNCLE", "AUNT"
]

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
    'value': 'SELF-EMPLOYED-FROM-HOME'
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

export const ridersOptionInsurance = [
  { name: 'Waiver of premium after Critical Illness', value: 'ci_benefit' },
  { name: 'Accidental death benefits', value: 'accident_benefit' },
  { name: 'No Rider', value: 'no_riders' }
]


export const quotePoints = {
  'HDFC': {
    basic_benefits: [
      'Lump sum payment of  ₹ 1 crore to your nominee',
      '100% of sum assured payable in case of death',
      'Early claim on terminal illness',
      'Full waiver of premium in case of total permanent disability',
      'Tax benefit on premium under 80C'
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
  'KOTAK': {
    basic_benefits: [
      '100% of sum assured payable in case of death',
      'Multiple rider options available',
      'Easy claim settlement process',
      'Tax benefit on premium under 80C'
    ],
    add_on_benefits: [
      'Accidental death benefit rider',
      'Permanent disability benefit rider',
      'Critical illness benefit rider'
    ],
    popup_info: {
      title: '',
      content: ''
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

export const quotePointsPorivders = {
  'HDFC': {
    basic_benefits: [
      '100% of sum assured payable in case of death',
      'Early claim on terminal illness',
      'Full waiver of premium in case of total permanent disability',
      'Tax benefit on premium under 80C'
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
  'KOTAK': {
    basic_benefits: [
      '100% of sum assured payable in case of death',
      'Multiple rider options available',
      'Easy claim settlement process',
      'Tax benefit on premium under 80C'
    ],
    add_on_benefits: [
      'Accidental death benefit rider',
      'Permanent disability benefit rider',
      'Critical illness benefit rider'
    ],
    popup_info: {
      title: '',
      content: ''
    }
  },
  'EDELWEISS': {
    basic_benefits: [
      'Complete sum assured payable in case of death',
      'Option to increase your sum assured regularly or at key life stages',
      'Tax benefits on premium under 80C^'
    ],
    add_on_benefits: [
      'Better half benefit option',
      'Option of waiver of premium benefit is available in case of one of the covered critical illnesses'
    ],
    popup_info: {
      title: '',
      content: ''
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
  '/group-insurance/term/quote': '/group-insurance/term/lifestyle',
  '/group-insurance/term/lifestyle': '/group-insurance/term/cover-period',
  '/group-insurance/term/cover-period': '/group-insurance/term/cover-amount',
  '/group-insurance/term/cover-amount': '/group-insurance/term/annual-income',
  '/group-insurance/term/annual-income': '/group-insurance/term/personal-details-intro',
  '/group-insurance/term/personal-details-intro': '/group-insurance/term/intro',
  '/group-insurance/term/journey-intro': '/group-insurance/term/intro',
  '/group-insurance/term/summary': '/group-insurance/term/journey',
  '/group-insurance/term/etli/personal-details3': '/group-insurance/term/etli/personal-details2',
  '/group-insurance/term/etli/personal-details2': '/group-insurance/term/etli/personal-details1',
  '/group-insurance/term/etli/personal-details1': '/group-insurance/term/intro',
  '/group-insurance/term/personal-details-redirect' : '/group-insurance/term/intro',
  '/group-insurance/term/intro' : '/group-insurance',
  '/group-insurance/group-health/entry' : '/group-insurance/health/landing',
  '/group-insurance/health/landing': '/group-insurance'
};

export const insuranceMaritalStatus = [
  {
    'name': 'Single',
    'value': 'UNMARRIED'
  },
  {
    'name': 'Married',
    'value': 'MARRIED'
  }
]

export const insuranceMaritalStatusEtli = [
  {
    'name': 'Single',
    'value': 'UNMARRIED'
  },
  {
    'name': 'Married',
    'value': 'MARRIED'
  }
]

export const insuranceStateMapper = {
  'HEALTH': 'health',
  'SMART_WALLET': 'wallet',
  'PERSONAL_ACCIDENT': 'accident',
  'HOSPICASH': 'hospicash',
  'term_insurance': 'term',
  'DENGUE': 'dengue',
  'CORONA': 'corona'
}

export const insuranceProductTitleMapper = {
  'HEALTH': 'Health',
  'SMART_WALLET': 'Smart wallet',
  'PERSONAL_ACCIDENT': 'Personal accident insurance',
  'HOSPICASH': 'Hospital daily cash',
  'term_insurance': 'Term Insurance',
  'DENGUE': 'Dengue insurance',
  'CORONA': 'Coronavirus insurance',
}

export function getBhartiaxaStatusToState(policy) {
  let status = policy.status;
  let payment_status = policy.lead_payment_status;
  let path = '';
  if (status === 'complete') {
    path = 'plan';
  } else if (status === 'init' && payment_status === 'payment_done') {
    path = 'payment-success';
  } else {
    path = 'plan';
  }

  return path;
}

export const health_providers = {
  'HDFCERGO': {
      key: 'HDFCERGO',
      title: 'HDFC ERGO',
      subtitle: 'my: health Suraksha',
      logo: 'hdfc_ergo_ic_logo_cta.svg',
      logo_card: 'hdfc_ergo_ic_logo_card.svg',
      logo_cta: 'hdfc_ergo_ic_logo_cta.svg',
      logo_summary: 'hdfc_ergo_ic_logo_summary.svg'
  }
}


export function ghGetMember(lead, providerConfig) {
  
  const backend_keys = [
    'self_account_key',
    'spouse_account_key',
    'parent_account1_key',
    'parent_account2_key',
    'parent_inlaw_account1_key',
    'parent_inlaw_account2_key'
  ];
  const { add_members_screen: { son_max, daughter_max }} = providerConfig;

  let backend_child_keys = [];
  for (let i = 0; i < (son_max + daughter_max); i++) {
    backend_child_keys.push(`child_account${i+1}_key`);
  }
  
  const allowed_as_per_account = {
    'self': ['self_account_key'],
    'family': ['spouse_account_key'].concat(backend_child_keys),
    'selfandfamily': ['self_account_key', 'spouse_account_key'].concat(backend_child_keys),
    'parents': ['parent_account1_key', 'parent_account2_key'],
    'parentsinlaw': ['parent_inlaw_account1_key', 'parent_inlaw_account2_key'],
  };
  const allowed_mapper = allowed_as_per_account[lead.account_type];
  let member_base = [];
  
  // Map all remaining keys
  for (let key of backend_keys) {
    let obj = lead[key];

    if (allowed_mapper.includes(key) && obj && !isEmpty(obj)) {
      Object.assign(obj, {
        backend_key: key,
        key: (obj.relation || '').toLowerCase(),
      });
      member_base.push(obj);
    }
  }

  let total_son = 0, total_daughter = 0;

  for (let i = 1; i <= (son_max + daughter_max); i++) {
    if (!isEmpty(lead[`child_account${i}_key`])) {
      if ((lead[`child_account${i}_key`].relation || '').toUpperCase() === 'SON') {
        total_son++;
      } else if ((lead[`child_account${i}_key`].relation || '').toUpperCase() === 'DAUGHTER') {
        total_daughter++;
      }
    }
  }

  let daughter_count = 1, son_count = 1;
  // Map all children keys
  for (let childKey of backend_child_keys) {
    let obj = lead[childKey];

    if (allowed_mapper.includes(childKey) && obj && !isEmpty(obj)) {
      obj.backend_key = childKey;
      obj.key = (obj.relation || '').toLowerCase();

      if ((obj.relation || '').toUpperCase() === 'SON' && total_son > 1) {
        obj.key = `son${son_count}`;
        son_count++;
      } else if ((obj.relation || '').toUpperCase() === 'DAUGHTER' && total_daughter > 1) {
        obj.key = `daughter${daughter_count}`;
        daughter_count++;
      }
      member_base.push(obj);
    }
  }

  
  if(['parents', 'parentsinlaw', 'family'].includes(lead.account_type)) {
    let obj = lead['self_account_key'];
    obj.backend_key = 'self_account_key';
    obj.key = 'applicant';
    member_base.push(obj);
  }
  
  return member_base;

}

export function getCssMapperReport(policy) {

  let provider = policy.provider;

  let cssMapper = {
    'init': {
      color: 'yellow',
      disc: 'Policy Pending'
    },
    'request_pending': {
      color: 'yellow',
      disc: 'Status awaited from'
    },
    'incomplete': {
      color: 'yellow',
      disc: 'Policy Pending'
    },
    'policy_issued': {
      color: 'green',
      disc: 'Policy Issued'
    },
    'success': {
      color: 'green',
      disc: 'Policy Issued'
    },
    'complete': {
      color: 'green',
      disc: 'Policy Issued'
    },
    'policy_expired': {
      color: 'red',
      disc: 'Policy Expired'
    },
    'rejected': {
      color: 'red',
      disc: 'Policy Rejected'
    },
    'failed': {
      color: 'red',
      disc: 'Policy Failed'
    },
    'cancelled': {
      color: 'red',
      disc: 'Policy Cancelled'
    }
  }

  if(['HDFCERGO', 'STAR', 'RELIGARE'].includes(provider)) {
   
    cssMapper.complete.disc = 'Issued on ' + (policy.dt_policy_start || '');
    cssMapper.success.disc = 'Issued on ' + (policy.dt_policy_start || '');
  }


  let obj = {};
  let policy_status = policy.status;

  if (policy.key === 'TERM_INSURANCE') {
    if (policy_status === 'failed') {
      obj.status = 'rejected';
    } else if (policy_status === 'success') {
      obj.status = 'policy_issued';
    } else {
      obj.status = 'init';
    }
  } else {
    obj.status = policy_status;
  }

  obj.cssMapper = cssMapper[obj.status] || cssMapper['init'];

  if(policy_status === 'request_pending') {
    if(provider === 'STAR') {
      obj.cssMapper.disc += ` Star Health`;
    } else {
      obj.cssMapper.disc += ` ${policy.status_title || policy.key}`;
    }
  }

  return obj;
}

export function childeNameMapper(name) {
  let mapper = {
    'son1': '1st Son',
    'son2': '2nd Son',
    'son3': '3rd Son',
    'son4': '4th Son',
    'daughter1': '1st Daughter',
    'daughter2': '2nd Daughter',
    'daughter3': '3rd Daughter',
    'daughter4': '4th Daughter',
    'father_in_law': 'father in law',
    'mother_in_law': 'mother in law'
  };

  return mapper[name] || name;
  
}