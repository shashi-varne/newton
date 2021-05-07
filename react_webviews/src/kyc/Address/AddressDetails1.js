import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { getPathname, addressProofOptions } from "../constants";
import { isEmpty } from "utils/validators";
import { validateFields, navigate as navigateFunc } from "../common/functions";
import { kycSubmit } from "../common/api";
import toast from "../../common/ui/Toast";
import SVG from "react-inlinesvg";
import { getConfig } from "utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";

const AddressDetails1 = (props) => {
  const genericErrorMessage = "Something went wrong!";
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [form_data, setFormData] = useState({});
  const state = props.location?.state || {};
  const isEdit = state.isEdit || false;
  const {kyc, isLoading} = useUserKycHook();
  const [title, setTitle] = useState("");

  const residentialOptions = [
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
        residentialOptions[selectedIndexResidentialStatus].value || "",
    };
    setFormData({ ...formData });
  };

  const handleClick = () => {
    let keysToCheck = ["address_doc_type", "residential_status"];
    let result = validateFields(form_data, keysToCheck);
    if (!result.canSubmit) {
      let data = { ...result.formData };
      setFormData(data);
      return;
    }
    const is_nri = form_data.residential_status === "NRI";
    if (
      is_nri === kyc.address.meta_data.is_nri &&
      kyc.address_doc_type === form_data.address_doc_type
    ) {
      navigate(getPathname.addressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      });
      return;
    }
    let userkycDetails = { ...kyc };
    userkycDetails.address.meta_data.address_doc_type =
      form_data.address_doc_type;
    userkycDetails.address.meta_data.is_nri = is_nri;
    saveAddressDetails1(userkycDetails);
  };

  const saveAddressDetails1 = async (userKyc) => {
    setIsApiRunning("button");
    try {
      let item = {
        kyc: {
          address: userKyc.address.meta_data,
        },
      };
      const submitResult = await kycSubmit(item);
      if (!submitResult) return;
      navigate(getPathname.addressDetails2, {
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
      formData[name] = residentialOptions[value].value;
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

  return (
    <Container
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
      data-aid='Kyc-address-details-1'
    >
      <div className="kyc-personal-details kyc-address-details" data-aid='Kyc-address-details-container'>
        <main data-aid='Kyc-address-details'>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.residential_status_error ? true : false}
              helperText={form_data.residential_status_error}
              width="40"
              label="Residential status:"
              class="residential_status"
              options={residentialOptions}
              id="account_type"
              value={form_data.residential_status || ""}
              onChange={handleChange("residential_status")}
              disabled={isApiRunning}
            />
          </div>
          <div className="input" data-aid='Kyc-address-proof'>
            <div className="address-label">Address proof:</div>
            <div className="address-proof">
              {addressProofOptions.map((data, index) => {
                const selected = form_data.address_doc_type === data.value;
                const disabled =
                  form_data.residential_status === "NRI" || isApiRunning;
                return (
                  <span
                    data-aid={`kyc-address-proof_${index+1}`}
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
                <div className="helper-text" data-aid='Kyc-helper-text'>
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
