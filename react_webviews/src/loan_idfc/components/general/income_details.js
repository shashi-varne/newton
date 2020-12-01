import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";

class IncomeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: 'Application form',
      steps: [
        {
          'title': 'Income details',
          'status': 'init'
        },
        {
          'title': 'BT transfer details',
          'status': 'pending'
        },
        {
          'title': 'Loan offer',
          'status': 'pending'
        }
      ]
    }

    this.setState({
      progressHeaderData: progressHeaderData
    })
  }

  onload = () => {};

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "income_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = (transaction_type) => {
    this.startTransaction(transaction_type)
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Income details"
        noFooter={true}
        headerData={{
          progressHeaderData: this.state.progressHeaderData
        }}
      >
        <div className="income-details">
          <div className="subtitle">
            Provide bank statements of your salary account for income assessment
            in <b>just 2 clicks!</b>
          </div>
          <Card
            withtag="true"
            onClick={() => this.handleClick('netbanking')}
          >
            <div className="card-content" style={{padding:"10px 0"}}>
              <img
                src={require(`assets/${this.state.productName}/mobile_credit_card.svg`)}
                alt=""
              />
              <div
                style={{ width: !getConfig().isMobileDevice ? "85%" : "75%" }}
              >
                <div className="title">Fetch details using net banking</div>
                <div className="sub-title">
                  This is the most preferred, secure and hassle-free way of
                  verifying your income. We never store your net banking
                  credentials.
                </div>
              </div>
            </div>
          </Card>

            <div className="OR">-- OR --</div>

          <Card
            onClick={() => this.handleClick('manual_upload')}
          >
            <div className="card-content">
              <img
                src={require(`assets/${this.state.productName}/register_icn.svg`)}
                alt=""
              />
              <div
                style={{ width: !getConfig().isMobileDevice ? "85%" : "75%" }}
              >
                <div className="title">Upload bank statement PDFs</div>
                <div className="sub-title">
                  Attach e-statements downloaded directly from your bank's
                  website or the ones you've received from your bank.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    );
  }
}

export default IncomeDetails;
