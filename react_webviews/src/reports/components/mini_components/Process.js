import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

const Process = ({
  isOpen,
  data,
  close,
  state,
  type,
  nfo_recommendation,
  status,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="reports-dialog"
      keepMounted
      aria-describedby="reports-dialog"
      className="reports-process-dialog"
      id="reports-process-dialog"
    >
      <DialogContent className="reports-process-dialog-content">
        <header>
          <div>Process</div>
          <div className="close-icon">
            <CloseIcon className="icon" onClick={() => close()} />
          </div>
        </header>
        <main>
          {status !== "upcoming" && type === "purchase" && (
            <>
              <div className="process-step">
                <div className="dot completed">
                  <CheckIcon className="icon" />
                </div>
                <div className="text selected">
                  <div className="top">
                    <span className="title">{data.purchase[0].title}</span>
                    <span className="time">{data.purchase[0].time}</span>
                  </div>
                  <div className="desc">{data.purchase[0].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_alloted" ||
                      state === "order_placed" ||
                      (state === "purchase_success" &&
                        state !== "order_placed")) &&
                    "completed"
                  }`}
                >
                  {state === "unit_alloted" || state === "order_placed" ? (
                    <CheckIcon className="icon" />
                  ) : state === "purchase_success" &&
                    state !== "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${
                    (state === "unit_alloted" || state === "order_placed") &&
                    "selected"
                  }`}
                >
                  <div className="top">
                    <span className="title">{data.purchase[1].title}</span>
                    <span className="time">{data.purchase[1].time}</span>
                  </div>
                  <div className="desc">{data.purchase[1].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_alloted" || state === "order_placed") &&
                    "completed"
                  }`}
                >
                  {state === "unit_alloted" ? (
                    <CheckIcon className="icon" />
                  ) : state !== "unit_alloted" && state === "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${state === "unit_alloted" && "selected"}`}
                >
                  <div className="top">
                    <span className="title">{data.purchase[2].title}</span>
                    <span className="time">
                      {nfo_recommendation
                        ? "10-15 days"
                        : data.purchase[2].time}
                    </span>
                  </div>
                  <div className="desc">{data.purchase[2].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${state === "unit_alloted" && "completed"}`}
                >
                  {state === "unit_alloted" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div className="text">
                  <div className="top">
                    <span className="title">{data.purchase[3].title}</span>
                    <span className="time">{data.purchase[3].time}</span>
                  </div>
                  <div className="desc">{data.purchase[3].desc}</div>
                </div>
              </div>
            </>
          )}
          {status === "upcoming" && type === "purchase" && (
            <>
              <div className="process-step">
                <div className="dot completed">
                  <CheckIcon className="icon" />
                </div>
                <div className="text selected">
                  <div className="top">
                    <span className="title">{data.autodebit[0].title}</span>
                    <span className="time">{data.autodebit[0].time}</span>
                  </div>
                  <div className="desc">{data.autodebit[0].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "prov_units_alloted" ||
                      (state === "request_raised" &&
                        state !== "prov_units_alloted")) &&
                    "completed"
                  }`}
                >
                  {state === "prov_units_alloted" ? (
                    <CheckIcon className="icon" />
                  ) : state === "request_raised" &&
                    state !== "prov_units_alloted" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${
                    (state === "unit_alloted" || state === "order_placed") &&
                    "selected"
                  }`}
                >
                  <div className="top">
                    <span className="title">{data.autodebit[1].title}</span>
                    <span className="time">{data.autodebit[1].time}</span>
                  </div>
                  <div className="desc">{data.autodebit[1].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    state === "prov_units_alloted" && "completed"
                  }`}
                >
                  {state === "prov_units_alloted" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div className="text">
                  <div className="top">
                    <span className="title">{data.autodebit[2].title}</span>
                    <span className="time">{data.autodebit[2].time}</span>
                  </div>
                  <div className="desc">{data.autodebit[2].desc}</div>
                </div>
              </div>
            </>
          )}
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default Process;
