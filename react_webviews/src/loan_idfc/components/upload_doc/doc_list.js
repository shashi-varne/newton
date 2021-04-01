import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";
import { changeNumberFormat } from "utils/validators";
import Api from "utils/api";
// import toast from "../../../common/ui/Toast";
import { getUrlParams } from "utils/validators";

class DocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "document_list",
      cards: [],
      docList: [],
      disableButton: true,
      params: getUrlParams(),
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.state;

    if (params.adminPanel) {
      this.setState({
        params: params,
      });
    }
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let bottomButtonData = {
      leftTitle: "Personal loan",
      leftSubtitle: `₹ ${changeNumberFormat(vendor_info.updated_offer_amount)}`,
    };

    this.setState({
      bottomButtonData: bottomButtonData,
    });
  };

  handleClick = async () => {
    this.sendEvents('next');
    let params = this.state.params;
    this.setState({
      show_loader: "button"
    })

    this.setErrorData("submit");

    let error = "";
    let errorType = "";
    try {
      const res = await Api.get(
        `relay/api/loan/idfc/document/submit/${this.state.application_id}`
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        if (params.adminPanel) {
            window.location.href = params.redirect_url;
        } else {
          this.navigate('final-offer')
        }

        this.setState({
          show_loader: false
        })
      } else {
        let title1 = result.error || "Something went wrong!";
        this.setState({
          show_loader: false,
          skelton: false,
          title1: title1,
        });

        this.setErrorData("submit");
        error = true;
        errorType = "form";
      }

    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
        skelton: false,
      });

      error = true;
      errorType = "form";
    }

    if (error) {
      this.setState({
        show_loader: false,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType,
        },
        showError: true,
      });
    }
  };

  sendEvents(user_action, data={}) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "upload_docs",
      properties: {
        user_action: user_action,
        docs_list : this.state.docList.map((category) => category.category_name),
        doc_card_selected: data.doc_card_selected || "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleCard = (category) => {
    let { params } = this.state;
    let current_params = '';
    storageService().set("category", category);

    if (this.state.params.adminPanel) {
      current_params = 'base_url=' + params.base_url + '&adminPanel=' + params.adminPanel + '&user=' + params.user + '&redirect_url=' + params.redirect_url;
    }

    this.navigate("doc-upload", {
      searchParams: current_params
    });
  };

  goBack = () => {
    let { params } = this.state;
    this.sendEvents('back')
    if (params.adminPanel) {
      window.location.href = this.state.params.redirect_url;
    } else {
      this.sendEvents("back");
      this.navigate('journey')
    }
  }

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    let { docList, disableButton } = this.state;

    docList.forEach((item) => {
      if (item.doc_checklist.length === 0 || (item.doc_checklist[0] && item.doc_checklist[0].docs.length === 0)) {
        disableButton = true;
      } else {
        disableButton = false;
      }
    });

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Upload documents"
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        withProvider={!this.state.params.adminPanel? true : false}
        buttonData={this.state.bottomButtonData}
        disable={disableButton}
        headerData={{
          icon: this.state.params.adminPanel ? "close" : "",
          goBack: this.goBack,
        }}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="upload-documents">
          {this.state.docList.map((item, index) => (
            <Card
              style={{ marginTop: "20px" }}
              key={index}
              onClick={() => {
                this.sendEvents('card_clicked', {doc_card_selected : item.category_name}); 
                this.handleCard(item.category)
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:"space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <img
                    style={{ margin: "-15px 0 -15px -15px" }}
                    src={require(`assets/${this.state.productName}/account.svg`)}
                    alt=""
                  />
                  <img
                    style={{ 
                      margin: "-2px 0 -10px -22px",
                      opacity: item.doc_checklist[0] && item.doc_checklist[0].docs.length !== 0 ? 1 : 0
                    }}
                    src={require(`assets/done.svg`)}
                    alt=""
                  />
                </div>
                <div
                  style={{
                    width: `${getConfig().isMobileDevice ? "60%" : "70%"}`,
                    fontWeight: 600
                  }}
                >
                  {item.category_name}
                  {item.doc_checklist.length !== 0 && (
                    <div className="subtitle">
                      {item.doc_checklist[0].subtype}
                    </div>
                  )}
                </div>
                <img
                  style={{
                    opacity: item.doc_checklist[0] && item.doc_checklist[0].docs.length !== 0 ? 1 : 0
                  }} 
                  src={require(`assets/edit_green.svg`)} 
                  alt="" />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    );
  }
}

export default DocumentList;
