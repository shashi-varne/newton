export var fyntuneConstants = {
  logo_cta: 'hdfc_logo.png',
  provider_api: 'fyntune',
    stepsContentMapper: { 
        options:[
        {
          icon: "icn_hs_no_document",
          title: "No document required",
          subtitle: "Quick and paperless process",
        },
        {
          icon: "icn_hs_assistance",
          title: "Complete assistance",
          subtitle: "Our experts will help in purchase and claim of policy",
        },
        {
          icon: "icn_hs_payment",
          title: "Secure payment",
          subtitle: "Smooth and secure online payment process",
        },
      ] 
    },
    fyntune_policy_report_status_mapper: {
      issued: {
        text: 'ISSUED',
        color: '#78CE5D',
        reportTab: 'activeReports'
      },
      pending: {
        text: 'PENDING',
        color: '#d3bd13',
        reportTab: 'pendingReports'
      },
      expired: {
        text: 'EXPIRED',
        color: 'orange',
        reportTab: 'inactiveReports'
      },
      rejected: {
        text: 'EXPIRED',
        color: 'red',
        reportTab: 'inactiveReports'
      }
    },
    stepsToFollow : [
      {
        title: "Get free quotes",
        subtitle: "To start, enter a few details & get free quotes",
      },
      {
        title: "Complete application form",
        subtitle: "Now select a plan you like and fill up the application form",
      },
      {
        title: "Make payment",
        subtitle: "Make your first payment securely",
      },
      {
        title: "Answer medical and lifestyle questions",
        subtitle: "Help us with a few answers to evaluate your application",
      },
      {
        title: "Upload the required documents",
        subtitle: "Lastly, upload all the required documents and you're good to go",
      },
    ],
    faq_data : {
      'header_title': 'Frequently asked questions',
      'steps': {
          'options': [
              {
                  'title': 'What are the products available?',
                  'subtitle': 'We are currently offering HDFC Life Sanchay Plus and HDFC Life Click-2-Invest products.'
              },
              {
                  'title': 'What are bonuses and how do the Cash Bonus work?',
                  'subtitle': 'Some plans which are ‘participating plans’ offer certain ‘bonuses’ to the insured which are declared at the end of every financial year and payable every year basis the frequency chosen (annual, half-yearly, quarterly or monthly) rather than at the time of a claim and hence they also act as a source of regular income.'
              },
              {
                  'title': 'What are ‘Guaranteed’ benefit plans',
                  'subtitle': 'Guaranteed benefit basically means that a certain sum of money will be paid to you as per the frequency chosen by you for a certain period of time, provided you have paid all the premiums. Please note that this amount will be told to you while purchasing the plan itself.'
              },
              {
                  'title': 'What is the difference between policy term and premium payment term?',
                  'subtitle': 'Policy term basically mean the period of time till when you will be covered i.e. if something happens to you, your family will get the cover amount and Premium payment term on the other hand means the period of time till when you are required to pay the premiums. '
              },
              {
                  'title': 'Can I choose my premium payment frequency?',
                  'subtitle': 'Yes, the premiums can be paid annually, half-yearly, quarterly and monthly, depending on the insurance company. '
              },
              {
                'title': 'What are ULIPs?',
                'subtitle': 'They are Unit Linked Insurance Plans; they invest your money (paid premiums)  in different funds and are thus market linked (hence ‘linked’ in the name) which gives you an option of getting higher returns on your investment while at the same time also providing you with an insurance cover.'                
              },
              {
                'title': 'What is the meaning of linked, non-linked, participating and non-participating plans ?',
                'subtitle': '',
                'points': [
                  'Linked - Returns are market linked (dependent on stock market!)', 'Non- linked - not dependent on stock market', 
                  'Participating - There will be bonuses which depend on the financial situation of the insurance company', 
                  'Non-participating - There will be ‘bonuses’ which will depend on the financial situation of the insurance company'
              ]                
              },
              {
                'title': 'What are some of the common terms in Life Insurance and their meaning:',
                'subtitle': '',
                'points': ['Life Assured: It is the person who is covered under the insurance policy.', 'Proposer: It is the person who pays the premiums of the policy. For example: If you have bought the policy for yourself, then you are both the Life Assured as well as the Proposer. Similarly, if you purchase an insurance policy for a family member, then you are the proposer and the family member is the Life Assured','Nominee or Beneficiary: It is the person you appoint at the time of buying the policy to receive the benefits of your insurance policy in your absence.', 'Insurer: The insurance company that sells the life insurance policy is called the Insurer (for example, ICICI Prudential Life Insurance, HDFC Life Insurance).', 'Life Cover: It is the amount that the Insurer will pay to your Nominee in case of an unfortunate event.', 'Maturity Benefit: For Protection + Savings policies, the Insurer pays a certain lump sum of money on completion of the policy term. This amount is known as the Maturity Amount.', 'Premium: A premium is the amount you pay to the insurer for receiving the benefits of the insurance policy. These payments can be made on a regular basis throughout the policy duration, for a limited number of years or just once, as per the options available under the policy you choose.','Premium Payment Term: The number of years for which you pay the premiums is known as the Premium Payment Term.',
                'Policy Term: The number of years for which the Life Cover continues.'
               ]                
              }
          ],
      },
      'cta_title': 'OK'
  },
}