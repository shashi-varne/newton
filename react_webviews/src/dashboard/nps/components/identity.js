import React, { useState, useEffect } from "react";
import Container from "fund_details/common/Container";
import toast from "common/ui/Toast";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import person from "../../../assets/person.png";
import "../style.scss";

const NpsIdentity = (props) => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  // const handleChange = (name) => (event) => {
  //   let value = event.target ? event.target.value : event;

  //   this.setState({
  //     [name]: value,
  //     [name + 'error']: ''
  //   });
  // };

  return (
    <Container
      classOverRide="pr-error-container"
      fullWidthButton
      buttonTitle="PROCEED"
      hideInPageTitle
      hidePageTitle
      title="Additional Details"
      showLoader={loader}
      // handleClick={replaceFund}
      classOverRideContainer="pr-container"
    >
      <div class="page-heading">
        <img src={require("assets/hand_icon.png")} alt="" width="50" />
        <div class="text">
          Please <span class="bold">confirm</span> your personal details.
        </div>
      </div>

      <div className="nps-identity">
        <div className="InputField">
          <InputWithIcon
            icon={person}
            width="30"
            id="name"
            label="Mother's name"
            // onChange={handleChange("pan")}
          />
        </div>

        <div>Marital Status</div>

        <div className="InputField">
          <InputWithIcon
            icon={person}
            width="30"
            id="name"
            label="Spouse's name"
            // onChange={handleChange("pan")}
          />
        </div>
      </div>
    </Container>
  );
};

export default NpsIdentity;
