import React from "react";
import Success from "./Success";

export default {
  component: Success,
  title: "Pages/Nominee/Success",
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = (args) => <Success {...args} />;

Default.args = {
  onCtaClick: () => {
    console.log("button is clicked");
  },
  dataAid: "success",
  title: "Nominees added",
  subtitle: "Your Nominees are now verified",
};
