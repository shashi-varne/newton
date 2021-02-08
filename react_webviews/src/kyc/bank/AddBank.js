import React, { useState } from "react";
import Container from "../common/Container";
import { storageService } from "utils/validators";
import Input from "common/ui/Input";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { storageConstants } from "../constants";
import { bankAccountTypeOptions } from "../constants";
import { getConfig } from "../../utils/functions";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Alert from "../mini_components/Alert";

const productName = getConfig().productName;
let userKycDetails = storageService().getObject(storageConstants.KYC);
const AddBank = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const [bankData, setBankData] = useState({
    account_number: "",
    c_account_number: "",
    account_type: "",
    ifsc_code: "",
  });
  const [userKyc, setUserKyc] = useState(userKycDetails);

  const accountTypes = bankAccountTypeOptions(
    userKyc.address.meta_data.is_nri || ""
  );

  const handleClick = () => {
    let keys_to_check = [
      "ifsc_code",
      "account_number",
      "account_type",
      "c_account_number",
    ];
    let formData = Object.assign({}, form_data);
    let submit = true;
    keys_to_check.forEach((element) => {
      let value = bankData[element];
      if (!value) {
        formData[`${element}_error`] = "This is required";
        submit = false;
      }
    });
    if (!submit) {
      setFormData(formData);
      return;
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let formData = Object.assign({}, form_data);
    let bank = Object.assign({}, bankData);
    bank[name] = value;
    if (!value) {
      formData[`${name}_error`] = "This is required";
    } else formData[`${name}_error`] = "";

    setFormData(formData);
    setBankData(bank);
  };

  const bankIcon =
    "https://sdk-dot-plutus-staging.appspot.com/static/img/bank_logos/ADB.png";
  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-approved-bank"
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-approved-bank">
        <div className="kyc-main-title">Enter bank account details</div>
        <Alert
          variant="info"
          title="Note"
          message=" As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details."
        />
        <main>
          <Input
            label="Account Holder name"
            class="input"
            value={userKyc.pan.meta_data.name || ""}
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
            id="ifsc_code"
            InputProps={{
              maxLength: 11,
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
          />
          <Input
            label="Account Number"
            class="input"
            value={bankData.account_number}
            error={form_data.account_number_error ? true : false}
            helperText={form_data.account_number_error || ""}
            onChange={handleChange("account_number")}
            maxLength={16}
            type="text"
            id="account_number"
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
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default AddBank;
