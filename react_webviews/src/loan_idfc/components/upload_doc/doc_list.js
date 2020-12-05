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
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let docList = [
      {
          "category": "Cat1",
          "category_name": "Address Proof",
          "docs": [
              {
                  "doc_display_name": "Latest Bank Statement",
                  "pages": null
              },
              {
                  "doc_display_name": "Driving License",
                  "pages": null
              },
              {
                  "doc_display_name": "Aadhaar Card",
                  "pages": "2"
              },
              {
                  "doc_display_name": "Pension or Family Pension Payment Orders (PPOs)",
                  "pages": null
              },
              {
                  "doc_display_name": "Letter of Allotment of Accommodation from Employer - issued by State Government or Central Government Departments",
                  "pages": null
              },
              {
                  "doc_display_name": "Property or Municipal Tax Receipt",
                  "pages": null
              },
              {
                  "doc_display_name": "Latest Passbook of scheduled commercial Bank",
                  "pages": null
              },
              {
                  "doc_display_name": "Rent Agreement",
                  "pages": null
              }
          ],
          "doc_checklist": [
              null
          ]
      },
      {
          "category": "Cat2",
          "category_name": "Identity Proof (PAN)",
          "docs": [
              {
                  "doc_display_name": "PAN",
                  "pages": "1"
              }
          ],
          "doc_checklist": [
              null
          ]
      },
      {
          "category": "Cat3",
          "category_name": "Salary Slip / Employment Proof",
          "docs": [
              {
                  "doc_display_name": "3 Months Salary Slip",
                  "pages": null
              }
          ],
          "doc_checklist": [
              null
          ]
      },
      {
          "category": "Cat4",
          "category_name": "Bank Account Statement",
          "docs": [
              {
                  "doc_display_name": "Last 3 months Bank Account Statement",
                  "pages": null
              }
          ],
          "doc_checklist": [
              null
          ]
      },
      {
          "category": "Cat5",
          "category_name": "Ownership Proof (Either Home Or Office)",
          "docs": [
              {
                  "doc_display_name": "Electricity Bill",
                  "pages": null
              },
              {
                  "doc_display_name": "Sale Deed",
                  "pages": null
              }
          ],
          "doc_checklist": [
              null
          ]
      }
  ]

  this.setState({
    docList: docList
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
