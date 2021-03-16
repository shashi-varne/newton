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
import { navigate as navigateFunc, validateFields } from "../common/functions";
import PennyExhaustedDialog from "../mini_components/PennyExhaustedDialog";
import { getIFSC, addAdditionalBank } from "../common/api";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";

const AddBank = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const partner = getConfig().partner;
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
    info_text:
      "As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details.",
    variant: "info",
  });

  const [kyc, ,isLoading] = useUserKycHook();

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
    }
    setBankData({ ...data });
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
    navigate(getPathname.journey);
  };

  const handleClick = () => {
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
      setIsApiRunning(true);
      const result = await addAdditionalBank(data);
      if (!result) return;
      if (result.bank.bank_status === "approved") {
        toast("Congratulations!, new account added succesfully");
        navigate(getPathname.bankList);
      } else {
        navigate(`${getPathname.addBankVerify}${result.bank.bank_id}`);
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
      setIsApiRunning(true);
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
      } finally {
        setIsApiRunning(false);
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
      hideInPageTitle
      showSkelton={isLoading}
      id="kyc-approved-bank"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || isLoading}
      handleClick={handleClick}
    >
      <div className="kyc-approved-bank">
        <div className="kyc-main-title">Enter bank account details</div>
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
                disabled={isApiRunning}
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
                disabled={isApiRunning}
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
                disabled={isApiRunning}
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
