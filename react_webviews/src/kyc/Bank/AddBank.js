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
import { validateFields } from "../common/functions";
import PennyExhaustedDialog from "../mini-components/PennyExhaustedDialog";
import { getIFSC, addAdditionalBank } from "../common/api";
import toast from "../../common/ui/Toast";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";

const AddBank = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const code = getConfig().code;
  const navigate = navigateFunc.bind(props);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  const bank_id = props.location.state?.bank_id || "";
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
    message:
      "As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details.",
    variant: "info",
  });

  const {kyc, isLoading} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  let initialize = async () => {
    setName(kyc.pan.meta_data.name || "");
    let data = { ...bankData };
    if (bank_id) {
      data =
        kyc.additional_approved_banks.find((obj) => obj.bank_id === bank_id) ||
        {};
      data.c_account_number = data.account_number;
      if (data.user_rejection_attempts === 0) {
        setIsPennyExhausted(true);
      } else if (data.user_rejection_attempts === 2) {
        setNote({
          message:
            "2 more attempts remaining! Please enter your correct account details to proceed",
          variant: "error",
        });
      } else if (data.user_rejection_attempts === 1) {
        setNote({
          message:
            "Just 1 attempt is remaining! Please enter your correct account details to proceed",
          variant: "error",
        });
      }
    }
    setBankData({ ...data });
    setBankIcon(data.ifsc_image || '')
    setAccountTypes([
      ...bankAccountTypeOptions(kyc?.address?.meta_data?.is_nri || ""),
    ]);
  };

  const uploadDocuments = () => {
    navigate(`/kyc/${kyc.kyc_status}/upload-documents`, {
      searchParams: `${
        getConfig().searchParams
      }&additional=true&bank_id=${bank_id}`,
    });
  };

  const redirect = () => {
    navigate(PATHNAME_MAPPER.journey);
  };

  const handleClick = () => {
    sendEvents("next")
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
    const data = {
      account_number: bankData.account_number,
      account_type: bankData.account_type,
      bank_name: bankData.bank_name,
      branch_name: bankData.branch_name,
      ifsc_code: bankData.ifsc_code.toUpperCase(),
    };
    saveBankData(data);
  };

  const saveBankData = async (data) => {
    try {
      setIsApiRunning("button");
      const result = await addAdditionalBank(data);
      if (!result) return;
      if (result.bank.bank_status === "approved") {
        toast("Congratulations!, new account added succesfully");
        navigate(PATHNAME_MAPPER.bankList);
      } else {
        navigate(`${PATHNAME_MAPPER.addBankVerify}${result.bank.bank_id}`);
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
      (code === "ktb" &&
        bankData.ifsc_code.toUpperCase().startsWith("KARB")) ||
      (code === "lvb" &&
        bankData.ifsc_code.toUpperCase().startsWith("LAVB")) ||
      (code === "cub" &&
        bankData.ifsc_code.toUpperCase().startsWith("CIUB")) ||
      (code === "ippb" &&
        bankData.ifsc_code.toUpperCase().startsWith("IPOS")) ||
      (code !== "ktb" &&
        code !== "lvb" &&
        code !== "cub" &&
        code !== "ippb")
    ) {
      setIsApiRunning("button");
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
          formData.ifsc_code_error = getIfscCodeError(code);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsApiRunning(false);
      }
    } else {
      bank.branch_name = "";
      bank.bank_name = "";
      formData.ifsc_code_error = getIfscCodeError(code);
    }
    return { bankData: bank, formData: formData, bankIcon: bankIcon };
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'my_account',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "new bank details",
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
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      buttonTitle="SAVE AND CONTINUE"
      showLoader={isApiRunning}
      disable={isLoading}
      handleClick={handleClick}
      title="Enter bank account details"
      data-aid='kyc-add-bank-screen'
    >
      <div className="kyc-approved-bank" data-aid='kyc-approved-bank-page'>
        {!isLoading && (
          <>
            <WVInfoBubble
              type={note.variant}
              hasTitle
              customTitle="Note"
              dataAid='kyc-addbank-alertbox'
            >
              {note.message}
            </WVInfoBubble>
            <main data-aid='kyc-approved-bank'>
              <Input
                label="Account holder name"
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
                label="IFSC code"
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
                disabled={isApiRunning}
              />
              <Input
                label="Account number"
                class="input"
                value={bankData.account_number}
                error={form_data.account_number_error ? true : false}
                helperText={form_data.account_number_error || ""}
                onChange={handleChange("account_number")}
                maxLength={16}
                inputMode="numeric"
                type="password"
                id="account_number"
                disabled={isApiRunning}
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
                disabled={isApiRunning}
              />
              <div className="input" data-aid='kyc-dropdown-withouticon'>
                <DropdownWithoutIcon
                  error={form_data.account_type_error ? true : false}
                  helperText={form_data.account_type_error}
                  options={accountTypes}
                  id="account_type"
                  label="Account type"
                  isAOB={true}
                  value={bankData.account_type || ""}
                  name="account_type"
                  onChange={handleChange("account_type")}
                  disabled={isApiRunning}
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

export default AddBank;
