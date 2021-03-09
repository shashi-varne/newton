import React, { Component } from "react";
import qs from "qs";

import Container from "../../common/Container";
// import intro from "assets/risk profiler intro_icn.svg";
// import intro_myway from "assets/risk profiler intro_icn.svg";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { storageService } from "../../../utils/validators";

const platform = getConfig().productName;
class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      openDialogConfirm: false,
      openDialog: false,
      benefitsList: [],
    };
    this.handleClose = this.handleClose.bind(this);
    this.renderBenefits = this.renderBenefits.bind(this);
  }

  componentWillMount() {
    let benefitsList = [
      {
        key: "Benefit_1",
        description: "You'll be able to better understand your risk appetite",
        icon: "ic_risk_analyse",
      },
      {
        key: "Benefit_2",
        description: "We'll be able to give you personalised recommendations",
        icon: "ic_intelligent_pf",
      },
      {
        key: "Benefit_3",
        description: "You'll know which asset allocation works best for you",
        icon: "ic_diverse_pf",
      },
    ];
    this.setState({
      benefitsList: benefitsList,
    });
  }
  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  handleClick = async () => {
    // if (!this.state.openDialogConfirm) {
    //   this.setState({
    //     openDialogConfirm: true
    //   })
    //   return;
    // }
    this.sendEvents("next");

    this.navigate("question1");
  };

  openDialogConfirmModal = () => {
    if (this.state.openDialogConfirm) {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialogConfirm}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ color: "#4a4a4a" }}>
                Answer a few questions to check risk tolerance and get the right
                mutual funds to invest.
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: "capitalize" }}
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={() => this.handleConfirm()}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  };

  handleClose() {
    this.setState({
      openDialogConfirm: false,
      openDialog: false,
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "Risk Analyser",
      properties: {
        user_action: user_action,
        screen_name: "Intro",
        flow: storageService().get('risk-entry-flow') || '',
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleConfirm = () => {
    this.setState({
      openDialogConfirm: false,
    });

    this.navigate("question1");
    return;
  };

  renderBenefits(props, index) {
    return (
      <div key={index} className="risk_profiler-benefitList">
        <img
          src={require(`assets/${platform}/${props.icon}.svg`)}
          alt=""
          className="risk_profiler-benefitList-img"
        />
        <p className="risk_profiler-benefitList-des">{props.description}</p>
      </div>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Risk Analyser"
        handleClick={this.handleClick}
        fullWidthButton={true}
        edit={this.props.edit}
        buttonTitle="Let’s get started"
        events={this.sendEvents("just_set_events")}
      >
        <div className="risk_profiler-intro">
          <h1 className="risk_profiler-intro-heading">What is Risk Profile</h1>
          <img
            src={require(`assets/${platform}/rp_intro_banner.svg`)}
            alt=""
            className="risk_profiler-intro-image"
          />
          <p className="risk_profiler-intro-des">
            Risk Profile is an indication of your willingness and ability to
            take on risk in your investments.
          </p>
          <div className="risk_profiler-benefit-outer">
            <h1 className="risk_profiler-benefit-heading">
              How does it help you?
            </h1>
            <div style={{ margin: "17.9px 0 0 0" }}>
              {this.state.benefitsList.map(this.renderBenefits)}
            </div>
          </div>
        </div>
        {this.openDialogConfirmModal()}
      </Container>
    );
  }
}

export default Intro;
