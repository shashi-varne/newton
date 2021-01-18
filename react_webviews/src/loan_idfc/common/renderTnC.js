import React, { Component } from "react";
import Container from "./Container";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class TermsAndCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            mobile_no: "",
            numPages: null,
            // pageNumber: 4,
        };
    }

    componentWillMount() {
        // this.initialize();
    }

    onload = () => { };

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({
            numPages: numPages
        })
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Terms and Condition"
                noFooter={true}
                styleContainer={{
                    overflow: 'hidden'
                }}
                headerData={{ icon: 'close' }}
            >
                <div className="tnc">
                    <Document
                        file="https://idfc-dev-dot-plutus-staging.appspot.com/api/res/download/AMIfv95R_sFMFEfgAWjeiM1xjquEE5d7rNNMP_Oetbqv77ff8-31mQnqm08xaBNbgeE6xz4Wp0tVh2MkNYUzio_k3NzqTuluyE2THsT6XwiK03l_K-qwnoHeJvRT70Oge66c437VyKwDjC_ih1aBo5LKB16EDQlXsvBWeuG9mUFVbGfUdMaeYMg?filename=AMIfv95R_sFMFEfgAWjeiM1xjquEE5d7rNNMP_Oetbqv77ff8-31mQnqm08xaBNbgeE6xz4Wp0tVh2MkNYUzio_k3NzqTuluyE2THsT6XwiK03l_K-qwnoHeJvRT70Oge66c437VyKwDjC_ih1aBo5LKB16EDQlXsvBWeuG9mUFVbGfUdMaeYMg"
                        onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                        {Array.from(
                            new Array(this.state.numPages),
                            (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    loading=''
                                />
                            ),
                        )}
                    </Document>
                </div>
            </Container>
        );
    }
}

export default TermsAndCondition;
