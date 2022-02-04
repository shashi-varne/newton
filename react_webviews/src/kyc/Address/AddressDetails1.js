import React, { useState, useEffect, useMemo } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { PATHNAME_MAPPER, ADDRESS_PROOF_OPTIONS } from "../constants";
import { isEmpty } from "utils/validators";
import { isEquityAllowed, validateFields } from "../common/functions";
import { kycSubmit } from "../common/api";
import toast from "../../common/ui/Toast";
import SVG from "react-inlinesvg";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";
import { nativeCallback } from "../../utils/native_callback";

const ADDRESS_DOC_SELECTED_MAPPER = {
  "DL": "driving_licence",
  "PASSPORT": "passport",
  "AADHAAR": "aadhar_card",
  "VOTER_ID_CARD": "voter_id",
  "LAT_BANK_PB": "passbook"
}

const AddressDetails1 = (props) => {
  const genericErrorMessage = "Something went wrong!";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const state = props.location?.state || {};
  const isEdit = state.isEdit || false;
  const {kyc, isLoading} = useUserKycHook();
  const [title, setTitle] = useState("");
  const { productName } = useMemo(() => getConfig(), []);

  const RESIDENTIAL_OPTIONS = [
    {
      name: "Indian",
      value: "INDIAN",
    },
    {
      name: "NRI",
      value: "NRI",
    },
  ];

  useEffect(() => {
    if (!isEmpty(kyc)) initialize();
  }, [kyc]);

  const initialize = () => {
    let topTilte = "";
    if (kyc.address.meta_data.is_nri) {
      if (isEdit) {
        topTilte = "Edit indian address details";
      } else {
        topTilte = "Indian address details";
      }
    } else {
      if (isEdit) {
        topTilte = "Edit address details";
      } else {
        topTilte = "Address details";
      }
    }
    setTitle(topTilte);
    let isNri = kyc.address.meta_data.is_nri;
    let selectedIndexResidentialStatus = 0;
    if (isNri) {
      selectedIndexResidentialStatus = 1;
    }
    let address_doc_type =
      selectedIndexResidentialStatus === 1 ? "PASSPORT" : kyc.address_doc_type;
    let formData = {
      address_doc_type: address_doc_type,
      residential_status:
        RESIDENTIAL_OPTIONS[selectedIndexResidentialStatus].value || "",
      disableResidentialStatus: !!kyc.identification.meta_data.tax_status
    };
    setFormData({ ...formData });
  };

  const handleClick = () => {
    sendEvents("next")
    let keysToCheck = ["address_doc_type", "residential_status"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    const isNri = form_data.residential_status === "NRI";
    if (
      isNri === kyc.address.meta_data.is_nri &&
      kyc.address_doc_type === form_data.address_doc_type
    ) {
      navigate(PATHNAME_MAPPER.addressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
      return;
    }
    let body = {
      kyc: {}
    };
    if(isNri !== kyc.address.meta_data.is_nri) {
      if (!isNri && isEquityAllowed() && kyc.kyc_product_type !== "equity") {
        body.set_kyc_product_type = "equity";
        if(kyc.kyc_status !== "compliant")
          body.set_kyc_type = "manual";
      } else if(isNri && kyc.kyc_product_type === "equity") {
        body.set_kyc_product_type = "mf";
        if(kyc.kyc_status !== "compliant")
          body.set_kyc_type = "init";
      } 
    }
    let userkycDetails = { ...kyc };
    userkycDetails.address.meta_data.address_doc_type =
      form_data.address_doc_type;
    userkycDetails.address.meta_data.is_nri = isNri;
    body.kyc.address = userkycDetails.address.meta_data;
    saveAddressDetails1(body);
  };

  const saveAddressDetails1 = async (body) => {
    setIsApiRunning("button");
    try {
      const submitResult = await kycSubmit(body);
      if (!submitResult) return;
      navigate(PATHNAME_MAPPER.addressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
    } catch (err) {
      console.log(err);
      toast(err.message || genericErrorMessage);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let formData = { ...form_data };
    if (name === "residential_status") {
      formData[name] = RESIDENTIAL_OPTIONS[value].value;
      if (formData[name] === "NRI") {
        formData.address_doc_type = "PASSPORT";
      }
    }
    formData[`${name}_error`] = "";
    setFormData({ ...formData });
  };

  const handleAddressDocType = (value) => {
    let formData = { ...form_data };
    formData["address_doc_type"] = value;
    formData[`address_doc_type_error`] = "";
    setFormData({ ...formData });
  };

  const getTotalPages = (residential_status) => {
    return residential_status === "NRI" ? 4 : 2;
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "address_details_1",
        doc_selected: ADDRESS_DOC_SELECTED_MAPPER[form_data.address_doc_type],
        residential_status: form_data.residential_status,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      skelton={isLoading}
      id="kyc-address-details1"
      buttonTitle="SAVE AND CONTINUE"
      disable={isLoading}
      handleClick={handleClick}
      showLoader={isApiRunning}
      title={title}
      current={1}
      count={1}
      total={getTotalPages(form_data.residential_status)}
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
      data-aid='kyc-address-details-screen-1'
    >
      <div className="kyc-personal-details kyc-address-details">
        <main data-aid='kyc-address-details'>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.residential_status_error ? true : false}
              helperText={form_data.residential_status_error}
              width="40"
              label="Residential status:"
              class="residential_status"
              options={RESIDENTIAL_OPTIONS}
              id="account_type"
              value={form_data.residential_status || ""}
              onChange={handleChange("residential_status")}
              disabled={form_data.disableResidentialStatus || isApiRunning}
              disabledWithValue={form_data.disableResidentialStatus}
            />
          </div>
          <div className="input" data-aid='kyc-address-proof'>
            <div className="address-label" data-aid='address-label'>Address proof:</div>
            <div className="address-proof" data-aid='address-proof'>
              {ADDRESS_PROOF_OPTIONS.map((data, index) => {
                const selected = form_data.address_doc_type === data.value;
                const disabled =
                  form_data.residential_status === "NRI" || isApiRunning;
                return (
                  <span
                    data-aid={`kyc-address-proof-${index+1}`}
                    key={index}
                    className={`address-proof-option ${
                      selected && `selected`
                    } ${disabled && `disabled`}`}
                    onClick={() => {
                      if (!disabled) {
                        handleAddressDocType(data.value);
                      }
                    }}
                  >
                    {data.name}
                    {selected && (
                      <SVG
                        className="check-icon"
                        preProcessor={(code) =>
                          code.replace(
                            /fill=".*?"/g,
                            "fill=" + getConfig().styles.primaryColor
                          )
                        }
                        src={require(`assets/check_selected_blue.svg`)}
                      />
                    )}
                  </span>
                );
              })}
              {form_data.address_doc_type_error && (
                <div className="helper-text" data-aid='kyc-helper-text'>
                  {form_data.address_doc_type_error}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default AddressDetails1;
