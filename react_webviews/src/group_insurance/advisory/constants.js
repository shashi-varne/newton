function computeAgeOptions(){
    var ageOptions = [];
        for(var i = 18; i < 100; i++){
            var temp = {'name': `${i} years`,'value': i};
            ageOptions.push(temp);
        }
        return ageOptions;        
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
    ]

}