import Api from '../utils/api'
import { isEmpty, storageService } from '../utils/validators'
import toast from '../common/ui/Toast'
import { isTradingEnabled } from '../utils/functions'
import { kycSubmit } from './common/api'

const DOCUMENTS_MAPPER = {
  DL: 'Driving license',
  PASSPORT: 'Passport',
  AADHAAR: 'Aadhaar card',
  VOTER_ID_CARD: 'Voter ID',
  UTILITY_BILL: 'Gas receipt',
  LAT_BANK_PB: 'Passbook',
}

export async function getAccountSummary(params = {}) {
  const url = '/api/user/account/summary'
  if (isEmpty(params)) {
    params = {
      campaign: ['user_campaign'],
      kyc: ['kyc'],
      user: ['user'],
      nps: ['nps_user'],
      partner: ['partner'],
      bank_list: ['bank_list'],
      referral: ['subbroker', 'p2p'],
    }
  }
  try {
    const response = await Api.post(url, params);
    if (
      response.pfwstatus_code !== 200 ||
      !response.pfwresponse ||
      isEmpty(response.pfwresponse)
    ) {
      throw new Error( response?.pfwmessage || "Something went wrong!");
    }
    if (response?.pfwresponse?.status_code === 200) {
      return response?.pfwresponse?.result;
    } else {
      throw new Error(response?.pfwresponse?.result?.message);
    }
  } catch (err) {
    toast(err.message || "Something went wrong!");
  }
}

export async function getNPSInvestmentStatus() {
  const url = '/api/nps/invest/status/v2'
  const response = await Api.get(url)
  try {
    if (response.pfwresponse.status_code === 200) {
      return response.pfwresponse.result;
    } else {
      throw new Error(response?.pfwresponse?.result?.message);
    }
  } catch (err) {
    toast(err.message || "Something went wrong!");
  }
}

export async function initData() {
  const currentUser = storageService().get('currentUser')
  const user = storageService().getObject('user')
  const kyc = storageService().getObject('kyc')

  if (currentUser && user && kyc) {
    if (!storageService().get('referral')) {
      const queryParams = {
        campaign: ['user_campaign'],
        nps: ['nps_user'],
        bank_list: ['bank_list'],
        referral: ['subbroker', 'p2p'],
      }
      const result = await getAccountSummary(queryParams)
      if(!result) return;
      storageService().set('dataSettedInsideBoot', true)
      setSDKSummaryData(result)
    }
  } else if (!currentUser || !user || !kyc) {
    const queryParams = {
      campaign: ['user_campaign'],
      kyc: ['kyc'],
      user: ['user'],
      nps: ['nps_user'],
      partner: ['partner'],
      bank_list: ['bank_list'],
      referral: ['subbroker', 'p2p'],
    }
    const result = await getAccountSummary(queryParams)
    if(!result) return;
    storageService().set('dataSettedInsideBoot', true)
    setSummaryData(result)
  }
}

async function setSummaryData(result) {
  const currentUser = result.data.user.user.data
  const userKyc = result.data.kyc.kyc.data
  if (userKyc.firstlogin) {
    storageService().set('firstlogin', true)
  }
  storageService().set('currentUser', true)
  storageService().setObject('user', currentUser)
  storageService().setObject('kyc', userKyc)

  const campaignData = await getCampaignBySection(
    result.data.campaign.user_campaign.data
  )
  storageService().setObject('campaign', campaignData)
  storageService().setObject("npsUser", result.data.nps.nps_user.data);
  storageService().setObject("banklist", result.data.bank_list.bank_list.data);
  storageService().setObject("referral", result.data.referral);
  let partner = "";
  let consent_required = false;
  if (result.data.partner.partner.data) {
    partner = result.data.partner.partner.data.name;
    consent_required = result.data.partner.partner.data.consent_required;
  }
  storageService().set("consent_required", consent_required);
  const subBrokerCodePartersList = ["hbl", "sbm", "flexi", "medlife", "life99"]
  if (partner === "bfdl") {
    storageService().set("partner", "bfdlmobile");
  } else if (partner === "obcweb") {
    storageService().set("partner", "obc");
  } else if (
    subBrokerCodePartersList.indexOf(result.data.referral.subbroker.data.subbroker_code) !== -1
  ) {
    storageService().set(
      "partner",
      result.data.referral.subbroker.data.subbroker_code
    );
  } else {
    storageService().set("partner", partner);
  }
  setNpsData(result)
}

export function getCampaignBySection(notifications, sections) {
  if (!sections) {
    sections = []
  }

  if (!notifications) {
    notifications = storageService().getObject('campaign') || []
  }

  const notificationsData = notifications.map((notification) => {
    return {
      ...notification,
      campaign: {
        ...notification.campaign,
        name: 'PlutusPendingTransactionCampaign',
      },
    }
  })
  return notificationsData
}

function setSDKSummaryData(result) {
  const campaignData = getCampaignBySection(
    result.data.campaign.user_campaign.data
  )
  storageService().setObject('campaign', campaignData)
  storageService().setObject('npsUser', result.data.nps.nps_user.data)
  storageService().setObject('banklist', result.data.bank_list.data)
  storageService().setObject('referral', result.data.referral)

  setNpsData(result)
}

async function setNpsData(result) {
  if (
    result?.data?.user?.user?.data?.nps_investment &&
    result?.data?.nps?.nps_user?.data?.is_doc_required
  ) {
    const data = await getNPSInvestmentStatus()
    if(!data) return;
    storageService().setObject("nps_additional_details", data.registration_details);
    storageService().setObject("nps_data", data);
    if (!data?.registration_details?.additional_details_status) {
      storageService().set('nps_additional_details_required', true)
    } else {
      storageService().set('nps_additional_details_required', false)
    }
  } else {
    storageService().set('nps_additional_details_required', false)
  }
}

export function getKycAppStatus(kyc) {
  const TRADING_ENABLED = isTradingEnabled(kyc);
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
      { name: "sign", keys: ["doc_status"] }
    ];
  } else {
    fieldsToCheck = [
      { name: "pan", keys: ["doc_status", "meta_data_status"] },
      { name: "address", keys: ["doc_status", "meta_data_status"] },
      { name: "bank", keys: ["meta_data_status"] },
      { name: "identification", keys: ["doc_status", "meta_data_status"] },
      { name: "nomination", keys: ["doc_status", "meta_data_status"] },
      { name: "sign", keys: ["doc_status"] },
      { name: "ipvvideo", keys: ["doc_status"] }
    ];
  }

  if (kyc.address.meta_data.is_nri) {
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
    if (!TRADING_ENABLED) {
      status = "rejected";
      result.status = status;
      return result;
    } else {
      status = kyc.equity_application_status;
    }
  } else {
    if (!TRADING_ENABLED || (kyc?.kyc_product_type !== "equity" && isReadyToInvest()) || kyc?.mf_kyc_processed) {
      status = kyc.application_status_v2;
    } else {
      status = kyc.equity_application_status;
    }
  }

  if (!kyc.pan.meta_data.pan_number || (kyc.pan.meta_data.pan_number &&
    kyc.customer_verified !== 'VERIFIED')) {
    status = 'ground';
  }

  if (kyc.kyc_status !== 'compliant' && kyc.application_status_v2 === 'init' && kyc.pan.meta_data.pan_number && kyc.customer_verified === 'UNVERIFIED' && kyc.kyc_type === "init") {
    status = 'ground_pan';
  }

  if (kyc.kyc_status === 'compliant' && (kyc.application_status_v2 !== 'submitted' &&
    kyc.application_status_v2 !== 'complete') && kyc.customer_verified === 'UNVERIFIED') {
    status = 'ground_premium';
  }

  if (!kyc.address.meta_data.is_nri && kyc.kyc_status !== 'compliant' && (kyc.application_status_v2 !== 'init' && kyc.application_status_v2 !== 'submitted' &&
    kyc.application_status_v2 !== 'complete') && kyc.dl_docs_status !== null) {
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

  if (kyc.kyc_status !== 'compliant' && (kyc.application_status_v2 === 'submitted' || kyc.application_status_v2 === 'complete') && kyc.sign_status !== 'signed') {
    status = 'incomplete';
  }

  if (TRADING_ENABLED && kyc?.kyc_product_type === "equity" && (kyc.equity_application_status === 'submitted' || kyc.equity_application_status === 'complete') && kyc.equity_sign_status !== "signed") {
    status = 'incomplete';
  }

  result.status = status;

  return result;
}

export function getDocuments(userKyc) {
  if(userKyc.kyc_status === 'compliant') {
    return [
      {
        key: "sign",
        title: "Signature",
        doc_status: userKyc.sign.doc_status,
        default_image: "sign_default.svg",
        approved_image: "sign_approved.svg",
      }
    ];
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
      doc_status: userKyc.identification.doc_status,
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

export async function setKycProductType(data) {
  try {
    const submitResult = await kycSubmit(data);
    if (!submitResult) {
      throw new Error("Something went wrong");
    }
    return true;
  } catch (err) {
    console.log(err.message);
    toast(err.message || "Something went wrong");
  } 
}
