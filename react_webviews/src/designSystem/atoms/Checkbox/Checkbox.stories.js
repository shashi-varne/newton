import React from "react";
import { storiesOf } from "@storybook/react";
import Checkbox from "./Checkbox";
import { action } from "@storybook/addon-actions";

storiesOf("Atoms/checkbox", module).add("default", () => (
  <Checkbox isSelected onChange={action("checkbox-clicked")} />
));
