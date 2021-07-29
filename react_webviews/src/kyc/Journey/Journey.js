import React, { useState, useEffect } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import ShowAadharDialog from '../mini-components/ShowAadharDialog'
import Alert from '../mini-components/Alert'
import { isEmpty, storageService, getUrlParams } from '../../utils/validators'
import { PATHNAME_MAPPER } from '../constants'
import { getKycAppStatus } from '../services'
import toast from '../../common/ui/Toast'
import {
  pollProgress, updateQueryStringParameter, getFlow
} from '../common/functions'
import { getUserKycFromSummary, submit } from '../common/api'
import Toast from '../../common/ui/Toast'
import AadhaarDialog from '../mini-components/AadhaarDialog'
import KycBackModal from '../mini-components/KycBack'
import "./Journey.scss"
import { nativeCallback } from '../../utils/native_callback'
import { getBasePath, navigate as navigateFunc, popupWindowCenter, isNewIframeDesktopLayout } from '../../utils/functions'

const Journey = (props) => {
  const newIframeDesktopLayout = isNewIframeDesktopLayout();
  const navigate = navigateFunc.bind(props)
  const urlParams = getUrlParams(props?.location?.search)
  const stateParams = props?.location?.state;
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [aadhaarLinkDialog, setAadhaarLinkDialog] = useState(false)
  const [npsDetailsReq] = useState(
    storageService().get('nps_additional_details_required')
  )

  const [showDlAadhaar, setDlAadhaar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [goBackModal, setGoBackModal] = useState(false)

  const [kyc, setKyc] = useState({})
  const [user, setUser] = useState({})
  const state = props.location.state || {};
  let { fromState } = state;

  const closeGoBackModal = () => {
    setGoBackModal(false)
  }
  const config = getConfig();
  const isMobileDevice = config.isMobileDevice;
  const iframe = config.isIframe;

  const backHandlingCondition = () => {
    if (config.isIframe) {
      if (config.code === 'moneycontrol') {
        navigate("/");
      } else {
        navigate("/landing");
      }
      return;
    } else if (!config.Web) {
      if (storageService().get('native')) {
        nativeCallback({ action: "exit_web" });
      } else {
        navigate("/");
      }
      return;
    }
    navigate("/landing");
  }

  const openGoBackModal = () => {
    if (user?.kyc_registration_v2 !== "submitted" && user.kyc_registration_v2 !== "complete") {
      setGoBackModal(true)
    } else {
      backHandlingCondition();
    }
  }

  const confirmGoBack = () => {
      closeGoBackModal()
      backHandlingCondition();
  }

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      const result = await getUserKycFromSummary()
      if (!result) {
        setIsLoading(false)
        return
      }
      let currentUser = result.data.user.user.data
      let userKyc = result.data.kyc.kyc.data
      setKyc(userKyc)
      setUser(currentUser)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const initJourneyData = () => {
    let i, j, k, data
    if (!isEmpty(kyc) && !isEmpty(user)) {
      let journeyData = getJourneyData()
      for (i = 0; i < journeyData.length; i++) {
        let status = 'completed'
        if (journeyData[i].key === 'digilocker') {
          if (
            kyc[journeyData[i].inputsForStatus[0]] === null ||
            kyc[journeyData[i].inputsForStatus[0]] === '' ||
            kyc[journeyData[i].inputsForStatus[0]] === 'init'
          ) {
            status = 'init'
            if(newIframeDesktopLayout)
              journeyData[i].subtitle = <Alert variant="info" message="Please ensure your mobile is linked with Aadhar" />;
            break
          }
        } else if (
          journeyData[i].key === 'esign' ||
          journeyData[i].key === 'bank_esign'
        ) {
          if (kyc.sign_status !== 'signed') {
            status = 'init'
            break
          }

          if(journeyData[i].key === 'bank_esign' && kyc.bank.meta_data_status === 'rejected') {
            status = 'init'
            break
          }
        } else if (
          journeyData[i].key === 'docs' ||
          journeyData[i].key === 'sign'
        ) {
          for (j = 0; j < journeyData[i].inputsForStatus.length; j++) {
            let data = journeyData[i].inputsForStatus[j]
            if (data !== 'bank' && (kyc[data].doc_status === 'init' || kyc[data].doc_status === 'rejected')) {
              status = 'init'
              break
            }

            if (data === 'bank' && (kyc[data].meta_data_status === 'init' || kyc[data].meta_data_status === 'rejected')) {
              status = 'init'
              break
            }
          }
        } else if (
          !isCompliant &&
          show_aadhaar &&
          journeyData[i].key === 'personal' &&
          (kyc.sign.doc_status === 'init' || kyc.sign.doc_status === 'rejected')
        ) {
          status = 'init'
          break
        } else {
          if (!isCompliant && show_aadhaar) {
            if (
              journeyData[i].key === 'pan' &&
              kyc.dl_docs_status !== null &&
              kyc.dl_docs_status !== '' &&
              kyc.dl_docs_status !== 'init'
            ) {
              journeyData[i].isEditAllowed = false
            }
          }
          for (j = 0; j < journeyData[i].inputsForStatus.length; j++) {
            for (
              k = 0;
              k < journeyData[i].inputsForStatus[j].keys.length;
              k++
            ) {
              data = journeyData[i].inputsForStatus[j]

              if (
                isEmpty(kyc[data.name]['meta_data'][data.keys[k]]) ||
                kyc[data.name]['meta_data'][data.keys[k]].length === 0
              ) {
                if (
                  data.name === 'nomination' &&
                  (kyc.nomination.nominee_optional ||
                    (kyc.address.meta_data.is_nri &&
                      kyc.nomination.nominee_optional === null))
                ) {
                  //
                } else {
                  status = 'init'
                  break
                }
              }
            }
          }
        }

        journeyData[i].status = status
      }

      if (isCompliant) {
        journeyData[0].status = 'init'
        if (customerVerified) {
          journeyData[0].status = 'completed'
        }
      }

      for (i = 0; i < journeyData.length - 1; i++) {
        if (journeyData[i].status === 'init') {
          for (j = i + 1; j < journeyData.length; j++) {
            journeyData[j].status = 'pending'
          }
        }
      }

      // for events

      for (i = 0; i < journeyData.length; i++) {
        if (
          journeyData[i].status === 'init' ||
          journeyData[i].status === 'pending'
        ) {
          stage = i + 1
          stageDetail = journeyData[i].key
          break
        }
      }

      if (
        isCompliant &&
        user.active_investment &&
        user.kyc_registration_v2 !== 'submitted'
      ) {
        topTitle = 'Investment pending'
        investmentPending = true
      } else if (isCompliant) {
        topTitle = 'What next?'
      } else if (!isCompliant && show_aadhaar) {
        topTitle = 'Steps to follow:'
      } else {
        topTitle = 'KYC journey'
      }
      return journeyData
    }
    return []
  }

  const canSubmit = () => {
    if (!isEmpty(kycJourneyData)) {
      if (kycJourneyData.length) {
        for (let i = 0; i < kycJourneyData.length; ++i) {
          if (kycJourneyData[i].status !== 'completed') {
            return false
          }
        }
        if (kycJourneyData[kycJourneyData.length - 1].status === 'completed') {
          return true
        }
      }
    }
    return false
  }

  const getJourneyData = () => {
    let journeyData = []
    if (isCompliant) {
      journeyData = [
        {
          key: 'pan',
          title: 'Confirm PAN',
          status: 'completed',
          isEditAllowed: false,
          inputsForStatus: [{ name: 'pan', keys: ['pan_number'] }],
        },
        {
          key: 'personal',
          title: 'Basic details',
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
        {
          key: 'bank',
          title: 'Bank details',
          status: 'pending',
          isEditAllowed: false,
          inputsForStatus: [
            {
              name: 'bank',
              keys: ['account_number', 'account_type', 'ifsc_code'],
            },
          ],
        },
        {
          key: 'sign',
          title: 'Signature',
          status: 'pending',
          isEditAllowed: true,
          inputsForStatus: ['sign'],
        },
      ]
    } else if (!isCompliant && show_aadhaar) {
      journeyData = [
        {
          key: 'pan',
          title: 'PAN',
          value: kyc?.pan?.meta_data?.pan_number,
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
              name: 'identification',
              keys: ['email', 'mobile_number', 'gender', 'marital_status'],
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
              name: 'identification',
              keys: ['email', 'mobile_number', 'gender', 'marital_status'],
            },
            {
              name: 'nomination',
              keys: ['name', 'dob', 'relationship'],
            },
            // { name: "nomination", keys: ["name", "dob", "relationship"] }
          ],
        },
        {
          key: 'address',
          title: 'Address details',
          status: 'pending',
          isEditAllowed: true,
          inputsForStatus: [
            { name: 'address', keys: ['pincode'] },
            { name: 'nomination', keys: ['address'] },
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

      if(!isCompliant && !dlCondition && kyc?.address?.meta_data?.is_nri) {
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
    }

    return journeyData
  }

  const goNext = async () => {
    sendEvents('next')
    try {
      if (!canSubmit()) {
        for (var i = 0; i < kycJourneyData.length; i++) {
          if (kycJourneyData[i].status !== 'completed') {
            if (
              kyc?.kyc_status !== 'compliant' &&
              show_aadhaar &&
              kycJourneyData[i].key === 'digilocker'
            ) {
              proceed()
              break
            } else {
              handleEdit(kycJourneyData[i].key, i)
              break
            }
          }
        }
      }

      if (journeyStatus === 'rejected' && !show_aadhaar) {
        handleEdit(kycJourneyData[3].key, 3)
      }

      if (canSubmit()) {
        await submitData()
      }
    } catch (err) {
      Toast(err.message)
    }
  }

  const handleEdit = (key, index, isEdit) => {
    if(isEdit)
      sendEvents('edit')
    console.log('Inside handleEdit')
    let stateMapper = {}
    if (kyc?.kyc_status === 'compliant') {
      if (key === 'pan' && !customerVerified) {
        navigate('/kyc/compliant-confirm-pan')
        return
      }
      stateMapper = {
        personal: '/kyc/compliant-personal-details',
        nominee: '/kyc/compliant-nominee-details',
        bank: '/kyc/compliant/bank-details',
        sign: '/kyc/upload/sign',
        pan: '/kyc/home',
      }
      navigate(stateMapper[key], {
        state: {
          isEdit: isEdit,
          backToJourney: key === 'sign' ? true : null,
          userType: 'compliant',
        }
      })
      return
    } else {
      if (show_aadhaar) {
        console.log(key)
        stateMapper = {
          pan: '/kyc/home',
          personal: '/kyc/dl/personal-details1',
          bank_esign: '/kyc/non-compliant/bank-details',
          address: '/kyc/address-details1',
          docs: '/kyc/upload/intro',
          esign: '/kyc-esign/info',
        }

        navigate(stateMapper[key], {
          state: {
            isEdit: isEdit,
            userType: 'non-compliant',
          }
        })
        return
      } else {
        console.log('Non show aadhaar')
        stateMapper = {
          pan: '/kyc/home',
          personal: '/kyc/personal-details1',
          address: '/kyc/address-details1',
          docs: '/kyc/upload/intro',
          esign: '/kyc-esign/info',
        }
        console.log(stateMapper[key])
      }
      navigate(stateMapper[key], {
        state: {
          isEdit: isEdit,
          userType: 'non-compliant',
        }
      })
      return
    }
  }

  const submitData = async () => {
    const isCompliant = kyc?.kyc_status === 'compliant'
    try {
      setIsApiRunning('button')
      await submit({
        kyc: {
          identification: {
            fatca_declaration: true,
          },
        },
      })
      if (npsDetailsReq) {
        navigate('/nps/identity')
      } else if (isCompliant) {
        if (kyc?.bank?.meta_data_status === 'approved') {
          navigate('/kyc/compliant-report-verified')
        } else {
          navigate('/kyc/compliant-report-complete')
        }
      } else {
        navigate('/kyc/report')
      }
    } catch (err) {
      Toast(err.message, 'error')
    } finally {
      setIsApiRunning(false)
    }
  }

  const productName = getConfig().productName

  const cancel = () => {
    setDlAadhaar(false)
    navigate(`${PATHNAME_MAPPER.journey}`, {
      searchParams: `${config.searchParams}&show_aadhaar=true`,
    })
    // navigate('/kyc/journey', { show_aadhar: false })
  }

  const proceed = () => {
    if (newIframeDesktopLayout) {
      const redirect_url = encodeURIComponent(
        `${getBasePath()}/digilocker/callback${
          config.searchParams
        }&is_secure=${storageService().get("is_secure")}`
      );
      handleIframeKyc(
        updateQueryStringParameter(
          kyc.digilocker_url,
          "redirect_url",
          redirect_url
        )
      )
    } else {
      setAadhaarLinkDialog(true)
    }
  }

  const handleIframeKyc = (url) => {
    let popup_window = popupWindowCenter(900, 580, url);
    setIsApiRunning("page");
    pollProgress(600000, 5000, popup_window).then(
      function (poll_data) {
        popup_window.close();
        if (poll_data.status === "success") {
          // Success
          navigate("/kyc/digilocker/success");
        } else if (poll_data.status === "failed") {
          // Failed
          navigate("/kyc/digilocker/failed");
        } else if (poll_data.status === "closed") {
          // Closed
          toast("Digilocker window closed. Please try again");
        }
        setIsApiRunning(false);
      },
      function (err) {
        popup_window.close();
        setIsApiRunning(false);
        console.log(err);
        if (err?.status === "timeout") {
          toast("Digilocker has been timedout . Please try again");
        } else {
          toast("Something went wrong. Please try again.");
        }
      }
    );
  };

  if (!isEmpty(kyc) && !isEmpty(user)) {
    var topTitle = ''
    var stage = 0
    // eslint-disable-next-line
    var stageDetail = ''
    var investmentPending = null
    var isCompliant = kyc?.kyc_status === 'compliant'
    var journeyStatus = getKycAppStatus(kyc).status || ''
    var dlCondition =
      !isCompliant &&
      !kyc.address.meta_data.is_nri &&
      kyc.dl_docs_status !== '' &&
      kyc.dl_docs_status !== 'init' &&
      kyc.dl_docs_status !== null
    var show_aadhaar =
      journeyStatus === 'ground_aadhaar' ||
      stateParams?.show_aadhaar || urlParams?.show_aadhaar === "true" ||
      dlCondition
    var customerVerified = journeyStatus === 'ground_premium' ? false : true
    var kycJourneyData = initJourneyData() || [];
    var ctaText = ''
    if (canSubmit()) {
      ctaText = 'SUBMIT APPLICATION'
    } else {
      if (!customerVerified) {
        ctaText = 'UNLOCK NOW'
      } else ctaText = 'CONTINUE'
    }
    if (
      !isCompliant &&
      !show_aadhaar &&
      user.kyc_registration_v2 !== 'submitted' &&
      user.kyc_registration_v2 !== 'complete' &&
      fromState !== "/kyc/digilocker/failed" &&
      journeyStatus !== "rejected"
    ) {
      if (
        !storageService().get('show_aadhaar') &&
        !kyc.address.meta_data.is_nri
      ) {
        // showAadhaar();
        setDlAadhaar(true)
        storageService().set('show_aadhaar', true)
      }
    }
  }
  if (!isEmpty(kyc) && !isEmpty(user)) {
    const params = {
      state: { goBack: '/invest' },
    }
    if (npsDetailsReq && user.kyc_registration_v2 === 'submitted') {
      navigate('/nps/identity', params)
    } else if (
      user.kyc_registration_v2 === 'submitted' &&
      kyc.sign_status === 'signed'
    ) {
      navigate('/kyc/report', params)
    } else if (
      user.kyc_registration_v2 === 'complete' &&
      kyc.sign_status === 'signed'
    ) {
      navigate('/invest')
    }
  }

  const sendEvents = (userAction, screen_name) => {
    let stageData=0;
    let stageDetailData='';
    for (var i = 0; i < kycJourneyData?.length; i++) {
      if (
        kycJourneyData[i].status === 'init' ||
        kycJourneyData[i].status === 'pending'
      ) {
        stageData = i + 1
        stageDetailData = kycJourneyData[i].key
        break
      }
    }
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "" ,
        "screen_name": screen_name || "kyc_journey",
        stage: stageData,
        details: stageDetailData,
        "rti": "",
        "initial_kyc_status": kyc.initial_kyc_status || "",
        "flow": getFlow(kyc) || ""
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      force_hide_inpage_title
      events={sendEvents("just_set_events")}
      buttonTitle={ctaText}
      classOverRideContainer="pr-container"
      skelton={isLoading || isEmpty(kyc) || isEmpty(user)}
      handleClick={goNext}
      showLoader={isApiRunning}
      headerData={{ goBack: openGoBackModal }}
      loaderData={{loadingText: " "}}
      iframeRightContent={require(`assets/${productName}/${show_aadhaar ? "digilocker_kyc" : "kyc_illust"}.svg`)}
      data-aid='kyc-journey-screen'
    >
      {!isEmpty(kyc) && !isEmpty(user) && (
        <div className="kyc-journey" data-aid='kyc-journey-data'>
          {journeyStatus === 'ground_premium' && (
            <div className="kyc-journey-caption">
              fast track your investment!
            </div>
          )}
          {kyc?.kyc_status === 'compliant' && (
            <div className="kyc-pj-content" data-aid='kyc-compliant-pj-content'>
              <div className="left">
                <div className="pj-header">Premium Onboarding</div>
                <div className="pj-bottom-info-box">
                  <img
                    src={require(`assets/${productName}/ic_instant.svg`)}
                    alt="Instant Investment"
                    className="icon"
                  />
                  <div className="pj-bottom-info-content">
                    Instant Investment
                  </div>
                </div>
                <div className="pj-bottom-info-box">
                  <img
                    src={require(`assets/${productName}/ic_no_doc.svg`)}
                    alt="No document asked"
                    className="icon"
                  />
                  <div className="pj-bottom-info-content">
                    No paperwork
                  </div>
                </div>
              </div>
            {
              !iframe &&
              <img
              src={require(`assets/${productName}/ic_premium_onboarding_mid.svg`)}
              alt="Premium Onboarding"
              />
            }
            </div>
          )}
          {show_aadhaar && (
            <div className="kyc-pj-content" data-aid='kyc-non-compliant-pj-content'>
              <div className="left">
                <div className="pj-header">Aadhaar KYC</div>
                <div className="pj-sub-text">
                  Link with DigiLocker to complete Aadhaar KYC
                </div>

                <div className="pj-bottom-info-box">
                  <img
                    src={require(`assets/${productName}/ic_instant.svg`)}
                    alt="Instant Investment"
                    className="icon"
                  />
                  <div className="pj-bottom-info-content">
                    Instant Investment
                  </div>
                </div>
                <div className="pj-bottom-info-box">
                  <img
                    src={require(`assets/${productName}/ic_no_doc.svg`)}
                    alt="No document asked"
                    className="icon"
                  />
                  <div className="pj-bottom-info-content">
                    No paperwork
                  </div>
                </div>
              </div>
              {
                (!iframe || isMobileDevice) &&
                  <img
                  src={require(`assets/${productName}/icn_aadhaar_kyc.svg`)}
                  alt="Premium Onboarding"
                  />
              }
            </div>
          )}
          <div className="kyc-journey-title" data-aid='kyc-journey-title'>{topTitle}</div>
          {!show_aadhaar && (
            <div className="kyc-journey-subtitle" data-aid='kyc-non-dl-compliant-subtitle'>
              Please keep your PAN ({kyc?.pan?.meta_data?.pan_number}) and
              address proof handy to complete KYC
            </div>
          )}
          {kyc?.kyc_status === 'compliant' && !investmentPending && (
            <div className="kyc-journey-subtitle" data-aid='kyc-compliant-subtitle'>
              To unlock premium onboarding, complete these simple steps
            </div>
          )}

          {isCompliant &&
            user.active_investment &&
            user.kyc_registration_v2 !== 'submitted' && (
              <Alert
                dataAid='kyc-registration-v2-alertbox'
                variant="attention"
                message="Please share following mandatory details within 24 hrs to execute the investment."
                title={`Hey ${user.name}`}
              />
            )}
          <main data-aid='kyc-journey' className="steps-container">
            {kycJourneyData.map((item, idx) => (
              <div
                data-aid={`kyc-${item.key}`}
                className={
                  item.status === 'completed' ? 'step step__completed' : 'step'
                }
                key={idx}
              >
                {item.status === 'completed' && (
                  <img
                    src={require(`assets/${productName}/completed.svg`)}
                    alt="completed"
                    className="icon img"
                  />
                )}
                {item.status !== 'completed' && (
                  <span
                    className={idx === stage - 1 ? 'icon icon__active' : 'icon'}
                  >
                    {idx + 1}
                  </span>
                )}
                <div
                  className={
                    idx === stage - 1 ? 'title title__selected' : 'title'
                  }
                >
                  <div>
                    <div className="flex flex-between" data-aid='kyc-field-value'>
                      <span className="field_key">
                        {item.title}
                        {item?.value ? ':' : ''}
                      </span>
                      {item?.value && (
                        <span className="field_value"> {item?.value}</span>
                      )}
                    </div>
                    <div>{item.subtitle}</div>
                  </div>
                  

                  {item.status === 'completed' && item.isEditAllowed && (
                    <span
                      data-aid='kyc-edit'
                      className="edit"
                      onClick={() =>
                        handleEdit(item.key, idx, item.isEditAllowed)
                      }
                    >
                      EDIT
                    </span>
                  )}
                </div>

                {item?.disc && <div className="disc" data-aid='kyc-disc'>{item?.disc}</div>}
              </div>
            ))}
          </main>
        </div>
      )}
      <ShowAadharDialog
        open={showDlAadhaar}
        onClose={() => setDlAadhaar(false)}
        redirect={cancel}
      />
      <AadhaarDialog
        open={aadhaarLinkDialog}
        close={() => {
          setAadhaarLinkDialog(false)
        }}
        kyc={kyc}
        handleIframeKyc={handleIframeKyc}
      />
      <KycBackModal
        id="kyc-back-modal"
        open={goBackModal}
        confirm={confirmGoBack}
        cancel={closeGoBackModal}
      />
    </Container>
  )
}

export default Journey
