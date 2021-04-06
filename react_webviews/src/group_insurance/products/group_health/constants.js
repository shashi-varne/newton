export const hdfc = {
    key: 'HDFCERGO',
    provider_api: 'hdfc_ergo',
    title: 'HDFC ERGO',
    title2: 'my: health Suraksha',
    subtitle: 'my: health Suraksha',
    address_field_max_length: 70,
    logo: 'hdfc_ergo_ic_logo_cta.svg',
    logo_card: 'hdfc_ergo_ic_logo_card.svg',
    logo_cta: 'hdfc_ergo_ic_logo_cta.svg',
    logo_summary: 'hdfc_ergo_ic_logo_summary.svg',
    show_ind_mem_premium: true,
    pan_amount: 100000,
    claim_settlement_ratio: 98.88,
    covers_text:{
        title: 'Coverage for all',
        subtitle: 'Option to cover your entire family (spouse, kids and parents)'
    },
    member_assets: ['icn_couple.svg', 'icn_kids.svg', 'icn_parents.svg'],
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        plan_dob_screen: 'plan-select-city',
        nominee_screen: 'is-ped'
    },
    validation_props: {
        'dob_adult': { min: 18, max: 90 },
        'dob_child': { minDays: 90, max: 25 },
        'dob_married_male': { min: 21, max: 90 },
        'dob_married_female': {min: 18 , max:90}
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    hdfc_plan_title_mapper : {
        'hdfc_ergo_silver_smart': 'Silver Smart Plan',
        'hdfc_ergo_gold_smart': 'Gold Smart Plan',
        'hdfc_ergo_platinum_smart' : 'Platinum Smart Plan'
    },
    landing_screen: {
        image_list: ['ic_why_hs.svg','ic_why_hs_gmc_3.svg', 'ic_why_hs3.svg', 'ic_why_hs4.svg'],
        offerImageData: [
            { src: 'hdfc_icn_landing_card_1.png' },
            { src: 'hdfc_icn_landing_card_2.png' },
            { src: 'hdfc_icn_landing_card_3.png' }
        ],
        whats_covered: [
            'Diseases occurred before policy issuance will be covered after 3 years',
            'Ayurveda, unani, sidha and homeopathy  treatments',
            '60 days pre and 180 days post hospitalisation expenses',
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
                        'subtitle': 'With the advancement in technology and the availability of more effective treatments, the cost of healthcare has steeply increased. Health insurance policy ensures that medical bills and hospitalisation expenses should not get paid from your hard-earned money. It takes care of the hospitalisation and treatment charges as well as provides assured tax benefit under section 80D of Income Tax.'
                    },
                    {
                        'title': 'What are the benefits of having a health insurance policy?',
                        'subtitle': 'Having a health insurance policy covers expenses incurred due to hospitalisation. This includes in-patient treatments, pre and post hospitalisation expenses, daycare procedures, home healthcare, etc.'
                    },
                    {
                        'title': 'Can I change the hospital during the course of treatment?',
                        'subtitle': 'Yes, if needed you can change the hospital during the treatment. However, you might need to provide the necessary information for a smooth claim process of your health insurance plan.'
                    },
                    {
                        'title': 'Is the health insurance coverage applicable worldwide?',
                        'subtitle': 'In certain conditions, you might be eligible for reimbursement of overseas treatment, such as pre-diagnosed planned hospitalisation, outpatient treatment, and second opinion in case of sudden illness while traveling under your health insurance plan.'
                    },
                    {
                        'title': 'Does my policy cover diagnostic charges?',
                        'subtitle': 'Most pre-hospitalisation and post-hospitalisation expenses (up to 60 days) are covered under the health insurance policy, such as X - rays, CT scans, MRI, ultrasound nursing, physicians, medicines, etc.'
                    }
                ],
            },
            'cta_title': 'OK'
        }
    },
    insure_type_screen: {
        bottom_info_text : 'Pro Tip: The first step to get financial stability is to be medically insured along with your family',
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
                'value': 'self_family'
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
            { 'label': 'Sum insured:', 'key': 'sum_assured_options_text' },
            { 'label': 'Recovery benefit:', 'key': 'recovery_benefit_extra', 'tooltip_key': 'recovery_benefit_content' },
            { 'label': 'Allowances:', 'key': 'allowances' }
        ]
    },
    nominee_screen: {
        nominee_opts: [
            {
                'name': 'SIBLING',
                'value': 'SIBLING'
            },
            {
                'name': 'CHILD',
                'value': 'CHILD'
            },
            {
                'name': 'NIECE',
                'value': 'NIECE'
            },
            {
                'name': 'GRANDPARENT',
                'value': 'GRAND PARENT'
            },
            {
                'name': 'GRANDCHILD',
                'value': 'GRAND CHILD'
            },
            {
                'name': 'BROTHER IN LAW',
                'value': 'BROTHER IN LAW'
            },
            {
                'name': 'SISTER IN LAW',
                'value': 'SISTER IN LAW'
            },
            {
                'name': 'NEPHEW',
                'value': 'NEPHEW'
            },
            {
                'name': 'PARENT',
                'value': 'PARENT'
            },
            {
                'name': 'SPOUSE',
                'value': 'SPOUSE'
            },
            // {
            //     'name' : 'OTHER RELATIVE',
            //     'value': 'OTHER RELATIVE'
            // }
        ]
    },
    select_ped_screen: {
        ped_list: [
            { 'name': 'Acute Gastroenteritis/AGE/Diarrhoea/Loose Motions/Vomiting' ,   "id": "hdfc_ergo_ped_diarrhoea",},
            { 'name': 'Adenoid/ Adenoidectomy',  "id": "hdfc_ergo_ped_adenoid_adenoidectomy", },
            {'name' : 'Tuberculosis', 'id': 'hdfc_ergo_ped_tuberculosis'},
            { 'name': 'Hypothyroid' , "id" : "hdfc_ergo_ped_hypothyroid"},
            {'name':  'Renal Calculus/Kidney Stone/Urinary Calculus', "id":'hdfc_ergo_ped_renal_kidneystone_urinary'},
            { 'name': 'Cataract - 1 Eye/Both Eyes' ,    "id": "hdfc_ergo_ped_cataract" },
            { 'name': 'Cholesterol/Triglyceride/Dyslipidaemia/Hyperlipidaemia', "id": "hdfc_ergo_ped_cholesterol", },
            { 'name': 'Tonsil/Tonsillectomy' ,  "id": "hdfc_ergo_ped_tonsils_tonsillectomy", },
            {'name' : 'Fistula', 'id' : 'hdfc_ergo_ped_fistula'},
            { 'name': 'Piles/Haemorrhoids', 'id': 'hdfc_ergo_ped_piles_haemorrhoids'},
            {'name' : 'Hernia/Inguinal Hernia/Umbilical Hernia' , 'id': 'hdfc_ergo_ped_hernia'},
            { 'name': 'Asthma', 'id': 'hdfc_ergo_ped_asthma'},
            { 'name': 'Fall/Accidental Injury' ,   "id": "hdfc_ergo_ped_fall_accidental_injury"},
            { 'name': 'Fissure',  "id": "hdfc_ergo_ped_fissure", },
            { 'name': 'Fever/Viral Fever/Enteric Fever/Typhoid/Malaria/Dengue', "id": "hdfc_ergo_ped_fever"  },
            { 'name': 'Fibroid/Myomectomy',  "id": "hdfc_ergo_ped_fibroid_myomectomy" },
            { 'name': 'Fracture with implant/rod/screw/plate' , "id": "hdfc_ergo__ped_fracture_with_implant",},
            { 'name': 'Fracture without implant/rod/screw/plate' , 'id':'hdfc_ergo_ped_fracture_without_implant'},
            {'name':  'Hysterectomy/Uterus removal', 'id':'hdfc_ergo_ped_uterus_removal'},
            {'name':  'Hypertension/Blood pressure', 'id' : 'hdfc_ergo_hypertension_blood_pressure'},
            {'name':  'Diabetes/High Sugar', 'id': 'hdfc_ergo_ped_diabetes'},
            {'name' : 'Cholecystectomy/Gall bladder surgery/removal', 'id':'hdfc_ergo_ped_gall_bladder_removal'},
            {'name':  'Piles/Haemorrhoids', 'id' : 'hdfc_ergo_ped_appendix'},
            { 'name': 'Other' ,  "id": "hdfc_ergo_ped_other_diseases", }
        ]
    },
    payment_screen: {
        total_cities: 10000
    }

};

export const religare = {
    key: 'RELIGARE',
    provider_api: 'religare',
    title: 'Care Health (formerly Religare)',
    title2: 'Care Health',
    subtitle: 'Care',
    address_field_max_length: 60,
    logo: 'ic_religare_logo.svg',
    logo_card: 'ic_religare_logo_card.svg',
    logo_cta: 'ic_religare_logo.svg',
    logo_summary: 'ic_religare_logo.svg',
    pan_amount: 50000,
    claim_settlement_ratio: 92.58,
    covers_text:{
        title: 'Covers your family',
        subtitle: 'Option to cover your entire family (spouse, kids and parents)'
    },
    member_assets: ['icn_couple.svg', 'icn_kids.svg', 'icn_parents.svg'],
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        insure_type_screen: 'plan-dob-religare',
        add_members_screen: 'plan-dob',
        plan_dob_screen: 'plan-list',
        religare_dob: 'plan-list',
        plan_list_screen: 'plan-details',
        plan_details_screens: 'plan-select-sum-assured',
        sum_assured_screen: {
            floater: 'plan-select-floater',
            not_floater: 'plan-select-add-ons'
        },
        cover_type_screen: 'plan-select-add-ons',
        add_ons_screen: 'plan-select-cover-period',
        nominee_screen: 'plan-lifestyle-details'
    },
    validation_props: {
        'dob_adult': { min: 18, max: 99 }, 
        'dob_child': { minDays: 91, minAge: 5, max: 25 },
        'dob_married_male': { min: 18, max: 99 },
        'dob_married_female': {min: 18}
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    add_on_title : {
        uar: 'Unlimited Automatic Recharge',
        opd: 'OPD care',
        ped_wait_period: 'Reduction in PED wait period',
        ncb: 'No Claim Bonus Super'
    },
    landing_screen: {
        image_list: ['ic_why_hs.svg','ic_why_hs_gmc_3.svg', 'ic_why_hs3.svg', 'ic_why_hs4.svg'],
        offerImageData: [
            { src: 'religare_icn_landing_card_1.png' },
            { src: 'religare_icn_landing_card_2.png' },
            { src: 'religare_icn_landing_card_3.png' }
        ],
        whats_covered: [
            '30 days pre and 60 days post hospitalisation expenses',
            'Treatment of pre-existing disease after 4 years',
            'Ayurveda, Unani, Sidha and Homeopathy treatments',
            'Organ donor expenses',
            'Domiciliary Hospitalisation'
        ],
        whats_not_covered: [
            'Maternity',
            'Plastic surgery',
            'External congenital diseases',
            'Mental health',
            'Eye/Dental treatment',
        ],
        faq_data: {
            'header_title': 'Frequently asked questions',
            'header_subtitle': '',
            'steps': {
                'options': [
                    {
                        'title': 'Is coronavirus treatment covered in this plan?',
                        'subtitle': 'Yes, this health insurance policy for family covers hospitalisation expenses to Coronavirus (COVID-19) subject to all terms and conditions of the policy.'
                    },
                    {
                        'title': 'Is there any free health check-up in your policy?',
                        'subtitle': 'Yes, there is a free annual health check-up for all the insured members every year regardless of claim history.'
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
                        'title': 'What do you mean by Network hospital?',
                        'subtitle': 'Network hospital is one, which has an agreement with Care Health Insurance for providing cashless treatment to its customers.'
                    },
                    {
                        'title': 'What is a No Claim Bonus?',
                        'subtitle': 'A policyholder, who hasn’t made any claim in a year, will have his Sum insured increased by a certain amount (bonus). CARE offers a 10% increase in the policy sum insured for every claim-free year, with no change in premium.'
                    },
                    {
                        'title': 'How to file and track your claim?',
                        'subtitle': 'You can file a claim by contacting Care Health customer help desk at customerfirst@careinsurance.com or 1800-102-4488.'
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
        bottom_info_text : 'Pro Tip: The first step to get financial stability is to be medically insured along with your family',
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
                'value': 'self_family'
            },
            {
                'name': 'Parents',
                'value': 'parents'
            }
        ]
    },
    add_members_screen: {
        son_max: 4,
        daughter_max: 4,
        total_plus_minus_max: 4
    },
    plan_list_screen: {
        tile_mid_data: [
            { 'label': 'Sum insured::', 'key': 'sum_assured_options_text' },
            { 'label': 'Hospital room:', 'key': 'hospital_room' },
            { 'label': 'Daily allowance:', 'key': 'alternative_treatment' }
        ]
    },
    nominee_screen: {
        nominee_opts: [
            {
                'name': 'BROTHER',
                'value': 'BROTHER'
            },
            {
                'name': 'FATHER',
                'value': 'FATHER'
            },
            {
                'name': 'GRAND FATHER',
                'value': 'GRANDFATHER'
            },
            {
                'name': 'GRAND MOTHER',
                'value': 'GRANDMOTHER'
            },
            {
                'name': 'BROTHER IN LAW',
                'value': 'BROTHER_IN_LAW'
            },
            {
                'name': 'MOTHER IN LAW',
                'value': 'MOTHER_IN_LAW'
            },
            {
                'name': 'SISTER IN LAW',
                'value': 'SISTER_IN_LAW'
            },
            {
                'name': 'MOTHER',
                'value': 'MOTHER'
            },
            {
                'name': 'SISTER',
                'value': 'SISTER'
            },
            {
                'name': 'SON',
                'value': 'SON'
            },
            // {
            //     'name': 'SPOUSE',
            //     'value': 'SPOUSE'
            // },
            {
                'name': 'DAUGHTER',
                'value': 'DAUGHTER'
            },
            {
                'name': 'WIFE',
                'value': 'WIFE'
            },
            {
                'name': 'HUSBAND',
                'value': 'HUSBAND'
            }
        ],

    },
    select_ped_screen: {
        ped_list: [
            {
                'name': 'Diabetes',
                id: 'ped_no_1',
                tag: 'PEDdiabetesDetails',
                "key" : 'religare_ped_diabetes',
                description: 'Diabetes Mellitus type 1 or Diabetes on insulin or Diabetes associated with blindness or chronic foot ulcer',
            },
            {
                'name': 'Hypertension',
                id: 'ped_no_2',
                tag: 'PEDhyperTensionDetails',
                "key" :  "religare_ped_hypertension",
                description: 'Hypertension / High blood pressure'
            },
            {
                'name': 'Liver disease',
                id: 'ped_no_3',
                tag: 'PEDliverDetails',
                "key" : "religare_ped_liver_disease",
                description: 'Pancreatitis or Liver disease(including but not limited to Cirrhosis / Hepatitis B or C / Willson’s disease) or any other digestive tract disorder(disorders of esophagus or stomach or intestine or any other)'
            },
            {
                'name': 'Cancer',
                id: 'ped_no_4',
                tag: 'PEDcancerDetails',
                "key" : "religare_ped_cancer",
                description: 'Cancer'
            },
            {
                'name': 'Cardiac disorder',
                id: 'ped_no_5',
                tag: 'PEDcardiacDetails',
                "key" :   "religare_ped_cardiac_disorder",
                description: 'Any cardiovascular / Heart disease(including but not limited to Coronary artery disease / Rheumatic heart disease / Heart attack or Myocardial infarction / Heart failure / Bypass Grafting or CABG / Angioplasty or PTCA / Heart valve diseases / Pacemaker implantation)'
            },
            {
                'name': 'Blood disorder',
                id: 'ped_no_6',
                tag: 'PEDjointpainDetails',
                "key" : "religare_ped_blood_disorder",
                description: 'Any disorders of Blood and / or Immunity(including but not limited to bleeding or clotting disorders, Systemic Lupus Erythematosus, Rheumatoid Arthritis, Crohn’s disease, Ulcerative Colitis) '
            },
            {
                'name': 'Kidney disease',
                id: 'ped_no_7',
                tag: 'PEDkidneyDetails',
                "key" : "religare_ped_kidney_disease",
                description: 'Any Kidney / urinary tract / reproductive organ disease'
            },
            {
                'name': 'Paralysis',
                id: 'ped_no_8',
                tag: 'PEDparalysisDetails',
                "key" : "religare_ped_paralysis",
                description: 'Any Neuromuscular(muscles or nervous system) disorder or Psychiatric disorders(including but not limited to Motor Neuron Disease, Muscular dystrophies, Epilepsy, Paralysis, Parkinsonism, Multiple Sclerosis, stroke, mental illness)'
            },
            {
                'name': 'Congenital disorder',
                id: 'ped_no_9',
                tag: 'PEDcongenitalDetails',
                "key" :  "religare_ped_congenital_disorder",
                description: 'Congenital disorder'
            },
            {
                'name': 'HIV / AIDS',
                id: 'ped_no_10',
                tag: 'PEDHivaidsDetails',
                "key" : "religare_ped_hiv_aids",
                description: 'HIV / AIDS / STD'
            },
            {
                'name': 'Respiratory disorders',
                id: 'ped_no_11',
                tag: 'PEDRespiratoryDetails',
                "key" : "religare_ped_respiratory_disorders",
                description: 'Any Respiratory disease / Disease of Lungs, Pleura, and airway(including but not limited to Asthma / Tuberculosis / Pleural effusion / Bronchitis / Emphysema) '
            },
            {
                'name': 'Endocrine disorders',
                id: 'ped_no_12',
                tag: 'PEDEndoDetails',
                "key" : "religare_ped_endocrine_disorders",
                description: 'Any disorders of the endocrine system(including but not limited to Pituitary / Parathyroid / adrenal gland disorders)'
            },
            {
                'name': 'Any other medication / treatment',
                id: 'ped_no_13',
                tag: 'PEDillnessDetails',
                "key" : "religare_ped_other_med_treatment",
                description: 'Has any of the proposed to be insured consulted / taken treatment or recommended to take investigations / medication / surgery other than for childbirth / minor injuries ? *'
            },
            {
                'name': 'Any other surgery',
                id: 'ped_no_14',
                tag: 'PEDSurgeryDetails',
                "key" :  "religare_ped_other_surgery",
                description: 'Has any of the proposed to be insured been hospitalised or has been under any prolonged treatment for any illness / injury or has undergone surgery other than for childbirth / minor injuries ? *'
            },
            {
                'display_name': 'Any other diseases',
                'name': 'Other',
                id: 'ped_no_15',
                tag: 'PEDotherDetails',
                "key" : "religare_ped_other_disease",
                description: ''
            }
        ]
    },
    payment_screen: {
        total_cities: 7800
    }
};

export const gmc = {
    key: 'GMC',
    provider_api: 'care_plus',
    title: 'Care Health',
    title2: 'fisdom HealthProtect',
    subtitle: 'fisdom HealthProtect',
    address_field_max_length: 60,
    logo: 'ic_religare_logo.svg',
    logo_card: 'ic_religare_logo_card.svg',
    logo_cta: 'ic_religare_logo.svg',
    logo_summary: 'ic_religare_logo.svg',
    pan_amount: 50000,
    claim_settlement_ratio: 92.58,
    covers_text:{
        title: 'Covers your family',
        subtitle: 'Ideal for self, spouse and kids'
    },
    member_assets: ['icn_couple.svg', 'icn_kids.svg'],
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        insure_type_screen: 'plan-dob-religare',
        add_members_screen: 'plan-dob',
        plan_dob_screen: 'plan-details',
        religare_dob: 'plan-details',
        plan_list_screen: 'plan-details',
        plan_details_screens: 'plan-select-sum-assured',
        sum_assured_screen: {
            floater: 'plan-select-paying-frequency',
            not_floater: 'plan-select-paying-frequency'
        },
        cover_type_screen: 'plan-select-add-ons',
        add_ons_screen: 'plan-select-cover-period',
        nominee_screen: 'final-summary'
    },
    validation_props: {
        'dob_adult': { min: 18, max: 61 }, 
        'dob_child': { minDays: 91, minAge: 5, max: 25 },
        'dob_married_male': { min: 18, max: 61 },
        'dob_married_female': {min: 18}
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    add_on_title : {
        uar: 'Unlimited Automatic Recharge',
        opd: 'OPD care',
        ped_wait_period: 'Reduction in PED wait period',
        ncb: 'No Claim Bonus Super'
    },
    landing_screen: {
        image_list: ['ic_why_hs_gmc_1.svg', 'ic_why_hs_gmc_3.svg', 'ic_why_hs_gmc_2.svg'],
        offerImageData: [
            { src: 'gmc_icn_landing_card_3.svg' },
            { src: 'gmc_icn_landing_card_2.svg' },
            { src: 'gmc_icn_landing_card_1.svg' }
        ],
        whats_covered: [
            '540+ day care procedures',
            '30 days pre & 60 days post hospitalisation expenses',
            'Pre-existing disease(s) after 24 months',
            'Accidental death, permanent total & permanent partial disability',
            'Doctor-on-call services'
        ],
        whats_not_covered: [
            'Maternity & childbirth related expenses',
            'Ayurveda, Unani, Siddha, and Homeopathy treatments, etc.',
            'Organ donor expenses',
            'Domiciliary hospitalisation',
            'Cost of spectacles/contact lenses, dental treatment, etc.',
        ],
        faq_data: {
            'header_title': 'Frequently asked questions',
            'header_subtitle': '',
            'steps': {
                'options': [
                    {
                        'title': 'Is Coronavirus treatment covered in this plan?',
                        'subtitle': 'Yes, this health insurance policy for family covers hospitalisation expenses to Coronavirus (COVID-19) subject to all terms and conditions of the policy.'
                    },
                    {
                        'title': 'Is there any free health check-up in your policy?',
                        'subtitle': 'Yes, there is a free annual health check-up for all the insured members every year regardless of claim history.'
                    },
                    {
                        'title': 'Can I cancel my policy once purchased?',
                        'subtitle': 'Yes, within 15 days from the receipt of the policy document you may return/cancel the policy, and premium after proportionate deduction would be refunded.'
                    },
                    {
                        'title': 'What is the waiting period for existing diseases? Can it be reduced?',
                        'subtitle': 'There is a waiting period of 24 months for both existing and specified diseases.'
                    },
                    {
                        'title': 'What do you mean by Network hospital?',
                        'subtitle': 'Network hospital is one, which has an agreement with Care Health Insurance for providing cashless treatment to its customers.'
                    },
                    {
                        'title': 'How to file and track your claim?',
                        'subtitle': 'You can file a claim by contacting Care Health customer help desk at customerfirst@careinsurance.com or 1800-102-4488.'
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
        bottom_info_text : 'Medical expenses are unpredictable - protect yourself with fisdom HealthProtect',
        account_type_options: [
            {
                'name': 'Self',
                'value': 'self'
            },
            // {
            //     'name': 'Family members',
            //     'value': 'family'
            // },
            {
                'name': 'Self & family members',
                'value': 'self_family'
            },
            // {
            //     'name': 'Parents',
            //     'value': 'parents'
            // }
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
        nominee_opts: [
            {
                'name': 'BROTHER',
                'value': 'BROTHER'
            },
            {
                'name': 'FATHER',
                'value': 'FATHER'
            },
            {
                'name': 'GRAND FATHER',
                'value': 'GRANDFATHER'
            },
            {
                'name': 'GRAND MOTHER',
                'value': 'GRANDMOTHER'
            },
            {
                'name': 'BROTHER IN LAW',
                'value': 'BROTHER_IN_LAW'
            },
            {
                'name': 'MOTHER IN LAW',
                'value': 'MOTHER_IN_LAW'
            },
            {
                'name': 'SISTER IN LAW',
                'value': 'SISTER_IN_LAW'
            },
            {
                'name': 'MOTHER',
                'value': 'MOTHER'
            },
            {
                'name': 'SISTER',
                'value': 'SISTER'
            },
            {
                'name': 'SON',
                'value': 'SON'
            },
            // {
            //     'name': 'SPOUSE',
            //     'value': 'SPOUSE'
            // },
            {
                'name': 'DAUGHTER',
                'value': 'DAUGHTER'
            },
            {
                'name': 'WIFE',
                'value': 'WIFE'
            },
            {
                'name': 'HUSBAND',
                'value': 'HUSBAND'
            }
        ],

    },
    select_ped_screen: {
        ped_list: [
            {
                'name': 'Diabetes',
                id: 'ped_no_1',
                tag: 'PEDdiabetesDetails',
                "key" : 'religare_ped_diabetes',
                description: 'Diabetes Mellitus type 1 or Diabetes on insulin or Diabetes associated with blindness or chronic foot ulcer',
            },
            {
                'name': 'Hypertension',
                id: 'ped_no_2',
                tag: 'PEDhyperTensionDetails',
                "key" :  "religare_ped_hypertension",
                description: 'Hypertension / High blood pressure'
            },
            {
                'name': 'Liver disease',
                id: 'ped_no_3',
                tag: 'PEDliverDetails',
                "key" : "religare_ped_liver_disease",
                description: 'Pancreatitis or Liver disease(including but not limited to Cirrhosis / Hepatitis B or C / Willson’s disease) or any other digestive tract disorder(disorders of esophagus or stomach or intestine or any other)'
            },
            {
                'name': 'Cancer',
                id: 'ped_no_4',
                tag: 'PEDcancerDetails',
                "key" : "religare_ped_cancer",
                description: 'Cancer'
            },
            {
                'name': 'Cardiac disorder',
                id: 'ped_no_5',
                tag: 'PEDcardiacDetails',
                "key" :   "religare_ped_cardiac_disorder",
                description: 'Any cardiovascular / Heart disease(including but not limited to Coronary artery disease / Rheumatic heart disease / Heart attack or Myocardial infarction / Heart failure / Bypass Grafting or CABG / Angioplasty or PTCA / Heart valve diseases / Pacemaker implantation)'
            },
            {
                'name': 'Blood disorder',
                id: 'ped_no_6',
                tag: 'PEDjointpainDetails',
                "key" : "religare_ped_blood_disorder",
                description: 'Any disorders of Blood and / or Immunity(including but not limited to bleeding or clotting disorders, Systemic Lupus Erythematosus, Rheumatoid Arthritis, Crohn’s disease, Ulcerative Colitis) '
            },
            {
                'name': 'Kidney disease',
                id: 'ped_no_7',
                tag: 'PEDkidneyDetails',
                "key" : "religare_ped_kidney_disease",
                description: 'Any Kidney / urinary tract / reproductive organ disease'
            },
            {
                'name': 'Paralysis',
                id: 'ped_no_8',
                tag: 'PEDparalysisDetails',
                "key" : "religare_ped_paralysis",
                description: 'Any Neuromuscular(muscles or nervous system) disorder or Psychiatric disorders(including but not limited to Motor Neuron Disease, Muscular dystrophies, Epilepsy, Paralysis, Parkinsonism, Multiple Sclerosis, stroke, mental illness)'
            },
            {
                'name': 'Congenital disorder',
                id: 'ped_no_9',
                tag: 'PEDcongenitalDetails',
                "key" :  "religare_ped_congenital_disorder",
                description: 'Congenital disorder'
            },
            {
                'name': 'HIV / AIDS',
                id: 'ped_no_10',
                tag: 'PEDHivaidsDetails',
                "key" : "religare_ped_hiv_aids",
                description: 'HIV / AIDS / STD'
            },
            {
                'name': 'Respiratory disorders',
                id: 'ped_no_11',
                tag: 'PEDRespiratoryDetails',
                "key" : "religare_ped_respiratory_disorders",
                description: 'Any Respiratory disease / Disease of Lungs, Pleura, and airway(including but not limited to Asthma / Tuberculosis / Pleural effusion / Bronchitis / Emphysema) '
            },
            {
                'name': 'Endocrine disorders',
                id: 'ped_no_12',
                tag: 'PEDEndoDetails',
                "key" : "religare_ped_endocrine_disorders",
                description: 'Any disorders of the endocrine system(including but not limited to Pituitary / Parathyroid / adrenal gland disorders)'
            },
            {
                'name': 'Any other medication / treatment',
                id: 'ped_no_13',
                tag: 'PEDillnessDetails',
                "key" : "religare_ped_other_med_treatment",
                description: 'Has any of the proposed to be insured consulted / taken treatment or recommended to take investigations / medication / surgery other than for childbirth / minor injuries ? *'
            },
            {
                'name': 'Any other surgery',
                id: 'ped_no_14',
                tag: 'PEDSurgeryDetails',
                "key" :  "religare_ped_other_surgery",
                description: 'Has any of the proposed to be insured been hospitalised or has been under any prolonged treatment for any illness / injury or has undergone surgery other than for childbirth / minor injuries ? *'
            },
            {
                'display_name': 'Any other diseases',
                'name': 'Other',
                id: 'ped_no_15',
                tag: 'PEDotherDetails',
                "key" : "religare_ped_other_disease",
                description: ''
            }
        ]
    },
    payment_screen: {
        total_cities: 7800
    }
};

export const star = {
    key: 'STAR',
    provider_api: 'star',
    title: 'Star',
    title2: 'Star',
    subtitle: 'Family Health Optima',
    address_field_max_length: 270,
    logo: 'ic_star_logo.svg',
    logo_card: 'ic_star_logo_card.svg',
    logo_cta: 'ic_star_logo.svg',
    logo_summary: 'ic_star_logo.svg',
    pan_amount: 100000,
    claim_settlement_ratio: 78.15,
    covers_text:{
        title: 'Covers all age groups',
        subtitle: 'Option to cover your entire family (spouse, kids and parents)'
    },
    member_assets: ['icn_couple.svg', 'icn_kids.svg', 'icn_parents.svg'],
    get_next: { //have as a separate map and not screen-specific property to reduce duplication across all providers and for all screens
        landing_screen: 'insure-type',
        insure_type_screen: 'plan-dob',
        add_members_screen: 'plan-dob',
        plan_dob_screen: 'pincode',
        star_pincode: 'health-details',
        health_details: 'plan-details',
        plan_details_screen: 'star-select-sum-assured',
        sum_assured_screen: 'plan-premium-summary',
        add_ons_screen: 'plan-select-cover-period',
        nominee_screen: 'star-select-ped',
        contact_screen: 'star-address'
    },
    validation_props: {
        'dob_adult': { min: 18, max: 65 },
        'dob_child': { minDays: 16, max: 25 },
        'dob_married_male': { min: 18, max: 65 },
        'dob_married_female': {min: 18}
    },
    applicant_detail_screen: {
        fields: [
            'fullname',
            'addr1',
            'erg-1'
        ]
    },
    landing_screen: {
        image_list: ['ic_why_hs.svg','ic_why_hs_gmc_3.svg', 'ic_why_hs3.svg', 'ic_why_hs4.svg'],
        offerImageData: [
            { src: 'star_icn_landing_card_1.svg' },
            { src: 'star_icn_landing_card_2.svg' },
            { src: 'star_icn_landing_card_3.svg' }
        ],
        whats_covered: [
            '60 days pre and 90 days post hospitalisation expenses',
            'Treatment of pre-existing disease after 4 years',
            'Ayurveda, Unani, Sidha and Homeopathy treatments',
            'Organ donor expenses',
            'Domiciliary Hospitalisation'
        ],
        whats_not_covered: [
            'Maternity',
            'Plastic surgery',
            'Substance abuse',
            'External congenital diseases',
            'Eye/Dental treatment'
        ],
        faq_data: {
            'header_title': 'Frequently asked questions',
            'header_subtitle': '',
            'steps': {
                'options': [
                    {
                        'title': 'Is there any pre policy medical check up?',
                        'subtitle': 'All persons above 50 years of age and those who declare adverse medical history in the proposal form are required to undergo pre-acceptance medical screening. 100% of this cost is borne by the company.'
                    },
                    {
                        'title': 'Is there any copay under the policy?',
                        'subtitle': 'There is a copay of 20% on each and every claim for insured members whose age at the time of entry is more than 60 years.'
                    },
                    {
                        'title': 'Is there any waiting period in the policy?',
                        'subtitle': 'There is a waiting period of 24 months for specified diseases and 48 months for pre-existing diseases.'
                    },
                    {
                        'title': 'Can the sum insured under the policy be enhanced?',
                        'subtitle': 'Yes, this can be done at the time of renewal subject to no claim being lodged or paid under the policy.'
                    },
                    {
                        'title': 'Can I cancel the policy after purchase?',
                        'subtitle': 'There is a free look period of 15 days from the date of receipt of the policy to the insured; if cancelled during this period premium would be refunded to the customer after adjusting the cost of medical screening, stamp duty charges and proportionate risk premium.'
                    },
                    {
                        'title': 'How does the Auto recharge work?',
                        'subtitle': 'Sum Insured will be automatically restored (once every policy year) in case the sum insured and any no claim bonus accumulated is exhausted during the policy year. It cannot be used against an illness/disease for which a claim has already been made in the current policy year.'
                    }
                ],
            },
            'cta_title': 'OK'
        }
    },
    insure_type_screen: {
        bottom_info_text : 'Pro Tip: The first step to get financial stability is to be medically insured along with your family',
        account_type_options: [
            {
                'name': 'Family members',
                'value': 'family'
            },
            {
                'name': 'Self & family members',
                'value': 'self_family'
            },
            {
                'name': 'Parents/Parents-in-law',
                'value': 'parents_in_law'
            },
        ]
    },
    add_members_screen: {
        son_max:3,
        daughter_max: 3,
        total_plus_minus_max: 3,
        preselect_father: true,
        preselect_mother: true,
        disable_father: true,
        disable_mother: true,
        preselect_father_in_law: true,
        preselect_mother_in_law: true,
        disable_father_in_law: true,
        disable_mother_in_law: true,
    },
    plan_list_screen: {
        tile_mid_data: [
            { 'label': 'Sum insured::', 'key': 'sum_assured_options_text' },
            { 'label': 'Hospital room:', 'key': 'hospital_room' },
            { 'label': 'Daily allowance:', 'key': 'alternative_treatment' }
        ]
    },
    nominee_screen: {
        nominee_opts: [
            {
                'name': 'FATHER',
                'value': 'Father'
            },
            {
                'name': 'MOTHER',
                'value': 'Mother'
            },
            {
                'name': 'SISTER',
                'value': 'Sister'
            },
            {
                'name': 'BROTHER',
                'value': 'Brother'
            },
            {
                'name': 'SON',
                'value': 'Son'
            },
            {
                'name': 'DAUGHTER',
                'value': 'Daughter'
            },
            {
                'name': 'SPOUSE',
                'value': 'Spouse'
            },
            {
                'name': 'GRAND FATHER',
                'value': 'Grand Father'
            },
            {
                'name': 'GRAND MOTHER',
                'value': 'Grand Mother'
            },
            {
                'name': 'FATHER IN LAW',
                'value': 'FatherinLaw'
            },
            {
                'name': 'BROTHER IN LAW',
                'value': 'BrotherinLaw'
            },
            {
                'name': 'SON IN LAW',
                'value': 'SoninLaw'
            },
            {
                'name': 'DAUGHTER IN LAW',
                'value': 'Daughter in Law'
            },
            {
                'name': 'COUSIN SON',
                'value': 'Cousin Son'
            },
            {
                'name': 'GRAND DAUGHTER',
                'value': 'Grand Daughter'
            },
            {
                'name': 'GRAND SON',
                'value': 'Grand Son'
            },
            {
                'name': 'OTHERS',
                'value': 'Others'
            }
        ],
        appointee_opts: [
            {
                'name': 'MOTHER',
                'value': 'Mother'
            },
            {
                'name': 'FATHER',
                'value': 'Father'
            },
            {
                'name': 'GRAND FATHER',
                'value': 'Grand Father'
            },
            {
                'name': 'GRAND MOTHER',
                'value': 'Grand Mother'
            },
            {
                'name': 'BROTHER',
                'value': 'Brother'
            },
            {
                'name': 'SISTER',
                'value': 'Sister'
            },
            {
                'name': 'BROTHER IN LAW',
                'value': 'Brother In Law'
            },
            {
                'name': 'OTHERS',
                'value': 'Others'
            }
        ],
        showDob: true,
        showAppointee: true,
    },
    personal_details_screen: {
        occupation_opts: [
            // {
            //     'name': 'none',
            //     'value': 'none'
            // },
            {
                'name': 'BUSINESS/TRADERS',
                'value': '1'
            },
            {
                'name': 'PROFESSIONAL-DOCTOR',
                'value': '2'
            },
            {
                'name': 'PROFESSIONAL-ENGINEER',
                'value': '3'
            },
            {
                'name': 'PROFESSIONAL-LAWYER',
                'value': '4'
            },
            {
                'name': 'CLERICAL/SUPERVISORY AND RELATED WORKER',
                'value': '5'
            },
            {
                'name': 'HOSPITALITY AND SUPPORT WORKERS',
                'value': '6'
            },
            {
                'name': 'PRODUCTION WORKERS, SKILLED AND NON-AGRICULTURAL',
                'value': '7'
            },
            {
                'name': 'FARMERS AND AGRICULTURAL WORKERS',
                'value': '8'
            },
            {
                'name': 'POLICE/PARA MILITARY/DEFENCE',
                'value': '9'
            },
            {
                'name': 'HOUSEWIVES',
                'value': '10'
            },
            {
                'name': 'RETIRED PERSONS',
                'value': '11'
            },
            {
                'name': 'STUDENTS-SCHOOL AND COLLEGE',
                'value': '12'
            },
            {
                'name': 'INFANT',
                'value': '13'
            }
        ]
    },
    payment_screen: {
        total_cities: 7800
    },
};


export function getGhProviderConfig(provider) {
    let mapper = {
        'HDFCERGO': hdfc,
        'RELIGARE': religare,
        'GMC': gmc,
        'STAR': star,
    };

    return mapper[provider];
}


export function memberKeyMapperFunction(groupHealthPlanData) {

    let dob_data = avilableMembersToInsured;

    let final_dob_data = [];

    let ui_members = groupHealthPlanData.ui_members || {};

    let child_total = 0;
    for (let i = 0; i < dob_data.length; i++) {
        let key = dob_data[i].key;

        if (!ui_members.mother && key === 'father') {
            dob_data[i].backend_key = 'parent_account1_key';
        }
        if (!ui_members.father && key === 'mother') {
            dob_data[i].backend_key = 'parent_account2_key';
        }

        let relation = key;
        if (relation.indexOf('son') >= 0) {
            relation = 'son';
        }

        if (relation.indexOf('daughter') >= 0) {
            relation = 'daughter';
        }

        if (relation.indexOf('son') >= 0 || relation.indexOf('daughter') >= 0) {

            if (ui_members[key]) {
                child_total++;
                dob_data[i].backend_key = `child_account${child_total}_key`;
            } else {
                dob_data[i].backend_key = `child_account_key_not_insured`;
            }

        }
        dob_data[i].relation = relation;
        dob_data[i].checked = !!ui_members[key];

        final_dob_data.push(dob_data[i]);
    }

    return final_dob_data;
}

export function getInsuredMembersUi(groupHealthPlanData) {

    let ui_members = groupHealthPlanData.ui_members || {};
    let data = [];
    const final_dob_data = memberKeyMapperFunction(groupHealthPlanData);
    for (var member in ui_members) {
        if (member && ui_members[member] === true) {
            // eslint-disable-next-line no-loop-func
            const [obj] = final_dob_data.filter(data => data.key === member);
            data.push(obj);
        }
    }

    return data;
}


export function resetInsuredMembers(groupHealthPlanData) {
    let post_body = groupHealthPlanData.post_body || {};

    for (var key in post_body) {
        if (key.indexOf('_account') >= 0 && key.indexOf('_key') >= 0) {
            delete post_body[key];
        }
    }

    groupHealthPlanData.post_body = post_body;

    return groupHealthPlanData;
}

export const avilableMembersToInsured = [
    {
        'key': 'self',
        'value': '',
        'backend_key': 'self_account_key'
    },
    {
        'key': 'wife',
        'value': '',
        'backend_key': 'spouse_account_key'
    },
    {
        'key': 'husband',
        'value': '',
        'backend_key': 'spouse_account_key'
    },

    {
        'key': 'father',
        'value': '',
        'backend_key': 'parent_account1_key'
    },
    {
        'key': 'mother',
        'value': '',
        'backend_key': 'parent_account2_key'
    },
    {
        'key': 'father_in_law',
        'value': '',
        'backend_key': 'parent_in_law_account1_key'
    },
    {
        'key': 'mother_in_law',
        'value': '',
        'backend_key': 'parent_in_law_account2_key'
    },
    {
        'key': 'son',
        'value': '',
        'backend_key': 'child_account1_key'
    },
    {
        'key': 'son1',
        'value': '',
        'backend_key': 'child_account1_key'
    },
    {
        'key': 'son2',
        'value': '',
        'backend_key': 'child_account2_key'
    },
    {
        'key': 'son3',
        'value': '',
        'backend_key': 'child_account3_key'
    },
    {
        'key': 'son4',
        'value': '',
        'backend_key': 'child_account4_key'
    },
    {
        'key': 'daughter',
        'value': '',
        'backend_key': 'child_account1_key'
    },
    {
        'key': 'daughter1',
        'value': '',
        'backend_key': 'child_account1_key'
    },
    {
        'key': 'daughter2',
        'value': '',
        'backend_key': 'child_account2_key'
    },
    {
        'key': 'daughter3',
        'value': '',
        'backend_key': 'child_account3_key'
    },
    {
        'key': 'daughter4',
        'value': '',
        'backend_key': 'child_account4_key'
    }
];


export function getCoverageType(lead) {
    let insured_people_details = lead.insured_people_details || lead.insured_member_details || [];
    let insurance_type = lead.quotation_details.insurance_type;
    if(insurance_type !== 'self' && insured_people_details.length >= 2) { //one extra for applicant
        if(lead.quotation_details.floater_type === 'floater') {
            return 'Family floater';
        }

        return 'Individually for each member';
    }

    return 'Individual';
}

export function insuranceTypeMapper(type){
    var ins_type = {
        'self': 'Self',
        'family': 'family',
        'self_family': 'Self & family',
        'parents': 'Parents',
        'parents_in_law': 'Parents in-law'
    }
    return ins_type[type]
}