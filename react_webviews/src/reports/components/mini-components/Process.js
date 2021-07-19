import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import "./mini-components.scss";

const Process = ({ isOpen, data, close, state, type, status }) => {
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
        <header data-aid='reports-process-header'>
          <div>Process</div>
          <div className="close-icon">
            <CloseIcon className="icon" onClick={() => close()} />
          </div>
        </header>
        <main data-aid='reports-process-main'>
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
                    <span className="time">{data.purchase[2].time}</span>
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
          {status !== "upcoming" && type === "withdraw" && (
            <>
              <div className="process-step">
                <div className="dot completed">
                  <CheckIcon className="icon" />
                </div>
                <div className="text selected">
                  <div className="top">
                    <span className="title">{data.withdraw[0].title}</span>
                    <span className="time">{data.withdraw[0].time}</span>
                  </div>
                  <div className="desc">{data.withdraw[0].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_deducted" ||
                      state === "order_placed" ||
                      (state === "withdraw_success" &&
                        state !== "order_placed")) &&
                    "completed"
                  }`}
                >
                  {state === "unit_deducted" || state === "order_placed" ? (
                    <CheckIcon className="icon" />
                  ) : state === "withdraw_success" &&
                    state !== "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${
                    (state === "unit_deducted" || state === "order_placed") &&
                    "selected"
                  }`}
                >
                  <div className="top">
                    <span className="title">{data.withdraw[1].title}</span>
                    <span className="time">{data.withdraw[1].time}</span>
                  </div>
                  <div className="desc">{data.withdraw[1].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_deducted" || state === "order_placed") &&
                    "completed"
                  }`}
                >
                  {state === "unit_deducted" ? (
                    <CheckIcon className="icon" />
                  ) : state !== "unit_alloted" && state === "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${state === "unit_deducted" && "selected"}`}
                >
                  <div className="top">
                    <span className="title">{data.withdraw[2].title}</span>
                    <span className="time">{data.withdraw[2].time}</span>
                  </div>
                  <div className="desc">{data.withdraw[2].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${state === "unit_deducted" && "completed"}`}
                >
                  {state === "unit_deducted" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div className="text">
                  <div className="top">
                    <span className="title">{data.withdraw[3].title}</span>
                    <span className="time">{data.withdraw[3].time}</span>
                  </div>
                  <div className="desc">{data.withdraw[3].desc}</div>
                </div>
              </div>
            </>
          )}
          {type === "switch" && (
            <>
              <div className="process-step">
                <div className="dot completed">
                  <CheckIcon className="icon" />
                </div>
                <div className="text selected">
                  <div className="top">
                    <span className="title">{data.switch[0].title}</span>
                    <span className="time">{data.switch[0].time}</span>
                  </div>
                  <div className="desc">{data.switch[0].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_deducted" ||
                      state === "order_placed" ||
                      (state === "switch_success" &&
                        state !== "order_placed")) &&
                    "completed"
                  }`}
                >
                  {state === "unit_deducted" || state === "order_placed" ? (
                    <CheckIcon className="icon" />
                  ) : state === "switch_success" &&
                    state !== "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${
                    (state === "unit_deducted" || state === "order_placed") &&
                    "selected"
                  }`}
                >
                  <div className="top">
                    <span className="title">{data.switch[1].title}</span>
                    <span className="time">{data.switch[1].time}</span>
                  </div>
                  <div className="desc">{data.switch[1].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${
                    (state === "unit_deducted" || state === "order_placed") &&
                    "completed"
                  }`}
                >
                  {state === "unit_deducted" ? (
                    <CheckIcon className="icon" />
                  ) : state !== "unit_deducted" && state === "order_placed" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div
                  className={`text ${state === "unit_deducted" && "selected"}`}
                >
                  <div className="top">
                    <span className="title">{data.switch[2].title}</span>
                    <span className="time">{data.switch[2].time}</span>
                  </div>
                  <div className="desc">{data.switch[2].desc}</div>
                </div>
              </div>
              <div className="process-step">
                <div
                  className={`dot ${state === "unit_deducted" && "completed"}`}
                >
                  {state === "unit_deducted" ? (
                    <MoreHorizIcon className="icon" />
                  ) : (
                    <HourglassFullIcon className="icon" />
                  )}
                </div>
                <div className="text">
                  <div className="top">
                    <span className="title">{data.switch[3].title}</span>
                    <span className="time">{data.switch[3].time}</span>
                  </div>
                  <div className="desc">{data.switch[3].desc}</div>
                </div>
              </div>
            </>
          )}
        </main>

        {type === "switch" && (
          <div className="bottom-message">
            *Subject to Registeration Completed.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Process;
