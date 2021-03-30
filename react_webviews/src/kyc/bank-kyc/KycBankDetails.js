import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { validateNumber, isEmpty } from "utils/validators";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  bankAccountTypeOptions,
  getPathname,
  getIfscCodeError,
} from "../constants";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Alert from "../mini_components/Alert";
import { compareObjects, navigate as navigateFunc, validateFields } from "../common/functions";
import PennyExhaustedDialog from "../mini_components/PennyExhaustedDialog";
import { getIFSC, kycSubmit } from "../common/api";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";

const KycBankDetails = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const partner = getConfig().partner;
  const navigate = navigateFunc.bind(props);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  const params = props.match.params || {};
  const userType = params.userType || "";
  const isEdit = props.location.state?.isEdit || false;
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [bankData, setBankData] = useState({
    account_number: "",
    c_account_number: "",
    account_type: "",
    ifsc_code: "",
  });
  const [oldState, setOldState] = useState({});
  const [bankIcon, setBankIcon] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState({
    info_text:
      "As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details.",
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

  const {kyc, user, isLoading} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc, user]);

  let initialize = async () => {
    let disableData = { ...disableFields };
    if (
      user.active_investment ||
      kyc.bank.meta_data_status === "approved" ||
      kyc.bank.meta_data.bank_status === "doc_submitted"
    ) {
      disableData.skip_api_call = true;
      disableData.account_number_disabled = true;
      disableData.c_account_number_disabled = true;
      disableData.account_type_disabled = true;
      disableData.ifsc_code_disabled = true;
    }
    setDisableFields({ ...disableData });
    if (
      kyc.kyc_status !== "compliant" &&
      !kyc.address.meta_data.is_nri &&
      kyc.dl_docs_status !== "" &&
      kyc.dl_docs_status !== "init" &&
      kyc.dl_docs_status !== null
    ) {
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
        variant: "attention",
      });
    } else if (data.user_rejection_attempts === 1) {
      setNote({
        info_text:
          "Just 1 attempt is remaining! Please enter your correct account details to proceed",
        variant: "attention",
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
    setOldState({...data})
    setBankIcon(data.ifsc_image || '')
    setAccountTypes([
      ...bankAccountTypeOptions(kyc?.address?.meta_data?.is_nri || ""),
    ]);
  };

  const uploadDocuments = () => {
    navigate(`/kyc/${kyc.kyc_status}/upload-documents`);
  };

  const redirect = () => {
    navigate(getPathname.journey);
  };

  const handleClick = () => {
    if (disableFields.skip_api_call) {
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
      // if(compareObjects(keysToCheck, oldState ,bankData)) {
      //   navigate(`/kyc/${userType}/bank-verify`)
      //   return
      // }
      saveBankData(data);
    }
  };

  const handleNavigation = () => {
    if (userType === "compliant") {
      if (isEdit) navigate(getPathname.journey);
      else
        navigate(getPathname.uploadSign, {
          state: {
            backToJourney: true,
          },
        });
    } else {
      if (dl_flow) {
        if (
          (kyc.all_dl_doc_statuses.pan_fetch_status === null ||
          kyc.all_dl_doc_statuses.pan_fetch_status === "" ||
          kyc.all_dl_doc_statuses.pan_fetch_status === "failed") && 
          kyc.pan.doc_status !== "approved"
        )
          navigate(getPathname.uploadPan);
        else navigate(getPathname.kycEsign);
      } else navigate(getPathname.uploadProgress);
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
      if (result.kyc.bank.meta_data_status === "approved") {
        handleNavigation();
      } else {
        navigate(`/kyc/${userType}/bank-verify`);
      }
    } catch (err) {
      toast(err.message || genericErrorMessage);
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
      (partner.code === "ktb" &&
        bankData.ifsc_code.toUpperCase().startsWith("KARB")) ||
      (partner.code === "lvb" &&
        bankData.ifsc_code.toUpperCase().startsWith("LAVB")) ||
      (partner.code === "cub" &&
        bankData.ifsc_code.toUpperCase().startsWith("CIUB")) ||
      (partner.code === "ippb" &&
        bankData.ifsc_code.toUpperCase().startsWith("IPOS")) ||
      (partner.code !== "ktb" &&
        partner.code !== "lvb" &&
        partner.code !== "cub" &&
        partner.code !== "ippb")
    ) {
      try {
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
          formData.ifsc_code_error = getIfscCodeError(partner.code);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      bank.branch_name = "";
      bank.bank_name = "";
      formData.ifsc_code_error = getIfscCodeError(partner.code);
    }
    return { bankData: bank, formData: formData, bankIcon: bankIcon };
  };

  return (
    <Container
      id="kyc-approved-bank"
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      skelton={isLoading}
      handleClick={handleClick}
      title="Enter bank account details"
    >
      <div className="kyc-approved-bank">
        {!isLoading && (
          <>
            <Alert
              variant={note.variant}
              title="Note"
              message={note.info_text}
            />
            <main>
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
                disabled={isApiRunning || disableFields.ifsc_code_disabled}
              />
              <Input
                label="Account Number"
                class="input"
                value={bankData.account_number}
                error={form_data.account_number_error ? true : false}
                helperText={form_data.account_number_error || ""}
                onChange={handleChange("account_number")}
                maxLength={16}
                type="password"
                id="account_number"
                disabled={isApiRunning || disableFields.account_number_disabled}
              />
              <Input
                label="Confirm Account Number"
                class="input"
                value={bankData.c_account_number}
                error={form_data.c_account_number_error ? true : false}
                helperText={form_data.c_account_number_error || ""}
                onChange={handleChange("c_account_number")}
                maxLength={16}
                type="text"
                id="c_account_number"
                disabled={
                  isApiRunning || disableFields.c_account_number_disabled
                }
              />
              <div className="input">
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
            isOpen={isPennyExhausted}
            redirect={redirect}
            uploadDocuments={uploadDocuments}
          />
        )}
      </div>
    </Container>
  );
};

export default KycBankDetails;
