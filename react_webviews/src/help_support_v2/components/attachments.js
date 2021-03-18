import React, { Component } from "react";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import ic_clip from "assets/ic_clip.svg";
import { initialize } from "../common/functions";

class RenderAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
    return (
      <div className="render-attachment">
        <div
          className="input"
          style={{
            border: `1px solid ${
              getConfig().productName === "finity" ? "#CBDEF6" : "#D5CCE9"
            }`,
          }}
        >
          <textarea
            rows={this.props.row}
            placeholder="Write your query here"
            //   value={this.state.query}
            //   onChange={this.handleChange()}
          ></textarea>
        </div>
        <div
          className="pdf-upload"
          onClick={() => this.startUpload("open_file", "bank_statement")}
        >
          <div className="plus-sign">
            <input
              type="file"
              style={{ display: "none" }}
              onChange={this.getPdf}
              id="myFile"
            />
            <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
              }
              src={ic_clip}
            />
          </div>
          <div>UPLOAD ATTACHMENTS</div>
        </div>
      </div>
    );
  }
}

export default RenderAttachment;