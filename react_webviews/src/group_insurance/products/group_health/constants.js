export const HDFCERGO_CONFIG = {
    key: 'HDFCERGO',
    title: 'HDFC ERGO',
    subtitle: 'my: health Suraksha',
    logo: 'hdfc_ergo_ic_logo_cta.svg',
    logo_card: 'hdfc_ergo_ic_logo_card.svg',
    logo_cta: 'hdfc_ergo_ic_logo_cta.svg',
    logo_summary: 'hdfc_ergo_ic_logo_summary.svg',
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

};
export const star = {

};


export function getGhProviderConfig(provider) {
    let mapper = {
        'HDFCERGO': HDFCERGO_CONFIG
    }

    return mapper[provider];
}