import React, { useState } from "react";
import Container from "../group_insurance/common/Container";
import DropDownNew from "../common/ui/DropDownNew";
import Input from "../common/ui/Input";
import toast from "../common/ui/Toast";
import DescriptionIcon from '@material-ui/icons/Description';
import './partner-referral.scss'

function PartnerReferral() {
  const [partner, setPartner] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const [partnerIndex, setPartnerIndex] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");
  const [partnerOptions, setPartnerOptions] = useState([
    { name: "Allahabad Bank", value: "allahabad_bank" },
    { name: "Karnataka Bank", value: "karnataka_bank" },
    { name: "Oriental Bank", value: "oriental_bank" },
    { name: "Punjab National Bank", value: "pnb" },
  ]);
  const [referralUrl, setReferralUrl] = useState("");

  const handleChange = (name) => (event) => {
    if (!name) {
      name = event.target.name;
    }
    var value = event.target ? event.target.value : event;
    if (name === "partner_name") {
      setPartner(value);
      setPartnerIndex(value);
      setPartnerError("");
    } else {
      setReferralCode(value);
      setReferralCodeError("");
    }
  };

  const handleClick = () => {
    var canSubmitForm = true;
    if (!partner) {
      setPartnerError("Please select the partner name!");
      canSubmitForm = false;
    }
    if (!referralCode) {
      setReferralCodeError("Please enter the valid code!");
      canSubmitForm = false;
    } else if (referralCode.length < 8) {
      setReferralCodeError("Please enter a valid referral code!");
      canSubmitForm = false;
    }
    if (canSubmitForm) {
      setReferralUrl("app.fisdom.com/baiotfs");
      toast("Referral code entered was incorrect", "error");
    }
  };

  return (
    <Container
      fullWidthButton={true}
      onlyButton={true}
      title="Partner Referral"
      buttonTitle="GENERATE LINK"
      headerData = {{
        hide_icon: true
      }}
      // showLoader={show_loader}
      // skelton={skelton}
      handleClick={() => handleClick()}
    >
        <div className="partner-dropdown">
        <DropDownNew
          parent={this}
          header_title="Partner name?"
          selectedIndex={partnerIndex || 0}
          width="140"
          dataType="AOB"
          options={partnerOptions}
          id="partner"
          label="Partner name?"
          error={partnerError ? true : false}
          helperText={partnerError}
          name="partner_name"
          value={partner || ""}
          onChange={handleChange("partner_name")}
        />
        </div>
        <Input
          type="text"
          width="40"
          label="Enter the referral code"
          class="Name"
          id="name"
          name="name"
          error={referralCodeError ? true : false}
          helperText={referralCodeError}
          value={referralCode || ""}
          onChange={handleChange()}
        />
      {referralUrl && (
        <div className="partner-referral-url">
          <div className="referral-url-left">
            <p>{referralUrl}</p>
          </div>
          <div
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              toast("Copied", "success");
            }}
            className="referral-url-right"
          >
            <DescriptionIcon />
          </div>
        </div>
      )}
    </Container>
  );
}

export default PartnerReferral;

