import React, { useState } from "react";
import Container from "../../group_insurance/common/Container";
import DropDownNew from "../../common/ui/DropDownNew";
import Input from "../../common/ui/Input";
import toast from "../../common/ui/Toast";
import DescriptionIcon from "@material-ui/icons/Description";
import "../common/style.scss";
import { verifyReferralCode } from "../services";

function Referral() {
  const [partner, setPartner] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const [partnerIndex, setPartnerIndex] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");
  const [partnerOptions] = useState([
    { name: "India Post Payments Bank", value: "ippb" },
    { name: "Karnataka Bank", value: "ktb" },
    { name: "Indian Bank", value: "indb" },
    { name: "City Union Bank", value: "cub" },
  ]);
  const [referralUrl, setReferralUrl] = useState("");
  const [showLoader, setShowLoader] = useState(false);

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

  const copyText = () => {
    navigator.clipboard.writeText(referralUrl);
    toast("Copied", "success");
  };

  const goBack = () => {}

  const handleClick = async () => {
    var canSubmitForm = true;
    if (!partner) {
      setPartnerError("Please select the partner name!");
      canSubmitForm = false;
    }
    if (!referralCode) {
      setReferralCodeError("Please enter the valid referral code!");
      canSubmitForm = false;
    } else if (referralCode.length < 3) {
      setReferralCodeError("Referral code must be greater than 3 characters!");
      canSubmitForm = false;
    }
    if (canSubmitForm) {
      setShowLoader("button");
      const result = await verifyReferralCode(partnerIndex, referralCode)
      setReferralUrl(result)
      setShowLoader(false)
    }
  };

  return (
    <Container
      fullWidthButton={true}
      onlyButton={true}
      title="Partner Referral"
      buttonTitle="GENERATE LINK"
      disableBack={true}
      headerData={{
        hide_icon: true,
        goBack: goBack,
      }}
      showLoader={showLoader}
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
          <div onClick={copyText} className="referral-url-right">
            <DescriptionIcon />
          </div>
        </div>
      )}
    </Container>
  );
}

export default Referral;
