import Api from "utils/api";
import Toast from 'common/ui/Toast';
import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";

export async function onload(){
    let error = ''
    try{
        var url = `api/guest/user/session/create`
        const res = await Api.get(url);
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {

            this.setState({skelton: false})
            console.log(res)
        } else {
            error = resultData.error || resultData.message || 'Something went wrong. Please try again';
            Toast(error);
        }
    }catch(err){
        this.setState({
          show_loader: false,
        });
    }
}

export async function startJourney(){
    var error = ''
    this.setState({
        show_loader: 'button'
    })
    try{
        var url = `api/guest/user/lead/create?rm_id=${this.state.form_data.rm_emp_id}&mobile_no=${this.state.form_data.mobile_no}`
        const res = await Api.get(url);
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            console.log(resultData)
            var guestLeadId = resultData.insurance_guest_lead.id;
            storageService().setObject('guestLeadId', guestLeadId);
            this.navigate('/group-insurance')
        } else {
            error = resultData.error || resultData.message || true;
            Toast(error);
            this.setState({show_loader: false})
        }
    }catch(err){
        this.setState({
          show_loader: false,
          showError: true,
        });
    }
}