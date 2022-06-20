import React from "react";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import TermsAndCondtions from "../../pages/ReferAndEarn/TermsAndCondtions";

const tncContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "",
      properties: {
        user_action: userAction || "",
        screen_name: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return <WrappedComponent points={dummyData} sendEvents={sendEvents} />;
};

const dummyData = [
  "By participating in the Referral Campaign, the user is deemed to have read, understood & accepted to be bound by these T&Cs along with the terms of use, privacy policy, product-specific terms & conditions & other policies as may be applicable from time to time. ",
  "The person referred should be new to Fisdom & must download & log in to the app for the first time & complete their KYC.",
  "Once your referred friend completes the KYC & opens a Demat account you will receive ₹150 in your Fisdom wallet. ",
  "Similarly, when your friend makes an investment for the first time (an SIP of ₹1,000 in Equity & authorises a one-time bank mandate or a one-time investment of ₹5,000 in equity), you will get ₹100 in your Fisdom wallet.",
  "When your friend buys a Freedom Plan for the first time, you will get ₹150 in your Fisdom wallet.",
  "You can earn cash rewards up to ₹2,00,000.",
  "Your referred friends will not receive any cash rewards.",
  "You will receive the referral amount in your Fisdom wallet which you can withdraw directly into your primary linked bank account.",
  "It may take up to 24 hours for the cash reward to get credited to your Fisdom wallet.",
  "You & your referred friend cannot be the same individual having multiple accounts. Neither can the personal details of you & your friend be the same.",
];

export default tncContainer(TermsAndCondtions);
