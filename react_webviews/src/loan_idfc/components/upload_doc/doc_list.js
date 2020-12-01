import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";

class DocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "document_list",
      cards: [],
      docList: [],
      doc_liist: []
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let doc_liist = [
      {
        category: "Cat1",
        category_name: "Address Proof",
        docs: [
          "Latest Bank Statement",
          "Driving License",
          "Aadhaar Card",
          "Pension or Family Pension Payment Orders (PPOs)",
          "Letter of Allotment of Accommodation from Employer - issued by State Government or Central Government Departments",
          "Property or Municipal Tax Receipt",
          "Latest Passbook of scheduled commercial Bank",
          "Rent Agreement",
        ],
        doc_checklist: [
          // {
          //     "subtype": "Aadhaar card",
          //     docs:[
          //         {
          //             "doc_id": <doc_id>,
          //             "doc_url": <doc_url>,
          //             "extension": <extension>
          //             "doc_type": <doc_type>
          //         },
          //         {
          //             "doc_id": <doc_id>,
          //             "doc_url": <doc_url>,
          //             "extension": <extension>,
          //             "doc_type": <doc_type>
          //         }
          //     ]
          // }
          null,
        ],
      },
      {
        category: "Cat2",
        category_name: "Identity Proof (PAN)",
        docs: ["PAN"],
        doc_checklist: [null],
      },
      {
        category: "Cat3",
        category_name: "Salary Slip / Employment Proof",
        docs: ["3 Months Salary Slip"],
        doc_checklist: [null],
      },
      {
        category: "Cat4",
        category_name: "Bank Account Statement",
        docs: ["Last 3 months Bank Account Statement"],
        doc_checklist: [null],
      },
      {
        category: "Cat5",
        category_name: "Ownership Proof (Either Home Or Office)",
        docs: ["Electricity Bill", "Sale Deed"],
        doc_checklist: [null],
      },
    ];

    this.setState({
      doc_liist: doc_liist,
    })
  };

  handleClick = () => {};

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
    // this.navigate("doc-upload", {
    //   params: {
    //     document_list: doc
    //   }
    // })
    this.navigate("doc-upload");
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload documents"
        buttonTitle="CONTINUE"
        withProvider={true}
        handleClick={this.handleClick}
      >
        <div className="upload-documents">
          {this.state.doc_liist.map((item, index) => (
            <Card
              style={{ marginTop: "20px" }}
              key={index}
              onClick={() => this.handleCard(item.category)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <img
                    style={{ margin: "-15px 0 -15px -15px" }}
                    src={require(`assets/${this.state.productName}/account.svg`)}
                    alt=""
                  />
                  <img
                    style={{ margin: "-2px 0 -10px -22px" }}
                    src={require(`assets/done.svg`)}
                    alt=""
                  />
                </div>
                <div
                  style={{
                    width: `${getConfig().isMobileDevice ? "60%" : "70%"}`,
                  }}
                >
                  {item.category_name}
                </div>

                <img src={require(`assets/edit_green.svg`)} alt="" />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    );
  }
}

export default DocumentList;
