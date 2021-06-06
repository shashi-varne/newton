import React, { useState, useEffect } from 'react'
import { getConfig, getBasePath, isMobile } from 'utils/functions'
import Container from '../common/Container'
import ShowAadharDialog from '../mini-components/ShowAadharDialog'
import { isEmpty, storageService, getUrlParams } from '../../utils/validators'
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from '../constants'
import { getKycAppStatus } from '../services'
import toast from '../../common/ui/Toast'
import { isKycCompleted, updateQueryStringParameter } from "../common/functions";
import { getFlow } from "../common/functions";
import { getUserKycFromSummary, submit } from '../common/api'
import Toast from '../../common/ui/Toast'
import AadhaarDialog from '../mini-components/AadhaarDialog'
import KycBackModal from '../mini-components/KycBack'
import { isTradingEnabled, navigate as navigateFunc } from '../../utils/functions'
import "./Journey.scss"
import { nativeCallback } from '../../utils/native_callback'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'
import { getJourneyData } from './JourneyFunction';

const HEADER_MAPPER_DATA = {
  kycDone: {
    icon: "ic_premium_onboarding_mid",
    title: "Finish account upgrade",
    subtitle: "",
  },
  compliant: {
    icon: "ic_premium_onboarding",
    title: "Premium onboarding",
    subtitle: "",
  },
  dlFlow: {
    icon: "icn_aadhaar_kyc",
    title: "Aadhaar KYC",
    subtitle: (
      <>
        <b>DigiLocker is now linked!</b> Complete the remaining steps to start
        investing
      </>
    ),
  },
  default: {
    icon: "kyc_status_icon",
    title: "Your KYC is incomplete!",
    subtitle:
      "As per Govt norm. you need to do a one-time registration process to complete KYC.",
  },
};

const HEADER_BOTTOM_DATA = [
  {
    title:"Fast & secure",
    icon:"ic_instant.svg"
  },
  {
    title:"100% paperless",
    icon:"ic_no_doc.svg"
  }
]

const DL_HEADER_BOTTOM_DATA = HEADER_BOTTOM_DATA.reverse();

const config = getConfig();
const productName = config.productName
const TRADING_ENABLED = isTradingEnabled();

const Journey = (props) => {
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

  const backHandlingCondition = () => {
    if (config.isIframe) {
      if (config.code === 'moneycontrol') {
        navigate("/invest/money-control");
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
      let journeyData = getJourneyData(kyc, isCompliant, show_aadhaar)
      for (i = 0; i < journeyData.length; i++) {
        let status = 'completed'
        if (journeyData[i].key === 'digilocker') {
          if (
            kyc[journeyData[i].inputsForStatus[0]] === null ||
            kyc[journeyData[i].inputsForStatus[0]] === '' ||
            kyc[journeyData[i].inputsForStatus[0]] === 'init'
          ) {
            status = 'init'
            break
          }
        } else if (['esign', 'bank_esign', 'trading_esign'].includes(journeyData[i].key)) {
          if (kyc.sign_status !== 'signed') {
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

            if (data === 'bank' && ((kyc[data].meta_data_status === 'init' || kyc[data].meta_data_status === 'rejected') ||
              (kyc[data].meta_data_status === 'approved' && kyc[data].meta_data.bank_status !== 'verified'))) { // this condition covers users who are not penny verified
              status = 'init'
              break
            }
          }
        } else if (
          ((!isCompliant && show_aadhaar) || isCompliant) &&
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
              } else {
                if (journeyData[i].key === 'bank') {
                  // this condition covers users who are not penny verified
                  if (kyc[data.name].meta_data_status === 'approved' && kyc[data.name].meta_data.bank_status !== 'verified') {
                    status = 'init';
                    break;
                  }
                }
              }
            }
          }
        }

        journeyData[i].status = status
      }

      // if (isCompliant) {
      //   journeyData[0].status = 'init'
      //   if (customerVerified) {
      //     journeyData[0].status = 'completed'
      //   }
      // }

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
      } else if (isCompliant || isKycDone) {
        topTitle = `What's next?`
      } else if (show_aadhaar) {
        topTitle = 'Steps to follow:'
      }
      //  else {
      //   topTitle = 'KYC journey'
      // }
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

      if (kyc.kyc_status === 'rejected' && !show_aadhaar) {
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
      // if (key === 'pan' && !customerVerified) {
      //   navigate('/kyc/compliant-confirm-pan')
      //   return
      // }
      stateMapper = {
        personal: PATHNAME_MAPPER.compliantPersonalDetails1,
        nominee: PATHNAME_MAPPER.compliantPersonalDetails4,
        bank: '/kyc/compliant/bank-details',
        sign: PATHNAME_MAPPER.uploadSign,
        pan: PATHNAME_MAPPER.homeKyc,
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
        stateMapper = {
          pan: PATHNAME_MAPPER.homeKyc,
          personal: PATHNAME_MAPPER.digilockerPersonalDetails1,
          bank: '/kyc/non-compliant/bank-details',
          bank_esign: '/kyc/non-compliant/bank-details',
          trading_esign: PATHNAME_MAPPER.tradingExperience,
          address: PATHNAME_MAPPER.addressDetails1,
          docs: PATHNAME_MAPPER.uploadProgress,
          esign: PATHNAME_MAPPER.kycEsign,
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
          pan: PATHNAME_MAPPER.homeKyc,
          personal: PATHNAME_MAPPER.personalDetails1,
          address: PATHNAME_MAPPER.addressDetails1,
          docs: PATHNAME_MAPPER.uploadProgress,
          esign: PATHNAME_MAPPER.kycEsign,
          trading_esign: PATHNAME_MAPPER.tradingExperience,
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
          navigate('/kyc-esign/nsdl', {
            searchParams: `${config.searchParams}&status=success`,
          })
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

  const basePath = getBasePath();
  const handleProceed = () => {
    const redirect_url = encodeURIComponent(
      `${basePath}/digilocker/callback${
        config.searchParams
      }&is_secure=${storageService().get("is_secure")}`
    );
    const data = {
      url: `${basePath}/kyc/journey${
        config.searchParams
      }&show_aadhaar=true&is_secure=
        ${storageService().get("is_secure")}`,
      message: "You are almost there, do you really want to go back?",
    };
    if (isMobile.any() && storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      if (isMobile.iOS()) {
        nativeCallback({
          action: "show_top_bar",
          message: { title: "Aadhaar KYC" },
        });
      }
      nativeCallback({ action: "take_back_button_control", message: data });
    } else if (!isMobile.any()) {
      const redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "You are almost there, do you really want to go back?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: encodeURIComponent(
                `${basePath}/kyc/journey${
                  config.searchParams
                }&show_aadhaar=true&is_secure=
                  ${storageService().get("is_secure")}`
              ),
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "server",
        },
      };
      if (isMobile.iOS()) {
        redirectData.show_toolbar = true;
      }
      nativeCallback({ action: "third_party_redirect", message: redirectData });
    }
    window.location.href = updateQueryStringParameter(
      kyc.digilocker_url,
      "redirect_url",
      redirect_url
    );
  };

  const cancel = () => {
    setDlAadhaar(false)
    navigate(`${PATHNAME_MAPPER.journey}`, {
      searchParams: `${config.searchParams}&show_aadhaar=true`,
    })
    // navigate('/kyc/journey', { show_aadhar: false })
  }

  const proceed = () => {
    // setAadhaarLinkDialog(true)
    handleProceed();
  }

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
    var isKycDone = TRADING_ENABLED && isKycCompleted(kyc);
    var kycJourneyData = initJourneyData() || []
    var headerKey = isKycDone
      ? "kycDone"
      : isCompliant
      ? "compliant"
      : dlCondition
      ? "dlFlow"
      : "default";
    var headerData = HEADER_MAPPER_DATA[headerKey];
    if(isCompliant) {
      if (journeyStatus === "ground_premium") {
        headerData.title = "You’re eligible for premium onboarding!";
      }
      if (kyc.address.meta_data.is_nri) {
        headerData.subtitle =
          "You are investment ready, just share few details to start investing";
      }
    }
    if (
      kycJourneyData[1]?.key === "digilocker" &&
      kycJourneyData[1]?.status === "init"
    ) {
      kycJourneyData[1].disc = (
        <WVInfoBubble
          hasTitle
          customTitle="Please ensure your mobile is linked with Aadhaar"
          type="info"
        />
      );
    }
    var ctaText = ''
    if (canSubmit()) {
      ctaText = 'SUBMIT APPLICATION'
    } else {
      ctaText = 'CONTINUE'
    }
    if (
      !isCompliant &&
      !show_aadhaar &&
      user.kyc_registration_v2 !== 'submitted' &&
      user.kyc_registration_v2 !== 'complete' &&
      fromState !== "digilocker-failed"
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
    if (npsDetailsReq && user.kyc_registration_v2 === 'submitted') {
      navigate('/nps/identity')
    } else if (
      user.kyc_registration_v2 === 'submitted' &&
      kyc.sign_status === 'signed'
    ) {
      navigate('/kyc/report', {
        state: { goBack: '/invest' },
      })
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
      data-aid='kyc-journey-screen'
    >
      {!isEmpty(kyc) && !isEmpty(user) && (
        <div className="kyc-journey" data-aid='kyc-journey-data'>
          <div className="kyc-pj-content" data-aid='kyc-pj-content'>
            <div className="left">
              <div className="pj-header" data-aid='kyc-pj-header'>{headerData.title}</div>
              <div className="pj-sub-text" data-aid='kyc-pj-sub-text'>{headerData.subtitle}</div>
              {!show_aadhaar && (isCompliant || isKycDone) && (
                <FastAndSecureDisclaimer options={HEADER_BOTTOM_DATA} />
              )}
            </div>
            <img
              src={require(`assets/${productName}/${headerData.icon}.svg`)}
              alt=""
            />
          </div>
          {show_aadhaar && !isCompliant && !isKycDone && (
            <FastAndSecureDisclaimer alignInRow options={DL_HEADER_BOTTOM_DATA} />
          )}
          <div className="kyc-journey-title" data-aid='kyc-journey-title'>{topTitle}</div>
          {!show_aadhaar && !isCompliant && (
            <div className="kyc-journey-subtitle" data-aid='kyc-journey-subtitle'>
              <WVInfoBubble isDismissable isOpen type="info">
                Please keep your <b>PAN</b> {kyc?.pan?.meta_data?.pan_number}{" "}
                and <b>address proof</b> handy to complete KYC
              </WVInfoBubble>
            </div>
          )}
          {isCompliant && !investmentPending && (
            <div className="kyc-compliant-subtitle" data-aid='kyc-compliant-subtitle'>
              Complete the remaining steps to start investing
            </div>
          )}

          <main  data-aid='kyc-journey' className="steps-container">
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
                  <div className="flex flex-between" data-aid='kyc-field-value'>
                    <span className="field_key">
                      {item.title}
                      {item?.value ? ':' : ''}
                    </span>
                    {item?.value && (
                      <span className="field_value">{item?.value}</span>
                    )}
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
          {show_aadhaar && (
            <footer className="footer">
              <div>
                INITIATIVE BY
              </div>
              <img
                src={require(`assets/ic_gov_meit.svg`)}
                alt="Initiative by Ministry of Electronics and Information Technology"
              />
            </footer>
          )}
        </div>
      )}
      <ShowAadharDialog
        open={showDlAadhaar}
        onClose={() => setDlAadhaar(false)}
        redirect={cancel}
      />
      <AadhaarDialog
        open={aadhaarLinkDialog}
        onClose={() => {
          setAadhaarLinkDialog(false)
        }}
        kyc={kyc}
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

export const FastAndSecureDisclaimer = ({options=[], alignInRow }) => {
  return (
    <div
      className={`kyc-pj-bottom ${alignInRow && "flex-between"}`}
      data-aid="kyc-pj-bottom"
    >
      {options.map((data, index) => {
        return (
          <div
            className="pj-bottom-info-box"
            data-aid="pj-bottom-info-box-one"
            key={index}
          >
            <img
              src={require(`assets/${config.productName}/${data.icon}`)}
              alt=""
              className="icon"
            />
            <div className="pj-bottom-info-content">{data.title}</div>
          </div>
        );
      })}
    </div>
  );
};
