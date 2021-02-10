import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { storageService, validateNumber } from "utils/validators";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import {
  storageConstants,
  bankAccountTypeOptions,
  getPathname,
} from "../constants";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Alert from "../mini_components/Alert";
import {
  navigate as navigateFunc,
  validateFields,
  checkIFSCFormat,
  saveBankData,
} from "../common/functions";
import { initData } from "../services";
import PennyExhaustedDialog from "../mini_components/PennyExhaustedDialog";

const AddBank = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isPennyExhausted, setIsPennyExhausted] = useState(false);
  let userKyc = storageService().getObject(storageConstants.KYC);
  const bank_id = props.location.state?.bank_id || "";
  let data = {
    account_number: "",
    c_account_number: "",
    account_type: "",
    ifsc_code: "",
  };
  if (bank_id && userKyc) {
    data = userKyc.additional_approved_banks.find(
      (obj) => obj.bank_id === bank_id
    );
    data.c_account_number = data.account_number;
  }

  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [bankData, setBankData] = useState({ ...data });
  const [bankIcon, setBankIcon] = useState(data.ifsc_image || "");
  const [accountTypes, setAccountTypes] = useState(
    bankAccountTypeOptions(userKyc?.address?.meta_data?.is_nri || "")
  );
  const [name, setName] = useState(userKyc?.pan?.meta_data?.name || "");
  const [note, setNote] = useState({
    info_text:
      "As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details.",
    variant: "info",
  });

  useEffect(() => {
    initialize();
  }, []);

  let initialize = async () => {
    if (!userKyc) {
      await initData();
      userKyc = storageService().getObject(storageConstants.KYC);
      setName(userKyc.pan.meta_data.name || "");
      if (bank_id) {
        data = userKyc.additional_approved_banks.find(
          (obj) => obj.bank_id === bank_id
        );
        data.c_account_number = data.account_number;
      }
      setBankData({ ...data });
      setAccountTypes([...bankAccountTypeOptions(true)]);
    }
    if (bank_id) {
      if (bankData.user_rejection_attempts === 3) {
        setIsPennyExhausted(true);
      } else if (bankData.user_rejection_attempts === 2) {
        setNote({
          info_text:
            "2 more attempts remaining! Please enter your correct account details to proceed",
          variant: "attention",
        });
      } else if (bankData.user_rejection_attempts === 1) {
        setNote({
          info_text:
            "Just 1 attempt is remaining! Please enter your correct account details to proceed",
          variant: "attention",
        });
      }
    }
  };

  const uploadDocuments = () => {
    navigate();
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
    saveBankData(data, setIsApiRunning, navigate);
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
        let data = await checkIFSCFormat(bank, formData, setIsApiRunning);
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

  return (
    <Container
      hideInPageTitle
      id="kyc-approved-bank"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning}
      handleClick={handleClick}
    >
      <div className="kyc-approved-bank">
        <div className="kyc-main-title">Enter bank account details</div>
        <Alert variant={note.variant} title="Note" message={note.info_text} />
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
        <PennyExhaustedDialog
          isOpen={isPennyExhausted}
          redirect={redirect}
          uploadDocuments={uploadDocuments}
        />
      </div>
    </Container>
  );
};

export default AddBank;
