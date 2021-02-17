import Api from "utils/api";
import { isEmpty, storageService } from "utils/validators";

const docMapper = {
  DL: "Driving license",
  PASSPORT: "Passport",
  AADHAAR: "Aadhaar card",
  VOTER_ID_CARD: "Voter ID",
  UTILITY_BILL: "Gas receipt",
  LAT_BANK_PB: "Passbook",
};

export async function getAccountSummary(params = {}) {
  const url = "/api/user/account/summary";
  if (isEmpty(params)) {
    params = {
      campaign: ["user_campaign"],
      kyc: ["kyc"],
      user: ["user"],
      nps: ["nps_user"],
      partner: ["partner"],
      bank_list: ["bank_list"],
      referral: ["subbroker", "p2p"],
    };
  }
  const response = await Api.post(url, params);
  if (response.pfwresponse.status_code === 200) {
    return response.pfwresponse.result;
  } else {
    throw new Error(response.pfwresponse.result.message);
  }
}

export async function getNPSInvestmentStatus() {
  const url = "/api/nps/invest/status/v2";
  const response = await Api.get(url);
  if (response.pfwresponse.status_code === 200) {
    return response.pfwresponse.result;
  } else {
    throw new Error(response.pfwresponse.result.message);
  }
}

export async function initData() {
  const currentUser = storageService().get("currentUser");
  const user = storageService().getObject("user");
  const kyc = storageService().getObject("kyc");

  if (currentUser && user && kyc) {
    if (!storageService().get("referral")) {
      const queryParams = {
        campaign: ["user_campaign"],
        nps: ["nps_user"],
        bank_list: ["bank_list"],
        referral: ["subbroker", "p2p"],
      };
      const result = await getAccountSummary(queryParams);
      storageService().set("dataSettedInsideBoot", true);
      setSDKSummaryData(result);
    }
  } else if (!currentUser || !user || !kyc) {
    const queryParams = {
      campaign: ["user_campaign"],
      kyc: ["kyc"],
      user: ["user"],
      nps: ["nps_user"],
      partner: ["partner"],
      bank_list: ["bank_list"],
      referral: ["subbroker", "p2p"],
    };
    const result = await getAccountSummary(queryParams);
    storageService().set("dataSettedInsideBoot", true);
    setSummaryData(result);
  }
}

async function setSummaryData(result) {
  const currentUser = result.data.user.user.data;
  const userKyc = result.data.kyc.kyc.data;
  if (userKyc.firstlogin) {
    storageService().set("firstlogin", true);
  }
  storageService().set("currentUser", true);
  storageService().setObject("user", currentUser);
  storageService().setObject("kyc", userKyc);

  const campaignData = await getCampaignBySection(
    result.data.campaign.user_campaign.data
  );
  storageService().setObject("campaign", campaignData);
  setNpsData(result);
}

export function getCampaignBySection(notifications, sections) {
  if (!sections) {
    sections = [];
  }

  if (!notifications) {
    notifications = storageService().getObject("campaign") || [];
  }

  const notificationsData = notifications.map((notification) => {
    return {
      ...notification,
      campaign: {
        ...notification.campaign,
        name: "PlutusPendingTransactionCampaign",
      },
    };
  });
  return notificationsData;
}

function setSDKSummaryData(result) {
  const campaignData = getCampaignBySection(
    result.data.campaign.user_campaign.data
  );
  storageService().setObject("campaign", campaignData);
  storageService().setObject("npsUser", result.data.nps.nps_user.data);
  storageService().setObject("banklist", result.data.bank_list.data);
  storageService().setObject("referral", result.data.referral);

  setNpsData(result);
}

async function setNpsData(result) {
  if (
    result?.data?.user?.user?.data?.nps_investment &&
    result?.data?.nps?.nps_user?.data?.is_doc_required
  ) {
    const data = await getNPSInvestmentStatus();
    if (!data.registration_details.additional_details_status) {
      storageService().set("nps_additional_details_required", true);
    } else {
      storageService().set("nps_additional_details_required", false);
    }
  } else {
    storageService().set("nps_additional_details_required", false);
  }
}

export function getKycAppStatus(kyc) {
  let rejected = 0;
  let metaRejected = 0;
  let docRejected = 0;
  let rejectedItems = [];
  let fieldsToCheck = [];
  if (kyc.kyc_status === "compliant") {
    fieldsToCheck = [
      { name: "pan", keys: ["meta_data_status"] },
      { name: "bank", keys: ["meta_data_status"] },
      { name: "identification", keys: ["meta_data_status"] },
      { name: "nomination", keys: ["meta_data_status"] },
      { name: "sign", keys: ["doc_status"] },
    ];
  } else {
    fieldsToCheck = [
      { name: "pan", keys: ["doc_status", "meta_data_status"] },
      { name: "address", keys: ["doc_status", "meta_data_status"] },
      { name: "bank", keys: ["meta_data_status"] },
      { name: "identification", keys: ["doc_status", "meta_data_status"] },
      { name: "nomination", keys: ["doc_status", "meta_data_status"] },
      { name: "sign", keys: ["doc_status"] },
      { name: "ipvvideo", keys: ["doc_status"] },
    ];
  }
  if (kyc.address.meta_data.is_nri) {
    fieldsToCheck.push({
      name: "nri_address",
      keys: ["doc_status", "meta_data_status"],
    });
  }

  fieldsToCheck.forEach((field) => {
    const { name, keys } = field;
    const objRej = {
      name,
      keys: [],
    };
    keys.forEach((key) => {
      if (kyc[name][key] === "rejected") {
        if (key === "meta_data_status") {
          ++metaRejected;
        }
        if (key === "doc_status") {
          ++docRejected;
        }
        objRej.keys.push(key);
        ++rejected;
      }
    });
    if (objRej.keys.length !== 0) {
      rejectedItems.push(objRej);
    }
  });
  let status = "";
  if (rejected > 0) {
    status = "rejected";
  } else {
    status = kyc.application_status_v2;
  }

  if (
    !kyc.pan.meta_data.pan_number ||
    (kyc.pan.meta_data.pan_number && kyc.customer_verified !== "VERIFIED")
  ) {
    status = "ground";
  }

  if (
    kyc.kyc_status === "compilant" &&
    kyc.application_status_v2 !== "submitted" &&
    kyc.customer_vrified !== "VERIFIED"
  ) {
    status = "ground";
  }

  if (
    kyc.kyc_status === "compilant" &&
    kyc.application_status_v2 !== "submitted" &&
    kyc.application_status_v2 !== "complete" &&
    kyc.customer_verified === "UNVERIFIED"
  ) {
    status = "ground_premium";
  }

  if (
    !kyc.address.meta_data.is_nri &&
    kyc.kyc_status !== "comliant" &&
    kyc.dl_docs_status !== "" &&
    kyc.dl_docs_status !== "init" &&
    kyc.dl_docs_status !== null
  ) {
    status = "ground_aadhar";
  }

  if (
    kyc.application_status_v2 === "init" &&
    kyc.pan.meta_data.pan_number &&
    kyc.customer_verified === "VERIFIED" &&
    (kyc.dl_docs_status === "" ||
      kyc.dl_docs_status === "init" ||
      kyc.dl_docs_status === null)
  ) {
    status = "incomplete";
  }

  if (
    kyc.kyc_status !== "compliant" &&
    (kyc.dl_docs_status === "" ||
      kyc.dl_docs_status === "init" ||
      kyc.dl_docs_status === null) &&
    (kyc.application_status_v2 === "submitted" ||
      kyc.application_status_v2 === "complete") &&
    kyc.sign_status !== "signed"
  ) {
    status = "incomplete";
  }

  return {
    status,
    metaRejected,
    docRejected,
    rejectedItems,
  };
}

export function getDocuments(userKyc) {
  return [
    {
      key: "pan",
      title: "PAN card",
      subtitle: userKyc.pan.meta_data.pan_number,
      doc_status: userKyc.pan.doc_status,
      default_image: "pan_default.svg",
      // approved_image: partner.assets.pan_approved
    },

    {
      key: "address",
      title: "Address proof",
      subtitle: getAddressProof(userKyc),
      doc_status: userKyc.address.doc_status,
      default_image: "regi_default.svg",
      // approved_image: partner.assets.regi_approved
    },

    {
      key: "selfie",
      title: "Selfie",
      doc_status: userKyc.identification.doc_status,
      default_image: "selfie_default.svg",
      // approved_image: partner.assets.selfie_approved
    },

    {
      key: "selfie_video",
      title: "Selfie video (IPV)",
      doc_status: userKyc.ipvvideo.doc_status,
      default_image: "video_default.svg",
      // approved_image: partner.assets.video_approved
    },

    {
      key: "bank",
      title: "Bank details",
      doc_status: userKyc.bank.meta_data_status,
      default_image: "default.svg",
      // approved_image: partner.assets.approved
    },

    {
      key: "sign",
      title: "Signature",
      doc_status: userKyc.sign.doc_status,
      default_image: "sign_default.svg",
      // approved_image: partner.assets.sign_approved
    },
  ];
}

function getAddressProof(userKyc) {
  if (userKyc.address.meta_data.is_nri) {
    return "Passport";
  }
  return docMapper[userKyc.address_doc_type];
}
