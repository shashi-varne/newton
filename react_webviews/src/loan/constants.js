export function goBackMap(path) {
    let mapper = {
        '/loan/dmi/journey': '/loan/dmi/loan-know-more',
        '/loan/dmi/instant-kyc-status': '/loan/dmi/journey',
        '/loan/dmi/loan-eligible': '/loan/dmi/journey',
        '/loan/dmi/reference': '/loan/dmi/journey',
        '/loan/dmi/loan-summary': '/loan/dmi/journey',
        '/loan/dmi/loan-approved': '/loan/dmi/loan-know-more',
        '/loan/dmi/report-details': '/loan/dmi/loan-know-more',
        // '/loan/form-otp': '/loan/journey',
        '/loan/dmi/bank': '/loan/dmi/journey',
        '/loan/dmi/upload-pan': '/loan/dmi/journey',
        '/loan/dmi/permissions': '/loan/dmi/loan-know-more'
    }

    return mapper[path] || false;
}

export function getCssMapperReport(vendor_info) {

  
    let cssMapper = {
      'callback_awaited_disbursement_approval': {
        color: 'green',
        disc: 'Application Submitted'
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