import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import {
  storageConstants,
  getPathname,
  addressProofOptions,
} from "../../constants";
import { initData } from "../../services";
import { storageService, isEmpty } from "utils/validators";
import {
  validateFields,
  navigate as navigateFunc,
} from "../../common/functions";

const ChangeAddressDetails1 = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(true);
  const [form_data, setFormData] = useState({});
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [title, setTitle] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userkyc };
    if (isEmpty(userkycDetails)) {
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      setUserKyc(userkycDetails);
    }
    let topTilte = "";
    if (userkycDetails.address.meta_data.is_nri) {
      topTilte = "Change indian address";
    } else {
      topTilte = "Change address";
    }
    setTitle(topTilte);
    let isNri = userkycDetails.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (isNri) {
      selectedIndexResidentialStatus = 1;
    }
    let address_doc_type =
      selectedIndexResidentialStatus === 1 ? "PASSPORT" : "";
    let formData = {
      address_doc_type:
        userkycDetails.address?.address_doc_type || address_doc_type,
    };
    setShowLoader(false);
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
    navigate(getPathname.changeAddressDetails2, {
      state: {
        address_doc_type: form_data.address_doc_type,
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

  const disabled = userkyc?.address?.meta_data?.is_nri || false;
  return (
    <Container
      showLoader={showLoader}
      id="kyc-change-address-details1"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      disable={showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details kyc-address-details">
        <div className="kyc-main-title">
          {title} <span>1/4</span>
        </div>
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
