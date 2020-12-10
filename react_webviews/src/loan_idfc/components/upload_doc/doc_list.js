import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";
import { numDifferentiationInr } from "utils/validators";
import Api from "utils/api";
import toast from "../../../common/ui/Toast";

class DocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "document_list",
      cards: [],
      docList: [],
      disableButton: true,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let bottomButtonData = {
      leftTitle: "Personal loan",
      leftSubtitle: numDifferentiationInr(vendor_info.loanAmount),
    };

    this.setState({
      bottomButtonData: bottomButtonData,
    });
  };

  handleClick = async () => {
    this.setState({
      show_loader: true
    })
    try {
      const res = await Api.get(
        `relay/api/loan/idfc/document/submit/${this.state.application_id}`
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        this.navigate('final-offer')
      } else {
        toast(result.error || result.message || "Something went wrong!");
      }

    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "upload_doc",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleCard = (category) => {
    storageService().set("category", category);
    this.navigate("doc-upload");
  };

  render() {
    let { docList, disableButton } = this.state;

    docList.forEach((item) => {
      if (item.doc_checklist.length === 0) {
        disableButton = true;
      } else {
        disableButton = false;
      }
    });

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload documents"
        buttonTitle="CONTINUE"
        withProvider={true}
        handleClick={this.handleClick}
        withProvider={true}
        buttonData={this.state.bottomButtonData}
        disable={disableButton}
      >
        <div className="upload-documents">
          {this.state.docList.map((item, index) => (
            <Card
              style={{ marginTop: "20px" }}
              key={index}
              onClick={() => this.handleCard(item.category)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: `${
                    item.doc_checklist.length === 0 ? "right" : "space-between"
                  }`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <img
                    style={{ margin: "-15px 0 -15px -15px" }}
                    src={require(`assets/${this.state.productName}/account.svg`)}
                    alt=""
                  />
                  {item.doc_checklist.length !== 0 && (
                    <img
                      style={{ margin: "-2px 0 -10px -22px" }}
                      src={require(`assets/done.svg`)}
                      alt=""
                    />
                  )}
                </div>
                <div
                  style={{
                    width: `${getConfig().isMobileDevice ? "60%" : "70%"}`,
                    marginLeft: `${item.doc_checklist.length === 0 && "15px"}`,
                  }}
                >
                  {item.category_name}
                  {item.doc_checklist.length !== 0 && (
                    <div className="subtitle">
                      {item.doc_checklist[0].subtype}
                    </div>
                  )}
                </div>

                {item.doc_checklist.length !== 0 && (
                  <img src={require(`assets/edit_green.svg`)} alt="" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    );
  }
}

export default DocumentList;
