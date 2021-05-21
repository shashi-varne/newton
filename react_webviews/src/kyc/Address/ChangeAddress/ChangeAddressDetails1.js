import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { getPathname, addressProofOptions } from "../../constants";
import { isEmpty } from "utils/validators";
import {
  validateFields,
} from "../../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
import "../commonStyles.scss";

const ChangeAddressDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [form_data, setFormData] = useState({});
  const {kyc, isLoading} = useUserKycHook();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let topTilte = "";
    if (kyc.address.meta_data.is_nri) {
      topTilte = "Change indian address";
    } else {
      topTilte = "Change address";
    }
    setTitle(topTilte);
    let isNri = kyc.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (isNri) {
      selectedIndexResidentialStatus = 1;
    }
    let address_doc_type =
      selectedIndexResidentialStatus === 1 ? "PASSPORT" : "";
    let formData = {
      address_doc_type: kyc?.address_doc_type || address_doc_type,
    };
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["address_doc_type"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    navigate(getPathname.uploadAddress, {
      state: {
        addressDocType: form_data.address_doc_type,
        flow: "myAccount",
      },
    });
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let formData = { ...form_data };
    formData[name] = addressProofOptions[value].value;
    formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const disabled = kyc?.address?.meta_data?.is_nri || false;
  return (
    <Container
      skelton={isLoading}
      id="kyc-change-address-details1"
      buttonTitle="SAVE AND CONTINUE"
      handleClick={handleClick}
      title={title}
      count={1}
      current={1}
      total={2}
    >
      <div className="kyc-personal-details kyc-address-details">
        <main>
          <div className={`input ${disabled && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.address_doc_type_error ? true : false}
              helperText={form_data.address_doc_type_error}
              label="Address proof:"
              class="address_doc_type"
              options={addressProofOptions}
              id="account_type"
              value={form_data.address_doc_type || ""}
              onChange={handleChange("address_doc_type")}
              disabled={disabled}
            />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default ChangeAddressDetails1;
