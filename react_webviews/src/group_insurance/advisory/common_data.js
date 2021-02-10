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
                advisory_data['recommendation_data'] = resultData.coverage_gap_dict;
                advisory_data['user_data'] = resultData.insurance_advisory;
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