import React from "react";
import ManualSignature from "./ManualSignature";
import { noop } from "lodash-es";

export default {
  component: ManualSignature,
  title: "Pages/Nominee/ManualSignature",
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = (args) => <ManualSignature {...args} />;

Default.args = {
  email: "test@fisdom.com",
  onClickDownloadForm: noop,
};
