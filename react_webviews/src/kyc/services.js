import Api from '../utils/api'
import { storageService } from '../utils/validators'
import toast from '../common/ui/Toast'
import { getConfig, isIndbSdkTradingFlow, isTradingEnabled, isTradingFlow } from '../utils/functions'
import { kycSubmit } from './common/api'
import { isDigilockerFlow, isEquityApplSubmittedOrComplete, isRetroMfIRUser } from './common/functions'
import isEmpty from "lodash/isEmpty"
import { isAocPaymentSkipped, isAocPaymentSuccessful, isAocPaymentSuccessOrNotApplicable } from './Aoc/common/functions'

const DOCUMENTS_MAPPER = {
  DL: 'Driving license',
  PASSPORT: 'Passport',
  AADHAAR: 'Aadhaar card',
  VOTER_ID_CARD: 'Voter ID',
  UTILITY_BILL: 'Gas receipt',
  LAT_BANK_PB: 'Passbook',
}

export function getCampaignBySection(notifications, sections) {
  if (!sections) {
    sections = [];
  }

  if (!notifications) {
    notifications = storageService().getObject("campaign") || [];
  }

  let notificationsData = [];

  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].campaign.name === "PlutusPendingTransactionCampaign") {
      continue;
    }

    notificationsData.push(notifications[i]);
  }

  return notificationsData;
}

export function getKycAppStatus(kyc) {
  if(isEmpty(kyc)) return {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  const isFinity = getConfig().productName === "finity";
  var rejected = 0;
  var metaRejected = 0;
  var docRejected = 0;
  var rejectedItems = [];
  var fieldsToCheck = [];
  if (kyc.kyc_status === "compliant") {
    fieldsToCheck = [
      { name: "pan", keys: ["meta_data_status"] },
      { name: "bank", keys: ["meta_data_status"] },
      { name: "identification", keys: ["meta_data_status"] },
      { name: "nomination", keys: ["meta_data_status"] },
      { name: "sign", keys: ["doc_status"] },
    ];
    if (isIndbSdkTradingFlow(kyc)) {
      fieldsToCheck = [...fieldsToCheck, { name: "ipvvideo", keys: ["doc_status"] }];
    }
  } else {
    fieldsToCheck = [
      { name: "pan", keys: ["doc_status", "meta_data_status"] },
      { name: "address", keys: ["doc_status", "meta_data_status"] },
      { name: "bank", keys: ["meta_data_status"] },
      { name: "identification", keys: ["doc_status", "meta_data_status"] },
      { name: "nomination", keys: ["meta_data_status"] },
      { name: "sign", keys: ["doc_status"] },
      { name: "ipvvideo", keys: ["doc_status"] },
    ];
  }

  let newFieldsToCheck;
  if (TRADING_ENABLED) {
    newFieldsToCheck = [
      { name: "equity_pan", keys: ["doc_status", "meta_data_status"] },
      { name: "equity_identification", keys: ["doc_status", "meta_data_status"] },
    ]
    fieldsToCheck = [...fieldsToCheck, ...newFieldsToCheck];
    fieldsToCheck = fieldsToCheck.filter((fieldObj) => !["pan", "identification"].includes(fieldObj.name));
  }

  if (kyc?.address?.meta_data?.is_nri) {
    var obj = {
      name: "nri_address",
      keys: ["doc_status", "meta_data_status"]
    };

    fieldsToCheck.push(obj);
  }

  for (var i = 0; i < fieldsToCheck.length; i++) {
    var objRej = {
      name: fieldsToCheck[i].name,
      keys: []
    };
    for (var j = 0; j < fieldsToCheck[i].keys.length; j++) {
      var k = fieldsToCheck[i].keys[j];
      if (kyc[fieldsToCheck[i].name][k] === "rejected") {
        if (k === "meta_data_status") {
          metaRejected++;
        }
        if (k === "doc_status") {
          docRejected++;
        }
        objRej.keys.push(k);
        rejected++;
      }
    }

    if (objRej.keys.length !== 0) {
      rejectedItems.push(objRej);
    }
  }

  var result = {
    metaRejected: metaRejected,
    docRejected: docRejected,
    rejectedItems: rejectedItems
  };

  var status;
  if (rejected > 0) {
    status = "rejected";
    result.status = status;
    return result;
  } else {
    if (!TRADING_ENABLED || (kyc?.kyc_product_type !== "equity" && isReadyToInvest())) {
      status = kyc.application_status_v2;
    } else {
      status = kyc.equity_application_status;
    }
  }
  const aocPaymentSuccessful = isAocPaymentSuccessful(kyc);
  const aocPaymentSkipped = isAocPaymentSkipped(kyc);
  const tradingFlow = isTradingFlow(kyc);
  const isMfKycProcessed = isRetroMfIRUser(kyc);

  if (!kyc.pan.meta_data.pan_number || (kyc.pan.meta_data.pan_number &&
    kyc.customer_verified !== 'VERIFIED')) {
    status = 'ground';
  }

  if (kyc.kyc_status !== 'compliant' && kyc.application_status_v2 === 'init' && kyc.pan.meta_data.pan_number && kyc.kyc_type === "init") {
    status = 'ground_pan';
  }

  if (kyc.kyc_status === 'compliant' && (kyc.application_status_v2 !== 'submitted' &&
    kyc.application_status_v2 !== 'complete') && kyc.customer_verified === 'UNVERIFIED') {
    status = 'ground_premium';
  }

  if (!kyc.address.meta_data.is_nri && kyc.kyc_status !== 'compliant' && kyc.kyc_type !== 'manual' && !['init', 'submitted', 'complete'].includes(kyc.application_status_v2)
      && kyc.dl_docs_status !== null) {
    status = 'ground_aadhaar';
  }

  if (kyc.application_status_v2 === 'init' && kyc.pan.meta_data.pan_number &&
    kyc.customer_verified === 'VERIFIED' && (kyc.dl_docs_status === '' || kyc.dl_docs_status === 'init' || kyc.dl_docs_status === null)) {
    status = 'incomplete';
  }

  if (kyc.kyc_status !== 'compliant' && kyc.application_status_v2 === 'init' && kyc.pan.meta_data.pan_number &&
      kyc.kyc_type === "manual" && (kyc.dl_docs_status === '' || kyc.dl_docs_status === 'init' || kyc.dl_docs_status === null)) {
      status = 'incomplete';
  }

  if (kyc.kyc_status !== 'compliant' && kyc.address.meta_data.is_nri && kyc.application_status_v2 === 'incomplete') {
    status = 'incomplete';
  }

  // this condition handles compliant bank document pending case 
  if (!TRADING_ENABLED && kyc.kyc_status === 'compliant' && !["verified", "doc_submitted"].includes(kyc.bank.meta_data.bank_status)) {
    status = "incomplete"
  }

  // this condition handles retro kyc submitted users
  if (kyc.kyc_product_type !== "equity" && isMfApplicationSubmitted(kyc)) {
    status = "submitted"
  }

  if ((!TRADING_ENABLED || aocPaymentSkipped) && kyc.kyc_status !== 'compliant' && ["submitted", "complete"].includes(kyc.application_status_v2) && kyc.sign_status !== 'signed') {
    if (aocPaymentSkipped) {
      status = 'mf_esign_pending'
    } else {
      status = 'incomplete';
    }
  }
  
  // this condition handles equity esign pending case
  if (tradingFlow && kyc.equity_application_status === 'complete' && isAocPaymentSuccessOrNotApplicable(kyc) && kyc.equity_sign_status !== "signed") {
    status = 'esign_pending';
  }

  // this condition handles fno doc rejected case
  if (tradingFlow && kyc.equity_application_status === 'complete' && kyc.equity_sign_status === "signed" &&
  kyc?.equity_investment_ready && kyc?.equity_income.doc_status === "rejected") {
    status = 'fno_rejected';
  }

  // this condition handles equity activation pending case
  if (tradingFlow && kyc.equity_application_status === 'complete' && kyc.equity_sign_status === "signed" &&
  !kyc?.equity_investment_ready) {
    status = 'verifying_trading_account';
  }

  // this condition handles compliant retro MF IR users 
  if (TRADING_ENABLED && kyc.kyc_status === 'compliant' && kyc?.kyc_product_type !== "equity" && (kyc.application_status_v2 === 'submitted' || kyc.application_status_v2 === 'complete') && kyc.bank.meta_data_status === "approved") {
    status = "complete";
  }

  // this condition handles showing upgrade account to MF IR or Submitted users until user submits all equity related docs & aoc payment is successful
  if (TRADING_ENABLED && ((!isFinity && isMfApplicationSubmitted(kyc) && aocPaymentSkipped) || (isReadyToInvest() && isMfKycProcessed)) && kyc.equity_application_status !== "init" 
    && ((isFinity && !isEquityApplSubmittedOrComplete(kyc)) || (!isFinity && !aocPaymentSuccessful)) && kyc.equity_sign_status !== "signed") {
    status = "upgraded_incomplete";
  }

  // this condition handles showing complete account setup card for new users until aoc payment is successful 
  if (tradingFlow && !isFinity && !isMfKycProcessed && isEquityApplSubmittedOrComplete(kyc) && !aocPaymentSuccessful && !aocPaymentSkipped 
    && kyc.equity_sign_status !== "signed") {
    status = "complete_account_setup";
  }

  result.status = status;

  return result;
}

export function getDocuments(userKyc) {
  const isIndbTradingFlow = isIndbSdkTradingFlow(userKyc);
  if(userKyc.kyc_status === 'compliant') {
    let documents = [
      {
        key: "pan",
        title: "PAN card",
        subtitle: userKyc.pan.meta_data.pan_number,
        doc_status: userKyc.pan.doc_status,
        default_image: 'pan_default.svg',
        approved_image: "pan_approved.svg",
      },
      {
        key: "selfie",
        title: "Selfie",
        doc_status: userKyc?.equity_identification?.doc_status,
        default_image: 'selfie_default.svg',
        approved_image: "selfie_approved.svg",
      },
      {
        key: "selfie_video",
        title: "Selfie video (IPV)",
        doc_status: userKyc.ipvvideo.doc_status,
        default_image: 'video_default.svg',
        approved_image: "video_approved.svg",
      },
      {
        key: "bank",
        title: "Bank details",
        doc_status: userKyc.bank.meta_data_status,
        default_image: 'default.svg',
        approved_image: "approved.svg",
      },
      {
        key: "sign",
        title: "Signature",
        doc_status: userKyc.sign.doc_status,
        default_image: "sign_default.svg",
        approved_image: "sign_approved.svg",
      }
    ];

    if (!isIndbTradingFlow) {
      // Remove selfie video (IPV)
      documents.splice(2, 1);
    }

    if (!isTradingEnabled(userKyc)) {
      // Removing Pan and Selfie
      documents.splice(0, 2);
    }

    return documents;
  }

  let documents =  [
    {
      key: "pan",
      title: "PAN card",
      subtitle: userKyc.pan.meta_data.pan_number,
      doc_status: userKyc.pan.doc_status,
      default_image: 'pan_default.svg',
      approved_image: "pan_approved.svg",
    },

    {
      key: "address",
      title: "Address proof",
      subtitle: getAddressProof(userKyc),
      doc_status: userKyc.address.doc_status,
      default_image: 'regi_default.svg',
      approved_image: "regi_approved.svg",
    },

    {
      key: "selfie",
      title: "Selfie",
      doc_status: userKyc?.equity_identification?.doc_status,
      default_image: 'selfie_default.svg',
      approved_image: "selfie_approved.svg",
    },

    {
      key: "selfie_video",
      title: "Selfie video (IPV)",
      doc_status: userKyc.ipvvideo.doc_status,
      default_image: 'video_default.svg',
      approved_image: "video_approved.svg",
    },

    {
      key: "bank",
      title: "Bank details",
      doc_status: userKyc.bank.meta_data_status,
      default_image: 'default.svg',
      approved_image: "approved.svg",
    },

    {
      key: "sign",
      title: "Signature",
      doc_status: userKyc.sign.doc_status,
      default_image: 'sign_default.svg',
      approved_image: "sign_approved.svg",
    }
  ];

  if(userKyc.address.meta_data.is_nri) {
    const data = {
      key: "nriaddress",
      title: "Foreign Address proof",
      subtitle: DOCUMENTS_MAPPER[userKyc.nri_address_doc_type],
      doc_status: userKyc.nri_address.doc_status,
      default_image: "regi_default.svg",
      approved_image:"regi_approved.svg",
    };

    documents.splice(2, 0, data);
  }

  if (isDigilockerFlow(userKyc) && !isIndbTradingFlow) {
    // removing selfie video (IPV)
    documents.splice(3, 1);
  }

  if (!isTradingEnabled(userKyc) || userKyc.kyc_product_type === "mf") {
    documents = documents.map((document) => {
      if (document.key === "selfie") {
        document.doc_status = userKyc.identification.doc_status
      }
      return document;
    });
  }

  return documents;
}

function getAddressProof(userKyc) {
  if (userKyc.address.meta_data.is_nri) {
    return "Passport"
  }
  return DOCUMENTS_MAPPER[userKyc.address_doc_type]
}

export function isReadyToInvest() {
  let userRTI = storageService().getObject("user");
  let kycRTI = storageService().getObject("kyc");

  if (!kycRTI || !userRTI) {
    return false;
  }

  if (kycRTI.kyc_status === "compliant") {
    if (
      kycRTI.friendly_application_status === "complete" ||
      (kycRTI.friendly_application_status === "submitted" &&
        kycRTI.bank.meta_data_status === "approved")
    ) {
      return true;
    } else if (userRTI.kyc_registration_v2 === "complete") {
      return true;
    } else if (kycRTI.provisional_action_status === "approved") {
      return true;
    }
  }

  if (
    kycRTI.kyc_status === "non-compliant" &&
    kycRTI.sign_status === "signed"
  ) {
    if (userRTI.kyc_registration_v2 === "complete") {
      return true;
    } else if (kycRTI.provisional_action_status === "approved") {
      return true;
    } else if (kycRTI.friendly_application_status === "complete") {
      return true;
    }
  }

  return false;
}

export function isMfApplicationSubmitted(kyc) {
  if (isEmpty(kyc)) return false;
  const isCompliantAppSubmitted = kyc.kyc_status === "compliant" && kyc.application_status_v2 === "submitted" &&
    (kyc.bank.meta_data_status !== "approved" && ["pd_triggered", "doc_submitted"].includes(kyc.bank.meta_data.bank_status));
  const isNonCompliantAppSubmitted = kyc.kyc_status !== "compliant" && kyc.application_status_v2 === "submitted" &&
    kyc.sign_status === "signed";
  
  if (isCompliantAppSubmitted || isNonCompliantAppSubmitted) {
    return true;
  }

  return false;
}

export async function setKycProductType(data) {
  try {
    const submitResult = await kycSubmit(data);
    if (!submitResult) {
      throw new Error("Something went wrong");
    }
    storageService().setObject("kyc", submitResult.kyc);
    return submitResult;
  } catch (err) {
    console.log(err.message);
    toast(err.message || "Something went wrong");
  } 
}

export async function validateLocation({ lat, lng }) {
  try {
    const res = await Api.get('/api/kyc/location/validation', {
      latlon: `${lat}, ${lng}`
    })

    return Api.handleApiResponse(res);
  } catch (err) {
    throw (err)
  }
}
