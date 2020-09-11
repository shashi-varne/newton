export const HDFCERGO_CONFIG = {
    key: 'HDFCERGO',
    provider_api: 'hdfcergo',
    title: 'HDFC ERGO',
    subtitle: 'my: health Suraksha',
    logo: 'hdfc_ergo_ic_logo_cta.svg',
    logo_card: 'hdfc_ergo_ic_logo_card.svg',
    logo_cta: 'hdfc_ergo_ic_logo_cta.svg',
    logo_summary: 'hdfc_ergo_ic_logo_summary.svg',
    show_ind_mem_premium: true,
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        plan_dob_screen: 'plan-select-city',
    },
    validation_props: {
        'dob_adult': { min: 19, max: 90 },  //add one year for minimum age here 18 to 19
        'dob_child': { minMonth: 3, max: 25 },
        'dob_married_male': { min: 22, max: 25 },
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    landing_screen: {
        offerImageData: [
            { src: 'icn_landing_card_1.svg' },
            { src: 'icn_landing_card_2.svg' },
            { src: 'icn_landing_card_3.svg' }
        ],
        whats_covered: [
            'Diseases occurred before policy issuance will be covered after 3 years',
            'Ayurveda, unani, sidha and homeopathy  treatments',
            '60 days pre and 180 days post hospitalization expenses',
            'Organ donor expenses',
            'Mental health and home health care'
        ],
        whats_not_covered: [
            'Maternity',
            'Self-inflicted injuries',
            'Adventure sport injuries',
            'Injuries caused due to participation in defense operations/war',
            'Venereal or Sexually transmitted diseases'
        ],
        faq_data: {
            'header_title': 'Frequently asked questions',
            'header_subtitle': 'my: health Suraksha',
            'steps': {
                'options': [
                    {
                        'title': 'Why do I need health insurance?',
                        'subtitle': 'With the advancement in technology and the availability of more effective treatments, the cost of healthcare has steeply increased. Health insurance policy ensures that medical bills and hospitalization expenses should not get paid from your hard-earned money. It takes care of the hospitalization and treatment charges as well as provides assured tax benefit under section 80D of Income Tax.'
                    },
                    {
                        'title': 'What are the benefits of having a health insurance policy?',
                        'subtitle': 'Having a health insurance policy covers expenses incurred due to hospitalization. This includes in-patient treatments, pre and post hospitalization expenses, daycare procedures, home healthcare, etc.'
                    },
                    {
                        'title': 'Can I change the hospital during the course of treatment?',
                        'subtitle': 'Yes, if needed you can change the hospital during the treatment. However, you might need to provide the necessary information for a smooth claim process of your health insurance plan.'
                    },
                    {
                        'title': 'Is the health insurance coverage applicable worldwide?',
                        'subtitle': 'In certain conditions, you might be eligible for reimbursement of overseas treatment, such as pre-diagnosed planned hospitalization, outpatient treatment, and second opinion in case of sudden illness while traveling under your health insurance plan.'
                    },
                    {
                        'title': 'Does my policy cover diagnostic charges?',
                        'subtitle': 'Most pre-hospitalization and post-hospitalization expenses (up to 60 days) are covered under the health insurance policy, such as X - rays, CT scans, MRI, ultrasound nursing, physicians, medicines, etc.'
                    }
                ],
            },
            'cta_title': 'OK'
        }
    },
    insure_type_screen: {
        account_type_options: [
            {
              'name': 'Self',
              'value': 'self'
            },
            {
              'name': 'Family members',
              'value': 'family'
            },
            {
              'name': 'Self & family members',
              'value': 'selfandfamily'
            },
            {
              'name': 'Parents',
              'value': 'parents'
            }
          ]
    },
    add_members_screen: {
        son_max: 2,
        daughter_max: 2,
        total_plus_minus_max: 2
    },
    plan_list_screen: {
        tile_mid_data: [
            {'label': 'Sum assured:', 'key': 'sum_assured_options_text'},
            {'label': 'Recovery benefit:', 'key': 'recovery_benefit_extra', 'tooltip_key': 'recovery_benefit_content'},
            {'label': 'Allowances:', 'key': 'allowances'}
        ]
    },
    nominee_screen: {
        nominee_opts: [],
    },
   
};

export const religare = {
    key: 'RELIGARE',
    provider_api: 'religare',
    title: 'Religare',
    subtitle: 'Care',
    logo: 'ic_religare_logo.jpg',
    logo_card: 'ic_logo_card.jpg',
    logo_cta: 'ic_religare_logo.jpg',
    logo_summary: 'ic_religare_logo.jpg',
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        insure_type_screen: 'plan-dob-religare',
        add_members_screen: 'plan-dob-religare',
        religare_dob: 'plan-list',
        plan_list_screen: 'plan-details',
        plan_details_screens: 'plan-select-sum-assured',
        sum_assured_screen: {
            floater: 'plan-select-floater',
            not_floater : 'plan-select-add-ons'
        },
        cover_type_screen: 'plan-select-add-ons',
        add_ons_screen: 'plan-select-cover-period'
    },
    validation_props: {
        'dob_adult': { min: 19, max: 90 },  //add one year for minimum age here 18 to 19
        'dob_child': { minMonth: 3, max: 25 },
        'dob_married_male': { min: 22, max: 25 },
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    landing_screen: {
        offerImageData: [
            { src: 'icn_landing_card_1.svg' },
            { src: 'icn_landing_card_2.svg' },
            { src: 'icn_landing_card_3.svg' }
        ],
        whats_covered: [
            '30 days pre and 60 days post hospitalization expenses',
            'Pre-existing disease after 4 years',
            'Ayurveda, Unani, Sidha and Homeopathy treatments',
            'Organ donor expenses',
            'Domiciliary Hospitalisation'
        ],
        whats_not_covered: [
            'Maternity',
            'Self-inflicted injuries',
            'Plastic surgery',
            'External congenital diseases',
            'Mental health',
            'Adventure sport injuries',
            'Venereal or Sexually transmitted diseases',
            'Eye/Dental treatment',
        ],
        faq_data: {
            'header_title': 'Frequently asked questions',
            'header_subtitle': '',
            'steps': {
                'options': [
                    {
                        'title': 'Is coronavirus treatment covered in this plan?',
                        'subtitle': 'Yes, this health insurance policy for family covers hospitalisation expenses to Corona Virus (COVID-19) subject to all terms and conditions of the policy.'
                    },
                    {
                        'title': 'Is there any free health check-up in your policy?',
                        'subtitle': 'Yes, there is a free Annual Health Check-up for all the insured members every year regardless of claim history.'
                    },
                    {
                        'title': 'Can I cancel my policy once purchased?',
                        'subtitle': 'Yes, within 15 days from the receipt of the policy document you may return/cancel the policy, and premium after proportionate deduction would be refunded.'
                    },
                    {
                        'title': 'How does Auto recharge work?',
                        'subtitle': 'Sum Insured will be automatically restored (once every policy year) in case the sum insured and any no claim bonus accumulated is exhausted during the policy year. It cannot be used against an illness/disease for which a claim has already been made in the current policy year.'
                    },
                    {
                        'title': 'What is the waiting period for existing diseases? Can it be reduced?',
                        'subtitle': 'There is a waiting period of 48 months for existing and 24 months for specified diseases. This waiting period of 48 months can be reduced by taking the additional cover of ‘Reduction in PED Wait Period’'
                    },
                    {
                        'title': 'What do you mean by Network Hospital?',
                        'subtitle': 'Network Hospital is one, which has an agreement with Religare Health Insurance for providing Cashless treatment to its customers. You can view the list of Network hospitals here '
                    },
                    {
                        'title': 'What is a No Claim Bonus?',
                        'subtitle': 'A Policyholder, who hasn’t made any claim in a year, will have his Sum Insured increased by a certain amount (bonus). CARE offers a 10% increase in the policy sum insured for every claim-free year, with no change in premium.'
                    },
                    {
                        'title': 'How to file and track your claim?',
                        'subtitle': 'You can file a claim by contacting Religare customer help desk at customerfirst@religarehealthinsurance.com or 1800-200-4488. Claim status can be tracked online here or contacting customer care at the above number.'
                    },
                    {
                        'title': 'How much time does it take for a claim to be processed?',
                        'subtitle': 'For cashless claims it takes 4 hrs and for reimbursement claims, it takes 5 working days to get processed, provided all the documents are in order.'
                    },
                ],
            },
            'cta_title': 'OK'
        }
    },
    insure_type_screen: {
        account_type_options: [
            {
                'name': 'Self',
                'value': 'self'
            },
            {
                'name': 'Family members',
                'value': 'family'
            },
            {
                'name': 'Self & family members',
                'value': 'selfandfamily'
            },
            {
                'name': 'Parents',
                'value': 'parents'
            }
        ]
    },
    add_members_screen: {
        son_max: 2,
        daughter_max: 2,
        total_plus_minus_max: 2
    },
    plan_list_screen: {
        tile_mid_data: [
            { 'label': 'Sum insured::', 'key': 'sum_assured_options_text' },
            { 'label': 'Hospital room:', 'key': 'hospital_room' },
            { 'label': 'Daily allowance:', 'key': 'alternative_treatment' }
        ]
    },
    nominee_screen: {
        nominee_opts: [],
    },
};
export const star = {

};


export function getGhProviderConfig(provider) {
    let mapper = {
        'HDFCERGO': HDFCERGO_CONFIG,
        'RELIGARE': religare,
    };

    return mapper[provider];
}