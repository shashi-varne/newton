import Api from 'utils/api';
import {storageService} from "utils/validators";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";

export async function updateLead( body, next_page, final_page, reset) {

    var advisory_id = storageService().getObject("advisory_id");
    
    this.setState({
        show_loader: 'button'
    })
    
    var update_url = `api/insurancev2/api/insurance/advisory/update?insurance_advisory_id=${advisory_id}`;

    if(final_page){
        update_url += '&submitted=True';
    }   
    if(reset){
      update_url = `api/insurancev2/api/insurance/advisory/status/update?insurance_advisory_id=${advisory_id}`;
      this.setState({
        skelton: true
      })
    }
    let error = ''
    try{
           var res = await Api.put(update_url, body);
          if(body.status === 'cancelled'){
            storageService().remove('advisory_resume_present');
          }

           this.setState({
             show_loader: false
           })
           var resultData = res.pfwresponse.result;
         
           if (res.pfwresponse.status_code === 200) {
               if(final_page){
                var advisory_data = storageService().getObject('advisory_data') || {};
                var recommendation_data = resultData.coverage_gap_dict;
                var user_data = resultData.insurance_advisory;
                setRecommendationData(advisory_data, recommendation_data, user_data)
                
               }
               this.navigate(`/group-insurance/advisory/${next_page}`);                    
           } else {
             error = resultData.error || resultData.message || "Something went wrong";
           }
       }catch(err){
        this.setState({
          show_loader: false,
          skelton: false,
          showError: true,
          errorData: {
            ...this.state.errorData, type: 'crash'
          }
        });
      }
      
      // set error data
      if(error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error
          },
          showError: true,
          skelton: false,
        })
      }
}

export async function getLead(){
  var advisory_id = storageService().getObject("advisory_id")
  this.setState({
      skelton: true,
  })

  this.setErrorData('onload');
    let error = '';
    try{
      var res = await Api.get(`api/insurancev2/api/insurance/advisory/get?insurance_advisory_id=${advisory_id}`);
        
      this.setState({
        skelton: false
      })
        var resultData = res.pfwresponse.result;
        
        if (res.pfwresponse.status_code === 200) {
          var resume_data = resultData.insurance_advisory;

          this.setState({
            resume_data : resume_data
          })
        } else {
          error = resultData.error || resultData.message || "Something went wrong";
      }
    }catch(err){
      this.setState({
        show_loader: false,
        showError: true,
        errorData: {
          ...this.state.errorData, type: 'crash'
        }
      });
    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error
        },
        showError: 'page'
      })
    }
}

export function setRecommendationData(advisory_data, recommendation_data, user_data){
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
    
    advisory_data.recommendation_data = {
      'recommendation_data': recommendation_array, 
    };
    advisory_data['recommendation_data']['rec_text'] = recommendation_data.recommended_text
    advisory_data.user_data = user_data;
    storageService().setObject('advisory_data', advisory_data);
}

export function openPdf(pdfLink, pdfType){
    if(getConfig().iOS){
      nativeCallback({
        action: 'open_inapp_tab',
        message: {
            url: pdfLink  || '',
            back_url: ''
        }
      });
    }else{
      this.openInBrowser(pdfLink, pdfType);
    }
}