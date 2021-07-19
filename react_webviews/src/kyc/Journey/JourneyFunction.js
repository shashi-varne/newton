import { isTradingEnabled } from "utils/functions";
import { panUiSet } from "../common/functions";

export const getJourneyData = (kyc, isCompliant, show_aadhaar) => {
  const TRADING_ENABLED = isTradingEnabled(kyc);

  let journeyData = [];
  if (isCompliant) {
    journeyData = [
      {
        key: 'pan',
        title: 'PAN',
        value: panUiSet(kyc?.pan?.meta_data?.pan_number),
        status: 'completed',
        isEditAllowed: false,
        inputsForStatus: [{ name: 'pan', keys: ['pan_number'] }],
      },
      {
        key: 'personal',
        title: 'Personal details',
        status: 'init',
        isEditAllowed: true,
        inputsForStatus: [
          { name: 'pan', keys: ['dob'] },
          {
            name: 'identification',
            keys: [
              'mobile_number',
              'email',
              'occupation',
              'gross_annual_income',
              'email_verified',
              'mobile_number_verified',
            ],
          },
          {
            name: 'nomination',
            keys: ['name', 'dob', 'relationship'],
          },
        ],
      },
      // {
      //   key: "nominee",
      //   title: "Assign nominee",
      //   status: "pending",
      //   isEditAllowed: true,
      //   inputsForStatus: [
      //     {
      //       name: "nomination",
      //       keys: ["name", "dob", "relationship", "address"]
      //     }
      //   ]
      // },
      // {
      //   key: 'sign',
      //   title: 'Signature',
      //   status: 'pending',
      //   isEditAllowed: true,
      //   inputsForStatus: ['sign'],
      // },
      {
        key: 'bank',
        title: 'Bank details',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: [
          {
            name: 'bank',
            keys: ['account_number', 'account_type', 'ifsc_code', 'bank_status'],
          },
        ],
      },
    ]

    const tradingJourneyData = [
      {
        key: 'trading_esign',
        title: 'Trading details & eSign',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: ['esign'],
      }
    ]
    if (TRADING_ENABLED) {
      journeyData = [...journeyData, ...tradingJourneyData];
    }
    if(kyc.address.meta_data.is_nri) {
      journeyData[1].inputsForStatus.push({name: 'nri_address', keys: ['pincode']})
    }
  } else if (!isCompliant && show_aadhaar) {
    journeyData = [
      {
        key: 'pan',
        title: 'PAN',
        value: panUiSet(kyc?.pan?.meta_data?.pan_number),
        status: 'completed',
        isEditAllowed: true,
        inputsForStatus: [{ name: 'pan', keys: ['pan_number'] }],
      },
      {
        key: 'digilocker',
        title: 'Connect to DigiLocker',
        status: 'init',
        isEditAllowed: false,
        inputsForStatus: ['dl_docs_status'],
      },
      {
        key: 'personal',
        title: 'Personal details',
        status: 'pending',
        isEditAllowed: true,
        inputsForStatus: [
          { name: 'pan', keys: ['name', 'father_name', 'mother_name'] },
          {
            name: "identification",
            keys: [
              "email",
              "mobile_number",
              "gender",
              "marital_status",
              "email_verified",
              "mobile_number_verified",
            ],
          },
          {
            name: 'nomination',
            keys: ['name', 'dob', 'relationship'],
          },
        ],
      },
      {
        key: 'bank_esign',
        title: 'Bank details & eSign',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: ['esign'],
      },
    ]

    const tradingJourneyData = [
      {
        key: 'bank',
        title: 'Bank details',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: [
          {
            name: 'bank',
            keys: ['account_number', 'account_type', 'ifsc_code', 'bank_status'],
          },
        ],
      },
      {
        key: 'trading_esign',
        title: 'Trading details & eSign',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: ['esign'],
      }
    ]
    if (TRADING_ENABLED) {
      journeyData = journeyData.slice(0,3);
      journeyData = [...journeyData, ...tradingJourneyData];
    }
  } else {
    journeyData = [
      {
        key: 'pan',
        title: 'PAN details',
        status: 'completed',
        isEditAllowed: true,
        inputsForStatus: [{ name: 'pan', keys: ['pan_number'] }],
      },
      {
        key: 'personal',
        title: 'Personal details',
        status: 'init',
        isEditAllowed: true,
        inputsForStatus: [
          {
            name: 'pan',
            keys: ['name', 'dob', 'father_name', 'mother_name'],
          },
          {
            name: "identification",
            keys: [
              "email",
              "mobile_number",
              "gender",
              "marital_status",
              "email_verified",
              "mobile_number_verified",
            ],
          },
          {
            name: 'nomination',
            keys: ['name', 'dob', 'relationship'],
          },
        ],
      },
      {
        key: 'address',
        title: 'Address details',
        status: 'pending',
        isEditAllowed: true,
        inputsForStatus: [
          { name: 'address', keys: ['pincode'] },
          // { name: 'nomination', keys: ['address'] },
        ],
      },
      {
        key: 'docs',
        title: 'Upload documents',
        disc: 'PAN & proof of address',
        status: 'pending',
        isEditAllowed: true,
        inputsForStatus: [
          'pan',
          'identification',
          'address',
          'bank',
          'ipvvideo',
          'sign',
        ],
      },
      {
        key: 'esign',
        title: 'eSign',
        status: 'init',
        isEditAllowed: false,
        inputsForStatus: ['esign'],
      },
    ]

    if(!isCompliant && kyc?.address?.meta_data?.is_nri) {
      journeyData[2].inputsForStatus.push({name: 'nri_address', keys: ['pincode']})
      journeyData[3].inputsForStatus.push('nri_address')
    }

    if (
      isCompliant &&
      kyc?.identification?.meta_data?.marital_status &&
      kyc?.identification?.meta_data?.marital_status?.toLowerCase() ===
        'married'
    ) {
      journeyData[1].inputsForStatus[1].keys.push('spouse_name')
    }

    const tradingJourneyData = [
      {
        key: 'trading_esign',
        title: 'Trading details & eSign',
        status: 'pending',
        isEditAllowed: false,
        inputsForStatus: ['esign'],
      }
    ]

    if (kyc.kyc_type === "manual" && TRADING_ENABLED) {
      journeyData = journeyData.slice(0, 4);
      journeyData = [...journeyData, ...tradingJourneyData];
    }
  }

  

  return journeyData;
}