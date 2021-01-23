function computeAgeOptions(){
    var ageOptions = [];
        for(var i = 18; i < 100; i++){
            var temp = {'name': `${i} years`,'value': i};
            ageOptions.push(temp);
        }
        return ageOptions;        
}

function computeIncomeGrowthOptions(){
    var incomeGrowthOptions = [];
        for(var i = 0; i < 26; i++){
            var temp = {'name': `${i} %`,'value': i};
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
          title: "Tell us about your liabilities",
          subtitle: "",
        },
        {
          title: "Let's note down your assets",
          subtitle: "",
        },
        {
          title: "Check our recommended coverages",
          subtitle: "",
        },
    ],
    ageOptions: computeAgeOptions(),
    metroCityOptions: [
        {'name':'Delhi' ,'value': 'delhi'},
        {'name':'Mumbai' ,'value': 'mumbai'},
        {'name':'Bangalore' ,'value': 'bangalore'},
        {'name':'Kolkata' ,'value': 'kolkata'},
        {'name':'Chennai' ,'value': 'chennai'},
        {'name':'Hyderabad' ,'value': 'hyderabad'},
        {'name':'Any other city' ,'value': 'other'},
    ],
    dependents_data: {kids_max: 4, parents_max: 2, total_plus_minus_max: 6},
    incomeGrowthOptions: computeIncomeGrowthOptions(),
    retireOptions: computeAgeOptions(),
    insuranceList: [{'value': 'Term Insurance', 'name': 'term_cover_amount'},{'value': 'Health Insurance', 'name': 'health_cover_amount'},{'value': 'Critical Insurance', 'name': 'critical_cover_amount'},{'value': 'Coronavirus Insurance', 'name': 'corona_cover_amount'},{'value': 'None', 'name': 'none'},]

}