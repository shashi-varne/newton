export function goBackMap(path) {
    let mapper = {
        '/loan/journey': '/loan/home',
        '/loan/instant-kyc-status': '/loan/journey',
        '/loan/loan-eligible': '/loan/journey',
        '/loan/reference': '/loan/journey',
        '/loan/loan-summary': '/loan/journey',
        '/loan/loan-approved': '/loan/home',
        '/loan/report-details': '/loan/home',
        // '/loan/form-otp': '/loan/journey',
        // '/loan/bank': '/loan/journey',
        '/loan/permissions': '/loan/home'
    }

    return mapper[path] || false;
}

export function getCssMapperReport(vendor_info) {

  
    let cssMapper = {
      'callback_awaited_disbursement_approval': {
        color: 'green',
        disc: 'Approved'
      },
      'disbursement_approved': {
        color: 'yellow',
        disc: 'Pending For Disbursal'
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