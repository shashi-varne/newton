export function goBackMap(path) {
    let mapper = {
        '/loan/journey': '/loan/home',
        '/loan/instant-kyc-status': '/loan/journey',
        '/loan/loan-eligible': '/loan/journey',
        '/loan/reference': '/loan/journey',
        '/loan/loan-approved': '/loan/report-details',
        '/loan/report-details': '/loan/home',
        '/loan/form-otp': '/loan/journey',
        '/loan/bank': '/loan/journey'
    }

    return mapper[path] || false;
}

export function getCssMapperReport(vendor_info) {

  
    let cssMapper = {
      'callback_awaited_disbursement_approval': {
        color: 'yellow',
        disc: 'Pending For Disbursal'
      },
      'disbursement_approved': {
        color: 'yellow',
        disc: 'Approved'
      },
      'complete': {
        color: 'green',
        disc: 'Disbursed'
      }
    }
  
  
    let obj = {}
    obj.status = vendor_info.dmi_loan_status;
  
    obj.cssMapper = cssMapper[obj.status] || cssMapper['callback_awaited_disbursement_approval'];
  
    return obj;
  }