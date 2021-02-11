import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import {storageService} from "utils/validators";

export async function updateLead( body, next_page, final_page) {

    var advisory_id = storageService().getObject("advisory_id");
    
    this.setState({
        show_loader: true
    })
    var update_url = `api/insurancev2/api/insurance/advisory/update?insurance_advisory_id=${advisory_id}`;

    if(final_page){
        update_url += '&submitted=True';
    }   
    try{
           var res = await Api.put(update_url, body);
       
           this.setState({
             show_loader: false
           })
           var resultData = res.pfwresponse.result;
         
           if (res.pfwresponse.status_code === 200) {
               if(final_page){
                var advisory_data = storageService().getObject('advisory_data');
                var recommendation_data = resultData.coverage_gap_dict;
                var user_data = resultData.insurance_advisory;

                var recommendation_array = []
                  for(var rec in recommendation_data){
                    var temp = {};
                    if(rec !== 'recommended_text'){
                    temp['key'] = rec;
                     for(var x in recommendation_data[rec]){
                         temp[x] = recommendation_data[rec][x]
                     }
                     recommendation_array.push(temp);
                    }
                  }
                  
                  advisory_data.recommendation_data = recommendation_array;
                  advisory_data.user_data = user_data;
                storageService().setObject('advisory_data', advisory_data);
               }
               this.navigate(`/group-insurance/advisory/${next_page}`);                    
           } else {
             toast(resultData.error || resultData.message || "Something went wrong");
           }
       }catch(err){
         console.log(err)
         this.setState({
           show_loader: false
         });
         toast("Something went wrong");
       }
            
}