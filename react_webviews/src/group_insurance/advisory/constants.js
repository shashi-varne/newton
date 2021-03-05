function computeAgeOptions(type){
  var ageLimit = 0;
  if(type === 'age'){
    ageLimit = 65;
  }else if(type === 'retire'){
    ageLimit = 99;
  }
    var ageOptions = [];
        for(var i = 18; i <= ageLimit; i++){
            var temp = {'name': `${i} years`,'value': i};
            ageOptions.push(temp);
        }
        return ageOptions;        
}

function computeIncomeGrowthOptions(){
    var incomeGrowthOptions = [];
        for(var i = 0; i < 26; i++){
            var temp = {'name': `${i}%`,'value': i};
            incomeGrowthOptions.push(temp);
        }
        return incomeGrowthOptions;        
}

export var advisoryConstants = {
    stepsToFollow: [
        {
            title: "Tell us about yourself",
            subtitle: "",
        },
        {
          title: "Let's know your income and expenses",
          subtitle: "",
        },
        {
          title: "Do you have any loans?",
          subtitle: "",
        },
        {
          title: "Have you made any investments?",
          subtitle: "",
        },
        {
          title: "Check our recommended coverages",
          subtitle: "",
        },
    ],
    ageOptions: computeAgeOptions('age'),
    metroCityOptions: [
        {'name':'Delhi' ,'value': 'delhi'},
        {'name':'Mumbai' ,'value': 'mumbai'},
        {'name':'Bangalore' ,'value': 'bangalore'},
        {'name':'Kolkata' ,'value': 'kolkata'},
        {'name':'Chennai' ,'value': 'chennai'},
        {'name':'Hyderabad' ,'value': 'hyderabad'},
        {'name':'Other' ,'value': 'other'},
    ],
    dependents_data: {kids_max: 4, parents_max: 2, total_plus_minus_max: 6},
    incomeGrowthOptions: computeIncomeGrowthOptions(),
    retireOptions: computeAgeOptions('retire'),
    insuranceList: [{'value': 'Term Insurance', 'name': 'term_cover_amount'},{'value': 'Health Insurance', 'name': 'health_cover_amount'},{'value': 'Critical Insurance', 'name': 'critical_cover_amount'},{'value': 'Coronavirus Insurance', 'name': 'corona_cover_amount'},{'value': 'None', 'name': 'none'},],
    recommendation_bottom_sheet_data: {
      'health': {
        'heading': 'Health insurance',
        'why': 'Medical expenses are increasing at 7.5% per year. With a well covered health plan, you will be better prepared to handle medical emergencies.',
        'benefits': ['Minimal out-of-pocket medical expenses','Tax benefits under Sec 80D','Cashless treatment pan India']
      },
      'term': {
        'heading': 'Term insurance',
        'why': 'Getting a term plan will ensure that your family will always have financial support even when you’re not around.',
        'benefits': ['High coverage at affordable premiums','Tax benefits under Sec 80C','Financial security for your family']
      },
      'ci': {
        'heading': 'Critical illness insurance',
        'why': 'Critical illnesses can incur great costs that standard health insurances don’t cover. We recommend this insurance to cover such emergencies.',
        'benefits': ['Coverage for up to 36 critical illnesses ','Payment on diagnosis','Acts as income substitute during emergencies']
      },
      'corona': {
        'heading': 'Coronavirus insurance',
        'why': 'Standard health plans don’t provide adequate cover for COVID-19 expenses. This means you’ll be paying over your existing health coverage. The Coronavirus insurance plan will take care of such expenses.',
        'benefits': ['Low waiting period of up to 15 days ','No medical check-up required','Affordable premiums']
      }
    },
    get_plan_path: {
      'health': '/group-insurance/group-health/RELIGARE/landing',
      'ci': '/group-insurance/health/critical_illness/plan',
      'corona': '/group-insurance/corona/plan',
      'term': '/group-insurance/life-insurance/term/landing'
    }

}