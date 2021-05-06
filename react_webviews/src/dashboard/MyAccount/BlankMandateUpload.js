import React, { useState, useRef } from "react";
import Container from "../common/Container";
import { Button } from "@material-ui/core";
import toast from "../../common/ui/Toast";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import "./MyAccount.scss";
import { getBase64, getConfig } from "../../utils/functions";
import { upload } from "./MyAccountFunctions";

const BlankMandateUpload = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [uploadImageError, setUploadImageError] = useState(false);
  const [file, setFile] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [fileToShow, setFileToShow] = useState(null);
  const inputEl = useRef(null);
  const config = getConfig();

  const handleClose = () => {
    props.history.push({
      pathname: "/my-account",
      search: config.searchParams,
    });
    setOpenDialog(false);
  };

  const renderDialog = (
    <Dialog open={openDialog} className="blank-mandate-upload-dialog">
      <DialogContent className="content">{dialogMessage}</DialogContent>
      <DialogActions className="action">
        <Button className="button" onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  const native_call_handler = (method_name, doc_type, doc_name, doc_side) => {
    window.callbackWeb[method_name]({
      type: "doc",
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      // callbacks from native
      upload: function upload(file) {
        try {
          switch (file.type) {
            case "image/jpeg":
            case "image/jpg":
            case "image/png":
            case "image/bmp":
              setFile(file);
              getBase64(file, function (img) {
                setFileToShow(img);
              });
              break;
            default:
              toast("Please select image file");
          }
        } catch (e) {
          //
        }
      },
    });

    window.callbackWeb.add_listener({
      type: "native_receiver_image",
      show_loader: function () {
        setShowLoader(true);
      },
    });
  };

  const handleChange = (event) => {
    const uploadedFile = event.target.files[0];
    let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    if (acceptedType.indexOf(uploadedFile.type) === -1) {
      toast("Please select image file only");
      return;
    }

    if (config.html_camera) {
      native_call_handler(
        "open_camera",
        "blank_mandate",
        "blank_mandate.jpg",
        "front"
      );
    } else {
      setFile(uploadedFile);
      getBase64(uploadedFile, function (img) {
        setFileToShow(img);
      });
    }
  };

  const handleUpload = () => {
    inputEl.current.click();
  };

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      const result = await upload(file);
      if (!result) return;
      setUploadImageError(false);
      setDialogMessage(result.message);
    } catch (err) {
      setDialogMessage(err.message || "Image upload failed, please retry");
      setUploadImageError(true);
    } finally {
      setIsApiRunning(false);
      setOpenDialog(true);
    }
  };

  return (
    <Container
      title="Upload Mandate"
      skelton={showLoader}
      buttonTitle={uploadImageError ? "RETRY UPLOAD" : "PROCEED"}
      handleClick={handleClick}
      disable={!file}
      showLoader={isApiRunning}
    >
      <div className="blank-mandate-upload">
        <header>Share the picture of your mandate form</header>
        {file && fileToShow && (
          <div className="preview-container">
            <img src={fileToShow} className="preview" alt="Uploaded File" />
          </div>
        )}
        {!config.Web && (
          <div className="blank-mandate-doc-upload-container">
            <div className="blank-mandate-upload-doc-actions">
              <div className="mobile-actions">
                <div>
                  <input
                    ref={inputEl}
                    type="file"
                    className="blank-mandate-upload"
                    onChange={handleChange}
                    accept="image/*"
                    capture
                  />
                  <button
                    data-click-type="camera-front"
                    onClick={handleUpload}
                    className="blank-mandate-upload-button"
                  >
                    <img alt="" src={require(`assets/take_pic_green.svg`)} />
                    <div className="upload-action">open camera</div>
                  </button>
                </div>
                <div>- OR -</div>
                <div>
                  <input
                    ref={inputEl}
                    type="file"
                    className="blank-mandate-upload"
                    onChange={handleChange}
                  />
                  <button
                    onClick={handleUpload}
                    className="blank-mandate-upload-button"
                  >
                    <img
                      alt=""
                      src={require(`assets/go_to_gallery_green.svg`)}
                    />
                    <div className="upload-action">Open Gallery</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {config.Web && (
          <div className="blank-mandate-doc-upload-container">
            <div className="blank-mandate-upload-doc-actions">
              <input
                ref={inputEl}
                type="file"
                className="blank-mandate-upload"
                onChange={handleChange}
              />
              <button
                onClick={handleUpload}
                className="blank-mandate-upload-button"
              >
                <img alt="" src={require(`assets/go_to_gallery_green.svg`)} />
                <div className="upload-action">Open Gallery</div>
              </button>
            </div>
          </div>
        )}
      </div>
      {renderDialog}
    </Container>
  );
};

export default BlankMandateUpload;
