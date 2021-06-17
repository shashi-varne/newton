import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { validateNumber, isEmpty } from "utils/validators";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  bankAccountTypeOptions,
  PATHNAME_MAPPER,
  getIfscCodeError,
} from "../constants";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {
  checkDLPanFetchAndApprovedStatus,
  isDigilockerFlow,
  validateFields,
  getFlow,
  skipBankDetails
} from "../common/functions";
import PennyExhaustedDialog from "../mini-components/PennyExhaustedDialog";
import { getIFSC, kycSubmit } from "../common/api";
import toast from "../../common/ui/Toast";
import { getConfig, isTradingEnabled, navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "../../utils/native_callback";
import PennyFailedDialog from "../mini-components/PennyFailedDialog";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";

const config = getConfig();
let titleText = "Enter bank account details";

const KycBankDetails = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const code = config.code;
  const navigate = navigateFunc.bind(props);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  const params = props.match.params || {};
  const userType = params.userType || "";
  const isEdit = props.location.state?.isEdit || false;
  if(isEdit) titleText = "Edit bank account details"
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [bankData, setBankData] = useState({
    account_number: "",
    c_account_number: "",
    account_type: "",
    ifsc_code: "",
  });
  const [bankIcon, setBankIcon] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState({
    info_text:
      "As per SEBI, it is mandatory for you to add your add bank account details.",
    variant: "info",
  });
  const [disableFields, setDisableFields] = useState({
    skip_api_call: false,
    account_number_disabled: false,
    c_account_number_disabled: false,
    account_type_disabled: false,
    ifsc_code_disabled: false,
  });
  const [dl_flow, setDlFlow] = useState(false);
  const [ifscDisabled, setIfscDisabled] = useState(false);
  const [isPennyFailed, setIsPennyFailed] = useState(false);
  const [goBackModal, setGoBackModal] = useState(false);
  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc, user]);

  let initialize = async () => {
    let disableData = { ...disableFields };
    if (skipBankDetails()) {
      disableData.skip_api_call = true;
      disableData.account_number_disabled = true;
      disableData.c_account_number_disabled = true;
      disableData.account_type_disabled = true;
      disableData.ifsc_code_disabled = true;
    }
    setDisableFields({ ...disableData });
    if (isDigilockerFlow(kyc)) {
      setDlFlow(true);
    }
    setName(kyc.pan.meta_data.name || "");
    let data = kyc.bank.meta_data || {};
    data.c_account_number = data.account_number;
    if (data.user_rejection_attempts === 0) {
      setIsPennyExhausted(true);
    } else if (data.user_rejection_attempts === 2) {
      setNote({
        info_text:
          "2 more attempts remaining! Please enter your correct account details to proceed",
        variant: "error",
      });
    } else if (data.user_rejection_attempts === 1) {
      setNote({
        info_text:
          "Just 1 attempt is remaining! Please enter your correct account details to proceed",
        variant: "error",
      });
    }
    if (disableData.skip_api_call) {
      setNote({
        info_text:
          "You have successfully added your bank, Complete your KYC to start investing",
        variant: "success",
      });
    }
    setBankData({ ...data });
    setBankIcon(data.ifsc_image || "");
    setAccountTypes([
      ...bankAccountTypeOptions(kyc?.address?.meta_data?.is_nri || ""),
    ]);
  };

  const uploadDocuments = () => {
    sendEvents("upload documents", "bottom_sheet");
    navigate(`/kyc/${kyc.kyc_status}/upload-documents`);
  };

  const redirect = () => {
    navigate(PATHNAME_MAPPER.journey);
  };

  const handleClick = () => {
    if (disableFields.skip_api_call) {
      sendEvents('next')
      handleNavigation();
    } else {
      const keysToCheck = [
        "ifsc_code",
        "account_number",
        "account_type",
        "c_account_number",
      ];
      const formData = { ...form_data, ...bankData };
      let result = validateFields(formData, keysToCheck);
      sendEvents('next')
      if (!result.canSubmit) {
        let data = Object.assign({}, result.formData);
        setFormData(data);
        return;
      }

      if (bankData.account_number !== bankData.c_account_number) {
        let data = Object.assign({}, form_data);
        data.c_account_number_error = "Account number should be same";
        setFormData(data);
        return;
      }

      if (form_data.ifsc_code_error) return;
      let data = { ...bankData };
      if (!["incomplete", "submitted"].includes(bankData.bank_status)) {
        data.bank_id = "";
      }
      saveBankData(data);
    }
  };

  const handleOtherPlatformNavigation = () => {
    if (userType === "compliant") {
      if (isEdit) navigate(PATHNAME_MAPPER.journey);
      else navigate(PATHNAME_MAPPER.tradingExperience)
    } else {
      if (dl_flow) {
        const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
        if (isPanFailedAndNotApproved) {
          navigate(PATHNAME_MAPPER.uploadPan, {
            state: { goBack: PATHNAME_MAPPER.journey }
          });
        } else {
          navigate(PATHNAME_MAPPER.tradingExperience);
        }
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress);
      }
    }
  };

  const handleSdkNavigation = () => {
    if (userType === "compliant") {
      navigate(PATHNAME_MAPPER.journey);
      // if (isEdit) navigate(PATHNAME_MAPPER.journey);
      // else
      //   navigate(PATHNAME_MAPPER.uploadSign, {
      //     state: {
      //       backToJourney: true,
      //     },
      //   });handleSdkNavigation
    } else {
      if (dl_flow) {
        const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
        if (isPanFailedAndNotApproved)
          navigate(PATHNAME_MAPPER.uploadPan, {
            state: { goBack: PATHNAME_MAPPER.journey }
          });
        else navigate(PATHNAME_MAPPER.kycEsign);
      } else navigate(PATHNAME_MAPPER.uploadProgress);
    }
  };

  const handleNavigation = () => {
    if (isTradingEnabled()) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  };

  const saveBankData = async (data) => {
    try {
      setIsApiRunning("button");
      const result = await kycSubmit({
        kyc: {
          bank: data,
        },
      });
      if (!result) return;
      if (result.kyc.bank.meta_data_status === "approved" &&
        (result.kyc.bank.meta_data.bank_status === "doc_submitted" || result.kyc.bank.meta_data.bank_status === "verified")) {
        handleNavigation();
      } else {
        navigate(`/kyc/${userType}/bank-verify`);
      }
    } catch (err) {
      if ((kyc?.bank.meta_data_status === "submitted" && kyc?.bank.meta_data.bank_status === "pd_triggered") ||
        (kyc?.bank.meta_data_status === "rejected" && kyc?.bank.meta_data.bank_status === "rejected")) {
          setIsPennyFailed(true);
      } else {
        toast(err.message || genericErrorMessage);
      }
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => async (event) => {
    let value = event.target ? event.target.value : event;

    if (name === "ifsc_code" && value && value.length > 11) return;

    if (name.includes("account_number") && value && !validateNumber(value))
      return;

    let formData = Object.assign({}, form_data);
    let bank = Object.assign({}, bankData);
    bank[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else formData[`${name}_error`] = "";
    setBankData(bank);
    if (name === "ifsc_code" && value) {
      if (value.length === 11) {
        let data = await checkIFSCFormat(bank, formData);
        setBankIcon(data.bankIcon);
        setFormData(data.formData);
        setBankData(data.bankData);
        return;
      } else if (formData.ifsc_code_helper) {
        formData.ifsc_code_error = "Please enter a valid ifsc code";
      } else {
        formData.ifsc_code_error = "";
      }
    }
    setFormData(formData);
  };

  const checkIFSCFormat = async (bankData, form_data) => {
    let formData = Object.assign({}, form_data);
    let bank = Object.assign({}, bankData);
    let bankIcon = "";
    if (
      (code === "ktb" && bankData.ifsc_code.toUpperCase().startsWith("KARB")) ||
      (code === "lvb" && bankData.ifsc_code.toUpperCase().startsWith("LAVB")) ||
      (code === "cub" && bankData.ifsc_code.toUpperCase().startsWith("CIUB")) ||
      (code === "ippb" &&
        bankData.ifsc_code.toUpperCase().startsWith("IPOS")) ||
      (code !== "ktb" && code !== "lvb" && code !== "cub" && code !== "ippb")
    ) {
      try {
        setIfscDisabled(true);
        const result = (await getIFSC(bankData.ifsc_code)) || [];
        if (result && result.length > 0) {
          const data = result[0] || {};
          formData.ifsc_code_error = "";
          bank.branch_name = data.branch;
          bank.bank_name = data.bank;
          bankIcon = data.image || "";
          formData.ifsc_code_helper = `${data.bank} ${data.branch}`;
        } else {
          bank.branch_name = "";
          bank.bank_name = "";
          formData.ifsc_code_error = getIfscCodeError(code);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIfscDisabled(false);
      }
    } else {
      bank.branch_name = "";
      bank.bank_name = "";
      formData.ifsc_code_error = getIfscCodeError(code);
    }
    return { bankData: bank, formData: formData, bankIcon: bankIcon };
  };

  const checkBankDetails = () => {
    sendEvents("check bank details", "bottom_sheet");
    setIsPennyFailed(false);
  };

  const closeConfirmBackDialog = () => {
    setGoBackModal(false);
  };

  const goBackToPath = () => {
    if (kyc?.kyc_status === "non-compliant" && (kyc?.kyc_type === "manual" || kyc?.address?.meta_data?.is_nri)) {
      navigate(PATHNAME_MAPPER.uploadProgress)
    } else {
      navigate(PATHNAME_MAPPER.journey);
    }
  };

  const goBack = () => {
    setGoBackModal(true)
  }

  const sendEvents = (userAction, screen_name) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": screen_name || "bank_details",
        "account_number": bankData.account_number ? "yes" : "no",
        "c_account_number": bankData.c_account_number ? "yes" : "no",
        "ifsc_code": form_data.ifsc_code_error ? "invalid" : bankData.ifsc_code ? "yes" : "no",
        "account_type": bankData.account_type ? "yes" : "no",
        "attempt_no": kyc.bank.meta_data.user_rejection_attempts || "",
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
      buttonTitle="SAVE AND CONTINUE"
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning}
      skelton={isLoading}
      handleClick={handleClick}
      title={titleText}
      headerData={{goBack}}
      data-aid='kyc-enter-bank-account-details-screen'
    >
      <div className="kyc-approved-bank" data-aid='kyc-approved-bank-page'>
        {!isLoading && (
          <>
            <WVInfoBubble
              type={note.variant}
              hasTitle
              customTitle="Note"
            >
              {note.info_text}
            </WVInfoBubble>
            <main data-aid='kyc-enter-bank-account-details'>
              <Input
                label="Account Holder name"
                class="input"
                value={name || ""}
                error={form_data.name_error ? true : false}
                helperText={form_data.name_error || ""}
                maxLength={16}
                type="text"
                disabled
                id="name"
              />
              <TextField
                label="IFSC Code"
                id="ifsc_code"
                className="input"
                value={bankData.ifsc_code}
                error={form_data.ifsc_code_error ? true : false}
                helperText={
                  form_data.ifsc_code_error || form_data.ifsc_code_helper || ""
                }
                onChange={handleChange("ifsc_code")}
                type="text"
                InputProps={{
                  endAdornment: (
                    <>
                      {bankIcon && (
                        <InputAdornment position="end">
                          <img alt="" src={bankIcon} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                disabled={isApiRunning || disableFields.ifsc_code_disabled || ifscDisabled}
              />
              <Input
                label="Account Number"
                class="input"
                value={bankData.account_number}
                error={form_data.account_number_error ? true : false}
                helperText={form_data.account_number_error || ""}
                onChange={handleChange("account_number")}
                maxLength={16}
                inputMode="numeric"
                type="password"
                id="account_number"
                disabled={isApiRunning || disableFields.account_number_disabled}
              />
              <TextField
                label="Re-enter account number"
                className="input"
                value={bankData.c_account_number}
                error={form_data.c_account_number_error ? true : false}
                helperText={form_data.c_account_number_error || ""}
                onChange={handleChange("c_account_number")}
                maxLength={16}
                type="text"
                InputProps={{
                  endAdornment: (
                    <>
                      {bankData.account_number && bankData.account_number === bankData.c_account_number && (
                        <InputAdornment position="end">
                          <img className="kbd-can-check-icon" alt="" src={require(`assets/completed_step.svg`)} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                // eslint-disable-next-line
                inputProps={{
                  inputMode: "numeric"
                }}
                disabled={
                  isApiRunning || disableFields.c_account_number_disabled
                }
              />
              <div className="input" data-aid='kyc-dropdown-withouticon'>
                <DropdownWithoutIcon
                  error={form_data.account_type_error ? true : false}
                  helperText={form_data.account_type_error}
                  options={accountTypes}
                  id="account_type"
                  label="Account Type"
                  isAOB={true}
                  value={bankData.account_type || ""}
                  name="account_type"
                  onChange={handleChange("account_type")}
                  disabled={isApiRunning || disableFields.account_type_disabled}
                />
              </div>
            </main>
          </>
        )}
        {isPennyExhausted && (
          <PennyExhaustedDialog
            isOpen= {isPennyExhausted}
            redirect={redirect}
            uploadDocuments={uploadDocuments}
          />
        )}
        {isPennyFailed && (
          <PennyFailedDialog
          isOpen={isPennyFailed}
          uploadDocuments={uploadDocuments}
          checkBankDetails={checkBankDetails}
          />
        )}
        {goBackModal ?
          <ConfirmBackDialog
           isOpen={goBackModal}
           close={closeConfirmBackDialog}
           goBack={goBackToPath}
         />
         : null
        }
      </div>
    </Container>
  );
};

export default KycBankDetails;
